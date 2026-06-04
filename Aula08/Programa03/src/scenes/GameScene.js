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
            'Animation by Spitesheet',
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
            'enemy'
        ).setScale(2);

        // Linha 1: 0-21 -> idle: 0-5
        // Linha 2: 22-43 -> walk: 22-33
        // Linha 3: 44-65 -> cleave: 44-58
        // Linha 4: 66-87 -> take hit: 66-70
        // Linha 5: 88-109 -> death: 88-109

        // Cria a animação do player atacando
        this.anims.create({
            key: 'cleave',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 44, // frame inicial
                    end: 58    // frame final
                }
            ),
            frameRate: 8, // taxa de quadros por segundo
            repeat: -1    // loop infinito
        });

        // Cria a animação do player morrendo
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers(
                'enemy',
                {
                    start: 88, // frame inicial
                    end: 109   // frame final
                }
            ),
            frameRate: 8, // taxa de quadros por segundo
            repeat: -1    // loop infinito
        });

        // Executa a animação
        this.enemy.play('death');
    }
    
} // Fim do programa