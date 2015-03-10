gta.MainMenu = function(game){
};
gta.MainMenu.prototype = {
	create: function(){
		// display images
		var a = this.add.sprite(0, 0, 'background', null);
		a.height = gta.GAME_HEIGHT;
		a.width = gta.GAME_WIDTH;
		a = this.add.sprite(0, 40, 'title', null);
		a = this.add.button(90, gta.GAME_HEIGHT-160, 'question',this.helpScreen, this, 1,0,2);
		a.scale.x = 0.4;
		a.scale.y = 0.4;
		// this.add.sprite(0, 10, 'monster-cover');		
		// this.add.sprite(gta.GAME_WIDTH/2, 20, 'title');
		// add the button that will start the game
		this.add.button(gta.GAME_WIDTH/2, gta.GAME_HEIGHT/2 , 'button-start', this.startGame, this, 1, 0, 2); 
		this.cannon = this.add.sprite(myVars.cannon.width/2,gta.GAME_HEIGHT-20, 'cannon');
        this.cannon.anchor.set(0.25, 0.75);
        this.cannon.rotation = Math.atan2(-100,100);

        var fontStyle = { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "right" },
        	fontStyle2 = { font: "30px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "right" },
        	highScoreObj ={};
        highScoreObj.text = this.add.text(gta.GAME_WIDTH, gta.GAME_HEIGHT - 110, "HighScore" , fontStyle);
        highScoreObj.value = this.add.text(gta.GAME_WIDTH, gta.GAME_HEIGHT - 55, myHud.highScore +" by " + myHud.player , fontStyle2);
        this.add.tween(highScoreObj.text).to( { x: (gta.GAME_WIDTH-highScoreObj.text.width)}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(highScoreObj.value).to( { x: (gta.GAME_WIDTH-highScoreObj.value.width)}, 250, Phaser.Easing.Linear.None, true);
	},
	helpScreen : function (argument) {
		alert("The Town of FunsVille is under attack! Save the village by using the only weapon available to you, the Cannon!! Don't miss more than 4 bombs otherwise the village will be destroyed.")
	},
	startGame: function() {
		// start the Game state
		this.state.start('Cannon');
	}
};