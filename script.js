const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let ox = 150, oy = 350, sizeObj = 50;
let oxRocket = 0, oyRocket = 0, rockets = [], noCol = 8, startingRokets = 20;
let score = 0, second = 1;

function drawAirplane() {
	let img = new Image();
	img.src = "image/f16.png";
	ctx.beginPath();
	img.addEventListener("load", function () {
		ctx.drawImage(img, ox, oy, sizeObj, sizeObj);
	}, false);
	ctx.closePath();
}

function drawRockets() { 
	let imgRocket = new Image();
	imgRocket.src = "image/rocket.png";
	ctx.beginPath();
	for (let i = 0; i < rockets.length; ++i) {
		ctx.clearRect(rockets[i].x, rockets[i].y, sizeObj, sizeObj);
		ctx.drawImage(imgRocket, rockets[i].x, rockets[i].y, sizeObj, sizeObj); 
		if (rockets[i].y === 400) { 
			generateOrReplaceRockets(i); //replace the rockets
		}
		rockets[i].y += 1;
		if (checkCollision(rockets[i].x, rockets[i].y)) {
			gameOver();
		}
	}
	ctx.closePath(); 
}

function drawExplosion() {
	let img = new Image();
	img.src = "image/explosion.png";
	ctx.beginPath();
	img.addEventListener("load", function () {
		ctx.drawImage(img, ox - sizeObj / 2, oy - sizeObj, sizeObj + sizeObj, sizeObj + sizeObj);
	}, false);
	ctx.closePath();
}

function generateOrReplaceRockets(position = -1) {  //generate or replace a rockets
	let random = () => Math.floor(Math.random() * noCol);
	let x = random(), y = random();
	x *= sizeObj, y *= sizeObj; //multiply to get the real position on the canvas
	y = -y; //we negate y to create the rockets above the canvas
	if (position === -1) { // if no position is specified, a new missile is generated
		rockets.push({ x, y }); 
	} else { //replace the rocket at the given position
		rockets[position] = { x, y }; 
	}
}

function moveAirplane(movement) {
	ctx.clearRect(ox, oy, sizeObj, sizeObj);
	drawAirplane();
	if (movement.code == "ArrowLeft") {
		ox -= sizeObj;
		if (ox < 0) {
			ox = 0;
		}
	} else if (movement.code == "ArrowRight") {
		ox += sizeObj;
		if (ox > canvas.width - sizeObj) {
			ox = canvas.width - sizeObj;
		}
	}
}

function rocketsAnimation() {
	drawRockets();
	window.requestAnimationFrame(rocketsAnimation);
}

function checkCollision(posX, posY) {
	let overlapX = (posX < ox + sizeObj) && (posX + sizeObj > ox);
	let overlapY = (posY < oy + sizeObj) && (posY + sizeObj > oy);
	return overlapX && overlapY;
}

function gameOver() {
	document.getElementById("gameOver").innerText = "Game over / ";
	rockets = [];
	second = 0;
	drawExplosion();
}

function updateScore() {
	score += second;
	document.getElementById("score").innerText = score;
}

function reload() { //new game
	location.reload();
}

function startGame() {
	drawAirplane();
	rocketsAnimation();
	document.addEventListener("keydown", function (movement) {
		moveAirplane(movement);
	});
	for (let i = 0; i < startingRokets; ++i) { 
		generateOrReplaceRockets();
	}
	setInterval(updateScore, 1000);
	document.getElementById("startGame").disabled = true;
}