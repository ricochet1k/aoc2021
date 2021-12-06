const fs = require('fs');

const raw = fs.readFileSync('day6_input.txt', 'utf-8');
const data = raw.trim().split(',').map(n => +n);

let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
data.forEach(days => counts[days]++);

let day = 0;
for (; day < 256; day++) {
    const newCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = counts.length-1; i > 0; i--) {
        newCounts[i-1] = counts[i];
    }
    newCounts[8] = counts[0];
    newCounts[6] += counts[0];
    counts = newCounts;
}

console.log('fish after', day, 'days:', counts.reduce((a, b) => a + b));