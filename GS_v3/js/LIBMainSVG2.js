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
var gW = 160;
var gH = 120;
var margin = 10;
var tableMax = 1000;
var tableCenter = 500;
var typoSize = 24;
var lineHeight = 24;
var textTest = "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. ";
//textTest = "ss";
//
function MainInit() {
	var lib = new LIB();
	// --------------- Mouse
	$(document).click(function(e) {
		lib.click(e.pageX, e.pageY);
	});
	$(document).mousedown(function(e) {
		lib.mouseDown(e.pageX, e.pageY);
	});
	$(document).mouseup(function(e) {
		lib.mouseUp(e.pageX, e.pageY);
	});
	$(document).mousemove(function(e) {
		lib.mouseMove(e.pageX, e.pageY);
	});
	$(document).mouseleave(function(e) {
		lib.mouseLeave(e.pageX, e.pageY);
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
	this.winW = parseInt(window.innerWidth);
	this.winH = parseInt(window.innerHeight);
	this.mouseActive = false;
	this.pos = new VEC(0, 0);
	this.oldMousePos = new VEC(0, 0);
	this.MousePos = new VEC(0, 0);
	this.MousePosMatrix = new VEC(0, 0);
	$(this.canvas).attr('width', this.winW);
	$(this.canvas).attr('height', this.winH);
	this.ctx = this.canvas.getContext('2d');
	//
	this.ctx.font = typoSize+"px font";
	this.ctx.textBaseline = "top";
	//
	this.gH = 50;
	this.gW = 50;
	this.fps = 60;
	this.frames = new Array();
	this.usedCases = new Array();
	for(var i=0; i<tableMax; i++) {
		this.usedCases[i] = new Array();
		for(var j=0; j<tableMax; j++) {
			this.usedCases[i][j] = false;
		}
	}
	this.addFrame(new VEC(0, 0));
}
//
LIB.prototype.click = function(mx, my) {
	for(var i=0; i<this.frames.length; i++) {
		this.frames[i].clickOver(this.MousePosMatrix.x, this.MousePosMatrix.y);
	}
}
LIB.prototype.mouseDown = function(mx, my) {
	this.oldMousePos = new VEC(mx, my);
	this.mousePos = new VEC(mx, my);
	this.mouseActive = true;
}
LIB.prototype.mouseUp = function(mx, my) {
	this.mouseActive = false;
}
LIB.prototype.mouseLeave = function(mx, my) {
	this.mouseActive = false;
}
LIB.prototype.mouseMove = function(mx, my) {
	if(this.mouseActive) {
		//alert("move");
		this.oldMousePos = this.mousePos;
		this.mousePos = new VEC(mx, my);
		
		//
		var diffX = this.mousePos.x-this.oldMousePos.x;
		var diffY = this.mousePos.y-this.oldMousePos.y;
		//
		this.pos.x += diffX;
		this.pos.y += diffY;
	}
	this.MousePosMatrix.x = mx-this.winW/2-this.pos.x;
	this.MousePosMatrix.y = my-this.winH/2-this.pos.y;
	//
	$("#debug").html(this.MousePosMatrix.x+"  "+this.MousePosMatrix.y);
		for(var i=0; i<this.frames.length; i++) {
			
			this.frames[i].isOver(this.MousePosMatrix.x, this.MousePosMatrix.y);
		}
}
LIB.prototype.update = function() {
	
}
//
LIB.prototype.draw = function() {
	this.ctx.fillStyle = "white";
	this.ctx.fillRect(0, 0, this.winW, this.winH);
	//
   	this.ctx.save();
	this.ctx.translate(this.winW/2+this.pos.x, this.winH/2+this.pos.y);
	for(var i=0; i<this.frames.length; i++) {
		this.frames[i].draw();
	}
   	this.ctx.restore();
   	// Debug
   	/*for(var y=0; y<this.usedCases.length; y++) {
		for(var x=0; x<this.usedCases[y].length; x++) {
			if(this.usedCases[x][y]) {
				this.ctx.fillStyle = "yellow";
			} else {
				this.ctx.fillStyle = "blue";
			}
			this.ctx.fillRect(x, y, 1, 1);
		}
	}*/
}
//
LIB.prototype.addFrame = function(vec) {
	/*this.parentFrame;
	if(this.frames.length>0) {
		this.parentFrame = this.frames[this.frames.length-1];
	}*/
	var that = this;
	//for(var i=0; i<10; i++) {
	var newFrame = new FRAME(that, vec);
	this.frames.push(newFrame);
	//}
}
//
LIB.prototype.tick = function() {
	this.update();
	this.draw();
	// relaunch
	var that = this;
	this.timer = setTimeout(function() {
		that.tick();
	}, 1000/this.fps);
}
LIB.prototype.blockCase = function(x, y) {
	this.usedCases[x+tableCenter][y+tableCenter] = true;
}
LIB.prototype.checkCase = function(x, y) {
	if(this.usedCases[x+tableCenter][y+tableCenter]) {
		return true;
	} else {
		return false;
	}
}
// --------------- OneContent
function FRAME(lib, vec) {
	this.ready = false;
	this.imageLoaded = false;
	this.lib = lib;
	this.parentPos = vec;
	this.rects = new Array();
	this.setup();
}
FRAME.prototype.setup = function() {
	this.ctx = this.lib.ctx;
	this.dim = new VEC(Math.round(Math.random()*3+1), Math.round(Math.random()*3+1));
	//this.color = getRandomColor();
	this.color = "black";
	//
	//if(this.parent != null) {
		this.findAPlace();
	/*} else {
		// first one
		this.pos = new VEC(0, 0);
		this.blockCases();
	}*/
}
FRAME.prototype.blockCases = function() {
	for(var y=0; y<this.dim.y; y++) {
		for(var x=0; x<this.dim.x; x++) {
			//
			var cx = this.pos.x+x;
			var cy = this.pos.y+y;
			//
			//alert(cx+" "+cy);
			this.lib.blockCase(cx, cy);
		}
	}
	this.ready = true;
	this.loadImage();
}
FRAME.prototype.giveContent = function(result) {
	
}
FRAME.prototype.findAPlace = function() {
	var rects = new Array();
	var beginPos = new VEC(this.parentPos.x, this.parentPos.y);
	var range = 1;
	while(rects.length<2) {
		//
		for(var y=beginPos.y-range; y<beginPos.y+range; y++) {
			for(var x=beginPos.x-range; x<beginPos.x+range; x++) {
				//
				var rectFree = true;
				//
				for(h = 0; h< this.dim.y; h++) {
					for(w = 0; w< this.dim.x; w++) {
						//
						var checkX = x+w;
						var checkY = y+h;
						//alert(checkX+" "+checkY);
						//
						if(this.lib.checkCase(checkX, checkY)) {
							rectFree = false;
						}
						//
					}
				}
				//
				if(rectFree) {
					var newRect = new RECT(x, y, this.dim.x, this.dim.y);
					rects.push(newRect);
				}
				//
			}
		}
		range++;
	}
	//alert(rects.length);
	// choisi un rectangle parmis les possibles
	/*var max = Number.MAX_VALUE;
	var thisRect = rects[0];
	for(var i = 0; i<rects.length; i++) {
		var vecA = rects[i].getCenter();
		var vecB = this.parent.getCenter();
		//alert(vecA.x);
		var dst = getDistance(vecA, vecB);
		//alert(dst);
		if(dst < max) {
			//alert(dst);
			max = dst;
			thisRect = rects[i];
		}
	}*/
	//var rand = Math.round(Math.random()*rects.length);
	//this.pos = new VEC(thisRect.x, thisRect.y);
	var rand = Math.floor(Math.random()*rects.length);
	this.pos = new VEC(rects[rand].x, rects[rand].y);
	this.blockCases();
	//this.pos.x = rects[rand].x;
	//this.pos.y = rects[rand].y;
	//alert(this.rects);
}
FRAME.prototype.loadImage = function() {
	this.imageObj = new Image();
	this.imageObj.onload = function() {
		this.imageLoaded = true;
		//alert("imgloaded: "+this.imageLoaded);
	};
	this.imageObj.src = 'data/a.jpg';
}
FRAME.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
	if(this.ready) {
   		this.ctx.save();
   		this.ctx.translate(this.pos.x*gW, this.pos.y*gH);
		this.ctx.fillRect(0, 0, this.dim.x*gW, this.dim.y*gH);
		//this.ctx.drawImage(this.imageObj, 0, 0, this.dim.x*gW-margin, this.dim.y*gH-margin);
		this.ctx.fillStyle = "black";
		WrapText(this.ctx, textTest, margin, margin, this.dim.x*gW-margin, lineHeight);
		this.ctx.restore();
	}
	//alert("imgloaded: "+this.imageLoaded);
	
}
FRAME.prototype.getCenter = function() {
	newVec = new VEC(this.pos.x+this.dim.x/2, this.pos.y+this.dim.y/2);
	return newVec;
}
FRAME.prototype.isOver = function(x, y) {
	if(x >= this.pos.x*gW && y >= this.pos.y*gH && x <= (this.pos.x+this.dim.x)*gW && y<= (this.pos.y+this.dim.y)*gH) {
		this.color = "grey";
	} else {
		this.color = "white";
	}
}
FRAME.prototype.clickOver = function(x, y) {
	if(x >= this.pos.x*gW && y >= this.pos.y*gH && x <= (this.pos.x+this.dim.x)*gW && y<= (this.pos.y+this.dim.y)*gH) {
		//var that = this;
		this.lib.addFrame(this.pos);
	}
}
// --------------- Vectors
function VEC(x, y) {
	this.x = x;
	this.y = y;
}
function getDistance(vecA, vecB) {
	var dx = vecA.x-vecB.x;
	var dy = vecA.y-vecB.y;
	//alert(dx+"  "+dy);
	return dx*dx+dy*dy;
	//return Math.sqrt(dx*dx+dy*dy);
}
// --------------- Rect
function RECT(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
//
RECT.prototype.getCenter = function() {
	newVec = new VEC(this.x+this.w/2, this.y+this.h/2);
	return newVec;
}
var letters = '0123456789ABCDEF'.split('');
//
function getRandomColor() {
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
// --------------- WrapText
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
// --------------- At the end the main Init...
MainInit();
