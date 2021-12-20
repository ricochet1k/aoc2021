const fs = require('fs');

const raw = fs.readFileSync('day7_input.txt', 'utf-8');
const data = raw.trim().split(',').map(n => +n);

const positions = Array(Math.max(...data)+1).fill(0);
for (const crab of data) {
    for (let i = crab, cost = 0, costMore = 1; i >= 0; i--, cost += costMore, costMore++) {
        positions[i] += cost;
    }
    for (let i = crab, cost = 0, costMore = 1; i < positions.length; i++, cost += costMore, costMore++) {
        positions[i] += cost;
    }
}
console.log('positions', JSON.stringify(positions));

console.log("min fuel", positions.reduce((a, b) => Math.min(a, b)));