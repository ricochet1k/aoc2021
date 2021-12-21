const fs = require('fs');

const raw = fs.readFileSync('day14_input.txt', 'utf-8');
let [template, rulesData] = raw.trim().split('\n\n');

const rules = Object.fromEntries(rulesData.split('\n').map(line => line.split(' -> ')));

for (let step = 1; step <= 10; step++) {
    const inserts = [];
    for (let i = template.length-2; i >= 0; i--) {
        const pair = template.slice(i, i+2);
        const insert = rules[pair];
        if (insert)
            inserts.push([i+1, insert]);
    }

    for (const [i, insert] of inserts) {
        template = template.slice(0, i) + insert + template.slice(i);
    }

    console.log('step', step, template.length);
}

const counts = {};
for (const c of template) {
    counts[c] = (counts[c] || 0) + 1;
}

const countList = Object.values(counts);
countList.sort((a, b) => b-a);

console.log('common - rare =', countList[0] - countList[countList.length-1]);
