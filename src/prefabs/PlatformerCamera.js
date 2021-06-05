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
        this.minSpeedForChange = 20;
        this.scrollXOffsetMax = 75;
        this.scrollYOffsetMax = 50;
        this.scrollXOffsetCurr = 0;
        this.scrollYOffsetCurr = 0;
        this.scrollSpeed = 1;
    }

    //all this garbage because phaser causes the webpage to crash if you call console.log() too fast
    slowUpdate(deltaMultiplier)
    {
        //console.log(this.objectToFollow.body.x + "   " + this.camera.midPoint.x);
        //console.log(this.objectToFollow.body.x);
        //console.log(this.tilemapWidth)
        //console.log("this.scrollYOffsetCurr: " + this.scrollYOffsetCurr + "this.tilemapHeight - this.camera.height/2: " + this.tilemapHeight - this.camera.height/2);
    }

    update(time, delta)
    {
        this.tilemapWidth = this.scene.currentLevel.width * this.scene.currentLevel.tileWidth;
        this.tilemapHeight = this.scene.currentLevel.height * this.scene.currentLevel.tileHeight;
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

        // for moving the camera to show more in the direction you are travelling, horizontal only
        if(this.objectToFollow.body.velocity.x > this.minSpeedForChange && this.scrollXOffsetCurr + this.scrollSpeed*deltaMultiplier < this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr += this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.x > this.minSpeedForChange && this.scrollXOffsetCurr + this.scrollSpeed*deltaMultiplier > this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr = this.scrollXOffsetMax;
        }
        else if(this.objectToFollow.body.velocity.x < -this.minSpeedForChange && this.scrollXOffsetCurr - this.scrollSpeed*deltaMultiplier > -this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr -= this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.x < -this.minSpeedForChange && this.scrollXOffsetCurr - this.scrollSpeed*deltaMultiplier < -this.scrollXOffsetMax)
        {
            this.scrollXOffsetCurr = -this.scrollXOffsetMax;
        }
        //for moving the camera to show more in the direction you are travelling, vertical only
        /*if(this.objectToFollow.body.velocity.y > this.minSpeedForChange && this.scrollYOffsetCurr + this.scrollSpeed*deltaMultiplier < this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr += this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.y > this.minSpeedForChange && this.scrollYOffsetCurr + this.scrollSpeed*deltaMultiplier > this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr = this.scrollYOffsetMax;
        }
        else if(this.objectToFollow.body.velocity.y < -this.minSpeedForChange && this.scrollYOffsetCurr - this.scrollSpeed*deltaMultiplier > -this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr -= this.scrollSpeed * deltaMultiplier;
        }
        else if(this.objectToFollow.body.velocity.y < -this.minSpeedForChange && this.scrollYOffsetCurr - this.scrollSpeed*deltaMultiplier < -this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr = -this.scrollYOffsetMax;
        }*/


        //handles horizontal deadzone based scrolling
        if(this.objectToFollow.body.y < this.camera.midPoint.y - this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr = this.objectToFollow.body.y + this.scrollYOffsetMax;
        }
        else if(this.objectToFollow.body.y > this.camera.midPoint.y + this.scrollYOffsetMax)
        {
            this.scrollYOffsetCurr = this.objectToFollow.body.y - this.scrollYOffsetMax;
        }

        //handles keeping the camera in the level bounds
        if(this.objectToFollow.body.x + this.scrollXOffsetCurr < 0 + this.camera.width/2)
        {
            //console.log("1");
            this.scrollXOffsetCurr = this.camera.width/2 - this.objectToFollow.body.x;
        }
        else if(this.objectToFollow.body.x + this.scrollXOffsetCurr > this.tilemapWidth - this.camera.width/2)
        {
            //console.log("2");
            this.scrollXOffsetCurr = this.tilemapWidth - this.camera.width/2 - this.objectToFollow.body.x;
        }

        if(this.scrollYOffsetCurr < 0 + this.camera.height/2)
        {
            console.log("3");
            this.scrollYOffsetCurr = this.camera.height/2;
        }
        else if(this.scrollYOffsetCurr > this.tilemapHeight - this.camera.height/2)
        {
            console.log("4");
            this.scrollYOffsetCurr = this.tilemapHeight - this.camera.height/2;
        }
    
        //applies the changes to the cameras custom scroll values
        this.camera.centerOn(this.objectToFollow.body.x + this.scrollXOffsetCurr, this.scrollYOffsetCurr);
    }
    
}