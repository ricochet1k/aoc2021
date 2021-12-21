const fs = require('fs');

const raw = fs.readFileSync('day9_input.txt', 'utf-8');
const data = raw.trim().split('\n');
const width = data[0].length;

function* adjacent(x, y) {
    if (x > 0) yield data[y][x-1];
    if (x < width - 1) yield data[y][x+1];
    if (y > 0) yield data[y-1][x];
    if (y < data.length - 1) yield data[y+1][x];
}

let riskSum = 0;
for (let y = 0; y < data.length; y++) {
    square: for (let x = 0; x < width; x++) {
        const height = data[y][x];
        for (let a of adjacent(x, y)) {
            if (height >= a) // not a low point
                continue square;
        }

        // console.log('low point', x, y, height, Array.from(adjacent(x, y)));

        riskSum += 1 + +height;
    }
}

console.log('risk sum', riskSum);
