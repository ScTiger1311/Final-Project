class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        //Add object to scenes
        super(scene, x, y, 'PlayerAtlas');
        scene.add.existing(this);
        scene.physics.add.existing(this);



        // for(tile in this.colliderFilter) {
        //     console.log(tile.name + ", " + tile.name)
        // }

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
        scene.anims.create({
            key:"attack",
            frames: this.anims.generateFrameNames('PlayerAtlas',
            {
                prefix: "Dash_Loop",
                start: 1,
                end: 4,
                zeroPad: 4
            }),
            frameRate: 12,

        });

        //Setup mouse input
        scene.input.on('pointerdown', (pointer) => {
            this.playerDebug("Down at [x: " + pointer.x + ", y: " + pointer.y + "]")
            if(this.canAttack && !this.attackTimerActive)
                this.attackQueued = true;
        })

        //Debug purposes only
        //this.body.collideWorldBounds = true 
      
        //Setup physics config
        this.body.useDrag;
        this.body.setSize(16, 30, true) //Size in pixels of hitbox  
        this.body.setOffset(this.width/2 - this.body.width/2, this.body.height/2)
        this.body.setDragX(2500); //This is used as the damping value
        this.body.bounceX = 5000

        //Add wall detection triggers
        this.wDHeightScaler = .7;

        this.leftDetector = scene.physics.add.sprite();
        this.leftDetector.body.setSize(3, this.body.height * this.wDHeightScaler);
        this.leftDetector.body.onOverlap = true;
        this.leftDetector.setDebugBodyColor(0xffff00)

        this.rightDetector = scene.physics.add.sprite();
        this.rightDetector.body.setSize(3, this.body.height * this.wDHeightScaler);
        this.rightDetector.body.onOverlap = true;
        this.rightDetector.setDebugBodyColor(0xff0000)
        
        //Setup control values
        //Walk/Jump movement values
        this.MoveAcceleration = 3000;
        this.maxMovementVelocity = new Phaser.Math.Vector2(185, 500)
        this.upGravity = 1200;
        this.downGravity = 1500;
        this.jumpForce = -250

        //Actual body physics values
        this.body.gravity = new Phaser.Math.Vector2(0, this.downGravity)
        this.body.maxVelocity = new Phaser.Math.Vector2(this.maxMovementVelocity.x, this.maxMovementVelocity.y);

        //Attack control values
        this.maxAttackVelocity = new Phaser.Math.Vector2(this.maxMovementVelocity.x*4.25, this.maxMovementVelocity.y*1.5725);
        this.baseAttackSpeed = 350
        this.attackTime = 100;
        this.attackDamping = .45
        this.attackCooldown = 100 //800 default
        this.attackCoeff = 2.3;

        //Boost control values
        // need boost cooldown & boost velocity
        this.boostCooldown = 200;
        this.boostModifier = 2.3;

        //wall cling/jump values
        this.wallDismountDelay = 175
        this.wallDismountVelocity = 150;
        this.wallClingCoeff = .35; //35% normal gravity on a wall
        this.wallJumpTime = 150;
        this.maxWallJumpVelocity = new Phaser.Math.Vector2(this.maxMovementVelocity.x*1.5, this.maxMovementVelocity.y*2) ;
        this.wallJumpVelocity = new Phaser.Math.Vector2(2050, -225);

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
        this.attackTimerActive = false;
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
        this.rightDetector.body.position.set(this.body.x + this.body.width - 1, this.body.y + this.body.height*(1-this.wDHeightScaler)/2)

        //Handle overlap
        this.overlapLeft = this.overlapRight = false
        this.leftDetector.setDebugBodyColor(0xffff00)
        this.rightDetector.setDebugBodyColor(0xffff00)
        this.scene.physics.overlap(this.leftDetector, this.scene.env, ()=>
        {
            this.overlapLeft = true
            this.leftDetector.setDebugBodyColor(0xff0000)
        });
        
        this.scene.physics.overlap(this.rightDetector, this.scene.env, ()=>
        {
            this.overlapRight = true
            this.rightDetector.setDebugBodyColor(0xff0000)
        });
        
    }
}



    class IdleState extends State {
        enter(scene, player) {
            player.body.maxVelocity.set(player.maxMovementVelocity.x, player.maxMovementVelocity.y)
            player.playerDebug("Enter IdleState");
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
            player.body.maxVelocity.set(player.maxMovementVelocity.x, player.maxMovementVelocity.y)
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
            player.play("attack")

            player.body.maxVelocity.set(player.maxAttackVelocity.x, player.maxAttackVelocity.y)
            player.attackQueued = false;
            player.canAttack = false;

            this.inVelocity = player.body.velocity;

            this.velocityDir = new Phaser.Math.Vector2(0,0);
            this.attackSpeed = player.baseAttackSpeed > this.inVelocity.length() ? player.baseAttackSpeed : this.inVelocity.length(),

            scene.physics.velocityFromRotation(
                Phaser.Math.Angle.Between(
                    player.body.position.x,
                    player.body.position.y,
                    scene.input.mousePointer.worldX,
                    scene.input.mousePointer.worldY
                    ),
                    this.attackSpeed,
                this.velocityDir
            );
            this.velocityDir.x *= player.attackCoeff
            this.velocityDir.y *= player.attackCoeff

            player.playerDebug("inVel: " + this.inVelocity.length() + "\natkVel: " + typeof(this.velocityDir))

            // set a short delay before going back to in air
            scene.time.delayedCall(player.attackTime, () => {
                player.body.setAllowGravity(true)
                player.body.setVelocity(player.body.velocity.x * player.attackDamping, player.body.velocity.y * player.attackDamping)
                player.attackTimerActive = true
                scene.time.delayedCall(player.attackCooldown, () => {player.attackTimerActive = false})
                player.play("jump") //Play jump animation from middle
                player.anims.setProgress(.35)
                this.stateMachine.transition('inair');
                return;
            });
        }

        execute(scene, player) {
            //player.body.setVelocity(0);
            player.body.setAllowGravity(false)
            player.setAcceleration(0);
            player.body.velocity.setFromObject(this.velocityDir)
            //Give velocity towards mouse
            // Velocity is whatever is higher, the atatck speed, or the players current speed

            
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
    
            // set recovery timer
            scene.time.delayedCall(player.hurtTimer, () => {
                this.stateMachine.transition('idle');
            });
        }
    }

    class WallClingState extends State {
        enter(scene, player) {
            player.body.maxVelocity.set(player.maxMovementVelocity.x, player.maxMovementVelocity.y/2.75)
            player.playerDebug("Enter WallClingState");
            player.play("wallcling")
            this.direction = player.overlapRight ? 1 : -1
            player.setFlipX(this.direction > 0 ? 1 : 0)
            //this.transitionStarted = false;
            player.comingOffWall = false;
            player.setGravityY(player.downGravity * player.wallClingCoeff)
        }

        execute(scene, player) {
            // use destructuring to make a local copy of the keyboard object
            const { left, right, a, d, space } = scene.keys;

            //Allow directional dismount of the wall
            if( (Phaser.Input.Keyboard.JustDown(left) || Phaser.Input.Keyboard.JustDown(a)) && player.overlapRight) {
                scene.time.delayedCall(player.wallDismountDelay, () => {
                    player.body.setVelocityX(player.wallDismountVelocity * -this.direction);
                });
            } 
            else if(Phaser.Input.Keyboard.JustDown(right) || Phaser.Input.Keyboard.JustDown(d) && player.overlapLeft) {
                scene.time.delayedCall(player.wallDismountDelay, () => {
                    player.body.setVelocityX(player.wallDismountVelocity * -this.direction);
                });
            }


            if(!player.overlapRight && !player.overlapLeft) {
                //this.transitionStarted = true;
                player.comingOffWall = true;
                player.play("jump")
                player.setGravityY(player.downGravity)
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
                this.stateMachine.transition('walljump')
                return;
            }

            //Handle attack interrupt
            if(player.attackQueued && player.canAttack) {
                player.setGravityY(player.downGravity)
                this.stateMachine.transition('attack')
                return;
            }

            //Handles player hitting the ground
            if(player.body.blocked.down) {
                player.canAttack = true;
                player.playerLand.play();
                player.setGravityY(player.downGravity)
                this.stateMachine.transition('walk')
                return
            }

        }
        
    }

    class WallJumpState extends State {
        enter (scene, player) {
            player.body.maxVelocity.set(player.maxWallJumpVelocity.x, player.maxWallJumpVelocity.y)
            player.playerDebug("Enter WallJumpState");
            this.direction = player.overlapRight ? 1 : -1

            // set a short delay before going back to in air
            scene.time.delayedCall(player.wallJumpTime, () => {
                player.body.setAllowGravity(true)
                //player.body.setVelocity(player.body.velocity.x * player.attackDamping, player.body.velocity.y * player.attackDamping)
                player.play("jump") //Play jump animation from middle
                player.anims.setProgress(.35)
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
            player.body.velocity.set(player.wallJumpVelocity.x * -this.direction, player.wallJumpVelocity.y);
            
        }
    }

    class InAirState extends State {
        enter(scene, player) {
            player.body.maxVelocity.set(player.maxMovementVelocity.x, player.maxMovementVelocity.y)
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
            //Transition to wall cling if pressed against wall
            if(left.isDown || a.isDown) {
                player.body.setAccelerationX(-player.MoveAcceleration * .3);
                player.setFlipX(true)
                if(player.overlapLeft) {
                    player.body.setAccelerationX(0);
                    this.stateMachine.transition('wallcling');
                    return;
                }
            }
            else if(right.isDown || d.isDown) {
                player.body.setAccelerationX(player.MoveAcceleration * .3);
                player.setFlipX(false)                 
                if(player.overlapRight) {
                    player.body.setAccelerationX(0);
                    this.stateMachine.transition('wallcling');
                    return;
                }
            }



            //Handle landing
            if(this.risingJumpInputted && player.body.blocked.down) {
                player.playerLand.play();
                player.comingOffWall = false;
                player.canAttack = true;
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

    
