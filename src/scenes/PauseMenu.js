class PauseMenu extends Phaser.Scene{
    constructor(){
        super("PauseMenu");
    }
    create(){
        console.log("Paused the game.");
        this.resumeButton = new Button(this, "button", 200, 200, function(){
            var playing = this.scene.scene.get('Play');
            playing.music.setVolume(0.06);
            this.scene.scene.resume('Play');
            this.scene.scene.sleep();
            });
            
        this.restartButton = new Button(this, "button", 400, 200, function(){
            var playing = this.scene.scene.get('Play');
            playing.music.stop();
            playing.scene.restart();
            this.scene.scene.sleep();
        })
    }
}