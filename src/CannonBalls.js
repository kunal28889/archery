gta.Cannon = function(game){
    this.angle = 0;
    this.fireRate = 0;
    this.nextFire = 0;
    this.cannon = null;
    this.bullets = null;
    this.spawnBombsTimer = 0;
    this.bombGroup = null;
    this.levelBar = 1300;
    this.lives = null;
    this.curScoreLength = 1;
    
    gta.scoreObj = null;
}

gta.Cannon.prototype = {

    create : function(){
        
        this.health = 4;
        this.curLvl = 0;
        this.bulletSpeed = 900;
        this.curScoreLength = 1;

        var a = this.add.sprite(0, 0, 'background', null);
        a.height = gta.GAME_HEIGHT;
        a.width = gta.GAME_WIDTH;

        // game.stage.backgroundColor = '#2d2d2d';
        myHud.watch("score",this.scoreListener.bind(this));
        myHud.initWatchListeners();
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // game.physics.arcade.gravity.y = 400;
        this.physics.arcade.restitution = 0.8;
        this.physics.arcade.friction = 0.1;

        this.bombGroup = this.add.group();
        this.bullets = this.add.group();
        this.lives = this.add.group();
        this.initLives(4);
        this.bullets.createMultiple(500, 'bullets', 0, false);

        this.cannon = this.add.sprite(myVars.cannon.width/2,gta.GAME_HEIGHT-20, 'cannon');
        this.cannon.anchor.set(0.25, 0.75);
        gta.items.spawnBombs(this);

        this.input.holdRate = 200;
        this.input.onHold.add(this.incMangnitude, this);
        this.input.onDown.add(this.fire, this);

        gta.scoreObj =  this.add.text(gta.GAME_WIDTH -30, 20, "0", { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "right" });
        myHud.score = 0;
    },
    initLives : function (num) {
        for (var i = 0; i < num; i++) {
            var t = this.lives.create(10 + (myVars.bomb.width)*i, 10, "life", i);
        };
    },
    incMangnitude : function (e) {
        this.bulletSpeed+=100;
        console.log("Held")
    },
    fire : function (e) {
        if(!this.health)
            backtoMain();
        var dx = this.input.activePointer.worldX - this.cannon.x;
        var dy = this.input.activePointer.worldY - this.cannon.y;
        this.cannon.rotation = Math.atan2(dy, dx);
        // console.log("Pressed")
        if (this.time.now > this.nextFire)
        {
            // console.log("Fire")
            this.nextFire = this.time.now + this.fireRate;

            var bullet = this.bullets.getFirstExists(false);

            if (bullet)
            {   
                bullet.frame = this.rnd.integerInRange(0, 6);
                bullet.exists = true;
                bullet.position.set(this.cannon.x-20, this.cannon.y-20);

                game.physics.arcade.enable(bullet);
                bullet.body.bounce.y = 1;
                bullet.body.bounce.x = 1;
                bullet.body.rotation = this.cannon.rotation + this.math.degToRad(-90);

                var magnitude = this.bulletSpeed;
                var angle = bullet.body.rotation + Math.PI / 2;

                bullet.body.velocity.x = magnitude * Math.cos(angle);
                bullet.body.velocity.y = magnitude * Math.sin(angle);
                bullet.body.gravity.y = 1000;
                // console.log(angle + "\t" + e.clientX + "\t" + e.clientY + "\t" + this.cannon.rotation + "\t" + this.math.degToRad(-90))
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.removeBullet, game);
            }
         }
    },
    update : function () {

        this.spawnBombsTimer += this.time.elapsed;
        if(this.spawnBombsTimer > this.levelBar) {
            // reset it
            this.spawnBombsTimer = 0;
            // and spawn new candy
            gta.items.spawnBombs(this);
        }// loop through all candy on the screen
        this.bombGroup.forEach(function(bomb){
            // to rotate them accordingly
            bomb.angle += bomb.rotateMe;
        });
        game.physics.arcade.collide(this.bombGroup, this.bullets, this.change, null, this);


       // if the health of the player drops to 0, the player dies = game over
       if(!this.health) {
           // show the game over message
           gameOverSprite = this.add.sprite(0, 0, 'game-over');
           gameOverSprite.height = gta.GAME_HEIGHT;
           gameOverSprite.width = gta.GAME_WIDTH;
           // pause the game
           this.game.paused = true;
           this.cannon.kill();
           if(myHud.score > myHud.highScore) {
                myHud.highScore = myHud.score;
                localStorage.highScore = myHud.score;
                document.getElementById("scoreValue").innerHTML = myHud.score;
                window.location.hash = "newHighScore";
           }
           gta.scoreObj.destroy();
       }

    },
    removeBullet: function(bullet){
        // kill the candy 
        // console.log("sdf") 
        bullet.kill();
        myHud.bulletCount += 1;      
    },
    change : function (a,b) {
      // console.log(a +"\t"+ b)  
      myHud.hitCount++;
      gta.items.spawnSprite(a, b, this);
    },
    scoreListener :  function (id, oldval, newval) {
        var curScore = 0;
        if(newval <= 0) 
          curScore = 0;
        else
          curScore = newval;
        if(curScore > 1){
            this.curLvl++;
            this.levelModifier();
        }
        if(curScore.toString().length>this.curScoreLength) {
            gta.scoreObj.x -=15*curScore.toString().length;
            this.curScoreLength = curScore.toString().length;
        }
        gta.scoreObj.setText(curScore);
        return curScore;
    },
    levelModifier : function () {
        var temp = (Math.ceil(Math.pow(this.curLvl/6, 2)) * 35);
         this.levelBar = (1900 - temp) >= 500 ? (1900 - temp) : 500;
         // console.log(this.levelBar)
    }
};

gta.items = {
    spawnBombs : function (game) {
        var dropPos = Math.floor(Math.random()*((gta.GAME_WIDTH - 80)-80+1)+80);
        //Math.floor(Math.random()*Candy.GAME_WIDTH);
        var bomb = game.add.sprite(dropPos, -30, 'bomb');
        // randomize candy type
        var candyType = Math.floor(Math.random()*5);
        // add new animation frame
        // bomb.animations.add('anim', [candyType], 10, true);
        // play the newly created animation
        // bomb.animations.play('anim');
        // enable candy body for physic engine
        // game.physics.enable(bomb, Phaser.Physics.ARCADE);
        game.physics.arcade.enable(bomb);
        bomb.body.checkCollision = "any";
        bomb.body.bounce.y = 1;
        bomb.body.bounce.x = 1;
        bomb.body.gravity.y = 400;
        // enable candy to be clicked/tapped
        bomb.inputEnabled = true;
        // be sure that the candy will fire an event when it goes out of the screen
        bomb.checkWorldBounds = true;
        // reset candy when it goes out of screen
        bomb.events.onOutOfBounds.add(this.removeBomb, game);
        // set the anchor (for rotation, position etc) to the middle of the candy
        bomb.anchor.setTo(0.5, 0.5);
        // set the random rotation value
        bomb.rotateMe = (Math.random()*4)-2;
        // add candy to the group
        game.bombGroup.add(bomb);
    },
    removeBomb: function(bomb){
        // kill the candy
        bomb.kill();
        this.health -= 1;
        if(this.health >= 0) {
            this.lives.children[this.health].kill();
            this.lives.create((this.health*myVars.bomb.width), 30, "explode", this.health)
        }
         
    },
    spawnSprite : function (a, b, game) {
        sprite = game.add.sprite(a.body.x + myVars.bomb.width/2, a.body.y + myVars.bomb.height/2, 'explode');

      sprite.anchor.setTo(0.5, 0.5);
      // // sprite.alpha = 0;
      // sprite.rotateMe = a.body.angle;
      x = game.add.tween(sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      x.onComplete.addOnce(function (evt) {
        // alert();
          evt.kill();
      }, this);
      a.kill();
      b.kill();
    }
}
