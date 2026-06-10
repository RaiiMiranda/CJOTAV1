// ----------------------------------------------------------------------------------------------------------------
// -- DefeatScene.js: define a cena de derrota do jogo
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class DefeatScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'DefeatScene' });

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

        // Depois de 3 segundos cria o botão para voltar ao menu
        this.time.delayedCall(5000, () => {
            const btnMenu = this.add.text(this.config.width / 2, 900, 'VOLTAR AO MENU', { fontStyle: 'bold', fontSize: '32px', fill: '#dbdbdb' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setShadow(0, 0, '#000000', 20);

            this.tweens.add({
                targets: btnMenu,
                scale: 1.05,
                duration: 1000,
                yoyo: true, 
                repeat: -1
            });

            // Adiciona o evento de clique
            btnMenu.on('pointerdown', () => {
                this.scene.stop('GameScene');
                this.scene.start('MenuScene');
            });

            // Efeito visual
            btnMenu.on('pointerover', () => btnMenu.setStyle({ fill: '#8e1e64' }));
            btnMenu.on('pointerout', () => btnMenu.setStyle({ fill: '#dbdbdb' }));
        });
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
            'background-menu'
        ).setTint(0xffffff);

        this.backgroundText = this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 80,
            '',
            {
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Texto inicial com efeito
        this.typeText('HUMANO DETECTADO\n\nVocê foi classificado como principal\n\nfonte de instabilidade do sistema\n\nAISTORM RESTAUROU O CONTROLE', 40);

        // Colocando a imagem do player
        this.aiCore = this.add.sprite(
            this.config.width * 0.5,
            this.config.height * 0.5 + 50,
            'player-death',
            17 // último frame
        ).setScale(8).setAlpha(0.8);
    }

    // ----------------------------------------------------------------------------------------------------------------

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