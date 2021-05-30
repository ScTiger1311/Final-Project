let config =
{
    type: Phaser.WEBGL,
    width: 640,
    height: 360,
    zoom: 2,
    antialias: false,
    pixelArt: true,
    scene: [Menu, Play],
    physics:{
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            },
            debug: false
        }
    },
    
}

let game = new Phaser.Game(config);
let BOOST = 5;

//set UI sizes

//reserve keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyX;

