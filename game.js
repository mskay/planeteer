var game;

// groups containing crates and planets

var crateGroup;
var planetGroup;
var martian;
var cursors;
var music;
// a force reducer to let the simulation run smoothly

var forceReducer = 0.005;

// graphic object where to draw planet gravity area

var gravityGraphics;

window.onload = function() {	
	game = new Phaser.Game(1000, 600, Phaser.AUTO, "");
    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");
}
	
var playGame = function(game){};

playGame.prototype = {
	preload: function(){
		game.load.image("crate", "crate.png");
		game.load.image("planet", "planet.png");
		game.load.image("bigplanet", "bigplanet.png"); 
		game.load.image("martian", "astronaut.png"); 
		//game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

		game.load.audio('tunes', 'Indian_Summer.mp3');
	},
  	create: function(){
  		
  		// adding groups
  		music = game.add.audio('tunes');
  		music.volume = 1;
		music.play();
		
  		crateGroup = game.add.group();
  		planetGroup = game.add.group();
  		martianGroup = game.add.group();
		// adding graphic objects
		
		gravityGraphics = game.add.graphics(0, 0);
    		gravityGraphics.lineStyle(2,0xffffff,0.5);
  		
		// stage setup
		
		game.stage.backgroundColor = "#222222";
		
		// physics initialization
		
		game.physics.startSystem(Phaser.Physics.BOX2D);
    		
		// adding a couple of planets. Arguments are:
		// x position
		// y position
		// gravity radius
		// gravity force
		// graphic asset
    		
		addPlanet(190, 200, 250, 450, "planet");
    	addPlanet(680, 350, 320, 600, "bigplanet");
		

		
		// waiting for player input
    		
    	cursors = game.input.keyboard.createCursorKeys();
    	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

		game.input.onDown.add(addCrate, this);


	    var martian = game.add.sprite(500, 150, "martian");
	martianGroup.add(martian);
    	game.physics.box2d.enable(martian);
    	martian.body.collideWorldBounds=true;
    	
	},
	update: function(){
		
		// looping through all crates
		

		for(var i=0;i<crateGroup.total;i++){	
			var c = crateGroup.getChildAt(i);
			
			// looping through all planets
			
			for(var j=0;j<planetGroup.total;j++){ 
				var p = planetGroup.getChildAt(j);
				
				// calculating distance between the planet and the crate
				
				var distance = Phaser.Math.distance(c.x,c.y,p.x,p.y);
				forceReducer = 0.005;
				// checking if the distance is less than gravity radius
				
				if(distance<p.width/2+p.gravityRadius/2){
					
					// calculating angle between the planet and the crate
					
					var angle = Phaser.Math.angleBetween(c.x,c.y,p.x,p.y);
					
					// add gravity force to the crate in the direction of planet center
					
					c.body.applyForce(p.gravityForce*Math.cos(angle)*forceReducer,p.gravityForce*Math.sin(angle)*forceReducer);
				}
			}
		}
		
		for(var i=0;i<martianGroup.total;i++){	
			var m = martianGroup.getChildAt(i);
			
			game.debug.spriteInfo(m, 32, 32);
			// looping through all planets
			
			for(var j=0;j<planetGroup.total;j++){ 
				var p = planetGroup.getChildAt(j);
				
				// calculating distance between the planet and the crate
				
				var distance = Phaser.Math.distance(m.x,m.y,p.x,p.y);
				
				
				// checking if the distance is less than gravity radius
				
				if(distance<p.width/2+p.gravityRadius/2){
					
					game.debug.text(distance,60,400);
					game.debug.text(m.angle,60,600);
					game.debug.text(p.width,60,500);
					// calculating angle between the planet and the crate
					
					var angle = Phaser.Math.angleBetween(m.x,m.y,p.x,p.y);
					//m.anchor.x = Math.cos(angle);
					//m.anchor.y = Math.sin(angle);
					//m.body.rotation = angle;
					m.body.rotation = angle + 4.7;
					// add gravity force to the crate in the direction of planet center
					game.debug.text(m.body.rotation,400,500);
					game.debug.text(m.body.angle,400,550);
					m.body.applyForce(p.gravityForce*Math.cos(angle)*forceReducer,p.gravityForce*Math.sin(angle)*forceReducer);
				}

				if (cursors.left.isDown) {
			        //  Move to the left
			        if (p.width == 250) {
			        	if (distance < 150) {
					        if (m.body.angle >= -60 && m.body.angle <= 60) {
			        			m.body.velocity.x = -100;
			        		} else if (m.body.angle > 60 && m.body.angle <= 120) {
			        			m.body.velocity.y = -100;

			        		} else if (m.body.angle > 120 && m.body.angle <= 180) {
			        			m.body.velocity.x = 100;

			        		} else if (m.body.angle > -180 && m.body.angle <= -90) {
			        			m.body.velocity.x = 100;
			        			m.body.velocity.y = 100;
			        		} else if (m.body.angle > -90 && m.body.angle <= -60) {
			        			m.body.velocity.x = -100;
			        		} 
					        //m.body.velocity.x = 100;
					        //m.body.angularVelocity = 0;
				    	} else if (distance > 150) {
				    		m.body.angularVelocity = -2;
				    	}
			        } else if (p.width == 180) {
			        	if (distance < 112) {
					        m.body.velocity.x = -100;
					        m.body.angularVelocity = 0;
				    	} else if (distance > 112) {
				    		m.body.angularVelocity = -2;
				    	}
			        }
			        
			       // player.animations.play('left');
			    } else if (cursors.right.isDown) {
			        //  Move to the right
			        if (p.width == 250) {
			        	if (distance < 150) {
			        		if (m.body.angle >= -60 && m.body.angle <= 40) {
			        			m.body.velocity.x = 120;
			        		} else if (m.body.angle > 40 && m.body.angle <= 120) {
			        			m.body.velocity.y = 120;

			        		} else if (m.body.angle > 120 && m.body.angle <= 180) {
			        			m.body.velocity.x = -120;

			        		} else if (m.body.angle > -180 && m.body.angle <= -120) {
			        			m.body.velocity.x = -120;
			        			m.body.velocity.y = -120;

			        		} else if (m.body.angle > -120 && m.body.angle <= -40) {
			        			m.body.velocity.y = -120;

			        		} else if (m.body.angle > -90 && m.body.angle <= -60) {
			        			m.body.velocity.x = 120;
			        		} 
					        
					        m.body.angularVelocity = 0;
				    	} else if (distance > 150) {
				    		m.body.angularVelocity = 2;
				    	}
			        } else if (p.width == 180) {
			        	if (distance < 112) {
					        m.body.velocity.x = 100;
					        m.body.angularVelocity = 0;
				    	} else if (distance > 112) {
				    		m.body.angularVelocity = 2;
				    	}
			        }
			        //martian.animations.play('right');
			    } else {
			    	//m.body.angularVelocity = 0;
			    }
			    
			    //  Allow the player to jump if they are touching the ground.
			    //if (cursors.up.isDown && player.body.touching.down) {
			    if (cursors.up.isDown) {

			    }

			    // jetpack
			    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			    	m.body.velocity.x = Math.sin(m.body.angle) * 100;
			    	m.body.velocity.y = Math.cos(m.body.angle) * 100;
			    }
			}
		}
		
	},
	render: function() {

	}
	
}

// function to add a crate

function addCrate(e){	
	var crateSprite = game.add.sprite(e.x, e.y, "crate");
	crateGroup.add(crateSprite);
    	game.physics.box2d.enable(crateSprite);
}

// function to add a planet

function addPlanet(posX, posY, gravityRadius, gravityForce, asset){
	var planet = game.add.sprite(posX, posY, asset);
	planet.gravityRadius = gravityRadius;
	planet.gravityForce = gravityForce
	planetGroup.add(planet);
	game.physics.box2d.enable(planet);
	planet.body.static = true;
	
	// look how I create a circular body
	planet.body.setCircle(planet.width / 2);
	gravityGraphics.drawCircle(planet.x, planet.y, planet.width+planet.gravityRadius);
}