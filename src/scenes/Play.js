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
        this.load.audio("jumpFx", "./assets/sounds/fx/Jump.wav");
        this.load.audio("landFx", "./assets/sounds/fx/Land.wav");
        this.load.audio("music_majorTheme", "./assets/music/Spirit Flow Music_Major.mp3");
        this.load.audio("music_minorTheme", "./assets/music/Spirit Flow Music_Minor.mp3");
        this.load.tilemapTiledJSON("TestLevel", "./assets/levels/Tutorial_Level.json");
        this.load.tilemapTiledJSON("Level1", "./assets/levels/Level_1.json");
    }

    create()
    {
        console.log("entered the Play scene");
        
        /*
        this.music = this.sound.add("music_majorTheme", 
        {
            loop:true,
            volume: 0.15,
        });
        this.music.play();
        */ 
        this.music = this.sound.add("music_minorTheme", 
        {
            loop:true,
            volume: 0.06,
        });
        this.music.play();

        this.tutorial_level_map = this.add.tilemap("TestLevel")
        this.level1_map = this.add.tilemap("Level1");
        //use this variable if you are checking map related things.
        this.currentLevel = this.level1_map;

        this.cameraMain = this.cameras.main;

        //Setup keys for whole game
        this.keys = this.input.keyboard.addKeys({
            'w':     Phaser.Input.Keyboard.KeyCodes.W,
            'a':     Phaser.Input.Keyboard.KeyCodes.A,
            's':     Phaser.Input.Keyboard.KeyCodes.S,
            'd':     Phaser.Input.Keyboard.KeyCodes.D,
            'plus':  Phaser.Input.Keyboard.KeyCodes.PLUS,
            'minus': Phaser.Input.Keyboard.KeyCodes.MINUS,
            'up':    Phaser.Input.Keyboard.KeyCodes.UP,
            'left':  Phaser.Input.Keyboard.KeyCodes.LEFT,
            'down':  Phaser.Input.Keyboard.KeyCodes.DOWN,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'x': Phaser.Input.Keyboard. KeyCodes.X,
        });

        this.loadLevel(this.curentLevel);
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */

        //Failsafe code
       if(this.player.y > game.config.width * 1.5) {
            this.player.reset();
       }
        

        if(Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.player.debugOn = !this.player.debugOn;
            console.log("PlayerDebug = " + this.player.debugOn);
        }
        //This doesn't work
        if(Phaser.Input.Keyboard.JustDown(this.keys.minus)) {
            this.currentLevel.setLayer
        }
        this.platformerCamera.update(time, delta);
        this.playerFSM.step();
        this.player.update();
        this.player.drawDebug();
        // this.enemy.update();
    }

    loadLevel( levelName )
    {
        this.playerSpawn = this.currentLevel.findObject("Object", obj => obj.name === "Player_Spawn")
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
        this.platformerCamera = new PlatformerCamera(this, this.player, this.cameraMain);

        const stoneTileset = this.currentLevel.addTilesetImage("StoneBrick", "StoneTilesetImage")

        
        this.Platform_Layer = this.currentLevel.createLayer("Platform", stoneTileset, 0, 0);
        
        this.env = this.add.group();

        //tilemap debugging
        this.currentLevel.forEachTile(
        (tile)=>
        {
            let obj = new Ground(this, this.currentLevel.tileToWorldX(tile.x, this.cameraMain), this.currentLevel.tileToWorldY(tile.y, this.cameraMain), "PinkSquareSprite", .25, .25);
            this.env.add(obj)
        }, 
        this, 0, 0, this.currentLevel.width, this.currentLevel.height, 
        {
            isNotEmpty: true,
            //isColliding: true
        },
         "Platform")

        this.Platform_Layer.setCollisionByProperty({
            Collides: true 
        });
           
        this.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            attack: new AttackState(),
            boost: new BoostState(),
            hurt: new HurtState(),
            wallcling: new WallClingState(),
            inair: new InAirState(),
            walljump: new WallJumpState(),
        }, [this, this.player]);

        this.physics.add.collider(this.player, this.Platform_Layer);
        //this.physics.add.collider(this.player, this.Test_Layer);

        // Setting up enemies
        this.enemynumber = 1;
        this.enemyGroup = this.add.group({
            runChildUpdate: true
        });
        for(let i = 0; i < 2; i++){
            let obj = new Obstacle(this, game.config.width/5 +(i*50), game.config.height*.82, "OrangeRectSprite", this.enemynumber).setScale(.75);
            this.enemyGroup.add(obj);
            this.enemynumber++;
        }
        // this.enemy = new Obstacle(this, game.config.width/3, game.config.height*.82, "OrangeRectSprite", this.enemynumber);
        // this.enemy.setScale(.75);
    }
}