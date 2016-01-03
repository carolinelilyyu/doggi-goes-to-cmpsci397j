ig.module( 
	'game.entities.bird' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

Bird = ig.Entity.extend({
	type: ig.Entity.TYPE.A,
	size: {x: 110, y: 50},	//its real dimensions are 130 x 80. needed to set an offset and smaller size because wanted the hitbox to be smaller for the bird
	offset: {x: 20, y:30},
	maxVel : {x:900, y: 300},
	gravityFactor:0,
	hitbird : false,	//same as hittruck, boolean to let certain methods execute
	
	animSheet: new ig.AnimationSheet('media/bird.png', 130, 80),
	
	init: function(x,y,settings){
			this.vel.x = -900;
			this.maxVel.x = 900;
			this.maxVel.y = 0;
			this.addAnim('idle', 1, [0], false);
			this.parent(x,y,settings);
	},
	
	update:function(){
			if(this.hitbird && this.pos.x < ig.system.width){	//if hitbird is true, it will rotate until offscreen
				this.currentAnim.angle += (this.vel.x > 0) ? 0.1 : -0.1;
			}
		this.parent();
		if(this.pos.x < 0-130){
			console.log("kill bird")
			this.kill();
		}if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
	},
	
	reset: function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -900;
		this.hitbird = false;
		this.currentAnim.angle =0;

	},
});

});