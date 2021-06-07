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
        this.floatSpeed = -35 //Don't put this higher than 200, it will miss it's target
        this.stoppingPointDist = 50 //Stop 150 pixels above this point when dead
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

        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setSize
        this.setCircle(this.width/4, this.width/4, this.height/4)
        
        // Handling when enemy is alive
        scene.physics.add.overlap(scene.player, this, ()=>{
            if(scene.playerFSM.state == "attack") {
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

    setGhostEvent() {

    }
    
    // Function kills the enemy, changes the collider to overlap
    kill(scene){
        this.tint = 0xff0000
        this.stoppingPoint = this.y - this.stoppingPointDist;
        scene.player.canAttack = true;
        scene.player.attackTimerActive = false;

        scene.physics.world.colliders.getActive().find(function(i){
            return i.name == `aliveCollider${this.num}`;
        }, this).destroy();
        scene.time.delayedCall(500, () => {        
            this.scene.physics.add.overlap(this.scene.player, this, ()=>{
                if(!this.overlapping && this.scene.playerFSM.state == "attack"){
                    this.overlapping = true;
                    this.scene.player.boostQueued = true;
                    scene.player.canAttack = true;
                    scene.player.attackTimerActive = false;
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