import { toggleGridlines, randomizeGrid, clearGrid } from './grid.js';
import { applyGameRules } from './rules.js';

// Animation
let isRunning = false;
let intervalID; // ID for animation loop
let cycleTime = 100; // every 100 ms

function startSimulation() {
	if (isRunning) return;
	isRunning = true;
	animateButton.textContent = 'Pause';
	intervalID = setInterval(() => {
		applyGameRules();
	}, cycleTime);
}

function stopSimulation() {
	isRunning = false;
	clearInterval(intervalID);
	animateButton.textContent = 'Start';
}

function toggleSimulation() {
	if (isRunning){
		stopSimulation();
	} else {
		startSimulation();
	}
}

// Sliders
const speedSlider = document.getElementById('speed');
const speedDisplay = document.getElementById('speedValue');

function updateSpeedDisplay(){
	const newSpeed = speedSlider.value; // evolves per second
	speedDisplay.textContent = newSpeed;
}

function updateCellSpeed(){
	const newSpeed = speedSlider.value;
	speedDisplay.textContent = newSpeed;
	cycleTime = 1000 / newSpeed;
	if (isRunning) { // restart with new rate
		stopSimulation();
		startSimulation();
	}
}

speedSlider.addEventListener('input', () => {
	updateSpeedDisplay();
});

speedSlider.addEventListener('change', () => {
	updateCellSpeed();
});

const gridSizeSlider = document.getElementById('gridSize');
gridSizeSlider.addEventListener('change', stopSimulation);


// Buttons
const animateButton = document.getElementById('toggleAnimation');
const randomizeButton = document.getElementById('randomizeButton');
const eraseButton = document.getElementById('eraseButton');
const gridlineButton = document.getElementById('toggleGridlines');

animateButton.addEventListener('click', () => {
	toggleSimulation();
});

randomizeButton.addEventListener('click', () => {
	stopSimulation();
	randomizeGrid();
});

eraseButton.addEventListener('click', () => {
	stopSimulation();
	clearGrid();
})

gridlineButton.addEventListener('click', () => {
	toggleGridlines();
	console.log(window.getComputedStyle(gridlineButton));
});

/** Adds the active class to a button temporarily */
function simulateButtonPress(button) {
	button.classList.add('active');
	setTimeout(() => {
		button.classList.remove('active');
	}, 150);
}

// Keyboard shortcuts
let keysPressed = {};

document.addEventListener('keydown', (e) => {
	if (keysPressed[e.code]){
		return;
	}
	keysPressed[e.code] = true;

	switch (e.code) {
		case 'Space':
			// Document must have focus
			if (e.target === document.body){
				simulateButtonPress(animateButton);
				toggleSimulation();
			}
			break;
		case 'KeyR':
			stopSimulation();
			simulateButtonPress(randomizeButton);
			randomizeGrid();
			break;
		case 'KeyE':
			stopSimulation();
			simulateButtonPress(eraseButton);
			clearGrid();
			break;
		case 'KeyG':
			simulateButtonPress(gridlineButton);
			toggleGridlines();
			break;
	}
});

document.addEventListener('keyup', (e) => {
	keysPressed[e.code] = false;
});

// Read first value from slider
updateCellSpeed();