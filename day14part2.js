const fs = require('fs');

const raw = fs.readFileSync('day14_input.txt', 'utf-8');
let [template, rulesData] = raw.trim().split('\n\n');

const rules = Object.fromEntries(rulesData.split('\n').map(line => line.split(' -> ')));

let pairCounts = {};
for (let i = template.length-2; i >= 0; i--) {
    const pair = template.slice(i, i+2);
    pairCounts[pair] = (pairCounts[pair] || 0) + 1;
}

const counts = {};
for (const c of template) {
    counts[c] = (counts[c] || 0) + 1;
}

let length = template.length;
console.log('start', 0, length, pairCounts);
for (let step = 1; step <= 40; step++) {
    const nextPairCounts = {};
    for (const pair in pairCounts) {
        const insert = rules[pair];
        const count = pairCounts[pair] || 0;
        if (count > 0) {
            if (insert) {
                const left = pair[0] + insert, right = insert + pair[1];
                nextPairCounts[left] = (nextPairCounts[left] || 0) + count;
                nextPairCounts[right] = (nextPairCounts[right] || 0) + count;
                length += count;
                counts[insert] = (counts[insert] || 0) + count;
                // console.log('ins', pair, '->', insert, ' ', count, left, right);
            } else {
                nextPairCounts[pair] = count;
            }
        }
    }
    pairCounts = nextPairCounts;
    console.log('step', step, length); //, JSON.stringify(pairCounts));
}

const countList = Object.values(counts);
countList.sort((a, b) => b-a);

console.log('common - rare =', countList[0] - countList[countList.length-1]);
