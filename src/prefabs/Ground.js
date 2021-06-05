class Ground extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, sizeX = 1, sizeY = 1)
    {
        //Add object to scenes
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDebugBodyColor(0x00ff00)

        this.setOrigin(0)
        this.setVisible(false)
        this.setScale(sizeX, sizeY);
        //Setup physics config
        this.body.immovable = true;
        this.body.allowGravity = false;


    }
    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
    }
}