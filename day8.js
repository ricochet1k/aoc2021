const fs = require('fs');

const raw = fs.readFileSync('day8_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(line => line.split(' | ').map(p => p.split(' ')));

let easy = 0;
for (const line of data) {
    for (const digit of line[1]) {
        switch (digit.length) {
            case 2: // digit 1
                easy += 1;
                break;
            case 3: // digit 7
                easy += 1;
                break;
            case 4: // digit 4
                easy += 1;
                break;
            case 7: // digit 8
                easy += 1;
                break;
        }
    }
}

console.log('easy digit count', easy);
