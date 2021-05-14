class PlatformerCamera extends Phaser.Cameras.Scene2D.BaseCamera
{
    //a scene, a physics object, and a camera
    constructor(scene, objectToFollow, camera)
    {
        super(scene, objectToFollow, camera);
        this.scene = scene;
        this.objectToFollow = objectToFollow;
        this.camera = camera;
        //this.camera.startFollow(objectToFollow);
        //this.camera.setFollowOffset(0, 50);
        //this.camera.setDeadzone(30, 30);
        this.slowUpdateTick = 0;

        //values to change if you want to adjust the behaviour of the camera
        this.scrollXOffsetMax = 100;
        this.scrollYOffsetMax = 100;
        this.scrollXOffsetCurr = 0;
        this.scrollYOffsetCurr = 0;
        this.scrollSpeed = 3;
    }

    //all this garbage because phaser causes the webpage to crash if you call console.log() too fast
    slowUpdate(deltaMultiplier)
    {
        //console.log(deltaMultiplier);
        //console.log("scrollXOffsetCurr " + this.scrollXOffsetCurr + this.scrollSpeed*deltaMultiplier);
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

        //all this garbage because phaser causes the webpage to crash if you call console.log() too fast
        if(this.slowUpdateTick < 20)
        {
            this.slowUpdateTick += 1;
        }
        else
        {
            this.slowUpdateTick = 0
            this.slowUpdate(deltaMultiplier);
        }
        // okay we done with all this garbage

        // for moving the camera to show more in the direction you are travelling
        if(this.objectToFollow.body.velocity.x > 20 && this.scrollXOffsetCurr + this.scrollSpeed*deltaMultiplier < this.scrollXOffsetMax)
        {
            //console.log("asdf");
            this.scrollXOffsetCurr += this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.x > 20 && this.scrollXOffsetCurr + this.scrollSpeed*deltaMultiplier > this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr = this.scrollXOffsetMax;
        }
        else if(this.objectToFollow.body.velocity.x < -20 && this.scrollXOffsetCurr - this.scrollSpeed*deltaMultiplier > -this.scrollXOffsetMax)
        {
            console.log("asdf");
            this.scrollXOffsetCurr -= this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.x < -20 && this.scrollXOffsetCurr - this.scrollSpeed*deltaMultiplier < -this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr = -this.scrollXOffsetMax;
        }
    
        //applies the changes to the cameras custom scroll values
        this.camera.centerOn(this.objectToFollow.body.x + this.scrollXOffsetCurr, this.objectToFollow.body.y);
        //just used the below things to test the scrolling.
        //this.camera.scrollX = Math.random();
        //this.camera.scrollY = ccMath.random();
    }
    
}