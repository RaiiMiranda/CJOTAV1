// ----------------------------------------------------------------------------------------------------------------
// -- main.js: arquivo principal
// ----------------------------------------------------------------------------------------------------------------

import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CreditScene } from './scenes/CreditScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ComputerScene } from './scenes/ComputerScene.js';
import { Puzzle01Scene } from './scenes/Puzzle01Scene.js';
import { Puzzle02Scene } from './scenes/Puzzle02Scene.js';
import { DefeatScene } from './scenes/DefeatScene.js';
import { Final01Scene } from './scenes/Final01Scene.js';
import { Final02Scene } from './scenes/Final02Scene.js';

// ----------------------------------------------------------------------------------------------------------------
// -- Configurações Globais
// ----------------------------------------------------------------------------------------------------------------

// Dimensões da tela do jogo
const WIDTH = 1440;
const HEIGHT = 960;

// Configurações compartilhadas entre as cenas
const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    debug: false
};

// Lista das cenas que compõem o jogo
const SCENES = [
    PreloadScene, // primeiro carrega os assets
    MenuScene,    // depois carrega o menu e outras cenas
    CreditScene,
    IntroScene,
    GameScene,  
    ComputerScene,
    Puzzle01Scene,
    Puzzle02Scene,
    DefeatScene,
    Final01Scene,
    Final02Scene,
];

// Cria uma instância de cena com a configuração compartilhada
const createScene = Scene => new Scene(SHARED_CONFIG);

// Inicializa todas as cenas do jogo
const initScenes = () => SCENES.map(createScene);

// ----------------------------------------------------------------------------------------------------------------
// -- Configuração Geral do Phaser.Game
// ----------------------------------------------------------------------------------------------------------------

const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    backgroundColor: '#0080ff',
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: SHARED_CONFIG['debug'],
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: initScenes()
};

// ----------------------------------------------------------------------------------------------------------------
// -- Inicializa a instância principal do jogo com a configuração definida
// ----------------------------------------------------------------------------------------------------------------

new Phaser.Game(config);