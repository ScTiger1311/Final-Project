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
        this.load.audio("jumpFx", "./assets/sounds/fx/Jump.wav")
        this.load.audio("landFx", "./assets/sounds/fx/Land.wav")
    }

    create()
    {
        console.log("entered the Play scene");
        this.player = new Player(this, game.config.width/2, game.config.height/2, "PinkSquareSprite");
      
        this.env = this.add.group();

        this.env.add(new Ground(this, game.config.width/2, game.config.height, "OrangeRectSprite", 50))
        this.physics.add.collider(this.player, this.env);
        for(let i = 0; i < 5; ++i) {
            let obj = new Ground(this, (Math.random() * game.config.width) , (Math.random() * game.config.height), "OrangeRectSprite");
            this.env.add(obj);
        }

        this.testObj = new Obstacle(this, game.config.width/3, game.config.height*.8, "OrangeRectSprite");
        this.physics.add.overlap(this.player, this.testObj, ()=>{
            this.player.speedChange(true);
            this.speedEvent = this.time.addEvent(2500, () =>{
                this.player.speedChange(false);
            });
        });
        this.testbounce = new Obstacle(this, game.config.width *.1, game.config.height*.9, "OrangeRectSprite");
        this.physics.add.collider(this.player, this.testbounce, ()=>{
            if(this.player.body.touching.down && this.testbounce.body.touching.up)
                this.player.bounce();
        });
        
        this.cameraMain = this.cameras.main;
        this.platformerCamera = new PlatformerCamera(this, this.player, this.cameraMain);

        //Setup keys for whole game
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
        this.platformerCamera.update();
        this.player.update();

    }
}