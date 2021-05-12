class Play extends Phaser.Scene
{
    constructor()
    {
       super("Play"); 
    }

    preload()
    {
        this.load.image("PinkSquareSprite", "./assets/single_sprites/pink_square.png");
        this.load.image("OrangeRectSprite", "./assets/single_sprites/orange_rect.png");
    }

    create()
    {
        console.log("entered the Play scene");
        this.camera = new MainCamera(this, 0, 0, game.config.width, game.config.height);
        this.player = new Player(this, game.config.width/2, game.config.height/2, "PinkSquareSprite");
        this.env = this.add.group();

        this.physics.add.collider(this.player, this.env);
        for(let i = 0; i < 5; ++i) {
            let obj = new Ground(this, (Math.random() * game.config.width) , (Math.random() * game.config.height), "OrangeRectSprite");
            this.env.add(obj);
        }
        

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */

        this.player.update();

    }
}