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

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // Inicializa as referências do teclado
        this.cursors = null;

        // Inicializa as referências do player
        this.player = null;
        this.playerSpeed = 50;

        // Inicializa as referências do queijo
        this.cheese = null;
        this.cheeseCollected = 0;
        this.TOTAL_CHEESES = 5;

        // Inicializa as referências do placar
        this.score = 0;
        this.scoreText = null;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // A ordem de criação dos objetos, determina quem fica na frente de quem

        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();

        // Instancia o queijo
        this.createCheese();

        // Adiciona a imagem da cerca, posicionada na parte inferior da tela
        // A cerca fica na frente de todos os elementos do jogo
        this.add.image(
            0,
            this.config.height - 241,
            'fence'
        ).setOrigin(0)
         .setDepth(10);

        // Cria o placar
        this.scoreText = this.add.text(
            10,
            10,
            'QUEIJOS: 0',
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        ).setShadow(1, 1, '#000000', 3);    
    
        // Habilita as setas de controle
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Atualiza as informações relacionadas ao player
        this.movePlayerManager(time);
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
            300, 
            'player'
        );

        // Habilita a colisão do player com as bordas do mundo
        this.player.setCollideWorldBounds(true);

        // Define um novo tamanho para o corpo físico do player
        const newWidth = this.player.width * 0.85;
        const newHeight = this.player.height * 0.5;

        // Ajusta o tamanho do corpo físico do player
        this.player.body.setSize(newWidth, newHeight);

        // Calcula o offset para centralizar o corpo físico do player
        const offsetX = (this.player.width - newWidth) / 2;
        const offsetY = (this.player.height - newHeight) / 2;
        
        // Ajusta o offset do corpo físico do player
        this.player.body.setOffset(offsetX, offsetY + 30);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza informações relacionadas ao player
    movePlayerManager() {
        // Zera a velocidade do player antes de aplicar uma nova direção
        this.player.setVelocity(0);

        // Movimenta o player para a esquerda
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.flipX = true;
        }

        // Movimenta o player para a direita
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.flipX = false;
        }

        // Movimenta o player para a cima
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        }

        // Movimenta o player para a baixo
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Criando os queijos
    createCheese() {
        // Antes de criar um novo queijo, destrói o anterior
        if (this.cheese) this.cheese.destroy();

        // Escolhe um queijo aleatoriamente e define sua chave
        const randomCheeseType = Phaser.Math.Between(1, this.TOTAL_CHEESES);
        const cheeseKey = 'cheese' + randomCheeseType;

        // Posição horizontal do queijo
        const x = Phaser.Math.Between(
            60,
            this.config.width - 60
        );

        // Posição vertical do queijo (evita a parte superior da tela)
        const y = Phaser.Math.Between(
            150,
            this.config.height - 40
        );

        // Cria o queijo e o torna um corpo físico
        this.cheese = this.physics.add.image(
            x,
            y,
            cheeseKey
        ).setOrigin(0.5);

        // Define um novo tamanho para o corpo físico do queijo
        const newWidth = this.cheese.width * 0.5;
        const newHeight = this.cheese.height * 0.5;

        // Ajusta o tamanho do corpo físico do queijo
        this.cheese.body.setSize(newWidth, newHeight);

        // Calcula o offset para centralizar o corpo físco do queijo
        const offsetX = (this.cheese.width - newWidth) / 2;
        const offsetY = (this.cheese.height - newHeight) / 2;

        // Captura a sobreposição com o jogador
        this.physics.add.overlap(
            this.player,
            this.cheese,
            this.collectCheese,
            null,
            this
        );

        // Gera um novo queijo a cada 3 segundos
        this.time.delayedCall(
            3000,
            this.createCheese,
            [],
            this
        );
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Gerencia a coleta do queijo
    collectCheese(player, cheeseToCollect) {
        // Incrementa o contador de queijos coletados
        this.cheeseCollected++;

        // Atualiza o placar
        this.scoreText.setText('QUEIJOS: ' + this.cheeseCollected);

        // Destrói o queijo que foi coletado
        cheeseToCollect.disableBody(true, true);
    }
    
} // Fim do programa