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
        anim = scene.anims.create({
            key: 'hitFade',
            frames: scene.anims.generateFrameNumbers("HitParticle",{
                start: 0,
                end: 21,
                first:0
            }),
            frameRate: 33,
        })
        player = scene.player



        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setSize
        this.setCircle(this.width/4, this.width/4, this.height/4)

        //Setup particles
        this.firstHitNum = 65;
        this.hitParticle = scene.add.particles('HitParticle');
        this.centerEmitCircle = new Phaser.Geom.Circle(this.x, this.y, 20)

        this.hitCallback = function (particle, emitter) {
            //console.log("X: " + scene.player.body.velocity.x + " Y: " + scene.player.body.velocity.y)
            emitter.setSpeedX({ start: Phaser.Math.Between(scene.player.body.velocity.x * .2, scene.player.body.velocity.x * .78),
                                    //* (this.centerEmitCircle.x - particle.x) * .03,
                                end: 0, 
                                steps: 10, 
                                ease: 'Bounce' 
                            })
            emitter.setSpeedY({ start: Phaser.Math.Between(scene.player.body.velocity.y * .2, scene.player.body.velocity.y * .78),
                                    //* (this.centerEmitCircle.y - particle.y) * .05,
                                end: 0, 
                                steps: 10, 
                                ease: 'Bounce'
            })

        }

        this.firstHitEmitter = this.hitParticle.createEmitter({
            emitZone: {type: 'random', source: this.centerEmitCircle },
            frequency: -1,
            frame: 0,
            gravityY: 250,
            emitCallbackScope: this,
            emitCallback: this.hitCallback,
            // tint: { start: 0xff44ff, end: 0x00ffff, ease: 'Circ.easeInOut'},
            // speedX: scene.player.body.velocity.x,
            // speedY: scene.player.body.velocity.y,
            scale: { start: 1.5, end: .8, ease: 'Power1' },
            lifespan: {min: 600, max: 1250},
            particleClass: AnimatedParticle,
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
            power: 14,
            epsilon: 300,
        })
        this.gravityTimer = this.scene.time.addEvent({
            delay: 10,
            callbackScope: this,
            callback: ()=>{
                this.hitGravity.x = this.scene.player.x;
                this.hitGravity.y = this.scene.player.y;
                //console.log("x: " + this.scene.player.x + " y: " + this.scene.player.y)
            },            
            repeat: 40
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

//From http://labs.phaser.io/edit.html?src=src%5Cgame%20objects%5Cparticle%20emitter%5Ccustom%20particles.js
let anim;
let player;
class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        this.t = 0;
        this.i = 0;
        this.distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y)
    }

    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= anim.msPerFrame)
        {
            this.i++;

            if (this.i > 17)
            {
                this.i = 0;
            }

            if(this.i < anim.frames.length)
                this.frame = anim.frames[this.i].frame;

            this.t -= anim.msPerFrame;
        }

        this.lifeCurrent -= (this.distToPlayer/Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y)) * .83

        return result;
    }
}