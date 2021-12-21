const fs = require('fs');

const raw = fs.readFileSync('day15_input.txt', 'utf-8');
const data = raw.trim().split('\n');
const realWidth = data[0].length;
const realHeight = data.length;
const width = realWidth * 5;
const height = realHeight * 5;

function riskAt(x, y) {
    let risk = +data[y % realHeight][x % realWidth];
    risk += Math.floor(x / realWidth);
    risk += Math.floor(y / realHeight);
    return risk > 9? risk-9 : risk;
}

function* adjacent(x, y) {
    if (x > 0) {
        yield [x-1, y];
    }
    if (y > 0) yield [x, y-1];
    if (y < height - 1) yield [x, y+1];
    if (x < width - 1) {
        yield [x+1, y];
    }
}

// A* distance metric
// manhattan distance * minimum risk possible (1)
function dist(x, y) {
    return Math.abs(x - width-1) + Math.abs(y - height-1);
}

// heap structure would be nice here, but that's a pain in plain JS
// maybe it's not needed?
const paths = [{x: 0, y: 0, risk: 0, metric: dist(0, 0)}];

const visited = Array(height).fill(0).map(() => Array(width).fill(0));

let finalPath = null;

outer: while (true) {
    const best_metric = paths[paths.length-1].metric;
    for (let i = paths.length-1; i >= 0 && paths[i].metric == best_metric; i--) {
        const path = paths.splice(i, 1)[0];
        console.log('path', path);
        if (path.x == width-1 && path.y == height-1) {
            finalPath = path;
            break outer;
        }
        for (const [x, y] of adjacent(path.x, path.y)) {
            const risk = path.risk + riskAt(x, y);
            const alreadyRisk = visited[y][x];
            if (alreadyRisk == 0 || risk < alreadyRisk) {
                visited[y][x] = risk;
                const metric = risk + dist(x, y);
                paths.push({x, y, risk, metric});
            }
        }
    }
    paths.sort((a, b) => b.metric - a.metric);
}

console.log('final path', finalPath);
