const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let oxAirplane = 150, oyAirplane = 350, sizeObj = 50;
let boardCol = 8;
let rockets = [], startingRokets = 20;
let bullets = [], bulletNumber = 0;
let intervalTime = 0;
let gameStats = { time: 0, avoidedRockets: 0, destroyedRockets: 0 };
let activePlayer = true;

function drawAirplane() {
	let imgAirplane = new Image();
	imgAirplane.src = "image/f16.png";
	ctx.beginPath();
	imgAirplane.addEventListener("load", function () {
		ctx.drawImage(imgAirplane, oxAirplane, oyAirplane, sizeObj, sizeObj);
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
			updateStats("avoidedRockets");
		}
		++rockets[i].y;
		if (checkCollision(rockets[i].x, rockets[i].y, oxAirplane, oyAirplane)) {
			gameOver();
		}
	}
	ctx.closePath();
}

function generateOrReplaceRockets(position = -1) {
	let random = () => Math.floor(Math.random() * boardCol);
	let x, y, overlap;
	do {
		x = random(), y = random();
		x *= sizeObj, y *= sizeObj; //multiply to get the real position on the canvas
		y = -y; //we negate y to create the rockets above the canvas
		overlap = false;
		for (let i = 0; i < rockets.length; ++i) {
			if (checkCollision(x, y, rockets[i].x, rockets[i].y)) {
				overlap = true; //found an overlap
				break;
			}
		}
	} while (overlap); //repeat until there is no overlap
	if (position === -1) { // if no position is specified, a new missile is generated
		rockets.push({ x, y });
	} else { //replace the rocket at the given position
		rockets[position] = { x, y };
	}
}

function airplaneSkills(ability) {
	ctx.clearRect(oxAirplane, oyAirplane, sizeObj, sizeObj);
	drawAirplane();
	if (ability.code == "ArrowLeft") {
		oxAirplane -= sizeObj;
		if (oxAirplane < 0) {
			oxAirplane = 0;
		}
	} else if (ability.code == "ArrowRight") {
		oxAirplane += sizeObj;
		if (oxAirplane > canvas.width - sizeObj) {
			oxAirplane = canvas.width - sizeObj;
		}
	} else if (ability.code == "Space") {
		shootingBullets();
	}
}

function drawBullets() {
	ctx.beginPath();
	let imgBullet = new Image();
	imgBullet.src = "image/missile-airplane.png";
	imgBullet.addEventListener("load", function () {
		for (let i = 0; i < bulletNumber; ++i) {
			ctx.clearRect(bullets[i].x, bullets[i].y, sizeObj, sizeObj);
			ctx.drawImage(imgBullet, bullets[i].x, bullets[i].y, sizeObj, sizeObj);
			--bullets[i].y;
			for (let j = 0; j < rockets.length; ++j) {
				if (checkCollision(rockets[j].x, rockets[j].y, bullets[i].x, bullets[i].y)) {
					drawExplosion(bullets[i].x, bullets[i].y);
					rockets[j] = [];
					bullets[i] = [];
					generateOrReplaceRockets(j);
					updateStats("destroyedRockets");
				}
			}
		}
	}, false);
	ctx.closePath();
}

function shootingBullets() {
	let maxBullets = 100;
	bullets[bulletNumber] = ({ x: oxAirplane, y: oyAirplane - sizeObj }); //bullets position in front of the plane
	drawBullets();
	if (bulletNumber <= maxBullets) {
		++bulletNumber;
	} else {
		document.getElementById("withoutBullets").innerText = "Without bullets / ";
	}
}

function animation() {
	drawRockets();
	drawBullets();
	window.requestAnimationFrame(animation);
}

function checkCollision(ox1, oy1, ox2, oy2) {
	let overlapX = (ox1 < ox2 + sizeObj) && (ox1 + sizeObj > ox2);
	let overlapY = (oy1 < oy2 + sizeObj) && (oy1 + sizeObj > oy2);
	return overlapX && overlapY;
}

function drawExplosion(ox, oy) {
	let imgExplosion = new Image();
	imgExplosion.src = "image/explosion.png";
	ctx.beginPath();
	imgExplosion.addEventListener("load", function () {
		ctx.drawImage(imgExplosion, ox, oy - sizeObj, sizeObj, sizeObj * 2);
		if (activePlayer) {
			setTimeout(function () { //deleting the destroyed rackets
				ctx.clearRect(ox, oy - sizeObj, sizeObj, sizeObj * 2);
			}, 500);
		}
	}, false);
	ctx.closePath();
}

function updateStats(element) {
	++gameStats[element];
	document.getElementById(element).innerHTML = gameStats[element];
}

function gameOver() {
	document.getElementById("gameOver").innerText = "Game over / ";
	rockets = [], bullets = [];
	drawExplosion(oxAirplane, oyAirplane);
	clearInterval(intervalTime);
	activePlayer = false;
}

function reload() { //new game
	location.reload();
}

function startGame() {
	drawAirplane();
	document.addEventListener("keydown", function (ability) {
		if (activePlayer) {
			airplaneSkills(ability);
		}
	});
	for (let i = 0; i < startingRokets; ++i) {
		generateOrReplaceRockets(); //generate starting rockets
	}
	animation();
	intervalTime = setInterval(function () {
		updateStats("time");
	}, 1000);
	document.getElementById("startGame").disabled = true;
}