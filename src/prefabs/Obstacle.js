class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, number)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world
        
        this.tint = 0x0b1f34;
        this.num = number;                  // obstacles are numbered to sort alive/dead colliders
        this.dead = false;
        this.overlapping = false;           // helps control dead collision checks
        this.touching = false;              // helps control alive collision checks

        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        
        // Handling when enemy is alive
        scene.physics.add.collider(scene.player, this, ()=>{
            if((scene.player.body.touching.left && this.body.touching.right) ||
                scene.player.body.touching.right && this.body.touching.left){
                if(!this.touching){
                    console.log("Hurt player");    
                    scene.playerFSM.transition('hurt');
                    this.touching = true;
                }
            }
            // current temp head bounce killing of enemies, remove later
            if(scene.player.body.touching.down && this.body.touching.up){
                this.kill(scene);
            }
        }).name = `aliveCollider${this.num}`;
    }
    
    // Function kills the enemy, changes the collider to overlap
    kill(scene){
        scene.physics.world.colliders.getActive().find(function(i){
            return i.name == `aliveCollider${this.num}`;
        }, this).destroy();
        scene.physics.add.overlap(scene.player, this, ()=>{
            if(!this.overlapping){
            this.overlapping = true;               
            console.log("Boosted player");
            scene.playerFSM.transition('boost');
            }
        }).name = 'boostCollide';
        this.dead = true;
    }

    update(scene){
        // if(Phaser.Input.Keyboard.JustDown(scene.keys.x) && !this.dead){
        //     this.kill(scene);   
        // }
        if(this.body.touching.none){
            this.touching = false;
            this.overlapping = false;
        }
    }
}