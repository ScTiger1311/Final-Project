class Play extends Phaser.Scene
{
    constructor()
    {
       super("Play"); 
    }

    preload()
    {
        this.load.atlas("PlayerAtlas", "./assets/Animations/Player_Atlas.png", "./assets/Animations/Player_Atlas.json");
        this.load.image("PinkSquareSprite", "./assets/single_sprites/pink_square.png");
        this.load.image("OrangeRectSprite", "./assets/single_sprites/orange_rect.png");
        this.load.image("StoneTilesetImage", "./assets/levels/StoneBrick_Tileset.png");
        this.load.audio("jumpFx", "./assets/sounds/fx/Jump.wav")
        this.load.audio("landFx", "./assets/sounds/fx/Land.wav")
        this.load.tilemapTiledJSON("TestLevel", "./assets/levels/Tutorial_Level.json");
    }

    create()
    {
        console.log("entered the Play scene");
      
        const tutorial_level_map = this.add.tilemap("TestLevel")
        const stoneTileset = tutorial_level_map.addTilesetImage("StoneBrick", "StoneTilesetImage")

        //const IntGridValues_Layer = tutorial_level_map.createLayer("IntGrid_values", stoneTileset, 0, 0);
        const Platform_Layer = tutorial_level_map.createLayer("Platform", stoneTileset, 0, 0);

        // IntGridValues_Layer.setCollisionByProperty({
        //     collides: true 
        // });

        Platform_Layer.setCollisionByProperty({
            Collides: true 
        });


        //test obstacles
        
        this.env = this.add.group();

        this.env.add(new Ground(this, game.config.width/2, game.config.height, "OrangeRectSprite", 50))
        // let obj1 = new Ground(this, game.config.width * .35 , game.config.height/2, "OrangeRectSprite", 1, 10);
        // this.env.add(obj1)
        // let obj2 = new Ground(this, game.config.width * .75 , game.config.height/2, "OrangeRectSprite", 1, 1.5);
        // this.env.add(obj2)

        

        this.player = new Player(this, game.config.width/2, game.config.height * -.1);

        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            attack: new AttackState(),
            boost: new BoostState(),
            hurt: new HurtState(),
            wallcling: new WallClingState(),
            inair: new InAirState(),
        }, [this, this.player]);

        //this.physics.add.collider(this.player, IntGridValues_Layer);
        this.physics.add.collider(this.player, Platform_Layer);
        this.physics.add.collider(this.player, this.env);

        /*for(let i = 0; i < 5; ++i) {
            let obj = new Ground(this, (Math.random() * game.config.width) , (Math.random() * game.config.height), "OrangeRectSprite");
            this.env.add(obj);
        }*/

        this.enemy = new Obstacle(this, game.config.width/3, game.config.height*.8, "OrangeRectSprite");
        this.enemy.setScale(.75);

        this.cameraMain = this.cameras.main;
        this.platformerCamera = new PlatformerCamera(this, this.player, this.cameraMain);

        //Setup keys for whole game
        this.keys = this.input.keyboard.addKeys({
            'w':     Phaser.Input.Keyboard.KeyCodes.W,
            'a':     Phaser.Input.Keyboard.KeyCodes.A,
            's':     Phaser.Input.Keyboard.KeyCodes.S,
            'd':     Phaser.Input.Keyboard.KeyCodes.D,
            'plus':     Phaser.Input.Keyboard.KeyCodes.PLUS,
            'up':    Phaser.Input.Keyboard.KeyCodes.UP,
            'left':  Phaser.Input.Keyboard.KeyCodes.LEFT,
            'down':  Phaser.Input.Keyboard.KeyCodes.DOWN,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'x': Phaser.Input.Keyboard. KeyCodes.X,
        });
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */

        if(Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.player.debugOn = !this.player.debugOn;
            console.log("PlayerDebug = " + this.player.debugOn);
        }
        this.platformerCamera.update(time, delta);
        this.playerFSM.step();
        this.player.update();
        this.enemy.update(this);
        this.player.drawDebug();
    }
}