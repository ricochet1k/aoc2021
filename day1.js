const fs = require('fs');

const raw = fs.readFileSync('day1_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(l => +l);

let count = 0;
for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i-1])
        count ++;
}

console.log('count increasing', count);
