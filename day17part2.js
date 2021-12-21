const fs = require('fs');

// const raw = 'target area: x=20..30, y=-10..-5';
const raw = fs.readFileSync('day17_input.txt', 'utf-8');
const [areaX, areaY] = raw.split(': ')[1].split(', ').map(p => p.split('=')[1].split('..').map(x => +x));
//target area: x=192..251, y=-89..-59

function step([x, y, xv, yv]) {
    x += xv;
    y += yv;
    if (xv > 0) xv--;
    yv--;
    return [x, y, xv, yv];
}

function didHitArea([x, y]) {
    return x >= areaX[0] && x <= areaX[1] && y >= areaY[0] && y <= areaY[1];
}

function mightStillHit([x, y, xv, yv]) {
    if (x > areaX[1]) return false;
    if (y < areaY[0]) return false;
    if (xv <= 0 && x < areaX[0]) return false;
    return true;
}

let minXVel = 1;
const maxXVel = areaX[1];

// reverse the drag component to find the minimum x velocity
for (let x = areaX[0]; x > 0; x -= minXVel) minXVel ++;
console.log('xvel', minXVel, maxXVel);

/* trace of 7,2
probe [ 0, 0, 7, 2 ]
probe [ 7, 2, 6, 1 ]
probe [ 13, 3, 5, 0 ]
probe [ 18, 3, 4, -1 ]
probe [ 22, 2, 3, -2 ]
probe [ 25, 0, 2, -3 ] // note that it hits y=0 again with -yv-1 as the velocity
probe [ 27, -3, 1, -4 ]
probe [ 28, -7, 0, -5 ]
hit
*/

/* trace of 6,2
probe [ 0, 0, 6, 2 ]
probe [ 6, 2, 5, 1 ]
probe [ 11, 3, 4, 0 ]
probe [ 15, 3, 3, -1 ]
probe [ 18, 2, 2, -2 ]
probe [ 20, 0, 1, -3 ] // note that it hits y=0 again with -yv-1 as the velocity
probe [ 21, -3, 0, -4 ]
probe [ 21, -7, 0, -5 ]
hit
*/

/* trace of 6,3
probe [ 0, 0, 6, 3 ]
probe [ 6, 3, 5, 2 ]
probe [ 11, 5, 4, 1 ]
probe [ 15, 6, 3, 0 ]
probe [ 18, 6, 2, -1 ]
probe [ 20, 5, 1, -2 ]
probe [ 21, 3, 0, -3 ]
probe [ 21, 0, 0, -4 ] // note that it hits y=0 again with -yv-1 as the velocity
probe [ 21, -4, 0, -5 ]
probe [ 21, -9, 0, -6 ]
hit
*/

/* trace of 6,9
probe [ 0, 0, 6, 9 ]
probe [ 6, 9, 5, 8 ]
probe [ 11, 17, 4, 7 ]
probe [ 15, 24, 3, 6 ]
probe [ 18, 30, 2, 5 ]
probe [ 20, 35, 1, 4 ]
probe [ 21, 39, 0, 3 ]
probe [ 21, 42, 0, 2 ]
probe [ 21, 44, 0, 1 ]
probe [ 21, 45, 0, 0 ]
probe [ 21, 45, 0, -1 ]
probe [ 21, 44, 0, -2 ]
probe [ 21, 42, 0, -3 ]
probe [ 21, 39, 0, -4 ]
probe [ 21, 35, 0, -5 ]
probe [ 21, 30, 0, -6 ]
probe [ 21, 24, 0, -7 ]
probe [ 21, 17, 0, -8 ]
probe [ 21, 9, 0, -9 ]
probe [ 21, 0, 0, -10 ] // note that it hits y=0 again with -yv-1 as the velocity
probe [ 21, -10, 0, -11 ] // this is the best that can be done because the step right after y=0 at any higher velocity will skip over the target
hit
*/

const minYVel = areaY[0];
const maxYVel = -areaY[0]-1;

function withStyle(xv, yv) {
    let probe = [0, 0, xv, yv], hit, maxY = 0;
    // console.log('probe', probe);
    while (!(hit = didHitArea(probe)) && mightStillHit(probe)) {
        probe = step(probe);
        maxY = Math.max(maxY, probe[1]);
        // console.log('probe', probe);
    }
    // console.log(hit? 'hit' : 'miss');
    return hit? maxY : false;
}

let countHitVels = 0;
for (let xv = minXVel; xv <= maxXVel; xv++) {
    for (let yv = minYVel; yv <= maxYVel; yv++) {
        if (withStyle(xv, yv) !== false)
            countHitVels += 1;
    }
}

console.log(countHitVels);
