const fs = require('fs');

const raw = fs.readFileSync('day18_input.txt', 'utf-8');
const snumbers = raw.split('\n').map(JSON.parse);

function snAdd(sa, sb) {
    return snReduce([sa, sb]);
}

function snReduce(sn) {
    while (true) {
        // console.log('snReduce', JSON.stringify(sn));

        const result = snReduceExplode(sn);
        if (result.explode) {
            sn = result.value;
            continue;
        }

        const result2 = snReduceSplit(sn);
        if (result2.split) {
            sn = result2.value;
            continue;
        }

        break;
    }

    return sn;
}

function snReduceExplode(sn, depth=0) {
    if (typeof sn === 'number')
        return { value: sn };

    if (depth == 4) {
        // explode
        return { explodeLeft: sn[0], explodeRight: sn[1], value: 0, explode: true };
    }

    const left = snReduceExplode(sn[0], depth+1);
    if (left.explode) {
        const right = left.explodeRight != null ? addToFirstLeft(sn[1], left.explodeRight) : sn[1];
        // console.log('left explode', left, right, sn[1]);
        return { explodeLeft: left.explodeLeft, value: [ left.value, right ], explode: true};
    }
    const right = snReduceExplode(sn[1], depth+1);
    if (right.explode) {
        const left = right.explodeLeft != null ? addToFirstRight(sn[0], right.explodeLeft) : sn[0];
        // console.log('right explode', left, right);
        return { explodeRight: right.explodeRight, value: [ left, right.value ], explode: true};
    }
    return { value: sn };
}

function addToFirstLeft(sn, val) {
    if (typeof sn === 'number')
        return sn + val;

    return [addToFirstLeft(sn[0], val), sn[1]];
}

function addToFirstRight(sn, val) {
    if (typeof sn === 'number')
        return sn + val;

    return [sn[0], addToFirstRight(sn[1], val)];
}

function snReduceSplit(sn) {
    if (typeof sn === 'number') {
        if (sn >= 10) {
            // split
            return { value: [Math.floor(sn/2), Math.ceil(sn/2)], split: true };
        }
        return { value: sn };
    }

    const left = snReduceSplit(sn[0]);
    if (left.split) {
        return { value: [ left.value, sn[1] ], split: true};
    }
    const right = snReduceSplit(sn[1]);
    if (right.split) {
        return { value: [ sn[0], right.value ], split: true};
    }
    return { value: sn };
}

function snMagnitude(sn) {
    if (typeof sn === 'number')
        return sn;

    return snMagnitude(sn[0]) * 3 + snMagnitude(sn[1]) * 2;
}


// console.log('snReduce', JSON.stringify(snReduce([[[[[9,8],1],2],3],4])));
// console.log('snReduce', JSON.stringify(snReduce([7,[6,[5,[4,[3,2]]]]])));
// console.log('snReduce', JSON.stringify(snReduce([[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]])));

// console.log('snMagnitude', snMagnitude([[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]));

let largestMagnitude = 0;
for (let i = 0; i < snumbers.length; i++) {

    for (let j = 0; j < snumbers.length; j++) {
        if (i == j) continue;
        
        const mag = snMagnitude(snAdd(snumbers[i], snumbers[j]));
        largestMagnitude = Math.max(largestMagnitude, mag);
    }

}

console.log('largest magnitude', largestMagnitude);