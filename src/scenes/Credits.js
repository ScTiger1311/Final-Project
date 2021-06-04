class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }

    preload() {
        this.load.image("credits_image", "./assets/single_sprites/Test_Credits.png");

        //3 frames, named button_neutral, button_hover, button_down
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");

    }

    create() {
        console.log("entered the Credits scene");
        this.creditsSprite = this.add.sprite(0, 0, "credits_image").setOrigin(0, 0);
        //this.startButton = this.add.sprite(100, 200, "button").setFrame("button_neutral").setOrigin(0, 0);
        this.keys = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            jump: 'SPACE'
        });
        //its cursed but you have to use this.scene.scene.start() >:O https://stackoverflow.com/questions/55264077/phaser-3-clickable-sprite-cant-start-scene
        //don't forget to call the update function
        this.startButton = new Button(this, "button", 200, 200, function(){this.scene.scene.start("Menu");});
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence.
        if (this.keys.left.isDown == true || this.keys.right.isDown == true) {
            //easyMode
            this.scene.start('Play');

        }
    }
}