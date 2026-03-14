// ------------------------------------------------------
// -- Arquivo principal do jogo
// ------------------------------------------------------

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

// Instanciamento da cena
const game = new Phaser.Game(config);

// Preload de assets
function preload() {
    // Carrega a imagem do logo do Phaser
    this.load.image('logo', 'assets/images/phaser-logo.png');
}

// Cria os objetos o jogo
function create() {
    // Adiciona a imagem na tela
    this.add.image(400, 300, 'logo');
}