const fs = require('fs');

const raw = fs.readFileSync('day7_input.txt', 'utf-8');
const data = raw.trim().split(',').map(n => +n);

const positions = Array(Math.max(...data)).fill(0);
for (const crab of data) {
    for (let i = 0; i < positions.length; i++) {
        positions[i] += Math.abs(i - crab);
    }
}

console.log("min fuel", Math.min(...positions));