class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, number)
    {
        super(scene, x, y, 'EnvironmentAtlas');
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world
        
        // this.tint = 0x0b1f34;
        this.num = number;                  // obstacles are numbered to sort alive/dead colliders
        this.dead = false;
        this.overlapping = false;           // helps control dead collision checks
        this.touching = false;              // helps control alive collision checks

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
    
    // Function kills the enemy, changes the collider to overlap
    kill(scene){
        this.tint = 0xff0000
        scene.physics.world.colliders.getActive().find(function(i){
            return i.name == `aliveCollider${this.num}`;
        }, this).destroy();
        scene.physics.add.overlap(scene.player, this, ()=>{
            if(!this.overlapping && scene.playerFSM.state == "attack"){
                this.overlapping = true;
                scene.player.boostQueued = true;
                this.destroy()
            }
        }).name = 'boostCollide';
        this.dead = true;
    }

    update(scene){
        if(this.body.touching.none){
            this.touching = false;
            this.overlapping = false;
        }
    }
}