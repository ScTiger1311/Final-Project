class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        //Add object to scenes
        super(scene, x, y, 'PlayerAtlas');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Setup physics config
        this.body.gravity = new Phaser.Math.Vector2(0, 800)

        //Setup animations
        scene.anims.create({
            key:"run",
            frames: this.anims.generateFrameNames('PlayerAtlas',
            {
                prefix: "Player_Run",
                start: 1,
                end: 8,
                zeroPad: 4
            }),
            frameRate: 12,
            repeat: -1

        });
        scene.anims.create({
            key:"idle",
            frames: this.anims.generateFrameNames('PlayerAtlas',
            {
                prefix: "Player_Idle",
                start: 1,
                end: 1,
                zeroPad: 4
            }),
            frameRate: 1,

        });
        scene.anims.create({
            key:"jump",
            frames: this.anims.generateFrameNames('PlayerAtlas',
            {
                prefix: "Player_Jump",
                start: 1,
                end: 13,
                zeroPad: 4
            }),
            frameRate: 16,

        });

        //Setup mouse input
        scene.input.on('pointerdown', (pointer) => {
            this.playerDebug("Down at [x: " + pointer.x + ", y: " + pointer.y + "]")
            if(scene.playerFSM.state == 'inair')
                this.attackQueued = true;
        })

        //Debug purposes only
        //this.body.collideWorldBounds = true 

        this.isBoosting = false;
      
        this.body.maxVelocity = new Phaser.Math.Vector2(400, 1100)
        this.body.useDrag;
        this.body.setDragX(1800); //This is used as the damping value
        this.body.bounceX = 5000
        
        //Setup control values
        this.MoveAcceleration = 1000;
        this.upGravity = 1600;
        this.downGravity = 1800;
        this.attackVelocity = 1000;
        this.attackTime = 100;

        //Debug items
        this.debugOn = true;
        this.debugGraphics = scene.add.graphics();

        //Temp values
        //this.setScale(.5)

        //Detection 
        this.topLeftRay = new Phaser.Geom.Line(
            this.x - this.body.width/2, this.y - this.body.height/2,
            this.x - this.body.width/2 - 1, this.y - this.body.height/2
        );
        this.topRightRay = new Phaser.Geom.Line(
            this.x + this.body.width/2, this.y - this.body.height/2,
            this.x + this.body.width/2 + 1, this.y - this.body.height/2
        );
        this.bottomLeftRay = new Phaser.Geom.Line(
            this.x - this.body.width/2, this.y + this.body.height/2,
            this.x - this.body.width/2 - 1, this.y + this.body.height/2
        );
        this.bottomRightRay = new Phaser.Geom.Line(
            this.x + this.body.width/2, this.y + this.body.height/2,
            this.x + this.body.width/2 + 1, this.y + this.body.height/2
        );

        //Tracking values
        this.deltaY = 0;
        this.lastY = this.y;
        this.wallInVelocity = 0;
        this.comingOffWall = false;
        this.attackQueued = false;


        //Player fx
        this.playerJump = scene.sound.add("jumpFx", {
            volume: .8,
        })
        this.playerLand = scene.sound.add("landFx", {
            volume: .8,
        })
    }

    speedChange(increase = false){
        if(increase && !this.isBoosting){
            this.MoveAcceleration *= BOOST;
            // this.body.setVelocityY(-500*BOOST);  // experimenting
            //console.log("increase:" + this.MoveAcceleration);
            this.isBoosting = true;
        }
        else{
            this.MoveAcceleration /= BOOST;
            //console.log(this.MoveAcceleration);
            this.isBoosting = false;
        }
    }
    bounce(){
        this.body.setVelocityY(-250);
        //console.log("bounce");
        //Track values last frame for delta uses
        this.lastY = this.y;
        this.lastXVelocity = this.body.velocity.x;
    }

    playerDebug(msg) {
        if(this.debugOn) console.log(msg);
    }

    drawDebug() {
        this.debugGraphics.clear();
        if(this.debugOn) {
            this.debugGraphics.lineStyle(1, 0x00ff00);
            this.debugGraphics.strokeLineShape(this.topLeftRay);
            this.debugGraphics.strokeLineShape(this.bottomLeftRay);
            this.debugGraphics.strokeLineShape(this.topRightRay);
            this.debugGraphics.strokeLineShape(this.bottomRightRay);
        }
    }

    update(time, delta) 
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.
        this.topLeftRay = new Phaser.Geom.Line(
            this.x - this.body.width/2, this.y - this.body.height/2,
            this.x - this.body.width/2 - 1, this.y - this.body.height/2
        );
        this.topRightRay = new Phaser.Geom.Line(
            this.x + this.body.width/2, this.y - this.body.height/2,
            this.x + this.body.width/2 + 1, this.y - this.body.height/2
        );
        this.bottomLeftRay = new Phaser.Geom.Line(
            this.x - this.body.width/2, this.y + this.body.height/2-1,
            this.x - this.body.width/2 - 1, this.y + this.body.height/2-1
        );
        this.bottomRightRay = new Phaser.Geom.Line(
            this.x + this.body.width/2, this.y + this.body.height/2-1,
            this.x + this.body.width/2 + 1, this.y + this.body.height/2-1
        );
        
    }
}

    class IdleState extends State {
        enter(scene, player) {
            player.playerDebug("Enter IdleState");
            player.playerDebug("Origin: " + player.originX + ", " + player.originY);
            player.play("idle")
            player.stop()
        }
    
        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            // Yes thank you nathan doing that now - Avery
            const { left, right, a, d, space } = scene.keys;
    
            // transition to swing if pressing space
            if(Phaser.Input.Keyboard.JustDown(space)) {
                player.playerJump.play(); //Play jump audio
                player.play("jump") //Play jump animation
                this.stateMachine.transition('inair');
                return;
            }
    
            // transition to move if pressing a movement key
            if(left.isDown || right.isDown || a.isDown || d.isDown) {
                this.stateMachine.transition('walk');
                return;
            }
        }
    }
    
    class WalkState extends State {
        enter (scene, player) {
            player.playerDebug("Enter WalkState");
            player.play("run")
        }

        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            const { left, right, a, d, space } = scene.keys;
    
            // transition to inair if pressing space
            if(Phaser.Input.Keyboard.JustDown(space)) {
                player.playerJump.play(); //Play jump audio
                player.play("jump") //Play jump animation
                player.body.setAccelerationX(0);
                this.stateMachine.transition('inair');
                return;
            }
    
            // transition to idle if not pressing movement keys
            if(!(left.isDown || right.isDown || a.isDown || d.isDown)) {
                player.body.setAccelerationX(0);
                this.stateMachine.transition('idle');
                return;
            }
    
            // handle movement
            //player.body.setVelocity(0);
            if(left.isDown || a.isDown) {
                player.body.setAccelerationX(-player.MoveAcceleration);
                player.setFlipX(true)
                player.direction = 'left';
            } else if(right.isDown || d.isDown) {
                player.body.setAccelerationX(player.MoveAcceleration);
                player.setFlipX(false)
                player.direction = 'right';
            }
        }
    }
    
    class AttackState extends State {
        enter (scene, player) {
            player.playerDebug("Enter AttackState");
            player.playerDebug("Playerposbef = " + player.body.position.x + ", " + player.body.position.y)
            player.attackQueued = false;

            // set a short delay before going back to in air
            let startPoint = player.body.position;
            player.playerDebug("Startpoint = " + startPoint.x + ", " + startPoint.y)
            scene.time.delayedCall(player.attackTime, () => {
                player.body.setAllowGravity(true)
                //player.body.setVelocity(0)
                player.playerDebug("Playerposaft = " + player.body.position.x + ", " + player.body.position.y)
                console.log("Start: " + startPoint.x + ", " + startPoint.y + " End: " + player.body.position.x + ", " + player.body.position.y )
                console.log("Distance: " + Phaser.Math.Distance.BetweenPoints(startPoint, player.body.position))
                this.stateMachine.transition('inair');
                return;
            });
        }

        execute(scene, player) {
            //player.body.setVelocity(0);
            player.body.setAllowGravity(false)

            //Give velocity towards mouse
            scene.physics.velocityFromRotation(
                Phaser.Math.Angle.Between(
                    player.body.position.x,
                    player.body.position.y,
                    scene.input.mousePointer.worldX,
                    scene.input.mousePointer.worldY
                    ),
                player.attackVelocity,
                player.body.velocity
            );
            this.endPoint = player.body.position
            
        }
    }
    
    class BoostState extends State {
        enter(scene, player) {
            player.playerDebug("Enter BoostState");
            player.body.setVelocity(0);
            player.anims.play(`swing-${player.direction}`);
            switch(player.direction) {
                case 'up':
                    player.body.setVelocityY(-player.heroVelocity * 3);
                    break;
                case 'down':
                    player.body.setVelocityY(player.heroVelocity * 3);
                    break;
                case 'left':
                    player.body.setVelocityX(-player.heroVelocity * 3);
                    break;
                case 'right':
                    player.body.setVelocityX(player.heroVelocity * 3);
                    break;
            }
    
            // set a short delay before going back to idle
            scene.time.delayedCall(player.dashCooldown, () => {
                this.stateMachine.transition('idle');
            });
        }
    }
    
    class HurtState extends State {
        enter(scene, player) {
            player.playerDebug("Enter HurtState");
            player.body.setVelocity(0);
            player.anims.play(`walk-${player.direction}`);
            player.anims.stop();
            player.setTint(0xFF0000);     // turn red
    
            // set recovery timer
            scene.time.delayedCall(player.hurtTimer, () => {
                player.clearTint();
                this.stateMachine.transition('idle');
            });
        }
    }

    class WallClingState extends State {
        enter(scene, player) {
            player.playerDebug("Enter WallClingState");
            player.play("idle")
            this.direction = player.body.blocked.right ? 1 : -1
            this.transitionStarted = false;
        }

        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            const { left, right, a, d, space } = scene.keys;

            //This doesn't totally work, but it is the best i've been able
            //To figure out so far
            //Problems when jumping from one wall to another
            if(!player.comingOffWall){ //Slightly press the player into the wall so that a collision is registered
                player.setVelocityX(100 * this.direction)
            }

            //Allow directional dismount of the wall
            if(Phaser.Input.Keyboard.JustDown(left) || Phaser.Input.Keyboard.JustDown(a)) {
                
            } else if(Phaser.Input.Keyboard.JustDown(right) || Phaser.Input.Keyboard.JustDown(d)) {
                
            }


            if(!player.body.blocked.right && !player.body.blocked.left && !this.transitionStarted) {
                this.transitionStarted = true;
                player.comingOffWall = true;
                player.play("jump")
                this.stateMachine.transition('inair');
                scene.time.delayedCall(200, () => {
                    if(this.stateMachine.state == 'wallcling') {
                        
                    }
                    return
                });
            }

            if(player.body.blocked.down) {
                player.playerLand.play();
                this.stateMachine.transition('walk')
                return
            }

            //Handle wall jump input
            if(Phaser.Input.Keyboard.JustDown(space)){
                player.comingOffWall = true;
                player.body.setVelocityX(450 * -this.direction);
                player.body.setVelocityY(-425);
                player.play("jump")
                //this.stateMachine.transition('inair')
                return;
            }

        }
        
    }

    class InAirState extends State {
        enter(scene, player) {
            player.playerDebug("Enter InAirState");
            // if we're coming off a wall cling, the first jump has already happened
            this.risingJumpInputted = player.comingOffWall;
        }

        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            const { left, right, a, d, space } = scene.keys;

            //Calculate deltaY
            player.deltaY = player.y - player.lastY;
            //if we're standing or jumping, less gravity
            if(player.deltaY <= 0) {
                player.setGravityY(player.upGravity);
            }
            else {//if we're falling, more gravity
                player.setGravityY(player.downGravity);
            }

            //Handle jumping inputs
            if(!this.risingJumpInputted && Phaser.Input.Keyboard.DownDuration(space, 200)){
                player.body.setVelocityY(-500);
            }
            else {
                this.risingJumpInputted = true;
            }

            // Handle air movement
            if(!(left.isDown || right.isDown || a.isDown || d.isDown)) {
                player.body.setAccelerationX(0);
            }

            //Slightly less control in the air
            if(left.isDown || a.isDown) {
                player.body.setAccelerationX(-player.MoveAcceleration * .8);
                player.direction = 'left';
            } else if(right.isDown || d.isDown) {
                player.body.setAccelerationX(player.MoveAcceleration * .8);
                player.direction = 'right';
            }

            //Handle wall collision
            if(player.body.blocked.right || player.body.blocked.left) {
                player.body.setAccelerationX(0);
                this.stateMachine.transition('wallcling');
                return;
            }

            //Handle landing
            if(this.risingJumpInputted && player.body.blocked.down) {
                player.playerLand.play();
                player.comingOffWall = false;
                //Go to walk and if they aren't holding a key go to idle
                this.stateMachine.transition('walk');
                return;
            }

            //Handle attack interrupt
            if(player.attackQueued) {
                this.stateMachine.transition('attack')
                return;
            }

        }
        
    }

    
