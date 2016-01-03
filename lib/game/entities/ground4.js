ig.module( 
	'game.entities.ground4' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

Ground4 = ig.Entity.extend({	//the long platform. most things spawn basing if ground4 spawns
	animSheet: new ig.AnimationSheet('media/ground4.png', 1644, 80),
	size:{x:1644,y:80},
	offset:{x:0, y:20},	//needed an offset because original picture had extra blank space above the top of the platform
	maxVel : {x:600, y:0},
	type: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,
	gravityFactor : 0,
	
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
		}if(ig.game.state == ig.game.GAME_OVER){
		this.kill();
		}	
		this.parent();


	},
	reset: function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -600;
	
	},
	toString: function(){
		return "ground4";
	},

});
});