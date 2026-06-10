// ----------------------------------------------------------------------------------------------------------------
// -- Puzzle02Scene.js: define a cena de puzzle da senha
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Puzzle02Scene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'Puzzle02Scene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;

        // Atributos para o puzzle
        this.correctPassword = '2691';
        this.attempt = '';
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

        // Adicionando o som das teclas
        this.keySound = this.sound.add('beep', { volume: 1, loop: false });
        this.doorSound = this.sound.add('door-opening', { volume: 1, loop: false });

        // Texto para mostrar a senha sendo digitada
        this.displayPassword = this.add.text(1065, 375, '', { fontSize: '20px', fill: '#fff' });

        // Criando um grupo de botões
        const buttons = this.add.group();

        // Criando cada botão do grupo
        for (let i = 1; i <= 9; i++) {
            let btn = this.add.rectangle(0, 0, 50, 30, 0x333333).setInteractive({ useHandCursor: true });

            btn.setData('value', i); // Definindo uma nova propriedade pros botões que guarda seu valor único
            btn.on('pointerdown', () => {
                this.keySound.play(); // tocando o som
                this.checkPassword(i) // checando a senha
            });
            
            buttons.add(btn); // Adicionando os botões
        }

        // Alinhando tudo automaticamente
        Phaser.Actions.GridAlign(buttons.getChildren(), {
            width: 3,          // 3 colunas
            height: 3,         // 3 linhas
            cellWidth: 55,     // Espaço horizontal
            cellHeight: 40,    // Espaço vertical
            x: 1050,           // Posição inicial X
            y: 425             // Posição inicial Y
        });

        // Escrevendo os números dentro dos botões
        buttons.getChildren().forEach(btn => {
            // Efeito visual
            btn.on('pointerover', () => btn.setFillStyle(0x55824F));
            btn.on('pointerout', () => btn.setFillStyle(0x333333));

            const valor = btn.getData('value');
            this.add.text(btn.x, btn.y, valor, { fontSize: '20px', fontStyle: 'bold' }).setOrigin(0.5);
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
            'background-puzzle02'
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
            this.config.width / 2 + 642,
            this.config.height * 0.5 + 358,
            'keyboard-small'
        ).setScale(3);

        this.key.play('keyboard-small');
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Função para verificar a senha digitada
    checkPassword(num) {
        this.attempt += num.toString();                   // Concatena as tentativas
        this.displayPassword.setText(' ' + this.attempt); // Atualiza a senha na tela

        // Se a tentativa tiver o mesmo tamanho da senha correta
        if (this.attempt.length === this.correctPassword.length) {
            // Então, verifica se a tentantiva está correta
            if (this.attempt === this.correctPassword) {
                this.displayPassword.setText("CORRETO!");

                // Define como senha completa no gamescene
                const gameScene = this.scene.get('GameScene');
                gameScene.isPasswordUnlocked = true;

                // Tocando o som da porta após 1s
                this.time.delayedCall(1000, () => this.doorSound.play({ seek: 1.4 }));

                // Trocando de cena após 3s
                this.time.delayedCall(3000, () => {
                    this.scene.stop();              // Fecha o puzzle
                    this.scene.resume('GameScene'); // Retorna o jogo
                });
            // Se estiver errada, então reseta
            } else {
                this.attempt = "";
                this.cameras.main.shake(100, 0.003);

                this.time.delayedCall(500, () => {
                    this.displayPassword.setText('Errada!')
                });
            }
        }
    }

}