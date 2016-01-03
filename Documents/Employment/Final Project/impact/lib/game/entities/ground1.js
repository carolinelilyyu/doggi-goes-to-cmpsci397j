ig.module( 
	'game.entities.ground1' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){


Ground1 = ig.Entity.extend({	//one of the short platforms (same with ground 2 and 3)
	animSheet: new ig.AnimationSheet('media/ground1.png', 548, 80),
	size:{x:548,y:80},
	offset: {x:0, y: 20},
	maxVel : {x:600, y:0},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED, //when player collides with platform, it is stationary
	gravityFactor : 0,
	isItAlive : false,
	
	init:function(x,y,settings){
		this.addAnim('idle', 1, [0], false);
		this.maxVel.x = 600;
		this.maxVel.y = 0;
		this.vel.x = -600;
		this.parent(x,y,settings);
	},
	update:function(){ 
		if(this.pos.x + this.size.x < 0){
			this.kill();
			this.isItAlive = false;
		}if(ig.game.state == ig.game.GAME_OVER){
		this.kill();
		this.isItAlive = false;
		}	
		this.parent();
	},
	reset:function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -600;

	},
	
	toString: function(){	//just in case i wanted to object match in spawning entities like Truck and Bird (scroll down to GAME state in MyGame)
		return "ground1";
	},
	
});


});