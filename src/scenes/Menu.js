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
        //its cursed but you have to use this.scene.scene.start() >:O https://stackoverflow.com/questions/55264077/phaser-3-clickable-sprite-cant-start-scene
        this.startButton = new Button(this, "button", 100, 200, function(){this.scene.scene.start("Play");});
        this.creditsButton = new Button(this, "button", 200, 200, function(){this.scene.scene.start("Credits");});
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence.

        if (this.keys.left.isDown == true || this.keys.right.isDown == true) {
            //easyMode
            this.scene.start('Play', 'Tutorial');

        }
    }
}