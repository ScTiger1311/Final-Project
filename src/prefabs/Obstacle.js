class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, number)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tint = 0x0b1f34;
        this.dead = false;
        this.overlapping = false;
        this.touching = false;
        this.num = number;

        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        // alive collider
        scene.physics.add.collider(scene.player, this, ()=>{
            if((scene.player.body.touching.left && this.body.touching.right) ||
                scene.player.body.touching.right && this.body.touching.left){
                if(!this.touching){
                    console.log("Hurt player");    
                    scene.playerFSM.transition('hurt');
                    this.touching = true;
                }
            }
            if(scene.player.body.touching.down && this.body.touching.up){
                this.destroy(scene);
            }
        }).name = `aliveCollider${this.num}`;
    }
    
    destroy(scene){
        // look into making it so each collider has a number in the name
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
        //     this.destroy(scene);   
        // }
        if(this.body.touching.none){
            this.touching = false;
            this.overlapping = false;
        }
    }
}