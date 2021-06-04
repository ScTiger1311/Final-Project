class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        this.load.image("menu_image", "./assets/single_sprites/Test_Menu.png");

        //3 frames, named button_neutral, button_hover, button_down
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");

    }

    create() {
        console.log("entered the Menu scene");
        this.menuSprite = this.add.sprite(0, 0, "menu_image").setOrigin(0, 0);
        //this.startButton = this.add.sprite(100, 200, "button").setFrame("button_neutral").setOrigin(0, 0);
        this.keys = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            jump: 'SPACE'
        });
        //its cursed but you have to use this.scene.scene.start() >:O
        this.startButton = new Button(this, "button", 100, 200, function(){this.scene.scene.start("Play");});
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence.
        this.startButton.update();
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */

        //all the code handling the button. this really should be its own class, but time crunch is time crunch
        /*this.mouseX = this.input.mousePointer.x;
        this.mouseY = this.input.mousePointer.y;
        if (this.mouseX > this.startButton.x
            && this.mouseX < this.startButton.x + this.startButton.width
            && this.mouseY > this.startButton.y
            && this.mouseY < this.startButton.y + this.startButton.height) {
            this.startButton.setFrame("button_hover");
        }
        else {
            this.startButton.setFrame("button_neutral");
        }*/
        if (this.keys.left.isDown == true || this.keys.right.isDown == true) {
            //easyMode
            this.scene.start('Play');

        }
    }
}