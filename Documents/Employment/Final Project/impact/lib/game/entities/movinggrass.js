ig.module( 
	'game.entities.movinggrass' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

MovingGrass = ig.Entity.extend({	//should be similar to sky
    
    size: {x:800, y:600},
    
    animSheet: new ig.AnimationSheet('media/grass.png', 800, 600),
    
    init: function(x, y, settings){
        
        this.addAnim('background', 1, [0], false);
        this.maxVel.x = 20;
		this.maxVel.y = 0;
        this.vel.x = -20;
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