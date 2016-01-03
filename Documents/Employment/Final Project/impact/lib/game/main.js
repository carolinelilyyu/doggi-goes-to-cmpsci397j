ig.module( 
	'game.main' 
)
.requires(
	'impact.game',	//allows for game
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound',	//allows for sound and music
	'impact.debug.debug',
	'game.entities.movingsky',
	'game.entities.movinggrass',
	'game.entities.movinghills',
	'game.entities.movingdubois',
	'game.entities.toast',
	'game.entities.truck',
	'game.entities.powerup',
	'game.entities.bird',
	'game.entities.ground1',
	'game.entities.ground2',
	'game.entities.ground3',
	'game.entities.ground4',
	'game.entities.player'
)
.defines(function(){

MyGame = ig.Game.extend({
	font : new ig.Font('media/score.font.png'),
	highscore : 0,
	score: 0,
	title: new ig.Image('media/title.png'),
	background : new ig.Image('media/background.png'),
	transparentbox : new ig.Image('media/transparentbox.png'),
	instructionsbackground : new ig.Image('media/instructions.png'),
	gameoverbackground : new ig.Image('media/gameover.png'),
	gameoverwords : new ig.Image('media/gameoverwords.png'),
	music : new ig.Sound('media/music.*'),
	doggi : new ig.Image('media/titledoggi.png'),
	clearColor: null, //canvas gets cleared after we draw background image
	gravity: 100, 
	state: 0, //state keeps track of which state: menu, nstructions, credits, game, and game over/ starts off on menu
	MENU : 0, 
	INSTRUCTIONS: 1,
	CREDITS : 2,
	GAME: 3,
	GAME_OVER: 4,
	currentPlatform: null,	//make currentPlatform public within class for other methods to use
	yPos : 0,	//make yPos public within class for other methods to use
	xSpace: 0,	//make xSpace public within class for other methods to use
	initialPlatform: null,	//make initialPlatform public within class for other methods to use. initialPlatform is the platform the player is on when player is spawned
	player:null,	//public variable for other methods and classes to use
	
	init:function(){
		if(this.state== this.MENU){
			this.music.play();
		}
		ig.EntityPool.enableFor(Ground1);
		ig.EntityPool.enableFor(Ground2);
		ig.EntityPool.enableFor(Ground3);
		ig.EntityPool.enableFor(Ground4);
		ig.EntityPool.enableFor(Toast);
		ig.EntityPool.enableFor(Truck);
		ig.EntityPool.enableFor(PowerUp);
		ig.EntityPool.enableFor(Bird);



		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.SPACE, 'space');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind(ig.KEY.BACKSPACE, 'back');
	},
	
	update:function(){
		switch(this.state){
			case this.MENU:
			console.log("in menu");
				if(ig.input.state('space')){
					this.startGame();
				}if(ig.input.state('up')){
					this.state = this.INSTRUCTIONS;
				}if(ig.input.state('down')){
					this.state = this.CREDITS
				}
				break;
			case this.INSTRUCTIONS:
				if(ig.input.state('space')){
					this.startGame();
				}
				break;
			case this.CREDITS:
				if(ig.input.state('space')){
					this.startGame();
				}
				break;
			case this.GAME:
			console.log(this.initialPlatform.isItAlive);
				if(this.currentPlatform != null && this.currentPlatform.pos.x <= ig.system.width){
						this.yPos= (Math.random() * this.currentPlatform.size.y+80) + ig.system.height-(this.currentPlatform.size.y*2)-60;
					if(this.currentPlatform.toString()!=("ground4")){
							this.xSpace = (Math.random())*(ig.system.width/2) + (ig.system.width*2);//more range for xSpace if the ground spawned is 4
						}else{
							this.xSpace = (Math.random())*(ig.system.width/2) + (ig.system.width*3.5);//less range for xSpace if the ground spawned is 4
						}
						for(i = ig.system.width+this.currentPlatform.size.x; i<this.xSpace; i+=100){
							this.spawnEntity(Toast, i, this.yPos-100);
						}
						this.currentPlatform = this.spawnObject(); //this updates currentPlatform with whatever returned from spawnObject	
						
						if(Math.random()<1/4 && /*!this.player.powerupmode && */this.currentPlatform.toString() != "ground4"){//1/4 chance of spawning powerup
							this.spawnEntity(PowerUp, this.xSpace + Math.random() * 500, this.yPos-60);
						}
						if(Math.random()<3/6 && this.currentPlatform.toString() == "ground4"){	//trucks spawn only on ground 4. ground 4 is spawned way offscreen on the right of screen
							this.spawnEntity(Truck, this.xSpace + Math.random() * 700 + 300, this.yPos-190)
						}						
						else if(this.currentPlatform.toString() == "ground4"){	//birds only get spawn on ground 4
								if(Math.random()<1/2){
									this.spawnEntity(Bird, this.xSpace + Math.random() + 2650, this.yPos-120);
								}else{
									this.spawnEntity(Bird, this.xSpace + Math.random() + 2650, this.yPos-30);
								}
						}
				}
		
				break;
			case this.GAME_OVER:
				if(this.score> this.highscore){ //updates high score
				this.highscore = this.score;
				}
				if(ig.input.state('space')){ //restarts game if press space
					this.startGame(); 
				}
				if(ig.input.state('back')){ //goes to menu if press back
					this.state = this.MENU;
				}
				break;
		}			
		this.parent();

	},
	
	startGame: function(){ //initializes everything in starting game
		this.state = this.GAME;
		this.score = 0;	
		this.spawnEntity(MovingSky,0,0);
		this.spawnEntity(MovingSky, ig.system.width, 0);
		this.spawnEntity(MovingHills,0,0);
		this.spawnEntity(MovingHills,ig.system.width,0);
		this.spawnEntity(MovingDubois, ig.system.width, ig.system.height-300);
		this.spawnEntity(MovingGrass, 0,0);
		this.spawnEntity(MovingGrass, ig.system.width, 0);
		this.player = this.spawnEntity(Player, 100, ig.system.height - 200); //sets player to public variable so other methods use it
		this.initialPlatform = this.spawnEntity(Ground1, 0 ,ig.system.height-80) //initialPlatform is platform so player can spawn on a platform 
		this.initialPlatform.isItAlive = true;
		this.yPos = Math.random() * 80 + ig.system.height-80-80; 
		this.xSpace = (Math.random())*(ig.system.width/2) + (ig.system.width);
		for(i = 0+this.initialPlatform.size.x; i<this.xSpace; i+=100){	//puts toast between each space in the platforms
				this.spawnEntity(Toast, i, this.yPos-100);
		}
		this.currentPlatform = this.spawnEntity(Ground2, this.xSpace ,this.yPos);
	},
	
	spawnObject: function(){
		var whichPlatform= Math.random();
		if(whichPlatform<(2/3)){
			return this.spawnEntity(Ground4, this.xSpace ,this.yPos); //uses public variable of xSpace and yPos. More likely to spawn Ground4
		}else if(whichPlatform<(7/9)){
			return this.spawnEntity(Ground1, this.xSpace ,this.yPos); //uses public variable of xSpace and yPos
		}else if(whichPlatform<(8/9)){
			return this.spawnEntity(Ground2, this.xSpace ,this.yPos); //uses public variable of xSpace and yPos
		}else{
			return this.spawnEntity(Ground3, this.xSpace, this.yPos); //uses public variable of xSpace and yPos
		}
	},
	
	draw(){
		this.parent();
		switch(this.state){
			case this.MENU:
				this.background.draw(0,0);
				this.title.draw(150, 50);
				this.transparentbox.draw(180,285);
				this.doggi.draw(550,200);
				this.font.draw("Press 'SPACE' to start!\nPress 'UP' for instructions!\nPress 'DOWN' for credits!\nHIGH-SCORE: " + this.highscore, ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
				break;
			case this.INSTRUCTIONS:
				this.instructionsbackground.draw(0,0);
				this.font.draw("Good morning Doggi! You're going to be late to \nclass again?! Maneuver your way through UMass \nto get to COMPSCI 397J!\n\nINSTRUCTIONS:\nJump on the platforms, collect 'toast' to get a\nhigher score, and gather 'milk' to gain special\nabilities. Dodge pesky geese by jumping and sliding.\nSlip under foodtrucks by crawling! There is no time\nlimit, so try to beat that high score! Avoid getting\nblown off the sides of the screen!\n\nCONTROLS:\n'UP' (Hold) : Jump (Higher)\n'UP' + 'SPACE' (Hold) : Double Jump (Higher)\n'DOWN' : Crawl", 50, 50, ig.Font.ALIGN.LEFT);
				this.font.draw(">>Press SPACE to start!", 450, 550);
				break;
			case this.CREDITS:
				this.instructionsbackground.draw(0,0);
				this.font.draw("MUSIC:\n'Bossa Nova' - Rhythm Heaven Fever\n\nART:\nSky, Grass - Pokemon Ruby/Sapphire\nPlatforms - CaptainToog\nOther stuff - Me! :D Caroline Yu\n\nGAME ENGINE:\nImpactJS",50,50,ig.Font.ALIGN.LEFT);
				this.font.draw(">>Press SPACE to start!", 450, 550);

				break;
			case this.GAME:
				this.font.draw("SCORE: " + this.score + "\nHIGH-SCORE: " + this.highscore, 0, 0);
				break;
			case this.GAME_OVER:
				this.gameoverbackground.draw(0,0);//might change to black
				this.gameoverwords.draw(250,150);
				this.font.draw("FINAL SCORE: " + this.score + "\nHIGH-SCORE: " + this.highscore + "\nPress 'SPACE' to restart\nPress 'BACKSPACE' for main menu", ig.system.width/2, ig.system.height/2-50, ig.Font.ALIGN.CENTER);
				break;
		}
	},
	
	
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
