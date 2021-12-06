const fs = require('fs');

const raw = fs.readFileSync('day3_input.txt', 'utf-8');
const data = raw.trim().split('\n');

const onesCount = Array.from(data[0]).map(() => 0);
for (const binary of data) {
    for (let i = 0; i < binary.length; i++)
        if (binary[i] == '1') onesCount[i]++;
}

let gamma = 0, epsilon = 0;
for (const oneCount of onesCount) {
    const bit = (oneCount > data.length/2) ? 1 : 0;
    gamma = (gamma << 1) + bit;
    epsilon = (epsilon << 1) + (1-bit);
}

console.log('power consumption', gamma * epsilon);
