class Obstacle extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // phys settings
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.tint = 0xFF0000 *Math.random();
    }
    
}