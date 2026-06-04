// ----------------------------------------------------------------------------------------------------------------
// -- PreloadScene.js: configuração da cena responsável pelo carregamento dos objetos do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que define a cena de carregamento
export default class PreloadScene extends Phaser.Scene {

    // Construtor
    constructor() {
        super({ key:'PreloadScene'});
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Carrega os assets utilizados pelo jogo
    preload() {
        // Exibe a barra de progresso
        this.displayProgressBar();

        // Carrega as imagens
        this.load.image('background', 'assets/images/background.png');
        this.load.image('player', 'assets/images/mineiro.png');
        this.load.image('fence', 'assets/images/cerca.png');

        // Carrega os queijos
        this.load.image('cheese1', 'assets/images/queijo1.png');
        this.load.image('cheese2', 'assets/images/queijo2.png');
        this.load.image('cheese3', 'assets/images/queijo3.png');
        this.load.image('cheese4', 'assets/images/queijo4.png');
        this.load.image('cheese5', 'assets/images/queijo5.png');
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa os elementos da cena
    create() {
        // Muda para a cena do jogo
        this.scene.start('GameScene');
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------
    
    // Cria e exibe uma barra de progresso enquanto os assets são carregados
    displayProgressBar() {
        // Dimensões da barra
        const { width, height } = this.cameras.main;

        // Fundo da barra
        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x222222, 0.8);
        progressBarBg.fillRect(width / 4 - 2, height / 2 - 12, width / 2 + 4, 24);

        // Barra principal
        const progressBar = this.add.graphics();

        // Texto "Loading..."
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 30,
            'Loading...',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Atualiza a barra conforme o progresso do carregamento
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2 - 10, (width / 2) * value, 20);
        });

        // Remove os elementos da barra ao fim do carregamento
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        });
    }

}