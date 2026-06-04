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

    // Cria os elementos visuais e lógicos da cena
    create() {
        // A ordem de criação dos objetos, determina quem fica na frente de quem

        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o inimigo
        this.createEnemy();

        // Obtém o centro da tela
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Adiciona um texto explicativo
        this.add.text(
            centerX,
            centerY - 200,
            'Animation by Frames',
            {
                fontSize: '40px',
                fontFamily: 'Times New Roman',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        
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

    // Criando o inimigo
    createEnemy() {
        // Adiciona o primeiro sprite do inimigo
        this.enemy = this.add.sprite(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'enemy_idle_1'
        ).setScale(2);

        // Cria a animação a partir dos quadros individuais
        this.anims.create({
            key: 'enemy_idle',
            frames: [
                { key: 'enemy_idle_1'},
                { key: 'enemy_idle_2'},
                { key: 'enemy_idle_3'},
                { key: 'enemy_idle_4'},
                { key: 'enemy_idle_5'},
                { key: 'enemy_idle_6'},
            ],
            frameRate: 4, // eaxa de quadros por segundo
            repeat: -1    // loop infinito
        });

        // Executa a animação
        this.enemy.play('enemy_idle');
    }
    
} // Fim do programa