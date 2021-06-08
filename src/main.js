// Team Buddy:
// Avery Weibel
// Cameron Beattie
// Ethan Rafael
// Sky Peterson
let config =
{
    type: Phaser.WEBGL,
    width: 640,
    height: 368,
    zoom: 2,
    antialias: false,
    pixelArt: true,
    scene: [Menu, Play, Credits, PauseMenu],
    physics:{
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            },
            debug: true
        }
    },
    
}

let game = new Phaser.Game(config);

//reserve keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyX;

