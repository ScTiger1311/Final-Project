class Fire extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, direction){
        super(scene, x, y, 'EnvironmentAtlas');
        scene.add.existing(this);           // add to scene
        scene.physics.add.existing(this);   // add to physics world

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
                this.play('flameside');
                this.setFlip(true, false);
                this.body.setSize(this.width/3, this.height)
                this.body.setOffset(10,0)
                break;
            case 'right':
                this.play('flameside');
                this.body.setSize(this.width/3, this.height, false);
                break;
            case 'up':
                this.play('flame');
                this.body.setSize(this.width, this.height/3);
                this.body.setOffset(0,10);
                break;
            case 'down':
                this.play('flame');
                this.setFlip(false, true);
                this.body.setSize(this.width, this.height/3, false);
                break;
        }

        scene.physics.add.collider(scene.player, this, () => {
            if(scene.playerFSM.state != "hurt") {
                console.log("Hurt player");
                scene.playerFSM.transition('hurt');
            }
        })
    }
}