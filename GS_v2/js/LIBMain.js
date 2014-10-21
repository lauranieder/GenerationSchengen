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
//
function MainInit() {
	var lib = new LIB();
}
// --------------- LostIn
function LIB() {
	this.setup();
	this.tick();
}
//
LIB.prototype.setup = function() {
	this.fps = 60;
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
LIB.prototype.draw = function() {
	
}
// --------------- OneContent
// --------------- At the end the main Init...
MainInit();

window.onload = function()
{
    var canvas = document.getElementById('mon_canvas');
        if(!canvas)
        {
            alert("Impossible de récupérer le canvas");
            return;
        }

    var context = canvas.getContext('2d');
        if(!context)
        {
            alert("Impossible de récupérer le context du canvas");
            return;
        }


    //C'est ici que l'on placera tout le code servant à nos dessins.
    
    
    function drawImage(imageObj) {
        
        var imageX = 0;
        var imageY = 0;
        /*var imageWidth = imageObj.width;
        var imageHeight = imageObj.height;*/
        
       
        context.drawImage(imageObj, imageX, imageY);
    }
    
    var imageObj = new Image();
      imageObj.onload = function() {
        drawImage(this);
        drawOverlay();
      };
      imageObj.src = 'data/preview-DSCF3937.jpg';
    
   /* base_image = new Image();
    base_image.src = 'data/preview-DSCF3937.jpg';
    base_image.onload = function(){
        context.drawImage(base_image, 0,0);
        
        
        
        
    }*/
    
    function  drawOverlay(){
        context.fillStyle = "#FF0000";
    context.fillRect(0,0,150,75);
    
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("Un périphérique, les zones industrielles se succèdent. Puis un paysage plus urbain apparaît.",60,60);
        
    }
    
    
    
    
}
