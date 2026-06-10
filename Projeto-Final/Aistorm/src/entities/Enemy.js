// ----------------------------------------------------------------------------------------------------------------
// -- Enemy.js: define a classe do inimigo
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        // Atributos
        this.life = 10;
        this.damage = 1;
        this.speed = 90;
        this.active = true;

        this.viewDistance = 50;    // campo de visão
        this.alertTimer = 0;       // tempo olhando o player
        this.isSuspicious = false; // estado de suspeitando
        this.isChasing = false;    // estado de caçando
        this.wasAttacked = false;  // para só atacar se levar dano do player
        this.isAttacking = false;  // para tocar a animação de ataque

        // Som de caminhar
        this.enemyWalkSound = scene.sound.add('enemy-walk', {
            volume: 0.4,
            loop: true
        });

        // Som de dor
        this.enemyHurtSound = scene.sound.add('enemy-hurt', {
            volume: 0.3,
            loop: false
        });

        // Som de morte
        this.enemyDeathSound = scene.sound.add('enemy-death', {
            volume: 0.6,
            loop: false
        });

        // Som de ataque
        this.enemyAttackingSound = scene.sound.add('enemy-attacking', {
            volume: 0.5,
            loop: false
        });

        this.isWalking = false; // para controlar o som de caminhar

        // Texto da vida
        this.lifeText = scene.add.text(this.x, this.y - 40, `HP: ${this.life}`, {
            fontSize: '10px',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Texto do alerta
        this.alertText = scene.add.text(this.x, this.y - 55, '', {
            fontSize: '10px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        });
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(player, gameState, delta) {
        if (!this.active) return;

        // Posição texto de vida e estado de alerta
        this.lifeText.setPosition(this.x - 15, this.y - 40);
        this.alertText.setPosition(this.x - 20, this.y - 55);
        this.lifeText.setText(`HP: ${this.life}`);

        const phase = gameState.phase;

        // Calculando a distância entre inimigo e player
        const dist = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );

        const seesPlayer = dist <= this.viewDistance;

        // Progressão de fases
        switch (phase) {

            // Fase 1
            case 1:

                this.damage = 2;
                this.speed = 90;

                // Player entrou na visão
                if (seesPlayer) {
                    this.alertTimer += delta;
                    const seconds = (this.alertTimer / 1000).toFixed(1);
                    this.alertText.setText(`👁 ${seconds}s`);

                    if (this.alertTimer >= 2000) {
                        this.isChasing = true;
                        this.alertText.setText('CHASE');
                    }
                } else {
                    this.alertTimer = 0;
                    this.isChasing = false;
                    this.alertText.setText('');
                }

                // Move se foi atacado OU se está caçando
                if (this.wasAttacked || this.isChasing) this.chasePlayer(player);
                else this.stopEnemy();

            break;

            // Fase 2
            case 2:

                this.damage = 3;
                this.speed = 110;
                this.viewDistance = 80;

                // Player entrou na visão
                if (seesPlayer) {
                    this.alertTimer += delta;
                    const seconds = (this.alertTimer / 1000).toFixed(1);
                    this.alertText.setText(`👁 ${seconds}s`);

                    if (this.alertTimer >= 2000) {
                        this.isChasing = true;
                        this.alertText.setText('CHASE');
                    }
                } 
                else {
                    this.alertTimer = 0;
                    this.isChasing = false;
                    this.alertText.setText('');
                }

                // Move se foi atacado OU se está caçando
                if (this.wasAttacked || this.isChasing) this.chasePlayer(player);
                else this.stopEnemy();
                
            break;

            // Fase 3 e 4
            case 3:
            case 4:

                this.damage = 4;
                this.speed = 130;
                this.viewDistance = 120;

                // Se player no campo de visão, então persegue ele
                if (seesPlayer) this.chasePlayer(player);
                else this.stopEnemy();

            break;

            // Fase 5
            case 5:

                this.damage = 5;
                this.speed = 150;
                this.viewDistance = 150;

                // Perseguição global
                this.chasePlayer(player);

            break;
        }

        // Atualizando a animação
        this.updateAnimation(player);
    }

    // -----------------------------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------------------------------

    // Caçando o player
    chasePlayer(player) {
        this.scene.physics.moveToObject(this, player, this.speed);

        // Distância do inimigo ao player
        const dist = Phaser.Math.Distance.Between(
            this.x, this.y,
            player.x, player.y
        );

        // Quanto mais perto, maior o volume
        const volume = Phaser.Math.Clamp(1 - dist / 400, 0, 1);

        this.enemyWalkSound.setVolume(volume * 0.3);

        if (!this.isWalking) {
            this.enemyWalkSound.play();
            this.isWalking = true;
        }
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Parando o inimigo
    stopEnemy() {
        this.body.setVelocity(0);

        // Se estiver andando, então para
        if (this.isWalking) {
            this.enemyWalkSound.stop();
            this.isWalking = false;
        }
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Atualizando as animações do inimigo
    updateAnimation(player) {
        // Direção do player
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        let direction = 'down';

        // Distância horizontal ou vertical é maior
        // Se for distância horizontal, então é direita (menor que 0) ou esquerda (maior que 0)
        if (Math.abs(dx) > Math.abs(dy)) direction = dx > 0 ? 'right' : 'left';
        else direction = dy > 0 ? 'down' : 'up';

        // Ataque
        if (this.isAttacking) {
            // Toca apenas se não estiver tocando
            if (!this.anims.isPlaying || this.anims.currentAnim.key !== `enemy-${direction}-attack`) {
                this.anims.play(`enemy-${direction}-attack`, true);
                this.enemyAttackingSound.play();

                this.once('animationcomplete', () => {
                    this.isAttacking = false;
                });
            }

            return;
        }

        // Parado
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.anims.play(`enemy-${direction}-idle`, true);
            return;
        }

        // Correndo
        this.anims.play(`enemy-${direction}-run`, true);
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Tomando dano do player
    takeDamage(playerDamage) {
        // Perde vida
        this.life -= playerDamage;
        this.enemyHurtSound.play()
        this.anims.play('enemy-down-gethit');

        // Tomou dano, então fica agressivo
        this.wasAttacked = true;

        if (this.life <= 0) {
            this.body.enable = false;

            this.enemyWalkSound.stop()
            this.enemyDeathSound.play();

            // Criando a explosão quando morre
            const explosion = this.scene.add.sprite(
                this.x, this.y,
                'projectile'
            ).setScale(1.5);

            explosion.setPipeline('Light2D');

            explosion.play('projectile-explode');
            explosion.once('animationcomplete', () => {
                explosion.destroy();
            }); 

            // Ignorando na camera do HUD e destruindo o restante
            this.scene.cameras.cameras[1].ignore(explosion);
            this.lifeText.destroy();
            this.alertText.destroy();

            this.destroy();
        }
    }

}