class Button extends Phaser.GameObjects.Sprite
{
    //the json file must include 3 frames, named button_neutral, button_hover, button_down
    //make sure to add Button.update() to the update function of the scene
    constructor(scene, atlas, x, y, funct)
    {
        super(scene, atlas, x, y);
        scene.add.existing(this);
        this.atlas = atlas;
        this.funct = funct;
        this.startButton = scene.add.sprite(x, y, "button").setFrame("button_neutral").setOrigin(0, 0).setInteractive();
        this.mouseButton = false; //true is down, false is up
        //after doing all this code you can do it in a few lines. rip me. I'm not removing the old code because it works. but if it breaks I will
        this.startButton.on('pointerdown', function(){this.mouseButton = true;}, this)
        this.startButton.on('pointerup', function(){this.mouseButton = false;}, this)
    }
    
    update()
    {
        this.mouseX = this.scene.input.mousePointer.x;
        this.mouseY = this.scene.input.mousePointer.y;
        if (this.mouseX > this.startButton.x
            && this.mouseX < this.startButton.x + this.startButton.width
            && this.mouseY > this.startButton.y
            && this.mouseY < this.startButton.y + this.startButton.height) 
        {
            this.startButton.setFrame("button_hover");
            if(this.mouseButton == true)
            {
                this.startButton.setFrame("button_down");
                this.funct();
            }
        }
        else 
        {
            this.startButton.setFrame("button_neutral");
        }
    }
}