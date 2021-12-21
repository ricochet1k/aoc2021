const fs = require('fs');

const raw = fs.readFileSync('day10_input.txt', 'utf-8');
const data = raw.trim().split('\n');

const brackets = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

class SyntaxErr extends Error {
    constructor(msg, rest) {
        super(msg+': '+JSON.stringify(rest));
        this.msg = msg;
        this.rest = rest;
    }
}

function parseChunk(str) {
    if (str == '') return str;

    const closeBracket = brackets[str[0]];
    if (closeBracket) {
        const rest = parseChunk(str.slice(1));
        if (rest == '') throw new SyntaxErr('incomplete', rest);
        if (rest[0] != closeBracket) throw new SyntaxErr('corrupted', rest);
        return parseChunk(rest.slice(1));
    }
    // console.log('no match', str);
    return str;
}

const characterScore = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

let totalScore = 0;
for (let line of data) {
    try {
        console.log('parsed', parseChunk(line));
    }
    catch (e) {
        if (!(e instanceof SyntaxErr)) throw e;
        console.log(e.message);
        if (e.msg == 'corrupted') {
            const score = characterScore[e.rest[0]];
            // console.log(e, score);
            totalScore += score;
        }
    }
}

console.log('total score', totalScore);

