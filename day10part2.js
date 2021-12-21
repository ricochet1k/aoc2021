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

class Incomplete extends Error {
    constructor(completed) {
        super('incomplete');
        this.completed = completed;
    }
}

function parseChunk(str) {
    if (str == '') return str;

    const closeBracket = brackets[str[0]];
    if (closeBracket) {
        let rest;
        try {
            rest = parseChunk(str.slice(1));
        } catch (e) {
            if (e instanceof Incomplete)
                e.completed += closeBracket;
            throw e;
        }
        if (rest == '') throw new Incomplete(closeBracket);
        if (rest[0] != closeBracket) throw new SyntaxErr('corrupted', rest);
        return parseChunk(rest.slice(1));
    }
    // console.log('no match', str);
    return str;
}

const characterScore = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

const allScores = [];
for (let line of data) {
    try {
        console.log('parsed', parseChunk(line));
    }
    catch (e) {
        if (e instanceof Incomplete) {
            let score = 0;
            for (let c of e.completed) {
                score = score * 5 + characterScore[c];
            }
            console.log(e.message, e.completed, score);
            allScores.push(score);
        } else if (e instanceof SyntaxErr) {}
        else throw e;
    }
}

allScores.sort((a, b) => a-b);
// console.log('allScores.length', allScores.length);

console.log('middle score', allScores[(allScores.length-1) / 2]);

