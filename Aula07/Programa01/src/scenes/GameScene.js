// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa a cena principal do jogo
export default class GameScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' }, config);

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // Inicializa as referências do teclado
        this.cursors = null;
        this.spaceKey = null;

        // Inicializa uma referência do player
        this.player = this.player;

        // Define a velocidade de movimentação do player
        this.playerSpeed = 250;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();

        // Habilita as setas de controle
        this.cursors = this.input.keyboard.createCursorKeys();

        // Habilita a tecla de espaço
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update() {
        // Atualiza o player
        this.movePlayerManager();
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------
    
    // Cria o cenário de fundo com base na imagem pré-carregada
    createBackground() {
        // Adiciona a imagem do cenário de fundo
        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'background'
        );
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona o jogador na cena
    createPlayer() {
        // Adiciona a imagem do player (habilitando a física)
        this.player = this.physics.add.sprite(
            this.config.width * 0.5,
            350,
            'player'
        );

        // habilita a colisão do player com as bordas do mundo
        this.player.setCollideWorldBounds(true);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Movimento do player
    movePlayerManager() {
        // Zerando a velocidade do player antes de aplicar uma nova direção
        this.player.setVelocity(0);
    
        // Movimenta o player para a esquerda
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }

        // Movimenta o player para a direita
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }

        // Movimenta o player para a cima
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        }

        // Movimenta o player para a baixo
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
    
        // Se espaço apertado
        if (this.spaceKey.isDown) {
            console.log("Tiro contínuo.");
        }

        // Se espaço pressionado
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            console.log("Barra de espaço pressionada!");
        }
    }

}
