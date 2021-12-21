const fs = require('fs');

const raw = fs.readFileSync('day16_input.txt', 'utf-8');

function hexToBinary(hex) {
    return Array.from(hex).map(c => ('0000' + parseInt(c, 16).toString(2)).slice(-4)).join('');
}

const data = hexToBinary(raw.trim()); // convert to string of (0|1)

function parsePacket(data) {
    // console.log('parsePacket', data);
    const version = parseInt(data.slice(0, 3), 2);
    const typeId = parseInt(data.slice(3, 6), 2);

    if (typeId == 4) { // literal number
        let value = 0;
        let i = 6;
        while (true) {
            value = (value << 4) + parseInt(data.slice(i+1, i+5), 2);

            if (data[i] == '0') break;
            i += 5;
        }
        // console.log('literal', version, typeId, value);
        const rest = data.slice(i+5);
        return [{version, typeId, value}, rest];
    }

    // operator
    // console.log('other', version, typeId);
    const packets = [];
    const lengthTypeId = data[6];
    if (lengthTypeId == '0') {
        // console.log('length bits', data.slice(7, 7+15));
        const length = parseInt(data.slice(7, 7+15), 2);
        let subData = data.slice(7+15, 7+15+length);
        const rest = data.slice(7+15+length);
        while (subData.length) {
            const [packet, rest] = parsePacket(subData);
            packets.push(packet);
            subData = rest;
        }
        return [{version, typeId, packets}, rest];
    } else {
        // console.log('count bits', data.slice(7, 7+11));
        let count = parseInt(data.slice(7, 7+11), 2);
        let subData = data.slice(7+11);
        while (count > 0) {
            count --;
            const [packet, rest] = parsePacket(subData);
            packets.push(packet);
            subData = rest;
        }
        const rest = subData;
        return [{version, typeId, packets}, rest];
    }
}

function sumVersionNumbers(packet) {
    let sum = packet.version;
    for (let subPacket of (packet.packets || [])) {
        sum += sumVersionNumbers(subPacket);
    }
    return sum;
}

// parsePacket('110100101111111000101000')
// console.log('packet', JSON.stringify(parsePacket('00111000000000000110111101000101001010010001001000000000')));
// console.log('packet', JSON.stringify(parsePacket('11101110000000001101010000001100100000100011000001100000')));
// console.log('packet', JSON.stringify(parsePacket(hexToBinary('8A004A801A8002F478'))));
// let [packet, rest] = parsePacket(hexToBinary('8A004A801A8002F478')); console.log('packet', sumVersionNumbers(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('620080001611562C8802118E34')); console.log('packet', sumVersionNumbers(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('C0015000016115A2E0802F182340')); console.log('packet', sumVersionNumbers(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('A0016C880162017C3686B18A3D4780')); console.log('packet', sumVersionNumbers(packet), JSON.stringify(packet));

let [packet, rest] = parsePacket(data); console.log('packet', sumVersionNumbers(packet), JSON.stringify(packet));