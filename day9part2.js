const fs = require('fs');

const raw = fs.readFileSync('day9_input.txt', 'utf-8');
const data = raw.trim().split('\n');
const width = data[0].length;

function* adjacent(x, y) {
    if (x > 0) yield [x-1, y];
    if (x < width - 1) yield [x+1, y];
    if (y > 0) yield [x, y-1];
    if (y < data.length - 1) yield [x, y+1];
}


const inBasin = Array(data.length).fill(0).map(() => Array(width).fill(0));
const basinSizes = [];

for (let y = 0; y < data.length; y++) {
    square: for (let x = 0; x < width; x++) {
        const height = data[y][x];
        for (let [ax, ay] of adjacent(x, y)) {
            if (height >= data[ay][ax]) // not a low point
                continue square;
        }

        // low spot found, start flood fill
        let basinSize = 0;
        const spots = [[x, y]];
        inBasin[y][x] = 1;
        let spot;
        while (spot = spots.pop()) {
            basinSize += 1;
            for (let [ax, ay] of adjacent(spot[0], spot[1])) {
                if (!inBasin[ay][ax] && data[ay][ax] != '9') {
                    spots.push([ax, ay]);
                    inBasin[ay][ax] = 1;
                }
            }
        }
        console.log('basin size', basinSize);
        basinSizes.push(basinSize);
    }
}

basinSizes.sort((a, b) => b-a);

console.log('basins', basinSizes);
console.log('answer', basinSizes[0] * basinSizes[1] * basinSizes[2]);
