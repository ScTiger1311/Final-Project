class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        //Add object to scenes
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setup physics config
        this.body.gravity = new Phaser.Math.Vector2(0, 800)
        this.body.collideWorldBounds = true;
        this.body.maxVelocity = new Phaser.Math.Vector2(600, 1000)
        //this.body.useDamping = true;
        this.body.useDrag;
        this.body.drag = .25; //This is used as the damping value
        
        //Setup control values
        this.MoveAcceleration = 1000;
        this.AccelerationDecay = .0025;
    }
    update(time, delta) 
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

        if(Phaser.Input.Keyboard.JustDown(keyUP)){
            this.body.setVelocityY(-500);
            console.log("Up");
        }

        if(keyRIGHT.isDown) {
            this.body.setAccelerationX(this.MoveAcceleration);
        }
        else if(keyLEFT.isDown) {
            this.body.setAccelerationX(-this.MoveAcceleration);
        }
        else {
            this.body.setAccelerationX(0);
        }
    }
}