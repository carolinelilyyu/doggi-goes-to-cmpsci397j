ig.module( 
	'game.entities.movingdubois' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

MovingDubois = ig.Entity.extend({
    
    size: {x:130, y:200},
    
    animSheet: new ig.AnimationSheet('media/dubois.png', 130, 200),
    
    init: function(x, y, settings){
        
        this.addAnim('background', 1, [0], false);
        this.maxVel.x = 50;	//moves faster than hills
		this.maxVel.y = 0;
        this.vel.x = -50;
		this.parent(x, y , settings); 

    },
    
    update: function(){
        this.parent();
       if(this.pos.x < -ig.system.width){
          this.pos.x = ig.system.width;
        }
		if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
    }
});
	
});