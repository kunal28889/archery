var gta = {
	gameOverSprite : null
};
gta.Boot = function(game){};
gta.Boot.prototype = {
	preload: function(){
		// preload the loading indicator first before anything else
		this.load.image('preloaderBar', 'img/loadingbar.png');
	},
	create: function(){
		// set scale options
		this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setScreenSize(true);
		// start the Preloader state
		this.state.start('Preloader');

		if(localStorage.getItem("highScore")!==null){
			myHud.highScore = parseInt(localStorage.highScore);
		} else localStorage.setItem("highScore", 0);

		if(localStorage.getItem("player")!==null){
			myHud.player = localStorage.player;
		} else localStorage.setItem("player", "Anonymous");
	}
};

var myHud = {
	hitCount : 0,
	score : 0,
	bulletCount : 0,
	highScore : 0,
	player : "Anonymous",
	reset : function (argument) {
		this.hitCount = 0;
		this.score = 0;
		bulletCount = 0;
	},
	initWatchListeners : function (argument) {
		this.watch("bulletCount", function (id, oldval, newval) {
		  // console.log('o.' + id + ' changed from ' + oldval + ' to ' + newval);
		  this.score--;
		  return newval;
		});

		this.watch("hitCount", function (id, oldval, newval) {
		  this.score+=2;
		  return newval;
		});		
	}
}

var winWidth, winHeight, game, highScoreBlock;
var myVars = {};
var curLvl = 1;
var pausedText;

function backtoMain (e) {
	document.getElementById("playerName").blur();
	if(document.getElementById("playerName").value.trim() != ""){
		localStorage.player = document.getElementById("playerName").value.trim();
		myHud.player = document.getElementById("playerName").value.trim();
	}
	window.location.hash='';
	game.state.start('MainMenu');
	game.paused = false;
	return false;
}

function init() {
	
	 // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back") {
            try {
            	switch(game.state.current){
            		case "Cannon" 	: if(game.paused){
            								backtoMain();
						                } else {
						                	game.paused = true;
						                	var fontStyle = { font: "32px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };
											// add proper informational text
											pausedText = game.add.text(0, 250, "Game paused.\nTap anywhere to continue.\n Press Back key for main screen", fontStyle);
											game.input.onDown.add(function(){
												// remove the pause text
												pausedText.destroy();
												// unpause the game
												game.paused = false;
											}, game);
						                }
						              break;
            		case "MainMenu" : 
            		default 		: tizen.application.getCurrentApplication().exit();
            	}
                
            } catch (error) {
                console.error(error.message);
            }
        }
    });

	winWidth = window.innerWidth;
	winHeight = window.innerHeight
	//.style.width = "60px";
	// document.getElementById("footer").style.height = "91px";
	// initialize the framework
	game = new Phaser.Game(winWidth, winHeight, Phaser.AUTO, 'game','',true);
	// add game states
	game.state.add('Boot', gta.Boot);
	game.state.add('Preloader', gta.Preloader);
	game.state.add("Cannon", gta.Cannon)
	game.state.add("MainMenu", gta.MainMenu)
	// start the Boot state
	game.state.start('Boot');

};
window.onload = init;

(function watchPrototype (argument) {
	// object.watch
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			  enumerable: false
			, configurable: true
			, writable: false
			, value: function (prop, handler) {
				var oldval = this[prop], newval = oldval
				, getter = function () {
					return newval;
				}
				, setter = function (val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				}
				;
				
				if (delete this[prop]) { // can't watch constants
					Object.defineProperty(this, prop, {
						  get: getter
						, set: setter
						, enumerable: true
						, configurable: true
					});
				}
			}
		});
	}
	 
	// object.unwatch
	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			  enumerable: false
			, configurable: true
			, writable: false
			, value: function (prop) {
				var val = this[prop];
				delete this[prop]; // remove accessors
				this[prop] = val;
			}
		});
	}
}())