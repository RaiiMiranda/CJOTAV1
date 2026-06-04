// ----------------------------------------------------------------------------------------------------------------
// -- Player.js: define a classe do personagem principal
// ----------------------------------------------------------------------------------------------------------------

import Phaser from 'phaser';

// ----------------------------------------------------------------------------------------------------------------

// Classe que representa o jogador principal
export default class Player extends Phaser.Physics.Arcade.Sprite {

    // Construtor
    constructor(scene, x, y) {
        // Inicializa o sprite com a textura 'player'
        super(scene, x, y, 'player');

        // Define a cena onde o player será adicionado
        this.scene = scene;

        // Configura física, entrada e propriedades iniciais
        this.init();
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Configura o sprite do jogador e suas propriedades físicas
    init() {
        // Adiciona o spite do player à cena para que seja renderizado
        this.scene.add.existing(this);

        // Adiciona o sprite ao sistema de física para que tenha corpo físico
        this.scene.physics.add.existing(this);

        // Impede que o player seja empurrado por outros objetos
        this.setImmovable(true);

        // Permite que o player colida com os limites da cena (parede da tela)
        this.setCollideWorldBounds(true);

        // Desativa a gravidade para o player (movimento apenas horizontal)
        this.body.allowGravity = false;
    }

    // ----------------------------------------------------------------------------------------------------------------

    // Atualiza o comportamento do jogador a cada frame
    update() {
        // TUDO...
    }

    // ----------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // ----------------------------------------------------------------------------------------------------------------

    // TUDO...
};