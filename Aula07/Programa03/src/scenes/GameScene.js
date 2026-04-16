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
        // Inicializa uma referência do player
        this.player = null;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();

        // Evita que o menu de contexto seja aberto com o botão direito do mouse
        this.input.mouse.disableContextMenu();

        // Configura os eventos de toque na tela
        // Eventos desse tipo devem ser feitos no create
        this.setupTouchEvents();

    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // TODO
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

    // Pega os eventos de toque
    setupTouchEvents() {
        // Detecta um toque na tela ou clique do mouse
        this.input.on('pointerdown', (pointer) => {
            // Exibe as coordenadas do local do toque
            console.log(`Tela tocada em X: ${pointer.x} e Y: ${pointer.y}`);

            // Move o player para o local de toque
            this.player.setPosition(pointer.x, pointer.y);
        });

        // Detecta quando o mouse é liberado
        this.input.on('pointerup', (pointer) => {
            // Exibe a mensagem
            console.log('Toque liberado');
        });

        // Detecta se o toque está sendo arrastado
        this.input.on('pointermove', (pointer) => {
            // Se o toque estiver pressionado
            if (pointer.isDown) {
                // Exibe as coordenadas do arrasto
                console.log(`Arrastando o toque para X: ${pointer.x} e Y: ${pointer.y}`);

                // Move o player para a posição do arrasto
                this.player.setPosition(pointer.x, pointer.y);
            }
        });
    }
    
} // Fim do programa
