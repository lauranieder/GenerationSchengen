/////////////////
//             //
//   made by   //
//             //
// fragment.in //
//             //
//      !      //
//             //
/////////////////

// --------------- Globals
var lib;
var gW = 10;
var gH = 10;
//
function MainInit() {
	var lib = new LIB();
	// --------------- Mouse
	$(document).click(function(e) {
		lib.click(e.pageX, e.pageY);
	});
}
// --------------- LostIn
function LIB() {
	this.setup();
	this.tick();
}
//
LIB.prototype.setup = function() {
	this.canvas = document.getElementById("LIBcanvas");
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	$(this.canvas).attr('width', this.winW);
	$(this.canvas).attr('height', this.winH);
	this.ctx = this.canvas.getContext('2d');
	//
	this.gH = 50;
	this.gW = 50;
	this.fps = 60;
	this.frames = new Array();
	this.usedCases = new Array();
	for(var i=0; i<100; i++) {
		this.usedCases[i] = new Array();
		for(var j=0; j<100; j++) {
			this.usedCases[i][j] = false;
		}
	}
}
//
LIB.prototype.click = function(mx, my) {
	this.addFrame();
}
//
LIB.prototype.draw = function() {
	this.ctx.fillStyle = "red";
	this.ctx.fillRect(0, 0, this.winW, this.winH);
	//
   	this.ctx.save();
	this.ctx.translate(this.winW/2, this.winH/2);
	for(var i=0; i<this.frames.length; i++) {
		this.frames[i].draw();
	}
   	this.ctx.restore();
}
//
LIB.prototype.addFrame = function() {
	this.parentFrame;
	if(this.frames.length>0) {
		this.parentFrame = this.frames[this.frames.length-1];
	}
	var newFrame = new FRAME({lib:this, parent:this.parentFrame});
	this.frames.push(newFrame);
}
//
LIB.prototype.tick = function() {
	this.draw();
	// relaunch
	var that = this;
	this.timer = setTimeout(function() {
		that.tick();
	}, 1000/this.fps);
}
LIB.prototype.checkOneCase = function(x, y) {
	
	var caseFree = true;
	for(var i=0; i<this.frames.length; i++) {
		if(frame != this.frames[i] && this.frames[i].isCaseFree(x, y)) {
			//
		} else {
			caseFree = false;
		}
	}
	return caseFree;
}
LIB.prototype.blockCase = function() {
	
}
// --------------- OneContent
function FRAME(params) {
	this.ready = false;
	this.lib = params.lib;
	this.parent = params.parent;
	this.rects = new Array();
	this.setup();
}
FRAME.prototype.setup = function() {
	this.ctx = this.lib.ctx;
	this.dim = new VEC(Math.round(Math.random()*4), Math.round(Math.random()*3));
	//this.cW = ;
	//this.cH = ;
	// à mettre dans checkCase
	if(this.parent != null) {
		this.checkCase();
	} else {
		// first one
		this.pos = new VEC(0, 0);
		this.ready = true;
		
	}
	/*this.caseX = 0;
	this.caseY = 0;
	this.dimX = 2;
	this.dimY = 1;
	//
	this.x = Math.round(Math.random()*10)*this.lib.gH;
	this.y = Math.round(Math.random()*4)*this.lib.gW;*/
}
FRAME.prototype.checkCase = function() {
	//this.foundPlace = false;
	//while(!this.foundPlace) {
		// test les 10 premières couches / à changer, infinite…
		this.rects = new Array();
		//
		var checkDistance = 0;
		//
		while(this.rects.length == 0) {
		//for(var i=0; i<10; i++) {
			var beginAt = new VEC(this.parent.pos.x-this.dim.x-checkDistance, this.parent.pos.y-this.dim.y-checkDistance);
			//alert(this.parent.dim.y+"  "+this.dim.x);
			// positions around the parent block
			loopY:
			for(var y=0; y<this.parent.dim.y+this.dim.x+1+checkDistance*2; y++) {
				loopX:
				for(var x=0; x<this.parent.dim.x+this.dim.y+1+checkDistance*2; x++) {
					// if the first case is empty
					//if() {
						// cases in the frame
						loopfrY:
						for(var frY = 0; frY<this.dim.y; frY++) {
							loopfrX:
							for(var frX = 0; frX<this.dim.x; frX++) {
								if(this.lib.checkOneCase(beginAt.x+x+frX, beginAt.y+y+frY, this)) {
									
									//this.pos = new VEC(beginAt.x+x, beginAt.y+y);
									//
									this.rect.push(new RECT(beginAt.x+x, beginAt.y+y, frX, frY));
									//alert(this.pos.x+"  "+this.pos.y+"  "+this.cW+"  "+this.cH);
									//this.ready = true;
									//break loopY;
								}
							}
						}
					//}
				}
			}
			checkDistance++;
		//}
		}
		alert(this.rect);
	//}
}
FRAME.prototype.isCaseFree = function(cX, cY) {
	this.upLeft = new VEC(this.cX, this.cY);
	this.downRight = new VEC(this.cX+this.cW, this.cY+this.cH);
	if(cX >= this.upLeft.x && cX <= this.downRight.x && cY >= this.upLeft.y && cY <= this.downRight.y) {
		return false;
	} else {
		return true;
	}
}
FRAME.prototype.draw = function() {
	this.ctx.fillStyle = "black";
	if(this.ready) {
		this.ctx.fillRect(this.pos.x*gW, this.pos.y*gH, this.dim.x*gW, this.dim.y*gH);
	}
}
// --------------- Vectors
function VEC(x, y) {
	this.x = x;
	this.y = y;
}
// --------------- Rect
function RECT() {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
RECT.prototype.center = function() {

}
// --------------- At the end the main Init...
MainInit();
