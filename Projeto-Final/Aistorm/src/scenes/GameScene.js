// ---------------------------------------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ---------------------------------------------------------------------------------------------------------------------------------------------

import { Computer } from '../entities/Computer.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Door } from '../entities/Door.js';

// ---------------------------------------------------------------------------------------------------------------------------------------------

export class GameScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adicionando o som ambiente e som final
        this.endSound = this.sound.add('end-music', { volume: 1, loop: true });
        this.gameSound = this.sound.add('game-ambient', { volume: 1, loop: true });
        this.gameSound.play();

        // Adiciona o cenário de fundo
        this.createBackground();
        this.createExit();

        // Cria a camera
        var camera = this.cameras.main;
        camera.setZoom(2.5);

        // Cria o objeto de gráficos para desenhar os cones
        this.graphics = this.add.graphics();

        // Quando a tela voltar pro GameScene, que estava preta, clareia ela novamente
        this.events.on('resume', () => {
            this.cameras.main.fadeIn(500, 0, 0, 0);
        });

        // Ativa o sistema de luzes
        this.lights.enable();

        // Define a cor da tela onde não tem a luz
        this.lights.setAmbientColor(0x000000); 

        // Instancia os objetos
        this.createComputer();
        this.createPlayer();
        this.createEnemy();
        this.createDoor();

        // Instância um objeto de luz: x, y, raio, cor, intensidade
        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 150).setIntensity(2);

        // Cria as animações
        this.registerPlayerAnimations();
        this.registerEnemyAnimations();

        // Fazendo as instâncias reagirem às luzes
        this.player.setPipeline('Light2D');

        // Colisões das instâncias
        this.physics.add.overlap(this.player, this.enemies);
        this.physics.add.collider(this.player, this.computers);
        this.physics.add.collider(this.player, this.doors);
        this.physics.add.collider(this.enemies, this.doors);
        this.physics.add.collider(this.enemies, this.enemies);

        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.enemies, this.walls);

        // Atributos para cooldown
        this.lastDamageTime = 0;
        this.damageCooldown = 500;

        // Criando os estados do jogo
        this.gameState = {
            enemiesDead: 0,
            restored: 0,
            totalComputers: 5,
            phase: 1,
        };

        // Recebendo o sinal do computador restaurado
        this.events.on('computer-restored', () => {
            this.gameState.restored++; // incrementa os pcs restaurados
            
            // Inicia o fadeOut
            this.cameras.main.fadeOut(500, 0, 0, 0);

            // Quando o fadeOut terminar, troca para a tela do computador
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.pause();
                this.scene.launch('ComputerScene');
            });   

            // Se restaurou todos, então chama função para finalizar a missão
            if (this.gameState.restored >= this.gameState.totalComputers) this.finishHack();
        });

        // Configurando a camera
        camera.setBounds(0, 0, this.config.width, this.config.height); // travando nos limites da tela
        camera.startFollow(this.player);                               // seguindo o player

        // Criando o som do radar
        this.radarSound = this.sound.add('heartbeat', {
            loop: true,
            volume: 0.3
        });

        this.radarSound.play();
        this.radarState = "SAFE";

        // Criando o HUD
        this.createHUD();
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Updates
        this.player.update();
        this.updateGamePhase();

        // Fazendo a luz criada seguir o personagem
        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;

        const currentTime = this.time.now;                                          // Pegando o tempo atual da cena 
        const interactPressed = Phaser.Input.Keyboard.JustDown(this.player.keys.E); // Pegando a tecla E pressionada

        // Fazendo a dinâmica do computador quando o player estiver perto apertando 'E'
        this.computers.getChildren().forEach(computer => {
            computer.update(this.player, delta);
        });
    
        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Interação player e objetos
        // ------------------------------------------------------------------------------------------------------------------------------------------

        // Se o player aperta 'E'
        // JustDown: retorna true apenas uma vez, só volta a ser true se soltar e apertar a tecla 'E' de novo
        if (interactPressed) {
            // Percorrendo cada porta
            this.doors.getChildren().forEach(door => {
                // Pegando a distância entre player e porta
                const distance = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y,
                    door.x, door.y
                );

                // Se distância menor que 60
                if (distance < 60) {
                    switch (door.doorName) {
                        case 'Door01':
                        {
                            // Se ainda não ter desbloqueado a porta
                            if (!this.isCablesUnlocked) {
                                // Troca para a tela do puzzle dos cabos
                                this.cameras.main.fadeOut(500, 0, 0, 0);

                                this.cameras.main.once('camerafadeoutcomplete', () => {
                                    this.scene.pause();
                                    this.scene.launch('Puzzle01Scene');
                                });
                            }
                            // Se já ter desbloqueado, então permite abrir e fechar
                            else door.toggle();
                        }
                        break;

                        case 'Door02':
                        {
                            // Se ainda não ter desbloqueado a porta
                            if (!this.isPasswordUnlocked) {
                                // Troca para a tela do puzzle da senha
                                this.cameras.main.fadeOut(500, 0, 0, 0);

                                this.cameras.main.once('camerafadeoutcomplete', () => {
                                    this.scene.pause();
                                    this.scene.launch('Puzzle02Scene');
                                });
                            }  
                            // Se já ter desbloqueado, então permite abrir e fechar
                            else door.toggle();
                        }
                        break;
                    }
                }
            });
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Movimentação e dano inimigos e player
        // ------------------------------------------------------------------------------------------------------------------------------------------
        
        // Lógica para cada inimigo
        this.enemies.getChildren().forEach(enemy => {
            // Inimigo segue o player
            enemy.update(this.player, this.gameState, delta);

            // Calcula distância entre o player e o inimigo
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, 
                enemy.x, enemy.y
            );

            // Lógica de dano do player no inimigo
            if (distance < 80 && this.player.state === "ATTACK" && enemy.active) {
                // Inimigo leva dano
                enemy.takeDamage(this.player.damage);

                // Se inimigo morreu, então retorna
                if (enemy.life <= 0) {
                    this.gameState.enemiesDead++;
                    console.log(this.gameState.enemiesDead);
                    return; 
                }

                // Inimigo toma o dano e fica invencível por 500ms
                enemy.active = false;
                this.time.delayedCall(500, () => {
                    enemy.active = true;
                });
            }

            // Lógica de dano do inimigo no player
            if (distance < 40 && currentTime - this.lastDamageTime >= this.damageCooldown) {
                // Se player já morreu, não entra nesse script
                if (this.player.state === "DEATH") return;

                // Se inimigo estiver ativo
                if (enemy.active) {
                    // Então player leva dano
                    enemy.isAttacking = true;
                    this.player.takeDamage(enemy.damage);

                    //this.time.delayedCall(500, () => {
                    //    this.cameras.main.shake(50, 0.002);
                    //});

                    // Se player morreu
                    if (this.player.life <= 0) {
                        this.player.state = "DEATH";
                        return;
                    }

                    // Alterna a transparência dele pro efeito de dano
                    this.player.setAlpha(0.5);
                    this.time.delayedCall(500, () => {
                        this.player.setAlpha(1);
                    });

                    // Reinicia o cooldown
                    this.lastDamageTime = currentTime;
                }
            }
        });

        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Emitindo o som do radar
        // ------------------------------------------------------------------------------------------------------------------------------------------

        let closestEnemy = Infinity; // começa com o maior valor possível, para descobrir o inimigo mais próximo
        let targetRate = 1;          // velocidade normal do som
        let targetVolume = 0.3;      // volume base de 30%

        // Percorrendo cada inimigo
        this.enemies.getChildren().forEach(enemy => {
            // Calcula a distância entre player e inimigo
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                enemy.x, enemy.y
            );
            
            // Guardando o inimigo mais próximo
            if (distance < closestEnemy) closestEnemy = distance;

            // Se inimigo estiver perto, então impede continuar a restauração do computador
            this.player.isDangerNearby = closestEnemy < 120;
        });

        // Danger (inimigo muito perto)
        if (closestEnemy < 100) {
            targetRate = 1.6;   // som mais rápido
            targetVolume = 0.6; // som mais alto
            this.radarState = "DANGER";
        } 
        // Warning (inimigo próximo)
        else if (closestEnemy < 250) {
            targetRate = 1.4;
            targetVolume = 0.4;
            this.radarState = "WARNING";
        } 
        // Safe (sem inimigos por perto)
        else {
            targetRate = 1;
            this.radarState = "SAFE";
        }

        // Mudando devagar de um valor para o outro, parâmetros (valor atual, valor alvo, velocidade de transição)
        this.radarSound.setRate(Phaser.Math.Linear(this.radarSound.rate, targetRate, 0.05));
        this.radarSound.setVolume(Phaser.Math.Linear(this.radarSound.volume, targetVolume, 0.05));

        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Desenhando a área de visão dos inimigos
        // ------------------------------------------------------------------------------------------------------------------------------------------

        // Limpa o desenho a cada frame e define o estilo da linha do círculo
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xff0000, 0.1);

        // Percorre cada inimigo do grupo
        this.enemies.getChildren().forEach(enemy => {
            // Se o inimigo estiver ativo
            if (enemy.active) {
                // Desenha um círculo de visão
                this.graphics.strokeCircle(
                    enemy.x, enemy.y,
                    enemy.viewDistance
                );
            }
        });

        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Atualizando o HUD 
        // ------------------------------------------------------------------------------------------------------------------------------------------
        
        if (this.healthText && this.player) {
            const currentLife = this.player.life < 0 ? 0 : this.player.life;
            this.healthText.setText(`Vida: ${currentLife}`);
        }

        if (this.computersText && this.gameState) 
            this.computersText.setText(`PCs restaurados: ${this.gameState.restored}/${this.gameState.totalComputers}`);

        if (this.player.canUseShield) {
            this.shieldText.setText('Escudo: Pronto');
            this.shieldText.setFill('#F269BB');
        }
        else {
            this.shieldText.setText('Escudo: Não pronto');
            this.shieldText.setFill('#de138c');
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------
        // -- Trocando para Cenas Finais
        // ------------------------------------------------------------------------------------------------------------------------------------------

        const distanceExit = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.exit.x, this.exit.y
        );

        // Se estiver perto da porta de saída e já ter completado as restaurações
        if (distanceExit < 60 && this.gameState.restored === 5) {
            // Parando os sons pra próxima cena
            this.sound.stopAll();

            // Tem 30 inimigos no mapa
            if (this.enemiesDead >= 20) this.scene.start('Final01Scene'); // final com Aistorm controlando tudo
            else this.scene.start('Final02Scene');                        // final com possível cooperação
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ---------------------------------------------------------------------------------------------------------------------------------------------
    
    // Criando o HUD com camera
    createHUD() {
        // Estilo dos textos
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000', // contorno
            strokeThickness: 4 // grossura do contorno
        };

        // Objetivo
        this.objectiveText = this.add.text(25, 25, 'Objetivo: restaurar os computadores', {
            ...textStyle,
            fill: '#de138c'
        });

        // Pc's restaurados
        this.computersText = this.add.text(25, 55, `PCs restaurados: ${this.gameState.restored}/${this.gameState.totalComputers}`, {
            ...textStyle,
            fill: '#F269BB'
        });

        // Escudo
        this.shieldText = this.add.text(25, 85, '[Q] Escudo: Pronto', {
            ...textStyle,
            fill: '#F269BB'
        });

        // Vida
        this.healthText = this.add.text(25, 115, `Vida: ${this.player.life}`, {
            ...textStyle,
            fill: '#F269BB'
        });

        // Tutorial teclas  
        this.tutorialText = this.add.text(25, this.config.height - 150, 
            "[W,A,S,D] Mover\n" +
            "[ESPAÇO] Atacar\n" +
            "[SHIFT] Correr\n" +
            "[E] Interagir\n" +
            "[Q] Escudo", 
            {
                ...textStyle,
                fontSize: '18px',
                fill: '#cccccc'
            }
        );

        // Camera do HUD
        this.hudCamera = this.cameras.add(0, 0, this.config.width, this.config.height);
        
        // Por padrão, as cameras novas olham para TUDO no jogo
        // Por isso, tem que fazer a camera do HUD ignorar elementos pra não duplicar
        this.hudCamera.ignore([
            this.ground, this.walls, this.walls2, this.decorations, 
            this.player, this.enemies, this.computers, this.doors,
            this.graphics
        ]);

        this.enemies.getChildren().forEach(enemy => {
            this.hudCamera.ignore(enemy.lifeText);
            this.hudCamera.ignore(enemy.alertText);
        });

        this.computers.getChildren().forEach(computer => {
            this.hudCamera.ignore(computer.barBg);
            this.hudCamera.ignore(computer.barFill);
        });

        // E a camera principal deve ignorar os textos do HUD
        this.cameras.main.ignore([
            this.objectiveText, this.healthText, 
            this.computersText, this.tutorialText, this.shieldText
        ]);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria o mapa
    createBackground() {
        const map = this.make.tilemap({ key: 'map' });

        const tilesetGround = map.addTilesetImage('tileset', 'tileset');
        const tilesetBuildings = map.addTilesetImage('buildings', 'buildings');
        const tilesetProps = map.addTilesetImage('props', 'props');

        // Pegando as camadas usadas no Tiled
        const layers = map.getTileLayerNames();
        const allTilesets = [tilesetGround, tilesetBuildings, tilesetProps];
        console.log(map.getTileLayerNames());

        // Pegando a camada de objetos para os spawns
        this.spawnLayer = map.getObjectLayer('objects');

        // Criando as camadas feitas no Tiled
        this.ground = map.createLayer(layers[0], allTilesets, 0, 0);
        this.walls = map.createLayer(layers[1], allTilesets, 0, 0);
        this.walls2 = map.createLayer(layers[2], allTilesets, 0, 0);
        this.decorations = map.createLayer(layers[3], allTilesets, 0, 0);

        // Colisão com qualquer bloco
        this.walls.setCollisionBetween(0, 10000); 

        this.walls2.setDepth(999);

        // Fazendo o cenário reagir a luz
        this.ground.setPipeline('Light2D');
        this.walls.setPipeline('Light2D');
        this.walls2.setPipeline('Light2D');
        this.decorations.setPipeline('Light2D');
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona os computadores na cena
    createComputer() {
        this.computers = this.physics.add.group();

        // Pegando o spawn dos computadores definido no Tiled
        const computerSpawns = this.spawnLayer.objects.filter(obj => obj.name === 'Computer');

        // Percorre cada ponto encontrado no mapa
        computerSpawns.forEach(spawn => {
            // Instancia o computador na coordenada X e Y do Tiled
            const computer = new Computer(this, spawn.x, spawn.y);
            
            // Adiciona ao grupo de física
            this.computers.add(computer);

            // Diz ao computador que ele deve reagir às luzes
            computer.setPipeline('Light2D');
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona o jogador na cena
    createPlayer() {
        // Pegando o spawn do player definido do Tiled
        const playerSpawn = this.spawnLayer.objects.find(obj => obj.name === 'Player');

        // Instancia o player
        this.player = new Player(this, playerSpawn.x, playerSpawn.y);

        // Tamanho do player e hitbox
        this.player.body.setSize(22, 35).setOffset(53, 63);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona os inimigos na cena
    createEnemy() {
        this.enemies = this.physics.add.group();

        // Pegando o spawn dos inimigos definido no Tiled
        const enemySpawns = this.spawnLayer.objects.filter(obj => obj.name === 'Enemy');

        // Percorre cada ponto encontrado no mapa
        enemySpawns.forEach(spawn => {
            // Instancia o inimigo na coordenada X e Y do Tiled
            const enemy = new Enemy(this, spawn.x, spawn.y);
            
            // Adiciona ao grupo de física
            this.enemies.add(enemy);

            // Diz ao inimigo que ele deve reagir às luzes
            enemy.setPipeline('Light2D');
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona a porta na cena
    createDoor() {
        this.doors = this.physics.add.group();

        // Pegando o spawn das portas definidas do Tiled
        const doorSpawns = this.spawnLayer.objects.filter(
            obj => obj.name === 'Door01' || obj.name === 'Door02'
        );

        // Percorre cada ponto encontrado no mapa
        doorSpawns.forEach(spawn => {
            // Instancia na coordenada X e Y do Tiled
            const door = new Door(this, spawn.x, spawn.y);

            door.doorName = spawn.name;
            
            // Adiciona ao grupo de física
            this.doors.add(door);

            // Diz a porta que ele deve reagir às luzes
            door.setPipeline('Light2D');
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria as animações do player
    registerPlayerAnimations() { 
        this.anims.create({
            key: 'shield-effect',
            frames: this.anims.generateFrameNumbers('shield-effect', {
                start: 0,
                end: 10,
            }),
            frameRate: 12,
            repeat: 0,
        });

        // Idle
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player-idle', {
                start: 0,
                end: 9,
            }),
            frameRate: 8,
            repeat: -1,
        });
        
        // Walk
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player-walk', {
                start: 0,
                end: 7,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Run
        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('player-run', {
                start: 0,
                end: 7,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Attack
        this.anims.create({
            key: 'player-attack',
            frames: this.anims.generateFrameNumbers('player-attack', {
                start: 0,
                end: 12,
            }),
            frameRate: 14,
            repeat: 0,
        });


        // Get Hit
        this.anims.create({
            key: 'player-gethit',
            frames: this.anims.generateFrameNumbers('player-gethit', {
                start: 0,
                end: 2,
            }),
            frameRate: 6,
            repeat: 0,
        });

        // Death
        this.anims.create({
            key: 'player-death',
            frames: this.anims.generateFrameNumbers('player-death', {
                start: 0,
                end: 17,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // Projectile Explode
        this.anims.create({
            key: 'projectile-explode',
            frames: this.anims.generateFrameNumbers('projectile-explode', {
                start: 0,
                end: 6,
            }),
            frameRate: 10,
            repeat: 0,
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    registerEnemyAnimations() {
        // ----------------------------------------------------------------------------------------------------------------
        // -- Up Animations
        // ----------------------------------------------------------------------------------------------------------------

        // Idle Up
        this.anims.create({
            key: 'enemy-up-idle',
            frames: this.anims.generateFrameNumbers('enemy-up', {
                start: 0,
                end: 4,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Run Up
        this.anims.create({
            key: 'enemy-up-run',
            frames: this.anims.generateFrameNumbers('enemy-up', {
                start: 20,
                end: 22,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Attack Up
        this.anims.create({
            key: 'enemy-up-attack',
            frames: this.anims.generateFrameNumbers('enemy-up', {
                start: 50,
                end: 53,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // Get Hit Up
        this.anims.create({
            key: 'enemy-up-gethit',
            frames: this.anims.generateFrameNumbers('enemy-up', {
                start: 35,
                end: 39,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // ----------------------------------------------------------------------------------------------------------------
        // -- Right Animations
        // ----------------------------------------------------------------------------------------------------------------

        // Idle Right
        this.anims.create({
            key: 'enemy-right-idle',
            frames: this.anims.generateFrameNumbers('enemy-right', {
                start: 0,
                end: 4,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Run Right
        this.anims.create({
            key: 'enemy-right-run',
            frames: this.anims.generateFrameNumbers('enemy-right', {
                start: 20,
                end: 22,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Attack Right
        this.anims.create({
            key: 'enemy-right-attack',
            frames: this.anims.generateFrameNumbers('enemy-right', {
                start: 50,
                end: 53,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // Get Hit Right
        this.anims.create({
            key: 'enemy-right-gethit',
            frames: this.anims.generateFrameNumbers('enemy-right', {
                start: 35,
                end: 39,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // ----------------------------------------------------------------------------------------------------------------
        // -- Down Animations
        // ----------------------------------------------------------------------------------------------------------------
    
        // Idle Down
        this.anims.create({
            key: 'enemy-down-idle',
            frames: this.anims.generateFrameNumbers('enemy-down', {
                start: 0,
                end: 4,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Run Down
        this.anims.create({
            key: 'enemy-down-run',
            frames: this.anims.generateFrameNumbers('enemy-down', {
                start: 20,
                end: 22,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Attack Down
        this.anims.create({
            key: 'enemy-down-attack',
            frames: this.anims.generateFrameNumbers('enemy-down', {
                start: 50,
                end: 53,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // Get Hit Down
        this.anims.create({
            key: 'enemy-down-gethit',
            frames: this.anims.generateFrameNumbers('enemy-down', {
                start: 35,
                end: 39,
            }),
            frameRate: 5,
            repeat: 0,
        });

        // ----------------------------------------------------------------------------------------------------------------
        // Left Animations
        // ----------------------------------------------------------------------------------------------------------------

        // Idle Left
        this.anims.create({
            key: 'enemy-left-idle',
            frames: this.anims.generateFrameNumbers('enemy-left', {
                start: 0,
                end: 4,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Run Left
        this.anims.create({
            key: 'enemy-left-run',
            frames: this.anims.generateFrameNumbers('enemy-left', {
                start: 20,
                end: 22,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Attack Left
        this.anims.create({
            key: 'enemy-left-attack',
            frames: this.anims.generateFrameNumbers('enemy-left', {
                start: 50,
                end: 53,
            }),
            frameRate: 8,
            repeat: 0,
        });

        // Get Hit Left
        this.anims.create({
            key: 'enemy-left-gethit',
            frames: this.anims.generateFrameNumbers('enemy-left', {
                start: 35,
                end: 39,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualizando as fases
    updateGamePhase() {
        if (this.gameState.restored === 1) this.gameState.phase = 1;
        if (this.gameState.restored === 2) this.gameState.phase = 2;
        if (this.gameState.restored === 3) this.gameState.phase = 3;
        if (this.gameState.restored === 4) this.gameState.phase = 4;
        if (this.gameState.restored === 5) this.gameState.phase = 5;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Criando a saída do núcleo
    createExit() {
        const exitSpawn = this.spawnLayer.objects.find(obj => obj.name === 'Exit');

        this.exit = { x: exitSpawn.x, y: exitSpawn.y }; // posição no Tiled
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Finalizando o jogo ao completar as restaurações
    finishHack() {
        this.objectiveText.destroy();

        this.cameras.main.flash(300);

        this.gameSound.stop();
        this.endSound.play();

        this.runText = this.add.text(25, 25, 'LUTE CONTRA OS ROBÔS OU FUJA!', {
            fontSize: '24px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Piscado o texto
        this.tweens.add({
            targets: this.runText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Texto na porta de saída
        this.exitAlert = this.add.text(this.exit.x - 30, this.exit.y, '⚠ SAÍDA', {
            fontSize: '12px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Piscado o texto
        this.tweens.add({
            targets: this.exitAlert,
            alpha: 0,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        this.hudCamera.ignore(this.exitAlert);
        this.cameras.main.ignore(this.runText);
    }

}