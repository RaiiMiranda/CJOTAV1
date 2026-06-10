// ----------------------------------------------------------------------------------------------------------------
// -- Computer.js: define a classe dos computadores
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Computer extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'computer');
        
        scene.add.existing(this);
        scene.physics.add.existing(this); 

        this.body.setImmovable(true);
        this.body.pushable = false;

        // Atributos
        this.progress = 0;
        this.maxProgress = 100;
        this.restored = false;
        this.isPlayerNear = false;
        this.isBlocked = false;

        // Criando a barra de fundo cinza do progresso
        // 40 de largura por 6 de altura
        this.barBg = scene.add.rectangle(x, y - 25, 40, 6, 0x222222);

        // Criando o preenchimento da barra
        // Sem largura (vai crescer ainda)
        this.barFill = scene.add.rectangle(x - 20, y - 25, 0, 6, 0x00ff00).setOrigin(0, 0.5);

        // Som da barra de progresso
        this.progressSound = scene.sound.add('progress-bar', { volume: 0.05, loop: true });
        this.isRestoring = false; // para controlar o som para usar no update (60fps não iniciava certo)

        // Som de finalização da restauração
        this.finishSound = scene.sound.add('finish-bar', { volume: 0.05, loop: false });

        // Cria o efeito de partículas ao completar a restauração
        this.anims.create({
            key: 'heal-effect',
            frames: this.anims.generateFrameNumbers('heal-effect', {
                start: 0,
                end: 11,
            }),
            frameRate: 8,
            repeat: 0,
        });
    }

    // -----------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(player, delta) {
        // Se já estiver restaurado, retorna
        if (this.restored) return;

        // Calculando a distância entre o player e o computador
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );

        this.isPlayerNear = distance < 60;      // armazena se o player está perto ou não
        this.isBlocked = player.isDangerNearby; // bloqueia a restauração se inimigo perto

        // Se não estiver bloqueado & player estiver perto & apertou 'E'
        if (!this.isBlocked && this.isPlayerNear && player.keys.E.isDown) {
            this.progress += delta * 0.05;       // então cresce a barra
            this.barFill.setFillStyle(0x00ff00); // verde

            // Toca o som de restaurando
            if (!this.isRestoring) {
                this.progressSound.play();
                this.isRestoring = true;
            }
        }
        else {
            this.barFill.setFillStyle(0xff0000); // vermelho

            // Para o som
            if (this.isRestoring) {
                this.progressSound.stop();
                this.isRestoring = false;
            }
        }

        // Se completou a restauração (100%)
        if (this.progress >= this.maxProgress) {
            player.life += 5;

            this.finishSound.play();        // toca o som de conclusão
            this.anims.play('heal-effect'); // toca a animação de conclusão
            this.completeRestore();         // chama a função de conclusão
        }

        // Atualizando a barra de progresso
        // Transforma em % calculando quanto já foi feito (50 / 100 = 0.5)
        const ratio = this.progress / this.maxProgress;

        // Pega largura da barra (40) e multiplica pelo ratio (40 * 0.5 = 20%)
        this.barFill.width = 40 * ratio;
    }

    // -----------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------

    // Função para mostrar que o computador foi restaurado
    completeRestore() {
        this.restored = true;
        this.barFill.setFillStyle(0x00ff00); // verde

        this.progressSound.stop();

        // Emite um sinal pro GameScene
        this.scene.events.emit('computer-restored');
    }
}
