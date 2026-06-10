// ----------------------------------------------------------------------------------------------------------------
// -- PreloadScene.js: configuração da cena responsável pelo carregamento dos objetos do jogo
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

// Classe que define a cena de carregamento
export class PreloadScene extends Phaser.Scene {

    // Construtor
    constructor() {
        super({ key:'PreloadScene' });
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Carrega os assets utilizados pelo jogo
    preload() {
        // Exibe a barra de progresso
        this.displayProgressBar();

        // ------------------------------------------------------------------------------------------------------------
        // -- Carregando as Imagens
        // ------------------------------------------------------------------------------------------------------------

        // Carrega as imagens de Fundo
        this.load.image('background-menu', 'assets/images/background/bg-menu.png');
        this.load.image('background-puzzle01', 'assets/images/background/bg-puzzle01.png');
        this.load.image('background-puzzle02', 'assets/images/background/bg-puzzle02.png');
        this.load.image('background-computer', 'assets/images/background/bg-computer.png');
        this.load.image('background-computer', 'assets/images/background/bg-computer.png');

        // Carrega outras imagens
        this.load.image('door', 'assets/images/door.png');
        this.load.image('door-open', 'assets/images/door-open.png');
        this.load.image('computer', 'assets/images/empty.png');

        // ------------------------------------------------------------------------------------------------------------

        // Carrega a Spritesheet do Efeito de Heal
        this.load.spritesheet('heal-effect', 'assets/images/effects/heal/spritesheet/heal_spritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Carrega a Spritesheet do Efeito do Escudo
        this.load.spritesheet('shield-effect', 'assets/images/effects/holyshield/spritesheet/holyshield_spritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // ------------------------------------------------------------------------------------------------------------

        // Carrega a Spritesheet do Teclado
        this.load.spritesheet('keyboard-small', 'assets/images/keyboard/keys-small.png', {
            // Tamanho de cada quadro
            frameWidth: 16, // tamanho real / quantidade de sprites horizontal = frameWidth
            frameHeight: 16 // tamanho real / quantidade de linhas = frameHeight
        });

        this.load.spritesheet('keyboard-big', 'assets/images/keyboard/keys-big.png', {
            // Tamanho de cada quadro
            frameWidth: 47.5, // tamanho real / quantidade de sprites horizontal = frameWidth
            frameHeight: 16 // tamanho real / quantidade de linhas = frameHeight
        });

        // ------------------------------------------------------------------------------------------------------------

        // Carrega as Spritesheet do Player
        this.load.spritesheet('player-idle', 'assets/images/player/idle.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('player-walk', 'assets/images/player/walk.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('player-run', 'assets/images/player/run.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('player-attack', 'assets/images/player/attack.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('player-gethit', 'assets/images/player/gethit.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('player-death', 'assets/images/player/death.png', {
            frameWidth: 140,
            frameHeight: 140
        });

        this.load.spritesheet('projectile-moving', 'assets/images/player/projectile/moving.png', {
            frameWidth: 50,
            frameHeight: 50
        });

        this.load.spritesheet('projectile-explode', 'assets/images/player/projectile/explode.png', {
            frameWidth: 50,
            frameHeight: 50
        });

        // ------------------------------------------------------------------------------------------------------------

        // Carrega a Spritesheet da IA Core
        this.load.spritesheet('ai-core', 'assets/images/enemy/agis.png', {
            frameWidth: 224,
            frameHeight: 240
        });

        // Carrega as Spritesheet dos Inimigos
        this.load.spritesheet('enemy-up', 'assets/images/enemy/up.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('enemy-down', 'assets/images/enemy/down.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('enemy-right', 'assets/images/enemy/right.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('enemy-left', 'assets/images/enemy/left.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        // ------------------------------------------------------------------------------------------------------------

        // Carrega as Imagens para o Mapa
        this.load.image('buildings', 'assets/map/buildings.png');
        this.load.image('props', 'assets/map/props.png');
        this.load.image('tileset', 'assets/map/tileset.png');
    
        // Carrega o arquivo JSON do mapa
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // ------------------------------------------------------------------------------------------------------------
        // -- Carrega os Sons
        // ------------------------------------------------------------------------------------------------------------

        // MenuScene
        this.load.audio('menu', 'assets/sounds/menuscene/menu.mp3');

        // IntroScene
        this.load.audio('typing', 'assets/sounds/introscene/typing.mp3');

        // GameScene
        this.load.audio('game-ambient', 'assets/sounds/gamescene/game-ambient.mp3');
        this.load.audio('heartbeat', 'assets/sounds/gamescene/game-heartbeat.mp3');
        this.load.audio('progress-bar', 'assets/sounds/gamescene/computer-processing.mp3');
        this.load.audio('finish-bar', 'assets/sounds/gamescene/computer-finish.mp3');
        this.load.audio('end-music', 'assets/sounds/gamescene/frenetic-end.mp3');

        this.load.audio('enemy-walk', 'assets/sounds/gamescene/enemy/enemy-walking.mp3');
        this.load.audio('enemy-hurt', 'assets/sounds/gamescene/enemy/enemy-hurt.mp3');
        this.load.audio('enemy-death', 'assets/sounds/gamescene/enemy/enemy-death.mp3');
        this.load.audio('enemy-attacking', 'assets/sounds/gamescene/enemy/enemy-attacking.mp3');

        this.load.audio('player-hurt', 'assets/sounds/gamescene/player/player-hurt.mp3');
        this.load.audio('player-walking', 'assets/sounds/gamescene/player/player-walking.mp3');
        this.load.audio('player-attacking', 'assets/sounds/gamescene/player/player-attacking.mp3');
        this.load.audio('shield-actived', 'assets/sounds/gamescene/player/shield-actived.mp3');

        // Puzzle01Scene
        this.load.audio('cables', 'assets/sounds/puzzle01scene/cables-conected.mp3');

        // Puzzle02Scene
        this.load.audio('beep', 'assets/sounds/puzzle02scene/beep-puzzle02.mp3');
        this.load.audio('door-opening', 'assets/sounds/puzzle02scene/door-opening.mp3');
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Inicializa os elementos da cena
    create() {
        // Muda para a cena do menu depois que todos os assets carregaram
        this.scene.start('MenuScene');
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------
    
    // Cria e exibe uma barra de progresso enquanto os assets são carregados
    displayProgressBar() {
        // Dimensões da barra
        const { width, height } = this.cameras.main;

        this.cameras.main.setBackgroundColor('#07091e');

        // Fundo da barra
        const progressBarBg = this.add.graphics();
        progressBarBg.fillStyle(0x3a0f41, 0.8);
        progressBarBg.fillRect(width / 4 - 2, height / 2 - 12, width / 2 + 4, 24);

        // Barra principal
        const progressBar = this.add.graphics();

        // Texto "Carregando..."
        const loadingText = this.add.text(
            width / 2,
            height / 2 - 30,
            'Carregando...',
            {
                fontSize: '20px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Atualiza a barra conforme o progresso do carregamento
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x8e1e64, 1);
            progressBar.fillRect(width / 4, height / 2 - 10, (width / 2) * value, 20);
        });

        // Remove os elementos da barra ao fim do carregamento
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        });
    }

}