class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'cycle');
    }
    update(time, delta) 
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

    }
}