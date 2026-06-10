// ----------------------------------------------------------------------------------------------------------------
// -- CreditScene.js: define a cena de créditos do jogo
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class CreditScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'CreditScene' });

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
        
        // ------------------------------------------------------------------------------------------------------------
        // -- Criando o botão de Play
        // ------------------------------------------------------------------------------------------------------------
        const btnBack = this.add.text(80, 100, '🡐', { fontSize: '32px', fill: '#8e1e64', fontStyle: 'bold' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Adiciona o evento de clique
        btnBack.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Efeito visual
        btnBack.on('pointerover', () => btnBack.setStyle({ fill: '#dbdbdb' }));
        btnBack.on('pointerout', () => btnBack.setStyle({ fill: '#8e1e64' }));

        this.creditsText = this.add.text(
            this.config.width / 2,
            220,
            'CRIADO POR\n' +
            'Raissa Pereira Miranda\n\n' +
            '➡ ARTE ⬅\n\n' +
            'Efeitos especiais\n' +
            'https://sentient-dream-studio.itch.io/pixel-holy-effects-pack01\n\n' +
            'Teclas de tutorial\n' +
            'https://retrograde-dev.itch.io/retrograde-input-16\n\n' +
            'Tileset do mapa\n' +
            'https://yaninyunus.itch.io/neo-zero-cyberpunk-city-tileset\n\n' +
            'Player\n' +
            'https://luizmelo.itch.io/evil-wizard-3\n\n' +
            'Inimigos\n' +
            'https://art-man-oil.itch.io/bots-and-bolts-player\n' +
            'https://papoycore.itch.io/free-agis\n\n' +
            'Fundos\n' +
            'https://gemini.google.com\n\n' +
            '➡ MÚSICA ⬅\n\n' +
            'https://pixabay.com/pt/sound-effects/',
            {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
                wordWrap: {
                    width: this.config.width - 200
                }
            }
        )
        .setOrigin(0.5, 0);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // TUDO ...
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
        );

        // Criando o título
        const title = this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 300,
            'CRÉDITOS',
            {
                fontSize: '64px',
                color: '#de138c'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#000000', 20);

        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true, // faz o título voltar ao normal, então cresce e volta (yoyo)
            repeat: -1
        });
    }

}