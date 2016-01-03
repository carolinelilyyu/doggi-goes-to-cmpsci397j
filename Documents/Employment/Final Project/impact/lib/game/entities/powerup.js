ig.module( 
	'game.entities.powerup' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

PowerUp = ig.Entity.extend({
	type: ig.Entity.TYPE.A,
	size: {x:50, y: 60},
	maxVel : {x:600, y: 0},
	gravityFactor:0,
	
	animSheet: new ig.AnimationSheet('media/powerup.png', 50, 60),
	
	init: function(x,y,settings){
			this.vel.x = -600;
			this.maxVel.x = 600;
			this.maxVel.y = 0;
			this.addAnim('idle', 1, [0], false);
			this.parent(x,y,settings);
	},
	
	update:function(){
		this.parent();
		if(this.pos.x < 0-50){
			this.kill();
		}if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
	},
	
	reset: function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -600;
	},
});

});