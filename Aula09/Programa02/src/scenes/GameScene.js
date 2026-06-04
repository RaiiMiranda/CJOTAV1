// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser from 'phaser';

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

    // Inicializando as prioridades da cena
    init() {
        // Player
        this.player = null;
        this.playerSpeed = 120;
        this.distanceOffset = 10;
        this.targetPosition = null;

        // Coca
        this.coke = null;
        this.cokeOffset = 70;
        this.cokeAmplitude = 250;

        // Obtém centro da tela
        this.centerX = this.cameras.main.width / 2;

        // Evita que o menu de contexto seja aberto com o botao deireito do mouse
        this.input.mouse.disableContextMenu();

        // Configura os eventos de clique na tela
        this.setupTouchEvents();
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // A ordem de criação dos objetos, determina quem fica na frente de quem

        // Adiciona o cenário de fundo
        this.createBackground();

        //  Registra as animações do player
        this.registerPlayerAnimations();

        // Cria o player
        this.createPlayer();
        this.player.setCollideWorldBounds(true);
        
        // Criando a coca
        this.createCoke();

        // Criando o texto
        this.createText();

        // Player correndo: diminui o tamanho do corpo físico
        this.player.on('animationstart', (anim) => {
            if (anim.key === 'player_run') {
                this.player.body.setSize(220, 310);
            }
        });

        // Player parado: aumenta o tamanho do corpo físico
        this.player.on('animationstart', (anim) => {
            if (anim.key === 'player_idle') {
                this.player.body.setSize(424, 317);
            }
        });

        // Pega as teclas
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Toca a música
        this.gameMusic = this.sound.add('gameMusic');
        this.gameMusic.setVolume(0.25);
        this.gameMusic.play({ loop: true};)
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Obtém referencia para as teclas
        const { left, right } = this.cursorKeys;

        const currentPlayerAmim = this.player.anims.currentAnim?.key;
        const isPlayerPlaying = animKey => this.player.anims.isPlaying && currentPlayerAmim === animKey;

        // Movimentando o player usando teclado
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
            this.targetPosition = null;
        }
        else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
            this.targetPosition = null;
        }
        // Movimentado o player usando mouse
        else if (this.targetPosition !== null) {
            const distance = this.targetPosition - this.player.x;

            if (Math.abs(distance) < this.distanceOffset) {
                this.player.setVelocityX(0);
                this.targetPosition = null;
            }
            // Caso contrario, move o player na direção do clique
            else {
                const direction = Math.sign(distance);

                this.player.setVelocityX(this.playerSpeed * direction);
                this.player.flipX = direction < 0;
            }
        }
        // Deixa player parado
        else {
            this.player.setVelocityX(0);
        }

        if (this.player.body.velocity.x !== 0) {
            if(!isPlayerPlaying('player_run')) 
                this.player.play('player_run', true);
            
            if(this.playerSound.isPlaying)
                this.playerSound.play();
        }
        else {
            if (!isPlayerPlaying('player_idle'))
                this.player.play('player_idle', true);

            if (this.playerSound.isPlaying)
                this.playerSound.stop();
        }
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

    // Criando o player
    createPlayer() {
        // Cria a animação chamada 'idle'
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'idle1' },
                { key: 'idle2' },
                { key: 'idle1' },
                { key: 'idle2' }
            ],
            frameRate: 3,
            repeat: -1,
            yoyo: true
        });

        // Adiciona a sprite do player
        this.player = this.add.sprite(
            220,
            this.config.height * 0.5 + 185,
            // 'player'
            'idle1'
        );

        // Inicia a animação
        this.player.anims.play('idle');
    }
    
    // ----------------------------------------------------------------------------------------------------------------

    createCoke() {
        // Adiciona a sprite da coca
        this.coca = this.add.sprite(
            this.config.height * 0.5 + 250,
            this.config.height * 0.5 + 200,
            'coca'
        );      

        // Tween para a coca ficar se movimentando verticalmente
        this.tweens.add({
            targets: this.coca,
            y: this.config.height * 0.5 - 60,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Tween para a coca ficar tremendo horizontalmente
        this.tweens.add({
            targets: this.coca,
            x: '+=8',
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Power1.easeInOut'
        });
    }

} // Fim do programa