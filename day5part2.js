const fs = require('fs');

const raw = fs.readFileSync('day5_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(l => l.split(' -> ').map(p => p.split(',').map(n => +n)));

let maxX = 0, maxY = 0;
data.forEach(pts => pts.forEach(([x, y]) => {
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
}));

const grid = Array(maxY+1).fill(0).map(() => Array(maxX+1).fill(0));

data.forEach(([[ax, ay], [bx, by]]) => {
    // only horiz/vert lines for now
    // if (ax != bx && ay != by) return;

    const dx = (ax == bx)? 0 : (ax < bx ? 1 : -1);
    const dy = (ay == by)? 0 : (ay < by ? 1 : -1);
    
    for (let [x, y] = [ax, ay]; x != bx+dx || y != by+dy; x += dx, y += dy) {
        grid[y][x]++;
    }
});

// console.log(maxX, maxY, grid);

let dangerous = 0;
grid.forEach(row => row.forEach(el => {
    if (el > 1) dangerous += 1;
}));

console.log('dangerous', dangerous);