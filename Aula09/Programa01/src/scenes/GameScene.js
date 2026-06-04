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

    // Cria os elementos visuais e lógicos da cena
    create() {
        // A ordem de criação dos objetos, determina quem fica na frente de quem

        // Adiciona o cenário de fundo
        this.createBackground();

        // Cria o player
        this.createPlayer();
        
        // Criando a coca
        this.createCoke();

        // Obtém o centro da tela
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Adiciona um texto explicativo
        this.add.text(
            centerX, 
            50,
            'Animações Interpoladas e Fonte Bitmap',
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setShadow(2, 2, "#000000", 3, true, true).setOrigin(0.5);

        // Adiciona um texto com a fonte bitmap
        this.add.bitmapText(
            centerX,
            130,
            'pokelino',
            'Pokelino: gotta catch all the Cokes!',
            50
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