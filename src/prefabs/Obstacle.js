class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tint = 0x0b1f34;
        this.dead = false;
        this.overlapping = false;
        this.touching = false;

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
        }).name = 'aliveCollider';
    }

    update(scene){
        if(Phaser.Input.Keyboard.JustDown(scene.keys.x) && !this.dead){
            scene.physics.world.colliders.getActive().find(function(i){
                return i.name == 'aliveCollider';
            }).destroy();
            scene.physics.add.overlap(scene.player, this, ()=>{
                if(!this.overlapping){
                this.overlapping = true;               
                console.log("Boosted player");
                scene.playerFSM.transition('boost');
                }
            }).name = 'boostCollide';
            this.dead = true;
        }
        if(this.body.touching.none){
            this.overlapping = false;
            this.touching = false;
        }
    }
}