// ----------------------------------------------------------------------------------------------------------------
// -- Player.js: define a classe do personagem principal
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        // Define a cena, a posição e a imagem do player
        super(scene, x, y, 'player');

        // Guarda uma referência da cena (para uso futuro com 'this.scene...')
        this.scene = scene;
        
        // Adiciona à cena e ao sistema de física
        scene.add.existing(this);
        scene.physics.add.existing(this); // momento em que o 'body' é injetado dentro da instância do player
        // o 'body' contém todas as propriedades de simulação de física, como:
        // velocity, acceleration, gravity e bounce (elasticidade)

        // Impede que o player saia da tela
        this.setCollideWorldBounds(true);
        this.setDepth(20);

        // Atributos do player
        this.life = 50;
        this.speed = 150;
        this.damage = 2;
        this.state = "IDLE";
        this.canAttack = true;
        this.canTakeDamage = true;
        this.canUseShield = true;
        this.isInvincible = false;
        this.invincibleTimer = 0;

        // Mapeia as teclas que serão usadas
        this.keys = scene.input.keyboard.addKeys("W,A,S,D,E,SPACE,Q");
        this.shift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Som de andar
        this.playerWalkSound = scene.sound.add('player-walking', {
            volume: 0.1,
            loop: true
        });

        // Som de ataque
        this.playerAttackSound = scene.sound.add('player-attacking', {
            volume: 0.3,
            loop: false
        });

        // Som de dor
        this.playerHurtSound = scene.sound.add('player-hurt', {
            volume: 0.4,
            loop: false
        });

        // Som do escudo
        this.shieldActiveSound = scene.sound.add('shield-actived', {
            volume: 0.6,
            loop: false
        });
    }

    // -----------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update() {
        // Reseta a velocidade a cada frame para não deslizar infinitamente
        this.setVelocity(0);

        // Ganha escudo quando apertar Q
        if (Phaser.Input.Keyboard.JustDown(this.keys.Q) && !this.isInvincible && this.canUseShield) this.activateInvincibility();

        // ------------------------------------------------------------------------------------------------------------
        // -- Máquina de Estados
        // ------------------------------------------------------------------------------------------------------------

        // Troca de estados
        switch(this.state) {
            case "IDLE":
            {
                // Parando o som de andar
                if (this.playerWalkSound.isPlaying) this.playerWalkSound.stop();

                // Toca a animação
                this.anims.play('player-idle', true);

                // Trocando os estados WALK, ATTACK ou RUN
                if (this.keys.W.isDown || this.keys.S.isDown || this.keys.A.isDown || this.keys.D.isDown) this.state = "WALK";
                if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.state = "ATTACK";
                if (this.shift.isDown) this.state = "RUN";
            }
            break;

            case "WALK":
            {   
                // Tocando o som de andar na velocidade normal
                this.playerWalkSound.setRate(1.0);
                if (!this.playerWalkSound.isPlaying) this.playerWalkSound.play();

                // Toca a animação e movimenta
                this.anims.play('player-walk', true);

                this.speed = 200;
                this.movimentDirections();

                // Trocando os estados IDLE, ATTACK ou RUN
                if (this.body.velocity.x === 0 && this.body.velocity.y === 0) this.state = 'IDLE';
                if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.state = "ATTACK";
                if (this.shift.isDown) this.state = "RUN";
            }
            break;

            case "RUN":
            {   
                // Tocando o som de andar 30% mais rápido
                this.playerWalkSound.setRate(1.3);
                if (!this.playerWalkSound.isPlaying) this.playerWalkSound.play(); 

                // Toca a animação e movimenta
                this.anims.play('player-run', true);

                this.speed = 220;
                this.movimentDirections();

                // Trocando os estados WALK, IDLE ou ATTACK
                // Se não estiver apertando shift
                if (!this.shift.isDown) {
                    // Mas estiver apertando WASD, então anda. Se não, fica parado
                    if (this.keys.W.isDown || this.keys.A.isDown || this.keys.S.isDown || this.keys.D.isDown) this.state = "WALK";
                    else this.state = "IDLE";
                }

                if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.state = "ATTACK";
            }
            break;

            case "ATTACK":
            {
                // Fazendo o player atacar a cada 1000ms
                if (this.canAttack) {
                    this.canAttack = false;

                    
                    
                    // Toca o som do ataque
                    this.playerAttackSound.play();
                    this.anims.play('player-attack');

                    // Após 1000ms, player fica parado e pode atacar novamente
                    this.scene.time.delayedCall(1000, () => {
                        this.state = "IDLE";
                        this.canAttack = true;
                    });
                }

                this.movimentDirections();
            }
            break;

            case "GETHIT":
            {
                this.setVelocity(0);

                // Toca a animação
                this.anims.play('player-gethit', true);
                this.once('animationcomplete-player-gethit', () => {
                    this.state = "IDLE";
                });
                
                return;
            }
            break;

            case "DEATH":
            {
                if (this.anims.currentAnim?.key === 'player-death') return;
                this.setVelocity(0);
                console.log("State Death");

                // Toca a animação
                this.anims.play('player-death');
                
                // Uma vez que a animação é completa
                this.once("animationcomplete-player-death", () => {
                    // Muda para a cena de derrota
                    this.scene.scene.launch('DefeatScene');
                });

                return;
            }
            break;
        }
    }

    // -----------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------
    
    // Função para ativar o escudo
    activateInvincibility() {
        this.canUseShield = false; // não pode usar até dar o cooldown
        this.isInvincible = true;  // fica invencível

        this.shieldActiveSound.play();
        
        // Criando a explosão de escudo
        const shield = this.scene.add.sprite(
            this.x, this.y,
            'shield'
        ).setScale(1.5);

        shield.setPipeline('Light2D');

        shield.play('shield-effect');
        shield.once('animationcomplete', () => {
            shield.destroy();
        }); 

        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: 10
        });

        this.scene.cameras.cameras[1].ignore(shield);

        //this.scene.sound.play('shield');

        // Volta ao normal depois de 2s
        this.scene.time.delayedCall(2000, () => {
            this.isInvincible = false;
            this.setAlpha(1);
        });

        // Pode usar novamente após 10 segundos
        this.scene.time.delayedCall(10000, () => {
            this.canUseShield = true;
        });
    }

    // -----------------------------------------------------------------------------------------------------------

    // Função chamada quando player leva dano
    takeDamage(enemyDamage) {
        if (!this.canTakeDamage || this.state === "DEATH") return;

        // Bloqueando invencibilidade do Q
        if (this.isInvincible) return;

        this.playerHurtSound.play();

        this.life -= enemyDamage;
        this.canTakeDamage = false;

        this.state = "GETHIT";

        // Cooldown de invencibilidade
        this.scene.time.delayedCall(1000, () => {
            this.canTakeDamage = true;
        });
    }

    // -----------------------------------------------------------------------------------------------------------

    // Função para movimentar o player
    movimentDirections() {
        // Movendo para esquerda
        if (this.keys.A.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        }
        // Movendo para direita
        else if (this.keys.D.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }

        // Movendo para cima ou baixo
        if (this.keys.W.isDown) this.setVelocityY(-this.speed);
        else if (this.keys.S.isDown) this.setVelocityY(this.speed);

        // Normalizando a diagonal
        this.body.velocity.normalize().scale(this.speed);
    }

}
