class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, number)
    {
        super(scene, x, y, 'EnvironmentAtlas');
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world
        
        this.num = number;                  // obstacles are numbered to sort alive/dead colliders
        this.dead = false;
        this.overlapping = false;           // helps control dead collision checks
        this.touching = false;              // helps control alive collision checks
        this.floatSpeed = -199 //Don't put this higher than 200, it will miss it's target
        this.stoppingPointDist = 160 //Stop 150 pixels above this point when dead
        this.stoppingPoint = 0

        // creating animations
        scene.anims.create({
            key: 'flight',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Enemy',
                start: 1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,

        });
        this.play('flight');

        // creating animations
        scene.anims.create({
            key: 'ghost',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Enemy_Ghost',
                start: 1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,

        });


        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setSize
        this.setCircle(this.width/4, this.width/4, this.height/4)

        //Setup particles
        this.firstHitNum = 200;
        this.hitParticle = scene.add.particles('DustParticle');
        this.centerEmitCircle = new Phaser.Geom.Circle(this.x, this.y, 34)

        this.hitCallback = function (particle, emitter) {
            //console.log("X: " + scene.player.body.velocity.x + " Y: " + scene.player.body.velocity.y)
            emitter.setSpeedX({ start: Phaser.Math.Between(scene.player.body.velocity.x * .15, scene.player.body.velocity.x * .25),
                                    //* (this.centerEmitCircle.x - particle.x) * .03,
                                end: 0, 
                                steps: 20, 
                                ease: 'Bounce' 
                            })
            emitter.setSpeedY({ start: Phaser.Math.Between(scene.player.body.velocity.y * .2, scene.player.body.velocity.y * .3),
                                    //* (this.centerEmitCircle.y - particle.y) * .05,
                                end: 0, 
                                steps: 20, 
                                ease: 'Bounce'
            })
        }

        this.firstHitEmitter = this.hitParticle.createEmitter({
            emitZone: {type: 'random', source: this.centerEmitCircle },
            frequency: -1,
            gravityY: 250,
            emitCallbackScope: this,
            emitCallback: this.hitCallback,
            tint: { start: 0xff44ff, end: 0x00ffff, ease: 'Circ.easeInOut'},
            // speedX: scene.player.body.velocity.x,
            // speedY: scene.player.body.velocity.y,
            scale: { start: 1.5, end: .7, ease: 'Power3' },
            lifespan: {min: 500, max: 950},
            on: false
        })
        
        // Handling when enemy is alive
        scene.physics.add.overlap(scene.player, this, ()=>{
            if(scene.playerFSM.state == "attack") {
                this.playHitParticles()
                this.kill(scene);
                console.log("KillEnemy");
            }
            else {
                if(scene.playerFSM.state != "hurt") {
                    console.log("Hurt player");
                    scene.playerFSM.transition('hurt');
                }
            }

        }).name = `aliveCollider${this.num}`;

    }

    playHitParticles() {
        this.firstHitEmitter.explode(this.firstHitNum)
        //Creat gravity well and move it with the player for a bit
        this.hitGravity = this.hitParticle.createGravityWell({
            x: this.scene.player.x,
            y: this.scene.player.y,
            power: .65,
            epsilon: 120,
        })
        this.gravityTimer = this.scene.time.addEvent({
            delay: 10,
            callback: ()=>{
                this.hitGravity.x = this.scene.player.x;
                this.hitGravity.y = this.scene.player.y;
                console.log("x: " + this.scene.player.x + " y: " + this.scene.player.y)
            },
            repeat: 50
        })
    }

    // Function kills the enemy, changes the collider to overlap
    kill(scene){
        this.play('ghost')
        this.stoppingPoint = this.y - this.stoppingPointDist;
        scene.player.canAttack = true;
        scene.player.attackTimerActive = false;

        scene.physics.world.colliders.getActive().find(function(i){
            return i.name == `aliveCollider${this.num}`;
        }, this).destroy();
        scene.player.canAttack = true;
        scene.player.attackTimerActive = false;
        scene.player.trailEmitter.setTint(0x00ffff)
        scene.time.delayedCall(500, () => {        
            this.scene.physics.add.overlap(this.scene.player, this, ()=>{
                if(!this.overlapping && this.scene.playerFSM.state == "attack"){
                    this.overlapping = true;
                    this.scene.player.boostQueued = true;
                    scene.player.canAttack = true;
                    scene.player.attackTimerActive = false;
                    scene.player.trailEmitter.setTint(0x00ffff)
                    console.log("Destroy enemy")
                    this.destroy()
                }
            }).name = 'boostCollide';
        })
        this.dead = true;
    }

    update(scene){
        if(this.body.touching.none){
            this.touching = false;
            this.overlapping = false;
        }
        if(this.dead && Math.abs(this.y - this.stoppingPoint) > 1) {
            this.body.velocity.y = this.floatSpeed
        }
        else {
            this.body.velocity.y = 0
        }
        // if (this.dead)
        //     this.y = this.stoppingPoint
    }
}