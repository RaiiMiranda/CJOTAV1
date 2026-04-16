// ----------------------------------------------------------------------------------------------------------------
// -- GameScene.js: define a cena principal do jogo
// ----------------------------------------------------------------------------------------------------------------

import Phaser, { GameObjects } from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa a cena principal do jogo
export default class GameScene extends Phaser.Scene {

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Principais
    // ----------------------------------------------------------------------------------------------------------------
    
    constructor(config) {
        // Define a chave da cena
        super({ key: 'GameScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // Inicializa as referências do player
        this.player = null;
        this.targetPosition = null;
        this.playerSpeed = 100;
        this.playerDrag = 0.95; // atrito 

        // Distância mínima para considerar o movimento do player
        // Se tiver muito perto não considera
        this.minDistance = 25;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Adiciona o cenário de fundo
        this.createBackground();

        // Instancia o player
        this.createPlayer();

        // Obtém a posição inicial do player
        this.targetPosition = new Phaser.Math.Vector2(
            this.player.x,
            this.player.y
        );

        // Evita que o menu de contexto seja aberto com o botão direito do mouse
        this.input.mouse.disableContextMenu();

        // Configura os eventos de toque na tela
        // Eventos desse tipo devem ser feitos no create
        this.setupTouchEvents();
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Atualiza as informações relacionadas ao player
        this.playerManager(time);
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
        this.player = this.physics.add
        .sprite(this.config.width * 0.5, 350, 'player')
        .setOrigin(0.5, 0.5);

        // Habilita o amortecedor
        this.player.setDamping(true);

        // Define o arrasto do player
        this.player.setDrag(this.playerDrag);

        // habilita a colisão do player com as bordas do mundo
        this.player.setCollideWorldBounds(true);
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Pega os eventos de toque
    setupTouchEvents() {
        // Detecta um toque na tela ou clique do mouse
        this.input.on('pointerdown', (pointer) => {
            // Define a posição do destino do player
            this.targetPosition.set(pointer.x, pointer.y);

            // Adiciona um X como alvo visual na posição do player
            const xMark = this.add
            .text(pointer.x, pointer.y, 'X', {
                font: '60px Arial',
                fill: '#ff0000',
            })
            .setOrigin(0.5);

            // Remove o X depois de 3 segundos
            this.time.delayedCall(3000, () => xMark.destroy());
        });
    }

    // Atualiza informações relacionadas ao player
    playerManager(time) {
        // Aplica oscilação suave no player
        this.player.y += Math.cos((time / 1000) * 2) * 0.5;

        // Calcula a distância até o destino
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.targetPosition.x,
            this.targetPosition.y
        );

        // Se a distância até o destino for maior que a distância mínima
        if (distance > this.minDistance) {
            // Calcula o ângulo para rotacionar o avião do player
            const angle = Phaser.Math.Angle.Between(
                this.player.x,
                this.player.y,
                this.targetPosition.x,
                this.targetPosition.y
            );
        }

        // Rotaciona o player para a direção do ângulo calculado
        // Aplica uma compensação, pois o avião não está virado para a direita
        this.player.rotation = Phaser.Math.Angle.RotateTo(
            this.player.rotation,
            angle + Phaser.Math.DegToRad(-90),
            0.03
        );

        // Move o avião para frente (na direção atual)
        // Assim, evita que o player seja rotacionado de forma abrupta
        // Calcula o ângulo de movimento, removendo o offset de -90 graus
        const moveAngle = this.player.rotation -= Phaser.Math.DegToRad(-90);

        // Move o avião na direção que ele está apontando
        const velocity = this.physics.velocityFromRotation(
            moveAngle,
            this.playerSpeed,
            this.player.body.velocity
        );
    }

    // Caso contrário, interrompe o movimento do player
    // esse else ta faltando if
    else {
        this.player.body.setVelocity(0, 0);
    }
    
} // Fim do programa
