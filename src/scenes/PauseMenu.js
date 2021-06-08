class PauseMenu extends Phaser.Scene{
    constructor(){
        super("PauseMenu");
    }

    preload() {
        this.load.image("pause_image", "./assets/single_sprites/Pause.png");

        //3 frames, named button_neutral, button_hover, button_down
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");
        this.load.atlas("Resume", "./assets/spritesheets/Resume_Atlas.png", "./assets/spritesheets/Resume_Atlas.json");
        this.load.atlas("Reset", "./assets/spritesheets/Reset_Atlas.png", "./assets/spritesheets/Reset_Atlas.json");
        this.load.atlas("Menu", "./assets/spritesheets/Menu_Atlas.png", "./assets/spritesheets/Menu_Atlas.json");
    }

    create(){
        this.pauseSprite = this.add.sprite(0, 0, "pause_image").setOrigin(0, 0);

        console.log("Paused the game.");
        this.resumeButton = new Button(this, "Resume", 200, 100, function(){
            var playing = this.scene.scene.get('Play');
            playing.music.setVolume(0.06);
            this.scene.scene.resume('Play');
            this.scene.scene.sleep();
            });
            
        this.restartButton = new Button(this, "Reset", 224, 190, function(){
            var playing = this.scene.scene.get('Play');
            playing.music.stop();
            playing.restartLevel();
            this.scene.scene.sleep();
        })
        this.menuButton = new Button(this, "Menu", 224, 280, function(){
            var playing = this.scene.scene.get('Play');
            playing.music.stop();
            playing.scene.stop();
            this.scene.scene.start('Menu');
            this.scene.scene.sleep();
        } )
    }
}