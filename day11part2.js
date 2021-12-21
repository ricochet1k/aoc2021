const fs = require('fs');

const raw = fs.readFileSync('day11_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(line => Array.from(line).map(x => +x));
const height = data.length;
const width = data[0].length;


function* adjacent(x, y) {
    if (x > 0) {
        if (y > 0) yield [x-1, y-1];
        yield [x-1, y];
        if (y < data.length - 1) yield [x-1, y+1];
    }
    if (y > 0) yield [x, y-1];
    if (y < data.length - 1) yield [x, y+1];
    if (x < width - 1) {
        if (y > 0) yield [x+1, y-1];
        yield [x+1, y];
        if (y < data.length - 1) yield [x+1, y+1];
    }
}

for (let step = 1; step < 10000; step++) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            data[y][x] += 1;
        }
    }

    const flashed = Array(height).fill(0).map(() => Array(width).fill(0));
    let flashCount = 0;

    function flash(x, y) {
        if (flashed[y][x]) return;
        flashed[y][x] = true;
        flashCount += 1;
        for (let [ax, ay] of adjacent(x, y)) {
            data[ay][ax] += 1;
            if (data[ay][ax] > 9) {
                flash(ax, ay);
            }
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (data[y][x] > 9) {
                flash(x, y);
            }
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (data[y][x] > 9) {
                data[y][x] = 0;
            }
        }
    }

    if (flashCount == width * height) {
        console.log('all flashed on step', step);
        break;
    }
}
