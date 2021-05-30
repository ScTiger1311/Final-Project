class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tint = 0xFF0000 *Math.random();
        this.dead = false;

        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        // alive collider
        scene.physics.add.collider(scene.player, this, ()=>{
            // if(Phaser.Input.Keyboard.JustDown(keyX) && ((scene.player.body.touching.left && this.body.touching.right) ||
            // scene.player.body.touching.right && this.body.touching.left)){
            //     this section used for killing obstacle after proper keypress is switched out
            // }
            if((scene.player.body.touching.left && this.body.touching.right) ||
                scene.player.body.touching.right && this.body.touching.left){
                console.log("Killed player");    
                // kill player here
            }
        }).name = 'aliveCollider';
    }

    update(scene){
        if(Phaser.Input.Keyboard.JustDown(keyX) && !this.dead){
            scene.physics.world.colliders.getActive().find(function(i){
                return i.name == 'aliveCollider';
            }).destroy();
            scene.physics.add.overlap(scene.player, this, ()=>{
                console.log("Boosted player");
                // boost here
                scene.player.speedChange(true);
                scene.speedEvent = this.time.addEvent(2500, () =>{
                scene.player.speedChange(false);
            });
            this.dead = true;
        }
    }
}