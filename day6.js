const fs = require('fs');

const raw = fs.readFileSync('day6_input.txt', 'utf-8');
const data = raw.trim().split(',').map(n => +n);

let day = 0;
for (; day < 80; day++) {
    let newFish = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] == 0) {
            newFish++;
            data[i] = 6;
        } else {
            data[i] --;
        }
    }
    for (let i = 0; i < newFish; i++) {
        data.push(8);
    }
}

console.log('fish after', day, 'days:', data.length);