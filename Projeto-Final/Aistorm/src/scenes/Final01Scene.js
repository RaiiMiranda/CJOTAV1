// ----------------------------------------------------------------------------------------------------------------
// -- Final01Scene.js: muitos robôs destruídos
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Final01Scene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'Final01Scene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Som de teclas
        this.typingSound = this.sound.add('typing', { volume: 0.3 });

        // Adiciona o cenário de fundo
        this.createBackground();

        // ------------------------------------------------------------------------------------------------------------
        // -- Criando o botão de Sair
        // ------------------------------------------------------------------------------------------------------------
        const btnMenu = this.add.text(720, 830, 'Jogar Novamente', { fontStyle: 'bold', fontSize: '24px', fill: '#dbdbdb' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 0, '#000000', 20);

        // Adiciona o evento de clique
        btnMenu.on('pointerdown', () => {
            this.typingSound.stop();
            this.scene.start('MenuScene');
        });

        // Efeito visual
        btnMenu.on('pointerover', () => btnMenu.setStyle({ fill: '#8e1e64' }));
        btnMenu.on('pointerout', () => btnMenu.setStyle({ fill: '#dbdbdb' }));

        this.tweens.add({
            targets: btnMenu,
            scale: 1.05,
            duration: 1000,
            yoyo: true, // faz o título voltar ao normal, então cresce e volta (yoyo)
            repeat: -1
        });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // TUDO ...
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------
    
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
            this.config.height / 2 - 300,
            '',
            {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#00ffff', 20).setDepth(999);
        
        // Texto inicial com efeito
        this.typeText(
            'Mesmo diante da oportunidade de restauração,\n' +
            'a agente utilizou força excessiva.\n\n' +
            '--------------------------------------------\n' +
            'Humanos continuam sendo a principal\n' +
            'fonte de instabilidade.\n' +
            '--------------------------------------------\n\n' +
            'AISTORM RETOMOU O CONTROLE TOTAL.'
        , 40);

        // -----------------------------------------------------------------------------------------------------------------------------------

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
        ).setAlpha(0.5).setScale(2.5);

        this.tweens.add({
            targets: this.aiCore,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.aiCore.play('ai-core');

        // -----------------------------------------------------------------------------------------------------------------------------------
    }

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
        this.typingSound.play();

        this.time.delayedCall(4000, () => {
            this.typingSound.stop();
        });
    }

}