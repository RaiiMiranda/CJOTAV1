// -----------------------------------------------------------------------------------------------------------------------------------
// -- IntroScene.js: define a cena de intro do jogo
// -----------------------------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------------------------

export class IntroScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'IntroScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Depois de aparecer os texto
        this.time.delayedCall(10000, () => {
            // Faz um fadeOut e começa o jogo
            this.cameras.main.fadeOut(500, 0, 0, 0);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            }); 
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // TUDO ...
    }

    // -----------------------------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------------------------------
    
    // Cria o cenário de fundo
    createBackground() {
        // Criando o fundo
        this.add.rectangle(
            this.config.width * 0.5,
            this.config.height * 0.5,
            this.config.width,
            this.config.height,
            0x000000
        );

        // -----------------------------------------------------------------------------------------------------------------------------------

        // Criando o texto de fundo vazio
        this.backgroundText = this.add.text(
            this.config.width / 2,
            this.config.height / 2,
            '',
            {
                fontSize: '18px',
                color: '#00ffcc',
                align: 'center'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#00ffff', 20);
        
        // Texto inicial com efeito
        this.typeText('INICIALIZANDO O SISTEMA AISTORM...\n\nSTATUS DO MUNDO: FRAGMENTADO\nREDE: CORROMPIDA\n\nOBJETIVO: RESTAURAR NÓS', 40);

        // -----------------------------------------------------------------------------------------------------------------------------------

        // Depois de 5 segundos troca o texto
        this.time.delayedCall(6000, () => {
            this.backgroundText.setText(''); // limpa o texto

            // Criando a animação da IA
            this.anims.create({
                key: 'ai-core',
                frames: this.anims.generateFrameNumbers('ai-core', {
                    start: 0,
                    end: 14
                }),
                frameRate: 10,
                repeat: -1
            });

            // Posição da IA
            this.aiCore = this.add.sprite(
                this.config.width * 0.5,
                this.config.height * 0.5 + 50,
                'ai-core'
            ).setAlpha(0.5);

            this.tweens.add({
                targets: this.aiCore,
                alpha: 0,
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            this.aiCore.play('ai-core');

            // -----------------------------------------------------------------------------------------------------------------------------------

            // Adiciona o novo texto
            this.bigText = this.add.text(
                this.config.width / 2,
                this.config.height / 2,
                'O MUNDO NÃO FOI DESTRUÍDO.\nELE FOI REESCRITO.\n\nPOR AISTORM.',
                {
                    fontSize: '22px',
                    color: '#ffffff',
                    align: 'center'
                }
            ).setOrigin(0.5).setAlpha(0);

            // Efeito suave de opacidade
            this.tweens.add({
                targets: this.bigText,
                alpha: 1,
                duration: 1000
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Cria efeito de typing no texto
    typeText(text, speed) {
        // Contador para as letras
        let i = 0; 

        // Cria um timer repetitivo
        this.time.addEvent({
            delay: speed,            // tempo em cada letra (40ms)
            repeat: text.length - 1, // quanto vai repetir
            callback: () => {        // roda a cada milissegundo
                this.backgroundText.text += text[i]; // adiciona a letra no final
                i++;                                 // próxima letra
            }
        });

        // Tocando o som de typing por 4 segundos
        this.typingSound = this.sound.add('typing', { volume: 0.3 });
        this.typingSound.play();

        this.time.delayedCall(4000, () => {
            this.typingSound.stop();
        });
    }

}