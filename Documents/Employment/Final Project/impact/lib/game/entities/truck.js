ig.module( 
	'game.entities.truck' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'//allows for sound and music
)
.defines(function(){

Truck = ig.Entity.extend({
	type: ig.Entity.TYPE.A,	
	size: {x:300, y: 140},
	maxVel : {x:1000, y: 600},	//maxvel is 1000 in x just because if in powerupmode and if you hit the truck, the maxVel would be 1000 and vel would be -1000 (opposite direction)
	gravityFactor:0,
	hittruck : false,	//in the check function for Player, hittruck is updated to truck when hit with truck and one of the conditions in truck's update function would happen 
	
	animSheet: new ig.AnimationSheet('media/truck.png', 300, 190),
	
	init: function(x,y,settings){
			this.vel.x = -600;		//makes truck look stationary, but actually moving same vel as platform
			this.maxVel.x = 600;
			this.maxVel.y = 0;
			this.addAnim('idle', 1, [0], false);
			this.parent(x,y,settings);
	},
	
	update:function(){
		this.parent();
		if(this.hittruck && this.pos.x < ig.system.width){	//if it was hit, the truck will rotate until it goes offscreen
			this.currentAnim.angle += (this.vel.x > 0) ? 0.1 : -0.1;
		}
		if(this.pos.x < 0-300){
			this.kill();
		}if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
	},
	
	reset: function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -600;
		this.hittruck = false;		//when pooled back in, hittruck is false again
		this.currentAnim.angle =0;	//when pooled back in, sets angle back to way it was so it wont keep spinning


	},
});

});