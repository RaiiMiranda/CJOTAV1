// ----------------------------------------------------------------------------------------------------------------
// -- Door.js: define a classe das portas
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Door extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'door');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setPushable(false);

        // Atributos da porta
        this.isOpen = false;
        this.doorName = ' ';

        this.setTexture('door');
    }

    // -----------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update() {
        // TUDO ...
    }

    // -----------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------

    // Função que alterna se a porta está ou não aberta
    toggle() {
        if (this.isOpen) {
            this.setDepth(10);
            this.setTexture('door');
            this.isOpen = false;

            this.body.checkCollision.none = false;
        }
        else {
            this.setTexture('door-open');
            this.isOpen = true;

            this.body.checkCollision.none = true;
        }
    }

}
