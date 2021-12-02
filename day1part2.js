const fs = require('fs');

const raw = fs.readFileSync('day1_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(l => +l);

function sum(a) {
    return a.reduce((a, b) => a+b, 0);
}

let count = 0;
for (let i = 3; i < data.length; i++) {
    const A = data.slice(i-2, i+1);
    const B = data.slice(i-3, i);
    if (i==3) console.log(A, B);
    if (sum(A) > sum(B))
        count ++;
}

console.log('count increasing', count);
