ig.module( 
	'game.entities.toast' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

Toast = ig.Entity.extend({	//functions like coins
	type: ig.Entity.TYPE.A, //player checks against type A
    size: {x:30, y:30},
	offset: {x:20, y: 20},
	maxVel : {x:600, y:0},
	gravityFactor: 0,	//gravity shouldn't play any role onto toast
    
    animSheet: new ig.AnimationSheet('media/toast.png', 50, 50),
    
    init: function(x, y, settings){
		this.vel.x = -600;		//moves at -600 velocity so it moves along with the platform. Technically -600 x velocity but it looks like its stationary
		this.maxVel.x = 600;
		this.maxVel.y = 0;	//shouldn't be moving in y direction
        this.addAnim('idle', 1, [0], false);
		this.parent(x, y , settings); 
    },
    
    update: function(){
        this.parent();
       if(this.pos.x < (0-50)){
          this.kill();
        }
		if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
    },
	reset:function(x,y,settings){
		this.parent(x,y,settings);
		this.vel.x = -600;	//sets the x vel to -600 when pooled in
	},
});

});