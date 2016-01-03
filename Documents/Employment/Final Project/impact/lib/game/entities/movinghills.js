ig.module( 
	'game.entities.movinghills' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

MovingHills = ig.Entity.extend({	
    
    size: {x:800, y:600},
    
    animSheet: new ig.AnimationSheet('media/hills.png', 800, 600),
    
    init: function(x, y, settings){
        
        this.addAnim('background', 1, [0], false);
        this.maxVel.x = 30;	//hills move at faster x speed because they are closer in view
		this.maxVel.y = 0;
        this.vel.x = -30;
		this.parent(x, y , settings); 

    },
    
    update: function(){
        this.parent();
       if(this.pos.x < -800){
          this.pos.x = 800;
        }
		if(ig.game.state == ig.game.GAME_OVER){
			this.kill();
		}
    }
});
});