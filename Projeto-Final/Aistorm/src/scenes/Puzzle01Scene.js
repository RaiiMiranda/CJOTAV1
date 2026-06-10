// ----------------------------------------------------------------------------------------------------------------
// -- Puzzle01Scene.js: define a cena de puzzle dos cabos
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Puzzle01Scene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'Puzzle01Scene' });

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
        // Pegando o ESC
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Adiciona o cenário de fundo
        this.createBackground();

        this.graphics = this.add.graphics();

        // Adicionando o som dos cabos
        this.cablesSound = this.sound.add('cables', { volume: 1, loop: false });
        
        // ------------------------------------------------------------------------------------------------------------
        // -- Criando os Fios
        // ------------------------------------------------------------------------------------------------------------

        // Para checar as combinações
        this.isRedCorrect = false;
        this.isGreenCorrect = false;
        this.isBlueCorrect = false;

        // Fios lado 1
        this.isRedSide1 = false;
        this.isGreenSide1 = false;
        this.isBlueSide1 = false;

        // Fios lado 2
        this.isRedSide2 = false;
        this.isGreenSide2 = false;
        this.isBlueSide2 = false;

        // ------------------------------------------------------------------------------------------------------------
        // -- Lado 1
        // ------------------------------------------------------------------------------------------------------------
        const btnRed1 = this.add.rectangle(795, 360, 20, 20, 0xff0000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const btnBlue1 = this.add.rectangle(828, 360, 20, 20, 0x0000FF)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const btnGreen1 = this.add.rectangle(860, 360, 20, 20, 0x008000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // ------------------------------------------------------------------------------------------------------------
        // -- Lado 2
        // ------------------------------------------------------------------------------------------------------------
        const btnRed2 = this.add.rectangle(860, 570, 20, 20, 0xff0000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const btnBlue2 = this.add.rectangle(828, 570, 20, 20, 0x0000FF)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        const btnGreen2 = this.add.rectangle(795, 570, 20, 20, 0x008000)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // ------------------------------------------------------------------------------------------------------------
        // -- Lado 1
        // ------------------------------------------------------------------------------------------------------------
        btnRed1.on('pointerdown', () => {
            if (this.isRedCorrect) return; // não permite apertar de novo se já acertou

            this.isRedSide1 = true;
            this.isBlueSide1 = false;
            this.isGreenSide1 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });

        btnBlue1.on('pointerdown', () => {
            if (this.isBlueCorrect) return; // não permite apertar de novo se já acertou

            this.isBlueSide1 = true;
            this.isGreenSide1 = false;
            this.isRedSide1 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });

        btnGreen1.on('pointerdown', () => {
            if (this.isGreenCorrect) return; // não permite apertar de novo se já acertou

            this.isGreenSide1 = true;
            this.isBlueSide1 = false;
            this.isRedSide1 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });

        // ------------------------------------------------------------------------------------------------------------
        // -- Lado 2
        // ------------------------------------------------------------------------------------------------------------
        btnRed2.on('pointerdown', () => {
            if (this.isRedCorrect) return; // não permite apertar de novo se já acertou

            this.isRedSide2 = true;
            this.isBlueSide2 = false;
            this.isGreenSide2 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });

        btnBlue2.on('pointerdown', () => {
            if (this.isBlueCorrect) return; // não permite apertar de novo se já acertou

            this.isBlueSide2 = true;
            this.isGreenSide2 = false;
            this.isRedSide2 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });

        btnGreen2.on('pointerdown', () => {
            if (this.isGreenCorrect) return; // não permite apertar de novo se já acertou

            this.isGreenSide2 = true;
            this.isBlueSide2 = false;
            this.isRedSide2 = false;
            console.log(`Red1: ${this.isRedSide1} | Green1: ${this.isGreenSide1} | Blue1: ${this.isBlueSide1}`);
            console.log(`Red2: ${this.isRedSide2} | Green2: ${this.isGreenSide2} | Blue2: ${this.isBlueSide2}`);

            this.checkCombination();
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Verificando se o player apertou ESC
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.scene.stop();  
            this.scene.resume('GameScene'); 
        }
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
            'background-puzzle01'
        );

        // Criando a animação da tecla ESC
        this.anims.create({
            key: 'keyboard-small',
            frames: this.anims.generateFrameNumbers('keyboard-small', {
                start: 112,
                end: 114
            }),
            frameRate: 2,
            repeat: -1
        });

        // Posição e tamanho
        this.key = this.add.sprite(
            this.config.width / 2 + 662,
            this.config.height * 0.5 + 348,
            'keyboard-small'
        ).setScale(3);

        this.key.play('keyboard-small');
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Checando as combinações
    checkCombination() {
        if (this.isRedSide1 && this.isRedSide2) {
            this.isRedCorrect = true;

            // Tocando o som de sucesso
            this.cablesSound.play();
            this.time.delayedCall(1000, () => {
                this.cablesSound.stop();
            });

            // Desenhando o cabo
            this.graphics.lineStyle(6, 0xff0000);

            this.graphics.beginPath();
            this.graphics.moveTo(795, 360); // ponto 1
            this.graphics.lineTo(860, 570); // ponto 2
            this.graphics.strokePath();
        }

        if (this.isGreenSide1 && this.isGreenSide2) {
            this.isGreenCorrect = true;

            // Tocando o som de sucesso
            this.cablesSound.play();
            this.time.delayedCall(1000, () => {
                this.cablesSound.stop();
            });

            // Desenhando o cabo
            this.graphics.lineStyle(6, 0x008000);

            this.graphics.beginPath();
            this.graphics.moveTo(860, 360); // ponto 1
            this.graphics.lineTo(795, 570); // ponto 2
            this.graphics.strokePath();
        }

        if (this.isBlueSide1 && this.isBlueSide2) {
            this.isBlueCorrect = true;

            // Tocando o som de sucesso
            this.cablesSound.play();
            this.time.delayedCall(1000, () => {
                this.cablesSound.stop();
            });

            // Desenhando o cabo
            this.graphics.lineStyle(6, 0x0000FF);

            this.graphics.beginPath();
            this.graphics.moveTo(828, 360); // ponto 1
            this.graphics.lineTo(828, 570); // ponto 2
            this.graphics.strokePath();
        }

        if (this.isRedCorrect && this.isGreenCorrect && this.isBlueCorrect) {
            this.time.delayedCall(2000, () => {
                // Define como puzzle concluído no gamescene
                const gameScene = this.scene.get('GameScene');
                gameScene.isCablesUnlocked = true;

                this.scene.stop(); // Fecha o puzzle
                this.scene.resume('GameScene'); // Retorna o jogo
            });
        }
    }

}