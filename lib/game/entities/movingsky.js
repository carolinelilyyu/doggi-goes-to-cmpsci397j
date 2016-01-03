ig.module( 
	'game.entities.movingsky' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

MovingSky = ig.Entity.extend({ 
    
    size: {x:800, y:600},
    
    animSheet: new ig.AnimationSheet('media/sky.png', 800, 600),
    
    init: function(x, y, settings){
        
        this.addAnim('background', 1, [0], false);
        this.maxVel.x = 20;
		this.maxVel.y = 0;
        this.vel.x = -20;
		this.parent(x, y , settings); 

    },
    
    update: function(){
        this.parent();
       if(this.pos.x < -800){ //once the whole MovingSky is offscreen on the left, bring it back to the right of the screen
          this.pos.x = 800;
        }
		if(ig.game.state == ig.game.GAME_OVER){ //when the game is over, kill it
			this.kill();
		}
    }
});
});