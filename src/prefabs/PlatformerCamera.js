class PlatformerCamera extends Phaser.Cameras.Scene2D.BaseCamera
{
    constructor(scene, objectToFollow, camera)
    {
        super(scene, objectToFollow, camera);
        this.scene = scene;
        this.objectToFollow = objectToFollow;
        this.camera = camera;
        this.camera.startFollow(objectToFollow);
        this.camera.setFollowOffset(0, 50);
        this.camera.setDeadzone(30, 30);
    }

    update(time, delta)
    {
        console.log("update camera");
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

        //just used the below things to test the scrolling.
        //this.camera.scrollX = Math.random();
        //this.camera.scrollY = Math.random();
    }
}