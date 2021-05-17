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
        // not sure if the following 3 lines are needed, kept just in case during merge
        this.body.collideWorldBounds = true;
        //this.body.useDamping = true;
        this.AccelerationDecay = .0025;

        this.isBoosting = false;
      
        this.body.maxVelocity = new Phaser.Math.Vector2(600, 1400)
        this.body.useDrag;
        this.body.setDragX(1200); //This is used as the damping value
        this.body.bounceX = 5000
        
        //Setup control values
        this.MoveAcceleration = 1000;
        this.upGravity = 1600;
        this.downGravity = 1800;

        //Temp values
        this.setScale(.5)

        //Tracking values
        this.deltaY = 0;
        this.lastY = this.y;
        this.canJump = false;
        this.justDown = false;
        this.wallInVelocity = 0;

        //Player fx
        this.playerJump = scene.sound.add("jumpFx", {
            volume: .8,
        })
        this.playerLand = scene.sound.add("landFx", {
            volume: .8,
        })
    }
    update(time, delta) 
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

        // this section left just in case? unsure if needed
        //if(Phaser.Input.Keyboard.JustDown(keyUP)){
        //    this.body.setVelocityY(-500);
        //    console.log("Up");
        //}

        //Calculate deltaY
        this.deltaY = this.y - this.lastY;

        //if we're standing or jumping, less gravity
        if(this.deltaY <= 0) {
            this.setGravityY(this.upGravity);
        }
        else {//if we're falling, more gravity
            this.setGravityY(this.downGravity);
        }


        //Handle the player touching the ground
        if(this.body.touching.down) {
            if(this.canJump == false) { //This if catches the first frame player touches down         
                this.body.setVelocityX(this.body.velocity.x *.5);
                if(!this.playerLand.isPlaying)
                    this.playerLand.play();
                //console.log(this.body.velocity.x);
            }

            this.canJump = true;   
        }

        //First frame jump
        if(this.canJump && Phaser.Input.Keyboard.JustDown(keyUP)){
            if(!this.playerJump.isPlaying)
                this.playerJump.play();
            //console.log("Up");
        }

        //Held down jump
        if(this.canJump && Phaser.Input.Keyboard.DownDuration(keyUP, 200)){
            this.body.setVelocityY(-500);
            //console.log("Up");
        }

        //Jump release
        if (Phaser.Input.Keyboard.UpDuration(keyUP)) {
            this.canJump = false;
        }

        //Detect and handle wall jumping inputs
        if(!this.body.touching.down && (this.body.touching.right || this.body.touching.left)) {
            if(this.lastXVelocity != 0)
                this.wallInVelocity = this.lastXVelocity;

            //console.log(this.wallInVelocity);
            if(Phaser.Input.Keyboard.JustDown(keyUP)){
                this.body.setVelocityX(-this.wallInVelocity);
                this.body.setVelocityY(-500);
                if(!this.playerJump.isPlaying)
                    this.playerJump.play();
                this.wallInVelocity = 0;
            }
        }

        //Left right movement
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
    speedChange(increase = false){
        if(increase && !this.isBoosting){
            this.MoveAcceleration *= BOOST;
            // this.body.setVelocityY(-500*BOOST);  // experimenting
            //console.log("increase:" + this.MoveAcceleration);
            this.isBoosting = true;
        }
        else{
            this.MoveAcceleration /= BOOST;
            //console.log(this.MoveAcceleration);
            this.isBoosting = false;
        }
    }
    bounce(){
        this.body.setVelocityY(-250);
        //console.log("bounce");
        //Track values last frame for delta uses
        this.lastY = this.y;
        this.lastXVelocity = this.body.velocity.x;
    }
}