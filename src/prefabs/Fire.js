class Fire extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, direction){
        super(scene, x, y, 'EnvironmentAtlas');
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world

        // this.body.setSize(this.width/4, this.height/4, false);
        // this.body.setOffset(0,0);

        scene.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Fire',
                start: 1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,

        });
        scene.anims.create({
            key: 'flameside',
            frames: this.anims.generateFrameNames('EnvironmentAtlas',
            {
                prefix: 'Fire_Side',
                start:1,
                end: 7,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: -1,
        });
        switch(direction){
            case 'left':
<<<<<<< Updated upstream
                this.play('flameside');
                this.setFlip(true, false);
                break;
            case 'right':
                this.play('flameside');
                break;
            case 'up':
                this.play('flame');
                break;
            case 'down':
                this.setFlip(false, true);
                this.play('flame');
=======
                this.angle = 270;
                this.body.setSize(this.width/7, this.height/4, false);
                break;
            case 'right':
                this.angle = 90;
                this.body.setSize(this.width/7, this.height/4, false);
                break;
            case 'up':
                this.body.setSize(this.width/4, this.height/7, false);
                this.body.setOffset(0, 8);
                break;
            case 'down':
                this.setFlip(false, true);
                this.body.setSize(this.width/4, this.height/7, false);

>>>>>>> Stashed changes
                break;
        }
        // this.play('flame');

        scene.physics.add.collider(scene.player, this, () => {
            if(scene.playerFSM.state != "hurt") {
                console.log("Hurt player");
                scene.playerFSM.transition('hurt');
            }
        })
    }
}