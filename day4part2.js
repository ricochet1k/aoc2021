const fs = require('fs');

const raw = fs.readFileSync('day4_input.txt', 'utf-8');
const data = raw.trim().split('\n\n');

const numbers = data[0].split(',').map(n => +n);
const boards = data.slice(1).map(b => {
    const board = b.split('\n').map(r => r.trim().split(/ +/).map(n => +n));
    const numberToPos = Object.fromEntries(board.flatMap((row, y) => row.map((num, x) => [num, {x, y}])));
    return {
        board,
        numberToPos,
        markedByRow: [0, 0, 0, 0, 0],
        markedByColumn: [0, 0, 0, 0, 0],
        // returns true for Bingo!
        mark(num) {
            const pos = numberToPos[num];
            if (pos) {
                // since we later need the sum of all unmarked numbers and marked numbers won't ever appear again
                // just delete the number from the map
                delete numberToPos[num];

                this.markedByColumn[pos.x] += 1;
                this.markedByRow[pos.y] += 1;
                return (this.markedByColumn[pos.x] == 5 || this.markedByRow[pos.y] == 5);
            }
        }
    }
});

let score = 0;
outer: for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < boards.length; j++) {
        if (boards[j].mark(numbers[i])) {
            score = numbers[i] * Object.keys(boards[j].numberToPos).reduce((a, b) => +a + +b, 0);
            boards.splice(j--, 1);
        }
    }
}

console.log("last bingo", score);
