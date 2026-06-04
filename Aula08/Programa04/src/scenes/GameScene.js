// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser, { GameObjects } from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa a cena principal do jogo
export default class GameScene extends Phaser.Scene {

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Principais
    // ----------------------------------------------------------------------------------------------------------------
    
    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' }, config);

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa as propriedades da cena
    init() {
        // Gravidade aplicada ao jogo
        this.gravity = 500;

        // Distância mínima para o ataque do inimigo
        this.distanceToAttack = 250;

        // Player
        this.player = null;
        this.playerSpeed = 200;
        this.playerJumpForce = 520;

        // Enemy
        this.enemy = null;
        this.enemySpeed = 80;
        this.enemyDirection = -1;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // A ordem de criação dos objetos, determina quem fica na frente de quem

        // Adiciona o cenário de fundo
        this.createBackground();
        this.createGround();

        // Registra as animações do player e do inimigo
        this.registerPlayerAnimations();
        this.registerEnemyAnimations();

        // Cria o player e o inimigo
        this.createPlayer();
        this.createEnemy();

        // Configura as propriedades físicas do player
        this.player.body.setGravityY(this.gravity);
        this.player.setCollideWorldBounds(true);

        // Configura propriedades físicas do inimigo
        this.enemy.body.setGravityY(this.gravity);
        this.enemy.setCollideWorldBounds(true);

        // Configura entrada de teclado e mouse
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

        // Eventos de animação do inimigo
        // Considera a animação para ajustar o tamanho do corpo físico
        // Também ajusta o offset conforme a direção do inimigo

        // Inimigo atacando aumenta o tamanho do corpo físico
        this.enemy.on('animationstart', (anim) => {
            if (anim.key === 'enemy_attack') {
                this.enemy.body.setSize(150, 100);
                const offsetX = this.enemy.flipX ? 85 : 40;
                this.enemy.body.setOffset(offsetX,60);
            }
        });

        // Inimigo caminhando reset o tamanho do corpo físico
        this.enemy.on('animationstart', (anim) => {
            if (anim.key === 'enemy_walk') {
                this.enemy.body.setSize(90, 100);
                this.enemy.body.setOffset(100, 50);
            }
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Obtém as referências para as teclas
        const { left, right, up, down, space } = this.cursorKeys;

        // Faz com que a tecla de pulo seja contabilizada uma única vez
        // Mesmo se ela estiver sendo pressionada
        const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        // Indica se o player está em contato com o chão
        const playerOnFloor = this.player.body.onFloor();

        // Indica se o player está executando alguma animação
        const currentPlayerAnim = this.player.anims.currentAnim?.key;

        // Verifica se o player está executando uma animação específica (animKey)
        const isPlayerPlaying = animKey => this.player.anims.isPlaying && currentPlayerAnim === animKey;

        // Movimentação do player
        // Esquerda e direita
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
        }
        else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
        }
        // Se não mantém parado
        else this.player.setVelocityX(0);

        // Pular
        if (isUpJustDown && playerOnFloor) this.player.setVelocityX(-this.playerJumpForce);

        // Abaixar
        // Só se abaixa se estiver no chão
        if (down.isDown && playerOnFloor) {
            // Deixa o player parado
            this.player.setVelocityX(0);

            // Executa a animação de abaixar
            if (currentPlayerAnim !== 'player_duck') this.player.play('play_duck');

            return;
        }

        // Ataque
        if (isSpaceJustDown && !isPlayerPlaying('player_attack')) {
            this.player.play('player_attack');
            return;
        }

        // Interrompendo outras animações, se player estiver atacando
        if (isPlayerPlaying('player_attack')) return;

        // Se o player estiver no chão
        if (playerOnFloor) {
            // Se estiver se movendo para os lados
            if (this.player.body.velocity.x !== 0) {
                if (!isPlayerPlaying('player_walk'))
                    // Executa a animação dele andando
                    this.player.play('player_walk', true);
            }
            // Se player estiver parado
            else {
                if (!isPlayerPlaying('player_idle'))
                    // Executa animação dele parado
                    this.player.play('player_idle', true);
            }
        }
        // Se player estiver pulando
        else {
            if (!isPlayerPlaying('player_jump')) {
                // Executa a animação dele pulando
                this.player.play('player_jump');
            }
        }

        // Movimento e ataque do inimigo
        this.handleEnemyMovement();
        this.handleEnemyAttack();
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------
    
    // Cria o cenário de fundo com base na imagem pré-carregada
    createBackground() {
        // Fundo
        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'background'
        );

        // Colunas
        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'columns'
        ).setDepth(2);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Criando o chão da cena
    createGround() {
        const groundRect = this.add.rectangle(
            this.config.width / 2,
            this.config.height * 0.5 + 250,
            this.config.width,
            20,
            0x00ff00,
            0.25
        ).setVisible(false);

        // Adiciona um corpo físico do tipo estático
        this.physics.add.existing(groundRect, true);

        // Atribui o retângulo do chão à cena, permitindo a aplicação de colisões
        this.ground = groundRect;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Criando o player
    createPlayer() {
        // Adiciona o primeiro sprite
        this.player = this.physics.add.sprite(
            200,
            this.config.height * 0.5,
            'player'
        ).setScale(2);

        // Executa a animação
        this.player.play('player_idle', true);

        // Ativa a colisão com o chão
        this.physics.add.collider(this.player, this.ground);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Registra as animações do player
    registerPlayerAnimations() {
        // Linha 1: 0 - 7   -> Idle: 0 - 1
        // Linha 2: 8 - 15  -> idle blink: 8 - 0
        // Linha 3: 16 - 23 -> walk: 15 - 19
        // Linha 4: 24 - 32 -> run 24 - 31
        // Linha 5: 32 - 39 -> duck: 32 - 37 (ou 32 - 35 para manter abaixado)
        // Linha 6: 40 - 47 -> jump: 40 - 47
        // Linha 7: 48 - 55 -> disappear: 48 - 50
        // Linha 8: 56 - 63 -> die: 56 - 63
        // Linha 9: 54 - 71 -> attack: 64 - 71

        // Cria a animação dele parado
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 0,
                    end: 1
                    //frames: [0, 1, 8, 9]
                }
            ),
            frameRate: 4,
            repeat: -1
        });

        // Cria a animação dele caminhando
        this.anims.create({
            key: 'player_walk',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 16,
                    end: 19
                }
            ),
            frameRate: 8,
            repeat: -1
        });

        // Cria a animação dele se abaixando
        this.anims.create({
            key: 'player_duck',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 32,
                    end: 32
                }
            ),
            frameRate: 8,
            repeat: 0
        });

        // Cria a animação dele pulando
        this.anims.create({
            key: 'player_jump',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 40,
                    end: 47
                }
            ),
            frameRate: 4,
            repeat: 0
        });

        // Cria a animação dele atacando
        this.anims.create({
            key: 'player_attack',
            frames: this.anims.generateFrameNumbers(
                'player',
                {
                    start: 64,
                    end: 71
                }
            ),
            frameRate: 8,
            repeat: 0
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Criando o inimigo
    createEnemy() {
        // Adiciona o primeiro sprite do inimigo
        this.enemy = this.physics.add.sprite(
            this.config.width - 200,
            this.config.height * 0.5 - 55,
            'enemy'
        ).setScale(2);

        // Executa a animação do inimigo parado
        // Ajusta o tamanho do corpo do inimigo
        this.enemy.play('enemy_walk', true);
        this.enemy.body.setSize(90, 100);
        this.enemy.body.setOffset(100, 50);

        // Ativa a colisão entre o inimigo e o chão
        this.physics.add.collider(this.enemy, this.ground);
    }
    
    // ----------------------------------------------------------------------------------------------------------------

    // Controla o movimento do inimigo
    handleEnemyMovement() {
        // Realiza a movimentação do inimigo
        this.enemy.setVelocityX(this.enemyDirection * this.enemySpeed);

        // Verifica se o inimigo está à esquerda ou à direita do player
        this.enemyDirection = this.enemy.x > this.player.x ? -1 : 1;

        // Vira o inimigo para a direita
        if (this.enemyDirection === 1) this.enemy.setFlipX(true);
        // Vira o inimigo para a esquerda
        else this.enemy.setFlipX(false);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Controla o ataque do inimigo
    handleEnemyAttack() {
        // Indica se o inimigo está atacando o player
        const enemyIsAttacking = this.enemy.anims.currentAnim?.key === 'enemy_attack';

        // Obtém a distância entre o inimigo e o player
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.enemy.x, this.enemy.y,
            this.player.x, this.player.y
        );

        // Se o inimigo estiver perto do player
        if (distanceToPlayer < this.distanceToAttack) {
            // Executa a animação de ataque
            if(!enemyIsAttacking)
                this.enemy.play('enemy_attack');

            // Enquanto ataca, não deixa o inimigo se movimentar
            this.enemy.setVelocityX(0);
        }
        else {
            // Movimenta o inimigo
            this.enemy.play('enemy_walk', true);
        }
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Registra as animações do inimigo
    registerEnemyAnimations() {
        // Linha 1: 0 -21    -> idle: 0 - 5
        // Linha 2: 22 - 43  -> walk: 22 - 33
        // Linha 3: 44 - 65  -> cleave: 44 - 58
        // Linha 4: 66 - 87  -> take hit: 66 - 70
        // LInha 5: 88 - 109 -> death: 88 - 109

        // Cria a animação dele parado
        this.anims.create({
            key: 'enemy_idle',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 0,
                    end: 5
                }
            ),
            frameRate: 8,
            repeat: -1
        }); 

        // Cria a animação dele caminhando
        this.anims.create({
            key: 'enemy_walk',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 22,
                    end: 33
                }
            ),
            frameRate: 8,
            repeat: -1
        }); 

        // Cria a animação dele atacando
        this.anims.create({
            key: 'enemy_attack',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 44,
                    end: 58
                }
            ),
            frameRate: 8,
            repeat: -1
        }); 
    }

} // Fim do programa