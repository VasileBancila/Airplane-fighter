const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let ox = 200, oy = 350;
let size = 30;

function drawPlane() {
	ctx.beginPath();
	let img = new Image();
	img.addEventListener("load", function() {
    	ctx.drawImage(img, ox, oy, size, size);
  	});
	img.src = "image/f16.png";
	ctx.closePath();
}
drawPlane();