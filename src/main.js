let config =
{
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    antialias: false,
    scene: [Menu, Play],
    physics:{
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    
}

let game = new Phaser.Game(config);

//set UI sizes

//reserve keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE;

