const fs = require('fs');

const raw = fs.readFileSync('day2_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(l => l.split(' '));

let horiz = 0, depth = 0;
for (const [cmd, num] of data) {
    switch (cmd) {
        case 'forward':
            horiz += +num;
            break;
        // backwards of what you'd expect
        case 'up':
            depth -= +num;
            break;
        case 'down':
            depth += +num;
            break;
    }
}

console.log('horiz * depth', horiz * depth);
