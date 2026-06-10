// ----------------------------------------------------------------------------------------------------------------
// -- MenuScene.js: define a cena de menu inicial do jogo
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class MenuScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'MenuScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Criando a música se ela ainda não existir
        this.menuMusic = this.sound.get('menu'); // busca o som no sistema interno de áudio do Phaser
        if (!this.menuMusic) {
            this.menuMusic = this.sound.add('menu', { volume: 1.5, loop: true })
            this.menuMusic.play();
        }

        // ------------------------------------------------------------------------------------------------------------
        // -- Criando o botão de Play
        // ------------------------------------------------------------------------------------------------------------
        const btnPlay = this.add.text(600, 780, 'JOGAR', { fontStyle: 'bold', fontSize: '32px', fill: '#dbdbdb' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 0, '#000000', 20);

        // Adiciona o evento de clique
        btnPlay.on('pointerdown', () => {
            this.menuMusic.stop();
            this.scene.start('IntroScene');
        });

        // Efeito visual
        btnPlay.on('pointerover', () => btnPlay.setStyle({ fill: '#8e1e64' }));
        btnPlay.on('pointerout', () => btnPlay.setStyle({ fill: '#dbdbdb' }));

        this.tweens.add({
            targets: btnPlay,
            scale: 1.05,
            duration: 1000,
            yoyo: true, // faz o título voltar ao normal, então cresce e volta (yoyo)
            repeat: -1
        });

        // ------------------------------------------------------------------------------------------------------------
        // -- Criando o botão de Créditos
        // ------------------------------------------------------------------------------------------------------------
        const btnCredits = this.add.text(880, 780, 'CRÉDITOS', { fontStyle: 'bold', fontSize: '32px', fill: '#dbdbdb' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 0, '#000000', 20);

        // Adiciona o evento de clique
        btnCredits.on('pointerdown', () => {
            //this.menuMusic.stop();
            this.scene.start('CreditScene');
        });

        // Efeito visual
        btnCredits.on('pointerover', () => btnCredits.setStyle({ fill: '#8e1e64' }));
        btnCredits.on('pointerout', () => btnCredits.setStyle({ fill: '#dbdbdb' }));

        this.tweens.add({
            targets: btnCredits,
            scale: 1.05,
            duration: 1000,
            yoyo: true, // faz o título voltar ao normal, então cresce e volta (yoyo)
            repeat: -1
        });

        // ------------------------------------------------------------------------------------------------------------
        // -- Criando o botão de Sair
        // ------------------------------------------------------------------------------------------------------------
        const btnLeave = this.add.text(720, 830, 'SAIR', { fontStyle: 'bold', fontSize: '32px', fill: '#dbdbdb' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(0, 0, '#000000', 20);

        // Adiciona o evento de clique
        btnLeave.on('pointerdown', () => {
            window.close();
        });

        // Efeito visual
        btnLeave.on('pointerover', () => btnLeave.setStyle({ fill: '#8e1e64' }));
        btnLeave.on('pointerout', () => btnLeave.setStyle({ fill: '#dbdbdb' }));

        this.tweens.add({
            targets: btnLeave,
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
        // Adiciona a imagem do cenário de fundo
        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'background-menu'
        ).setTint(0xffffff);

        // Criando o título
        const title2 = this.add.text(
            this.config.width / 2 + 5,
            this.config.height / 2 - 280,
            '-',
            {
                fontSize: '120px',
                color: '#de138c'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#000000', 20);

        const title = this.add.text(
            this.config.width / 2 + 5,
            this.config.height / 2 - 230,
            'AIS ORM',
            {
                fontSize: '64px',
                color: '#de138c'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#000000', 20);

        // Pulsando o título
        // tween = animação suave automática
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true, // faz o título voltar ao normal, então cresce e volta (yoyo)
            repeat: -1
        });

        this.tweens.add({
            targets: title2,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

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

        // Posição e tamanho da IA
        this.aiCore = this.add.sprite(
            this.config.width / 2,
            this.config.height * 0.5 + 50,
            'ai-core'
        ).setScale(3.2);

        this.aiCore.play('ai-core');
    }

}