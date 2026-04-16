// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser, { GameObjects } from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa a cena principal do jogo
export default class GameScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' }, config);

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // Inicializa uma referência do player
        this.player = null;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();

        // Evita que o menu de contexto seja aberto com o botão direito do mouse
        this.input.mouse.disableContextMenu();

        // Detecta a rolagem da tela, mediante uso da roda do mouse
        // Essa verificação é feita no create para evitar múltiplas assinaturas
        this.input.on('wheel', (pointer, GameObjects, deltaX, deltaY, deltaZ) => {
            // Rolagem para cima
            if (deltaY < 0) {
                console.log('Roda do mouse rolada para cima');
            }

            // Rolagem para baixo
            if (deltaY > 0) {
                console.log('Roda do mouse rolada para baixo');
            }
        });

    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Exibe informações de acordo com o botão do mouse
        this.checkMouseButton();
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

    // Cria e posiciona o jogador na cena
    createPlayer() {
        // Adiciona a imagem do player (habilitando a física)
        this.player = this.physics.add.sprite(
            this.config.width * 0.5,
            350,
            'player'
        );

        // habilita a colisão do player com as bordas do mundo
        this.player.setCollideWorldBounds(true);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Exibe informações de acordo com o botão do mouse
    checkMouseButton() {
        // Obtém a informação sobre o ponteiro do mouse
        const pointer = this.input.activePointer;

        // Se botão esquerdo foi pressionado
        if (pointer.leftButtonDown()) {
            console.log('Botão esquerdo pressionado');

            // Move o avião para a posição do mouse
            this.player.x = pointer.x;
            this.player.y = pointer.y;
        }

        // Se botão direito foi pressionado
        if (pointer.rightButtonDown()) {
            console.log('Botão direito pressionado');
        }

        // Se botão do meio foi pressionado
        if (pointer.middleButtonDown()) {
            console.log('Botão direito do mouse está pressionado');
        }

        // Detecta se o botão está pressionado por mais de X ms
        if (pointer.isDown && pointer.getDuration() > 500) {
            console.log('Botão mantido pressionado por mais de 500ms');
        }
    }
}
