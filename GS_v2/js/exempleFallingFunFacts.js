// VARIABLES
var quadsGlobal = null;
var s = 100;
var marges = 15;
// TYPO SIZE et LINE HEIGHT - 25
var typoSizeGlobal = 25;
var lineHeightGlobal = 25;
//
var nbrMaxGlobal = 15;
var soundsOpen = [];
var ctSound = 0;
var appearsOpen = false;
var margeFiltreGlobal = 20;
var FrameAppearsGLobal = 5;
var autoGlobal = false;
var nextWave = 0;
// TAILLE FERMEE
var diviseurSizeGlobal = 1.4;
var globalMargeAppear = 2;
var wallsLR = false;
var mJX = 0;
var mJY = 0;
//
var x = 0, y = 0, vx = 0, vy = 0, ax = 0, ay = 0;
//
function InitCanvas() {
	//alert(GetOneFact());
	// MOUSE MOVE UPDATE
	$(window).mousemove(function(e){
      mJX = e.pageX;
      mJY = e.pageY;
   });
   //
	$(window).resize(function() {
		quadsGlobal.resize();
		quadsGlobal.setWalls();
	});
	// TRANSFORM TO JQUERY
	/*
	window.ondeviceorientation = function(event) {
		//BETA USEFULL MIAM MIAM
		if(event.beta != null && quadsGlobal != null) {
			quadsGlobal.changeGravity(event.gamma	);
			$("#trace").html("##:   "+Math.round(event.alpha)+"   "+Math.round(event.beta)+"   "+Math.round(event.gamma));
		}
	}*/
	var ua = navigator.userAgent.toLowerCase();
	//
	if (window.DeviceMotionEvent != undefined && (ua.indexOf("iphone")>=0 || ua.indexOf("ipad")>=0)) {
		//alert("MIAM A CHANGER LES ORIENTATIONS");
		window.ondevicemotion = function(e) {
			ax = (event.accelerationIncludingGravity.x * 1);
			ay = (event.accelerationIncludingGravity.y * 1);
			//var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
			if (window.orientation == 0) {
				vx = ax;
				vy = ay;
			} else if (window.orientation == 90) {
				vy = ax;
				vx = -ay;
			} else if (window.orientation == 180) {
				vy = ay;
				vx = -ax;
			} else if (window.orientation == -90) {
				vy = ax;
				vx = ay;
			}
			vy = Math.abs(vy)*-1;
			vx*=50;
			vy*=50;
		}
		setInterval("setGrav()", 50);
	}
	// 0 bas
	// 90 gauche
	//
	
	// -- SPECIFIC CLICK IPAD !!
	//var ua = navigator.userAgent,
    //event = (ua.match(/iPad/i)) ? "touchstart" : "click";
    //$(window).bind(event, function(e) {
    	//alert(e.targetTouches[0]);
    	//quadsGlobal.intersect(e.clientX, e.clientY);
	//});
	if(ua.match(/iphone/) || ua.match(/ipad/)) {
		//alert("JE SUIS UN APPAREIL DE MERDE"); <3
		document.addEventListener("touchstart", function(e){
			//alert("FUCK");
    		//startX = e.touches[0].pageX;
    		//startY = e.touches[0].pageY;
    		quadsGlobal.intersect(e.touches[0].pageX, e.touches[0].pageY);
    		e.preventDefault();//Stops the default behavior
		}, false);
	} else {
		// SI C'EST AUTRE CHOSE
		$(document).click(function(e) {
			quadsGlobal.intersect(e.pageX, e.pageY);
			quadsGlobal.addJoint(e.pageX, e.pageY);
		});
	}
	for(var l=0; l<10; l++) {
		var n = Math.floor(Math.random()*3+1);
		soundsOpen.push(new Audio("open"+n+".wav"));
	}
	$("#keyword").keyup(function() {
		var keyword = $(this).val().toLowerCase();
		quadsGlobal.deleteByWord(keyword);
	});
	//
	quadsGlobal = new Quads();
}
function setGrav() {
			quadsGlobal.changeGravityXY(vx, -vy);
			//$("#trace").html("##:   "+vx+"  "+vy+" (((((( "+window.orientation+" ### ");
}
function playSoundOpen() {
	if(ctSound>=soundsOpen.length) {
		ctSound = 0;
	}
	soundsOpen[ctSound].play();
	ctSound++;
}
function playSoundClose() {
	// INUTILISE POUR L'INSTANT
}
// ------------------------------------------------------- OBJET QUADS
function Quads() {
	this.setup();
	this.resize();
	this.createWorld();
	this.tick();
}
Quads.prototype.setup = function() {
	//
	this.timeElapsed = 0;
	this.fps = 60;
	this.drawables = [];
	this.walls = [];
	this.joint;
	//
	this.canvas = $('#canvas');
	this.ctx = $('#canvas').get(0).getContext('2d');
	//resize to correct size
}
//
Quads.prototype.resize = function() {
	//var canvas = this.canvas;
	//Set the canvas dimensions to match the window dimensions
	var w = window.innerWidth;
	var h = window.innerHeight;
	//alert(w+" : "+h);
	this.canvas.width(w);
	this.canvas.height(h);
	this.canvas.attr('width' , w);
	this.canvas.attr('height' , h);
	this.w = w;
	this.h = h;
	//
	this.ctx.font = typoSizeGlobal+"px font";
	this.ctx.fillStyle = "white";
	this.ctx.textBaseline = "top";
	// WORLD CREATION
	//alert(this.ctx);
	//this.ctx.fillRect(0,0,600,600);
	/*
	this.ctx.beginPath();
 	this.ctx.strokeStyle='green'; 
 	this.ctx.moveTo(20,100);
 	this.ctx.lineTo(200,10);
 	this.ctx.stroke();*/
 	//alert("BOBN");
}
Quads.prototype.deleteByWord = function(keyword) {
	var cnt = 0;
	for(var m=0; m<this.drawables.length; m++) {
		if(this.drawables[m].clickable == true) {
			var tstFact = this.drawables[m].text.toLowerCase();
			//alert(tstFact);
			if(tstFact.indexOf(keyword)==-1) {
				this.drawables[m].alive = false;
				cnt++;
			}
		}
	}
	if(cnt > 0) {
		playSoundOpen();
	}
}
// JOINT SOURIS PAS REUSSI
Quads.prototype.addJoint = function(mx, my) {
	var p = new b2Vec2(mx/s, my/s);
	for(var m=0; m<this.drawables.length; m++) {

		if(this.drawables[m].clickable == true) {
			var fixt = this.drawables[m].fixt;
			var shap = fixt.GetShape();
			var body = this.drawables[m].body;
			var bool = shap.TestPoint(body.GetTransform(), p);
			//
			if(bool) {
				var the_joint = new b2DistanceJointDef();
				
			alert("g");
				the_joint.Initialize(this.mouser, body,p);
        		the_joint.collideConnected=true;
        		this.joint=box2dWorld.CreateJoint(the_joint);
        		
			}
		}
	}
}
Quads.prototype.delJoint = function() {
    if (joint) {
        m_world.DestroyJoint(this.joint);
        this.joint=null;
    }
}
Quads.prototype.intersect = function(mx, my) {
	//alert(mx+" "+my);
	var p = new b2Vec2(mx/s, my/s);
	//
	for(var m=0; m<this.drawables.length; m++) {
		if(this.drawables[m].clickable == true) {
			//alert(i);
			var fixt = this.drawables[m].fixt;
			//alert(this.drawables[m].fixt);
			var shap = fixt.GetShape();
			//alert(fixt.GetBody().GetTransform());
			var body = this.drawables[m].body;
			var bool = shap.TestPoint(body.GetTransform(), p);
			//alert(bool);
			if(bool) {
				if(this.drawables[m].open == false) {
					this.drawables[m].openText();
					playSoundOpen();
				} else {
					this.drawables[m].alive = false;
					playSoundOpen();
				}
			}
		}
	}
	
}
Quads.prototype.addSquare = function() {
	//alert("AJOUTE");
	var keyword = $("#keyword").val().toLowerCase();
	if(keyword == "search") {
		keyword = "";
	}
	//alert(keyword);
	var fact = GetOneFact(keyword);
	var phrase = fact[0];
	var tagsIn = fact[1];
	var tagsNumIn = fact[2];
	var howLong = phrase.length*5;
	//phrase = "It was the accepted practice in Babylon 4,000 years ago that for a month after the wedding, the bride's father would supply his son-in-law with all the mead he could drink. Mead is a honey beer and because their calendar was lunar based, this period was called the honey month or what we know today as the honeymoon.";
	//phrase = "s h d q w kd";
	// SI LA RECHERCHE N'A RIEN DONNE, N'ENVOIE PLUS RIEN
	if(phrase != "") {
		var nSq = new Square({parent:this, text:phrase, tags:tagsIn, tagsNum:tagsNumIn});
		if(appearsOpen) {
			nSq.openText();
		}
		this.drawables.push(nSq);
	}
	return howLong;
}
Quads.prototype.changeGravity = function(angle) {
	var ngravity = new b2Vec2(Math.cos(angle)*100, Math.sin(angle)*100);
	this.box2dWorld.SetGravity(ngravity);
}
Quads.prototype.changeGravityXY = function(_x, _y) {
	var ngravity = new b2Vec2(_x, _y);
	this.box2dWorld.SetGravity(ngravity);
}
Quads.prototype.createWorld = function() {
	//10m/s2 downwards, cartesian coordinates remember - we shall keep slightly lesser gravity
	var gravity = new b2Vec2(0, 100);
	/*
		very important to do this, otherwise player will not move.
		basically dynamic bodies trying to slide over static bodies will go to sleep
	*/
	var world = new b2World(gravity , true);
	//save in global object
	this.box2dWorld = world;
	//
	//
	//
	this.setWalls();
	this.mouser = new Mouser({parent:this});
}
Quads.prototype.setWalls = function() {
	if(this.walls.length>0) {
		for(var k=this.walls.length-1; k>=0; k--) {
			this.walls[k].alive = false;
		}
	}
	// posX posY sizeX sizeY
	
	if(wallsLR == true) {
		this.walls.push(new Sol({parent:this}, (this.w/2)/s, this.h/s, (this.w/2)/s, 1/s));
		this.walls.push(new Sol({parent:this}, (0)/s, (this.h/2)/s, 1/s, (this.h/2)/s));
		this.walls.push(new Sol({parent:this}, (this.w)/s, (this.h/2)/s, 1/s, (this.h/2)/s));
	} else {
		this.walls.push(new Sol({parent:this}, (this.w/2)/s, this.h/s, (this.w/2.5)/s, 1/s));
	}
}
// TICK TACK TICK TACK TICK TACK
Quads.prototype.tick = function() {
	this.timeElapsed++;
	if(!autoGlobal) {
		if(this.timeElapsed%FrameAppearsGLobal == 0 && this.drawables.length<=nbrMaxGlobal) {
			this.addSquare();
		}
	} else {
		if(this.timeElapsed>nextWave && this.drawables.length<=nbrMaxGlobal) {
			//alert(this.drawables.length);
			if(this.drawables.length>0) {
				for(var k=this.drawables.length-1; k>=0; k--) {
					if(this.drawables[k].clickable == true) {
						playSoundOpen();
						this.drawables[k].alive = false;
					}
				}
			}
			nextWave += this.addSquare();
		} 
	}
	document.title = this.drawables.length+"/400 FUN FACTS";
	// STEP
	//Step the box2d engine ahead
	this.box2dWorld.Step(1/120, 10, 10);
	this.box2dWorld.ClearForces();
	//alert("d");
	// DRAW
	//
	this.ctx.fillStyle = 'white';
	this.ctx.fillRect(0, 0, this.w, this.h);
	this.ctx.fillStyle = 'black';
	// DELETION
	//$("#trace").html(this.drawables.length);
	if(this.drawables.length>0) {
		for(var k=this.drawables.length-1; k>=0; k--) {
			//alert("VA CREVER JAVASCRIPT");
			//$("#trace").html(k);
			if(this.drawables[k].alive == false) {
			//alert("FDEEJI");
				this.drawables[k].closeText();
				this.box2dWorld.DestroyBody(this.drawables[k].body);
				this.drawables.splice(k, 1);
			}
		}
	}
	if(this.walls.length>0) {
		for(var k=this.walls.length-1; k>=0; k--) {
			//alert("VA CREVER JAVASCRIPT");
			//$("#trace").html(k);
			if(this.walls[k].alive == false) {
			//alert("FDEEJI");
				this.box2dWorld.DestroyBody(this.walls[k].body);
				this.walls.splice(k, 1);
			}
		}
	}
	//
	for(var i in this.drawables) {
		this.drawables[i].draw();
	}
	this.mouser.updatePos();
	this.mouser.draw();
	//
	//$('#trace').html(this.timeElapsed);
	// END OF TICK, RELAUNCH
	var that = this;
	this.timer = setTimeout( function() { that.tick(); }, 1000/this.fps);
}
function Mouser(o) {
	this.parent = o.parent;
	this.ctx = this.parent.ctx;
	alert(this.parent.box2dWorld);
	var fixDef = new b2FixtureDef();
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsBox(5, 5);
	fixDef.density = 1.0;
	fixDef.restitution = 0.1;
	fixDef.friction = 0.8;
	var bodyDef = new b2BodyDef();
	bodyDef.position.x = 0;
	bodyDef.position.y = 0;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.damping = 0;
	//
	var body = this.parent.box2dWorld.CreateBody(bodyDef);
	//var fixt = body.CreateFixture(fixDef);
	this.body = body;
	//this.fixt = fixt;
}
Mouser.prototype.updatePos = function() {
	var vel = new b2Vec2(100, 100);
	//this.body.SetLinearVelocity(1, 1);
	this.body.SetTransform(vel, 0);
	//this.body.position.set(100, 100);
	//this.body.syncTransform(p, 0);
	//this.position.y = mJY;
	//alert(mJX);
}
Mouser.prototype.draw = function() {
	this.ctx.save();
	this.ctx.fillRect(0, 0, 50, 50);
	this.ctx.restore();
}
function Square(o) {
	this.parent = o.parent;
	this.text = o.text;
	this.tags = o.tags;
	this.tagsNum = o.tagsNum;
	//alert("** "+this.tagsPos);
	var textLn = this.text.length;
	this.ctx = this.parent.ctx;
	//
	//ChooseSize(this.ctx, text, lineHeightGlobal);
	var size = ChooseSize(this.ctx, this.text, lineHeightGlobal);
	this.size = size/diviseurSizeGlobal;
	//alert(this.size);
	this.alive = true;
	this.clickable = true;
	this.open = false;
	//
	var fixDef = new b2FixtureDef();
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsBox((this.size/2)/s, (this.size/2)/s);
	fixDef.density = 1.0;
	fixDef.restitution = 0.1;
	fixDef.friction = 0.8;
	var bodyDef = new b2BodyDef();
	bodyDef.position.x = (this.parent.w/2)/s+(Math.random()*globalMargeAppear-globalMargeAppear/2);
	bodyDef.position.y = -1.5*(this.size/s);
	bodyDef.angle = Math.random()*0.4-0.2;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.damping = 0;
	//
	var body = this.parent.box2dWorld.CreateBody(bodyDef);
	var fixt = body.CreateFixture(fixDef);
	this.body = body;
	this.fixt = fixt;
	this.color = 'black';
}
Square.prototype.openText = function() {
	this.body.DestroyFixture(this.fixt);
	this.size *=diviseurSizeGlobal;
	this.open = true;
	//
	var fixDef = new b2FixtureDef();
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsBox((this.size/2)/s, (this.size/2)/s);
	fixDef.density = 1.0;
	fixDef.restitution = 0.1;
	fixDef.friction = 0.8;
	var fixt = this.body.CreateFixture(fixDef);
	this.fixt = fixt;
}
Square.prototype.closeText = function() {
}
Square.prototype.draw = function() {
	//alert(this.body.GetPosition().x);
	var c = this.body.GetPosition();
	var r = this.body.GetAngle();
	// TEST LES LIMITES DU DOCUMENT
	if(c.x*s>this.parent.w+200 || c.x*s<-200 || c.y*s>this.parent.h+200 || c.y*s<-2000) {
		this.alive = false;
	}
	//TEST SI PASS UN FILTRE
	this.filtre(c);
	//
   	this.ctx.save();
   	this.ctx.translate(c.x*s, c.y*s);
	this.ctx.rotate(r);
	this.ctx.translate(-this.size/2, -this.size/2);
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.size, this.size);
	//
	if(this.open) {
    	this.ctx.font = typoSizeGlobal+"px font";
		this.ctx.fillStyle = "white";
		this.ctx.textBaseline = "top";
		/*
		this.ctx.fillText("Autre exemple", 0, 0);*/
		WrapText(this.ctx, this.text, marges, marges, this.size-2*marges, lineHeightGlobal);
	}
	//
   	this.ctx.restore();
	//this.px++;
	//this.py--;
	//
	//parent.ctx.fillRect(px, py px+1, py+1);
}
Square.prototype.filtre = function(c) {
	for(var i=0; i<dstTags.length; i++) {
		if(c.y*s>dstTags[i]-margeFiltreGlobal && boolTags[i]) {
			// && c.y*s<dstTags[i]+margeFiltreGlobal // SUPPRIMER QUE SUR LA LIGNE SI AJOUTE
			//alert("passe");
			var cnt = 0;
			for(var j=0; j<this.tagsNum.length; j++) {
				//alert("%%% "+tags[this.tagsNum[j]]+"  :  "+tags[i]);
				if(tags[this.tagsNum[j]] == tags[i]) {
					cnt++;
				}
			}
			if(cnt == 0) {
				playSoundOpen();
				this.alive = false;
			}
		}
	}
	/*for(var i=0; i<this.tags.length; i++) {
		var pos = this.tagsPos[i];
		if(c.y*s>this.tags[i]-margeFiltreGlobal && c.y*s<this.tags[i]+margeFiltreGlobal && boolTags[pos]) {
			//alert("FILTRED");
			playSoundOpen();
			this.alive = false;
		}
	}*/
}
function Sol(o, pX, pY, sX, sY) {
	this.parent = o.parent;
	this.ctx = this.parent.ctx;
	this.clickable = false;
	this.alive = true;
	//
	var fixDef = new b2FixtureDef();
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsBox(sX, sY);
	fixDef.density = 0;
	fixDef.restitution = 0.1;
	var bodyDef = new b2BodyDef();
	bodyDef.position.x = pX;
	bodyDef.position.y = pY;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.linearDamping = 0;
	//
	var body = this.parent.box2dWorld.CreateBody(bodyDef);
	var fixt = body.CreateFixture(fixDef);
	this.body = body;
	this.fixt = fixt;
}
Sol.prototype.draw = function() {
	//var c = this.body.GetPosition();
	//this.ctx.fillRect(c.x*s, c.y*s, this.parent.w, 10);
}
Sol.prototype.closeText = function() {
}
// ------------------------------------------------------- WRAP TEXT ET CHOOSE SIZE FONCTION GLOBALES MOCHES
function WrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if(testWidth > maxWidth) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
}
//
function ChooseSize(ctx, text, lineHeight) {
	var words = text.split(' ');
    var line = '';
	//
	var hauteur = 1000;
	var size = 0;
	//var x = 100;
	//var y = 100;
	//
	while(hauteur >= size) {
	var nbrLines = 0;
		//
		var testLine = "";
		var hauteurTemp = lineHeight;
		var TXT = "";
		//
		for(var n = 0; n < words.length; n++) {
			testLine += words[n]+" ";
      		var metrics = ctx.measureText(testLine);
      		var testWidth = metrics.width;
      		if(testWidth >= size) {
      			hauteurTemp+=lineHeight;
      			//alert("BIGGER: "+testLine);
      			//ctx.fillText(line, x, y);
      			TXT+=testLine+"\n";
      			testLine = "";
      			nbrLines++;
      			//y+=lineHeight;
      			
      		}
		}
		hauteur = hauteurTemp;
		size+=lineHeight;
		//alert(hauteur+" h///s "+size+"     nbr: "+nbrLines+"    TXT: \n"+TXT);
	}
	size+=lineHeight;
	return (size+marges*2);
	//alert("g");
}
