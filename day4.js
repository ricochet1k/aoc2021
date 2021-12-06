const fs = require('fs');

const raw = fs.readFileSync('day4_input.txt', 'utf-8');
const data = raw.trim().split('\n\n');

const numbers = data[0].split(',').map(n => +n);
const boards = data.slice(1).map(b => {
    const board = b.split('\n').map(r => r.split(/ +/).map(n => +n));
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

outer: for (let i = 0; i < numbers.length; i++) {
    for (const board of boards) {
        if (board.mark(numbers[i])) {
            console.log("bingo", numbers[i] * Object.keys(board.numberToPos).reduce((a, b) => +a + +b));
            break outer;
        }
    }
}
