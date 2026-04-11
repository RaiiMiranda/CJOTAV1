// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser from 'phaser';

// Importa as dependências
import Player from '../entities/Player.js';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa a cena principal do jogo
export default class GameScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // TUDO...
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // TUDO...
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
            'cenario'
        );
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria e posiciona o jogador na cena
    createPlayer() {
        // Define a posição inicial do player
        const startX = this.config.width * 0.5;
        const startY = this.config.height - 235;

        // Instancia o layer
        this.player = new Player(this, startX, startY);
    }

}
