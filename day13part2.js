const fs = require('fs');

const raw = fs.readFileSync('day13_input.txt', 'utf-8');
const [coordsData, foldsData] = raw.trim().split('\n\n');

const coords = coordsData.split('\n').map(line => line.split(',').map(x => +x));
const folds = foldsData.split('\n').map(line => {
    const [fold, val] = line.split('=');
    return [fold, +val]
});

let maxX = 0, maxY = 0;
for (const [x, y] of coords) {
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
}

let dots = Array(maxY+1).fill(0).map(() => Array(maxX+1).fill(0));

for (const [x, y] of coords) {
    dots[y][x] = 1;
}

for (const [fold, at] of folds) {
    let startx = 0, starty = 0;
    if (fold == 'fold along x') {
        startx = at;
    } else {
        starty = at;
    }

    for (let x = startx; x < dots[0].length; x++) {
        for (let y = starty; y < dots.length; y++) {
            if (dots[y][x]) {
                dots[y][x] = 0;
                if (fold == 'fold along x') {
                    // console.log('folding', x, y, at - (x - at), y);
                    dots[y][at - (x - at)] = 1;
                } else {
                    // console.log('folding', x, y, x, at - (y - at));
                    dots[at - (y - at)][x] = 1;
                }
            }
        }
    }

    if (fold == 'fold along x') {
        for (let y = starty; y < dots.length; y++) {
            dots[y] = dots[y].slice(0, at);
        }
    } else {
        dots = dots.slice(0, at);
    }

    // console.log(dots.map(d => d.join('')).join('\n'));
    // break;
}
console.log(dots.map(d => d.map(x=>' #'[x]).join('')).join('\n'));

let count = 0;
for (let x = 0; x < dots[0].length; x++) {
    for (let y = 0; y < dots.length; y++) {
        if (dots[y][x])
            count ++;
    }
}
console.log('count', count);