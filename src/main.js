let config =
{
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    scene: [Menu, Play],
    
}

let game = new Phaser.Game(config);

//set UI sizes

//reserve keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT;

