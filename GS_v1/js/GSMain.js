var stats;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
//
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Resize
THREEx.WindowResize(renderer, camera);
//
var texture = THREE.ImageUtils.loadTexture( "textures/testA.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 1 );
// boucle
function Init(){
	CreateWalls();
	CreateStats();
}
function Update() {
	stats.update();
}
function Animate () {
	Update();
	renderer.render(scene, camera);
	requestAnimationFrame(Animate);
};
function CreateWalls() {
	for(var i=0; i<100; i++) {
		// Plane textured
		var geometry = new THREE.PlaneGeometry(1,1,1,1);
		var material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		//
		scene.add(cube);
		cube.position.x = Math.floor(Math.random()*4)*4;
		cube.position.z = Math.floor(Math.random()*4)*4;
		cube.rotation.y = Math.floor(Math.random()*4)*90;
		camera.position.z = 5;
	}
}
function CreateStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
}
//
Init();
Animate();