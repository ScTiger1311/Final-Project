class Play extends Phaser.Scene
{
    constructor()
    {
       super("Play"); 
    }

    preload()
    {
        this.load.atlas("PlayerAtlas", "./assets/Animations/Player_Atlas.png", "./assets/Animations/Player_Atlas.json");
        this.load.atlas("EnvironmentAtlas", "./assets/Animations/Environment_Atlas.png","./assets/Animations/Environment_Atlas.json");
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

        this.currentLevel = this.tutorial_level_map;

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
            'r': Phaser.Input.Keyboard. KeyCodes.R,
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
        // reset level function
        if(Phaser.Input.Keyboard.JustDown(this.keys.r)){
            this.scene.restart();
            // need to pass data in this^
        }
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
    }

    loadLevel(levelName)
    {
        const stoneTileset = this.currentLevel.addTilesetImage("StoneBrick", "StoneTilesetImage")


        this.Platform_Layer = this.currentLevel.createLayer("Background", stoneTileset, 0, 0);
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

        this.playerSpawn = this.currentLevel.findObject("Object", obj => obj.name === "Player_Spawn")
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y);
        this.platformerCamera = new PlatformerCamera(this, this.player, this.cameraMain);
           
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
        let enemyObjects = this.currentLevel.filterObjects("Object", obj => obj.name == 'Enemy');
        this.enemyGroup = this.add.group({
            runChildUpdate: true
        });
        // // set up group here
        enemyObjects.map((element) =>{
            let obj = new Obstacle(this, element.x, element.y, this.enemynumber);
            this.enemyGroup.add(obj);
            this.enemynumber++;
        });

        //test enemy
        let obj = new Obstacle(this, 200, 250, this.enemynumber);
        this.enemyGroup.add(obj);

        // creating transition object
        this.levelend = this.currentLevel.createFromObjects("Object", {
            name: "Level_Transition",
        });
        this.physics.world.enable(this.levelend, Phaser.Physics.Arcade.STATIC_BODY);
        this.endGroup = this.add.group(this.levelend);
        this.physics.add.overlap(this.player, this.endGroup, () =>{
            // this.scene.start('Play');
        });
    }
}