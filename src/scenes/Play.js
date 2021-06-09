class Play extends Phaser.Scene
{
    constructor()
    {
       super("Play"); 
    }

    init(data){
        this.levelName = data;
    }

    preload()
    {
        this.load.atlas("PlayerAtlas", "./assets/Animations/Player_Atlas.png", "./assets/Animations/Player_Atlas.json");
        this.load.atlas("EnvironmentAtlas", "./assets/Animations/Environment_Atlas.png","./assets/Animations/Environment_Atlas.json");
        this.load.image("PinkSquareSprite", "./assets/single_sprites/pink_square.png");
        this.load.image("OrangeRectSprite", "./assets/single_sprites/orange_rect.png");
        this.load.image("StoneTilesetImage", "./assets/levels/StoneBrick_Tileset.png");
        this.load.audio("jumpFx", "./assets/sounds/fx/Jump.wav");
        this.load.audio("slideFx", "./assets/sounds/fx/slide.wav");
        this.load.audio("landFx", "./assets/sounds/fx/Land.wav");
        this.load.audio("music_majorTheme", "./assets/music/Spirit Flow Music_Major.mp3");
        this.load.audio("music_minorTheme", "./assets/music/Spirit Flow Music_Minor.mp3");
        this.load.tilemapTiledJSON("TestLevel", "./assets/levels/Tutorial_Level.json");
        this.load.tilemapTiledJSON("Level1", "./assets/levels/Level_1.json");
        this.load.tilemapTiledJSON("Level2", "./assets/levels/Level_2.json");
        this.load.tilemapTiledJSON("Level3", "./assets/levels/Level_3.json");
        this.load.tilemapTiledJSON("Level4", "./assets/levels/Level_4.json");
        this.load.tilemapTiledJSON("Level5", "./assets/levels/Level_5.json");
        this.load.tilemapTiledJSON("Level6", "./assets/levels/Level_6.json");
        this.load.tilemapTiledJSON("Level7", "./assets/levels/Level_7.json");
        this.load.tilemapTiledJSON("Level8", "./assets/levels/Level_8.json");
        this.load.image("DustParticle", "./assets/single_sprites/DustParticle.png");
        this.load.image("Jump", "./assets/single_sprites/Jump.png");
        this.load.image("wasd", "./assets/single_sprites/wasd.png");
        this.load.image("Left_Click", "./assets/single_sprites/Left_Click.png");
        this.load.image("Arrow", "./assets/single_sprites/Arrow.png");
        this.load.image("Dash", "./assets/single_sprites/Dash.png");

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
        // play music, prevent double playing
        if(!this.music.isPlaying){
            this.music.play();
        }

        // setting up level maps
        this.tutorial_level_map = this.add.tilemap("TestLevel")
        this.level1_map = this.add.tilemap("Level1");
        this.level2_map = this.add.tilemap("Level2");
        this.level3_map = this.add.tilemap("Level3");
        this.level4_map = this.add.tilemap("Level4");
        this.level5_map = this.add.tilemap("Level5");
        this.level6_map = this.add.tilemap("Level6");
        this.level7_map = this.add.tilemap("Level7");
        this.level8_map = this.add.tilemap("Level8");
        
        //changing current map based on level
        switch(this.levelName){
            case 'Level2':
                this.currentLevel = this.level2_map;
                break;
            case 'Level3':
                this.currentLevel = this.level3_map;
                break;
            case 'Level4':
                this.currentLevel = this.level4_map;
                break;
            case 'Level5':
                this.currentLevel = this.level5_map;
                break;
            case 'Level6':
                this.currentLevel = this.level6_map;
                break;
            case 'Level7':
                this.currentLevel = this.level7_map;
                break;
            case 'Level8':
                this.currentLevel = this.level8_map;
                break;
            case 'Level1':
            default:
                this.currentLevel = this.level1_map;
                break;
        }
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
            'esc': Phaser.Input.Keyboard.KeyCodes.ESC,
        });

        this.loadLevel(this.curentLevel);   // loading level if not already loaded
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
            this.restartLevel();
        }
        //Failsafe code
        if(this.player.y > this.currentLevel.heightInPixels) {
            this.restartLevel()
        }

        if(Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.player.debugOn = !this.player.debugOn;
            console.log("PlayerDebug = " + this.player.debugOn);
        }
        // pause menu
        if(Phaser.Input.Keyboard.JustDown(this.keys.esc)){
            this.music.setVolume(0.03);
            this.scene.pause();
            this.scene.launch('PauseMenu');

        }
        
        this.platformerCamera.update(time, delta);
        this.playerFSM.step();
        this.player.update();
        this.player.drawDebug();
    }

    restartLevel(level = null) {
        console.log("Restart w/ fn")
        //this.sound.stopAll()
        this.player.playerSlide.stop()
        this.music.stop();
        this.scene.restart(level);
    }

    loadLevel()
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

        // Setting up enemies 🦇
        this.enemynumber = 1;
        let enemyObjects = this.currentLevel.filterObjects("Object", obj => obj.name == 'Enemy');
        this.enemyGroup = this.add.group({
            runChildUpdate: true
        });
        enemyObjects.map((element) =>{
            let obj = new Obstacle(this, element.x, element.y, this.enemynumber).setOrigin(0.33, 0.33);
            this.enemyGroup.add(obj);
            this.enemynumber++;
        });

        //test enemy
         //let obj = new Obstacle(this, 200, 250, this.enemynumber);
         //this.enemyGroup.add(obj);

        // setting up 🔥
        let fireList = this.currentLevel.filterObjects("Object", obj => obj.name == 'Fire_Left');
        this.fire = this.add.group();
        fireList.map((element) => {
            let obj = new Fire(this, element.x, element.y, 'left').setOrigin(0,0);
            this.fire.add(obj);
        })
        fireList = this.currentLevel.filterObjects("Object", obj => obj.name == 'Fire_Right');
        fireList.map((element) => {
            let obj = new Fire(this, element.x, element.y, 'right').setOrigin(0,0);
            this.fire.add(obj);
        })
        fireList = this.currentLevel.filterObjects("Object", obj => obj.name == 'Fire_Up');
        fireList.map((element) => {
            let obj = new Fire(this, element.x, element.y, 'up').setOrigin(0,0);
            this.fire.add(obj);
        })
        fireList = this.currentLevel.filterObjects("Object", obj => obj.name == 'Fire_Down');
        fireList.map((element) => {
            let obj = new Fire(this, element.x, element.y, 'down').setOrigin(0,0);
            this.fire.add(obj);
        })
        // creating level transition zone 🚪
        this.levelend = this.physics.add.group({immovable: true, moves: false});
        this.levelend.addMultiple(this.currentLevel.createFromObjects("Object",{
            name: "Level_Transition",
        }));
        this.nextLevel = this.levelend.getChildren()[0].data.list.Level;    // geting name of level to switch to
        this.physics.add.collider(this.player, this.levelend, () =>{
            this.music.stop();
            this.restartLevel(this.nextLevel);
            console.log("Changed level.");
        });
        // set up tutorial objects ↗
        this.tutorialObj = this.add.group();
        let objList = this.currentLevel.filterObjects("Object", obj => obj.name == 'Tutorial_Text');
        objList.map((element) => {
            let obj = new Tutorial(this, element.x, element.y, element.properties[0].value);
            // console.log(element.properties[0].value);
            this.tutorialObj.add(obj);
        });
        
    }
}