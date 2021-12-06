const fs = require('fs');

const raw = fs.readFileSync('day3_input.txt', 'utf-8');
const data = raw.trim().split('\n');

const [oxygenRatingBits, co2ScrubberRatingBits] = [1, 0].map(mainBit => {
    let filteredData = data;
    for (let i = 0; i < data[0].length; i++) {
        const oneCount = filteredData.filter(d => d[i] == '1').length;
        const bit = oneCount >= filteredData.length/2? mainBit : 1-mainBit;
        filteredData = filteredData.filter(d => +d[i] == bit);
        // console.log(i, 'bit', bit, 'filtered', filteredData);
        if (filteredData.length == 1)
            return filteredData[0]; //.slice(i+1);
    }
});

console.log([oxygenRatingBits, co2ScrubberRatingBits]);

const [oxygenRating, co2ScrubberRating] = [oxygenRatingBits, co2ScrubberRatingBits].map(bits => {
    let value = 0;
    for (const bit of bits) {
        value = (value << 1) + +bit;
    }
    return value;
});

console.log('life support rating', oxygenRating, co2ScrubberRating, oxygenRating * co2ScrubberRating);
