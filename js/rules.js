import { isCellAlive, giveLife, takeLife, grid, gridWidth, gridHeight } from './grid.js';

/** Count the number of live cells in the 8 immediate neighbours */
function countLiveNeighbours(x, y){
	let liveNeighbours = 0;

	const offsets = [-1, 0, 1];
	offsets.forEach((dx) => {
		offsets.forEach((dy) => {
			if (dx === 0 && dy === 0){
				return; // skip self
			}
			const nx = x + dx;
			const ny = y + dy;
			if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight){
				const neighbour = grid[ny][nx];
				if (isCellAlive(neighbour)){
					++liveNeighbours;
				}
			}
		});
	});
	return liveNeighbours;
}

/** Rules
 * 
 * 1) Underpopulation:
 * Any live cell with fewer than 2 live neighbours dies
 * 
 * 2) Survival:
 * Any live cell with 2 or 3 live neighbours continues to live
 * 
 * 3) Overpopulation:
 * Any live cell with more than 3 live neighbours dies
 * 
 * 4) Reproduction:
 * Any dead cell with exactly 3 live neighbours becomes a live cell
 */
function applyGameRules(){
	const updates = [];

	grid.forEach((row, y) => {
		row.forEach((cell, x) => {
			const liveNeighbours = countLiveNeighbours(x, y);
			const alive = isCellAlive(cell);
			// survive only if 2 or 3 neighbours
			if (alive && (liveNeighbours < 2 || liveNeighbours > 3)){
				updates.push({cell, alive: false}); // dies
			}
			// comes to life if exactly 3 neighbours
			else if (liveNeighbours === 3){
				updates.push({cell, alive: true});
			}
		});
	});

	// Apply changes
	updates.forEach(({cell, alive}) => {
		alive ? giveLife(cell) : takeLife(cell);
	});
}

export { isCellAlive, applyGameRules };