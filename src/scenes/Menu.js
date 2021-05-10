class Menu extends Phaser.Scene
{
    constructor()
    {
       super("menuScene"); 
    }

    preload()
    {

    }

    create()
    {
        this.menuText = this.add.text(game.config.width/2, game.config.height/2, 'Left/Right arrow to play scene');
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */
        if(Phaser.Input.Keyboard.JustDown(keyLEFT))
        {
            //easyMode
            this.scene.start('playScene');

        }
    }
}