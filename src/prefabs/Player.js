class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        //Add object to scenes
        super(scene, x, y, 'PlayerAtlas');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Add wall detection triggers
        this.wDHeightScaler = .7;

        this.leftDetector = scene.physics.add.sprite();
        this.leftDetector.body.setSize(30, this.height * this.wDHeightScaler);
        this.leftDetector.onOverlap = true;
        this.leftDetector.setDebugBodyColor(0xffff00)

        scene.physics.world.on('overlap', (obj1, obj2, body1, body2)=>{
            console.log("fuck");
        })

        //Setup physics config
        this.body.gravity = new Phaser.Math.Vector2(0, 800)
        this.body.maxVelocity = new Phaser.Math.Vector2(400, 1100)
        this.body.useDrag;
        this.body.setDragX(1800); //This is used as the damping value
        this.body.bounceX = 5000        
        this.body.setSize(16, 30, true) //Size in pixels of hitbox  
        this.body.setOffset(this.body.width/2, 0)

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
                end: 14,
                zeroPad: 4
            }),
            frameRate: 21,

        });
        scene.anims.create({
            key:"wallcling",
            frames: this.anims.generateFrameNames('PlayerAtlas',
            {
                prefix: "Wall_Slide",
                start: 1,
                end: 1,
                zeroPad: 4
            }),
            frameRate: 1,

        });

        //Setup mouse input
        scene.input.on('pointerdown', (pointer) => {
            this.playerDebug("Down at [x: " + pointer.x + ", y: " + pointer.y + "]")
            if(this.canAttack)
                this.attackQueued = true;
        })

        //Debug purposes only
        //this.body.collideWorldBounds = true 

        this.isBoosting = false;
      
        this.body.maxVelocity = new Phaser.Math.Vector2(185, 1100);
        this.body.useDrag;
        this.body.setDragX(2500); //This is used as the damping value
        this.body.bounceX = 5000
        
        //Setup control values
        this.MoveAcceleration = 3000;
        this.upGravity = 1200;
        this.downGravity = 1500;
        this.jumpForce = -250
        this.attackVelocity = 500;
        this.attackTime = 100;
        this.attackDamping = .7
        this.attackCooldown = 800
        // need boost cooldown & boost velocity
        this.boostCooldown = 200;
        this.boostModifier = 2.3;

        //Debug items
        this.debugOn = true;
        this.debugGraphics = scene.add.graphics();

        //Temp values

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
        this.debugCircle = new Phaser.Geom.Circle(this.body.position.x, this.body.position.y, 4)

        //Tracking values
        this.deltaY = 0;
        this.lastY = this.y;
        this.wallInVelocity = 0;
        this.comingOffWall = false;
        this.attackQueued = false;
        this.canAttack = true;
        this.overlapLeft = false;
        this.overlapRight = false;

        //Player fx
        this.playerJump = scene.sound.add("jumpFx", {
            volume: .8,
        })
        this.playerLand = scene.sound.add("landFx", {
            volume: .8,
        })
    }

    playerDebug(msg) {
        if(this.debugOn) console.log(msg);
    }

    drawDebug() {
        this.debugGraphics.clear();
        if(this.debugOn) {
            this.debugGraphics.lineStyle(1, 0x00ff00);
            //this.debugGraphics.circleStyle(1, 0xff0000);
            this.debugGraphics.strokeLineShape(this.topLeftRay);
            this.debugGraphics.strokeLineShape(this.bottomLeftRay);
            this.debugGraphics.strokeLineShape(this.topRightRay);
            this.debugGraphics.strokeLineShape(this.bottomRightRay);
            this.debugGraphics.strokeCircleShape(this.debugCircle);
        }
    }

    reset() {
        this.body.setVelocity(0)
        this.body.setAcceleration(0)
        this.y = this.scene.playerSpawn.y;
        this.x = this.scene.playerSpawn.x;
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence.

        //Position debugging geometry
        this.topLeftRay = new Phaser.Geom.Line(
            this.x - this.width/2, this.y - this.height/2,
            this.x - this.width/2 - 1, this.y - this.height/2
        );
        this.topRightRay = new Phaser.Geom.Line(
            this.x + this.width/2, this.y - this.height/2,
            this.x + this.width/2 + 1, this.y - this.height/2
        );
        this.bottomLeftRay = new Phaser.Geom.Line(
            this.x - this.width/2, this.y + this.height/2-1,
            this.x - this.width/2 - 1, this.y + this.height/2-1
        );
        this.bottomRightRay = new Phaser.Geom.Line(
            this.x + this.width/2, this.y + this.height/2-1,
            this.x + this.width/2 + 1, this.y + this.height/2-1
        );
        this.debugCircle = new Phaser.Geom.Circle(this.body.x, this.body.y, 8)

        //Position wall detectors
        this.leftDetector.body.position.set(this.body.x - 1, this.body.y + this.body.height*(1-this.wDHeightScaler)/2)

        //Handle overlap
        //this.tint = 0xffffff
        //this.scene.physics.overlap(this.leftDetector, this.scene.Platform_Layer, null, this.LogLeft(), this.scene);
        
    }

    //LogLeft() {this.tint = 0xffff00}
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
            // Yes thank you nathan doing that now -Avery
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

            //Handle attack interrupt
            if(player.attackQueued && player.canAttack) {
                this.stateMachine.transition('attack')
                return;
            }

            //Handle dropping off ledges
            if(!player.body.blocked.down) {
                player.play("jump") //Play jump animation from middle
                player.anims.setProgress(.35)
                this.stateMachine.transition('inair')
                return
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
                //player.body.setAccelerationX(0);
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

            //Handle attack interrupt
            if(player.attackQueued && player.canAttack) {
                this.stateMachine.transition('attack')
                return;
            }

            //Handle dropping off ledges
            if(!player.body.blocked.down) {
                player.play("jump") //Play jump animation from middle
                player.anims.setProgress(.35)
                this.stateMachine.transition('inair')
                return
            }
        }
    }
    
    class AttackState extends State {
        enter (scene, player) {
            player.playerDebug("Enter AttackState");
            player.playerDebug("Playerposbef = " + player.body.position.x + ", " + player.body.position.y)
            player.attackQueued = false;
            player.canAttack = false;

            player.tint = 0xff0000;

            this.inVelocity = player.body.velocity;

            player.playerDebug("inVel: " + this.inVelocity.length() + "\natkVel: " + player.attackVelocity)

            // set a short delay before going back to in air
            let startPoint = player.body.position;
            player.playerDebug("Startpoint = " + startPoint.x + ", " + startPoint.y)
            scene.time.delayedCall(player.attackTime, () => {
                player.body.setAllowGravity(true)
                player.body.setVelocity(player.body.velocity.x * player.attackDamping, player.body.velocity.y * player.attackDamping)
                // player.playerDebug("Playerposaft = " + player.body.position.x + ", " + player.body.position.y)
                // console.log("Start: " + startPoint.x + ", " + startPoint.y + " End: " + player.body.position.x + ", " + player.body.position.y )
                // console.log("Distance: " + Phaser.Math.Distance.BetweenPoints(startPoint, player.body.position))
                scene.time.delayedCall(player.attackCooldown, () => {player.canAttack = true})
                player.tint = 0xffffff;
                this.stateMachine.transition('inair');
                return;
            });
        }

        execute(scene, player) {
            //player.body.setVelocity(0);
            player.body.setAllowGravity(false)
            player.setAcceleration(0);

            //Give velocity towards mouse
            // Velocity is whatever is higher, the atatck speed, or the players current speed
            scene.physics.velocityFromRotation(
                Phaser.Math.Angle.Between(
                    player.body.position.x,
                    player.body.position.y,
                    scene.input.mousePointer.worldX,
                    scene.input.mousePointer.worldY
                    ),
                player.attackVelocity > this.inVelocity.length() ? player.attackVelocity : this.inVelocity.length(),
                player.body.velocity
            );
            this.endPoint = player.body.position
            
        }
    }
    
    class BoostState extends State {
        enter(scene, player) {
            player.playerDebug("Enter BoostState");
            // player.anims.play(`swing-${player.direction}`);
            player.body.setVelocity(player.body.velocity.x *player.boostModifier, player.body.velocity.y *player.boostModifier);
    
            // set a short delay before going back to idle
            scene.time.delayedCall(player.boostCooldown, () => {
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
            player.play("wallcling")
            this.direction = player.body.blocked.right ? 1 : -1
            player.setFlipX(this.direction > 0 ? 1 : 0)
            //this.transitionStarted = false;
            player.comingOffWall = false;
        }

        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            const { left, right, a, d, space } = scene.keys;

            //This doesn't totally work, but it is the best i've been able
            //To figure out so far
            //Problems when jumping from one wall to another
            if(!player.comingOffWall){ //Slightly press the player into the wall so that a collision is registered
                player.setVelocityX(300 * this.direction)
            }

            //Allow directional dismount of the wall
            if(Phaser.Input.Keyboard.JustDown(left) || Phaser.Input.Keyboard.JustDown(a)) {
                
            } else if(Phaser.Input.Keyboard.JustDown(right) || Phaser.Input.Keyboard.JustDown(d)) {
                
            }


            if(!player.body.blocked.right && !player.body.blocked.left) {
                //this.transitionStarted = true;
                player.comingOffWall = true;
                player.play("jump")
                this.stateMachine.transition('inair')
                // scene.time.delayedCall(10, () => {
                //     if(this.stateMachine.state == 'wallcling') {
                        
                //     }
                //     return
                // });
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

            //Handle attack interrupt
            if(player.attackQueued && player.canAttack) {
                this.stateMachine.transition('attack')
                return;
            }

            //Handles player hitting the ground
            if(player.body.blocked.down) {
                player.playerLand.play();
                this.stateMachine.transition('walk')
                return
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
                player.body.setVelocityY(player.jumpForce);
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
                player.body.setAccelerationX(-player.MoveAcceleration * .3);
                player.setFlipX(true)
            } else if(right.isDown || d.isDown) {
                player.body.setAccelerationX(player.MoveAcceleration * .3);
                player.setFlipX(false)
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
                //if holding a key go to walk otherwise go to idle
                if (left.isDown || a.isDown || right.isDown || d.isDown) {
                    this.stateMachine.transition('walk');
                }
                else {
                    this.stateMachine.transition('idle');
                }

                return;
            }

            //Handle attack interrupt
            if(player.attackQueued && player.canAttack) {
                this.stateMachine.transition('attack')
                return;
            }

        }
        
    }

    
