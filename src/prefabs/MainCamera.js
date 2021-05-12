class MainCamera extends Phaser.Cameras.Scene2D.BaseCamera
{
    constructor(scene, x, y, width, height)
    {
        //add camera to the scene
        super(x, y, width, height);
        scene.cameras.add(this);

        //setup camera config
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}