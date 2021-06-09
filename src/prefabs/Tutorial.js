class Tutorial extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, name){
        switch(name){
            case 'wasd':
                super(scene, x, y, 'wasd');
                break;
            case 'Jump':
                super(scene, x, y, 'Jump');
                break;
            case 'Left_Click':
                super(scene, x, y, 'Left_Click');
                break;
            case 'Arrow':
                super(scene, x, y, 'Arrow');
                break;
            case 'Dash':
                super(scene, x, y, 'Dash');
                break;
            default:
                super(scene, x, y, 'PinkSquareSprite');
        }
        scene.add.existing(this);
    }
}