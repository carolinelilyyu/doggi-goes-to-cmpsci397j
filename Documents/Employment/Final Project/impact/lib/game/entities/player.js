ig.module( 
	'game.entities.player' 
)
.requires(
	'impact.font',	//font
	'impact.image',	//allows to insert pictures
	'impact.entity',
	'impact.entity-pool',	//allows for entity pooling
	'impact.sound'	//allows for sound and music
)
.defines(function(){

Player = ig.Entity.extend({	
	animSheet: new ig.AnimationSheet('media/spritesheet.png', (1600/10),200), 
	size : {x:(1600/10), y:200}, 
	ground : false,		//to check if it is touching the floor of the platform
	jumpVel : -600,		//the potential velocity for y when pressing up
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	damping: 1.2,	//smoother jumping. when reaching max y pos when jumping, it will slow down 
	jumpCount : 0,	//prominent for double jump. if the jumpcount is 0, you can press up to jump. the jumpcount gets incremented 1. if jumpcount 1, you can space to double jump
	powerupmode : false,	//this is the mode for the player after getting powerup/milk
	crouching : false,	//if crouching, true
	stun : false,
	hitgroundnormal: false,
	poweruptimer : new ig.Timer(), //gives player special powerup abilities for 5 seconds
	playerhitbird: false, //prominent for the player to spin offscreen towards the left when hitting bird
	
	init: function(x,y,settings){ //different animations
		this.parent(x,y,settings);
		this.addAnim('moving', 0.1, [0,1] , false);
		this.addAnim('jumping', 1, [2], false);
		this.addAnim('sliding', 0.1, [3,4], false);
		this.addAnim('powerupmoving',0.1,[5,6,7,8,9], false);
		this.maxVel.x = (600);
	},
	
	handleMovementTrace: function(res){ //this is to see if it hits the sides of the platform
		this.parent(res);
		if(res.collision.x){
			console.log("hitsides")
			this.vel.y = 0;
			this.vel.x = 0;
		}
	},
	
	
	checkKill: function(){
				this.parent();

		if(this.pos.y > ig.system.height | this.pos.x <-100){	//if it goes out of bounds, it gets killed and game is over
			this.kill();
			ig.game.state = ig.game.GAME_OVER;
		}
	},
	check: function(other){
		if(other instanceof Ground1){
			this.touchedPlatform = true;	//important for jumping later on 
			this.ground = true;		//to show the ground/floor of platform has been touched
		}else if(other instanceof Ground2){
			this.touchedPlatform = true;
			this.ground = true;
		}else if(other instanceof Ground3){
			this.ground = true;
		}else if(other instanceof Ground4){
			this.touchedPlatform = true;
			this.ground = true;
		}
		if(other instanceof Toast){	//toast gives 1 score point
			other.kill();
			ig.game.score+=1;
		}
		if(other instanceof PowerUp){ //calls powerup() method and gets killed afterwards
			  this.powerUp();
			  other.kill();
		}
		if(!this.powerupmode && other instanceof Truck){ //when truck hits, player is "stunned" and is pushed back by the truck to left offscreen
				this.stun = true;
				this.vel.x = 0;
				this.pos.x -= 10;
		}else if(this.powerupmode && other instanceof Truck){ //makes truck spin offscreen towards right
			other.vel.y = -300;
			other.maxVel.y = 300;
			other.vel.x= 1000;
			other.maxVel.x = 1000;
			other.hittruck = true;
		}
		if(!this.powerupmode && other instanceof Bird){ 
			this.playerhitbird = true;	//important condition to get player blown offscreen
			this.vel.x = -600;
			this.vel.y = -600;
		}else if(this.powerupmode && other instanceof Bird){ //blows bird offscreen to right
			other.vel.y = 300; 
			other.maxVel.y = 300;
			other.vel.x= 1000;
			other.maxVel.x = 1000;
			other.hitbird = true;
			
		}
	},
	
	powerUp : function(){ //makes the size of the Player 200 in y now
		this.offset.y = 0; //makes it so offset gets reset to 0
		this.size.y = 200;
		this.powerupmode = true;
		this.poweruptimer.set(5);	//sets 5 seconds to timer (counting from -5, -4, -3,...)
	},
	update: function(){
		if(this.playerhitbird && this.pos.x + this.size.x >= 0){ //player gets blown offscreen to left. put it in update function because update gets called every frame and in check function when Player hits other, anything in that code block gets called once
			this.pos.x-=10;
			this.pos.y -= 10;
				ig.game.player.currentAnim.angle += (ig.game.player.vel.x > 0) ? 0.1 : -0.1;
			}
		if(this.powerupmode && this.poweruptimer.delta()>=0){ //when 5 seconds pass -> -5,-4,-3,-2,-1,0 and it is in powerupmode
			this.powerupmode = false; //powerupmode should be faulse
			this.size.y = 120; //sets back to original size
			this.offset.y = 80;
			this.pos.y += 80;	//since this function only gets called once, setting position of y back to normal mode
		}
		this.checkStationary();	//makes sure player is at same place when just running normally
		this.updateAnims();	//updates animations
		this.checkInputs();	//adds functionality to keys
		this.checkKill();	//out of bouns or not
		this.parent();
	},
	checkStationary: function(){
		if(this.ground){
			this.vel.x = 300;
			this.jumpCount = 0;
		}else if(this.ground == false){
			this.vel.x =0;
		}if(this.vel.y > 0 ){
			this.ground = false;
		}if(!this.ground && !this.stun && !this.playerhitbird){
			this.pos.x = 100
		}
	},
	updateAnims: function(){
		if(this.powerupmode){
			this.currentAnim = this.anims.powerupmoving;
		}
		else{
			if(ig.input.state('up')){
				this.currentAnim = this.anims.jumping;
			}else if(!this.ground){
				this.currentAnim = this.anims.jumping;
			}else if(ig.input.state('down')){
				this.currentAnim = this.anims.sliding;
			}else{
				this.currentAnim = this.anims.moving;
			}
		}
	},

	checkInputs: function(){ 
		if(ig.input.state('up') && (this.jumpCount==0)){ //allows a jump
			this.vel.y = this.jumpVel;
			this.ground = false;
			this.jumpCount = 1;
		}		
		if(ig.input.state('space') && (this.touchedPlatform==true) && (this.jumpCount==1)){ //if jumped already, you can double jump
			this.vel.y = this.jumpVel/2; //can only be half of y vel, don't want to go too high
			this.jumpCount = 0; //resets jumpcount
			this.touchedPlatform = false;		
		}
		if(!ig.input.state('up') && (this.ground==false) && (this.vel.y < 0)){
			this.vel.y = (this.vel.y)/this.damping;
		}if(ig.input.state('down') && !this.crouching && this.ground && !this.powerupmode){
			this.offset.y = 160; 
			this.size.y = 40;	//size for crawling
			this.pos.y +=80;	//makes position right on top of floor of patform
			this.crouching = true;	//crouching is true
			this.hitgroundnormal = false; //its not normal and it didn't hit the ground
		}
		else if(!ig.input.state('down') && !this.hitgroundnormal &&!this.powerupmode){
		this.crouching=false;	//changes size
		
		if(this.size.y == 40){	//if previous was crawling
				this.pos.y -= 80
		}else{
			this.pos.y += 80;
		}
		this.size.y = 120;
		this.offset.x = 30;
		this.size.x = 100;
		this.offset.y = 80;
		this.hitgroundnormal = true;
		}
	},
	

});
});