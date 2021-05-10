class Play extends Phaser.Scene
{
    constructor()
    {
       super("playScene"); 
    }

    preload()
    {
        
    }

    create()
    {

    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        /*
        Please multiply any movements that are happening in the update function by this variable.
        That way they don't speed up on high refresh rate displays. Ask Ethan for more help/info
        if you are unsure.
        */
    }
}