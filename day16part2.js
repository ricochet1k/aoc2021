const fs = require('fs');

const raw = fs.readFileSync('day16_input.txt', 'utf-8');

function hexToBinary(hex) {
    return Array.from(hex).map(c => ('0000' + parseInt(c, 16).toString(2)).slice(-4)).join('');
}

const data = hexToBinary(raw.trim()); // convert to string of (0|1)

function parseBinary(str) {
    // return BigInt('0b'+str);
    return parseInt(str, 2);
}

function parsePacket(data) {
    // console.log('parsePacket', data);
    const version = parseBinary(data.slice(0, 3));
    const typeId = parseBinary(data.slice(3, 6));

    if (typeId == 4) { // literal number
        let value = 0n;
        let i = 6;
        while (true) {
            value = (value << 4n) + BigInt(parseBinary(data.slice(i+1, i+5)));

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
        const length = parseBinary(data.slice(7, 7+15));
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
        let count = parseBinary(data.slice(7, 7+11));
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

function evaluate(packet) {
    if (packet.typeId == 4) return packet.value;
    
    const values = packet.packets.map(evaluate);
    // console.log('eval', packet.typeId, values);
    switch (packet.typeId) {
        case 0: // sum
            return values.reduce((a, b) => a + b);
        case 1: // product
            return values.reduce((a, b) => a * b);
        case 2: // minimum
            return values.reduce((a, b) => a < b? a : b);
        case 3: // maximum
            return values.reduce((a, b) => a > b? a : b);
        case 5: // greater than
            return BigInt(+(values[0] > values[1]));
        case 6: // less than
            return BigInt(+(values[0] < values[1]));
        case 7: // equal to
            return BigInt(+(values[0] == values[1]));
    }
}

function tostr(packet) {
    if (packet.typeId == 4) return packet.value;
    
    const values = packet.packets.map(tostr);
    switch (packet.typeId) {
        case 0: // sum
            return '(' + values.join(' + ') + ')';
        case 1: // product
            return '(' + values.join(' * ') + ')';
        case 2: // minimum
            return 'min(' + values.join(', ') + ')';
        case 3: // maximum
            return 'max(' + values.join(', ') + ')';
        case 5: // greater than
            return '(' + values[0] + ' > ' + values[1] + ')';
        case 6: // less than
            return '(' + values[0] + ' < ' + values[1] + ')';
        case 7: // equal to
            return '(' + values[0] + ' == ' + values[1] + ')';
    }
}

// let [packet, rest] = parsePacket(hexToBinary('C200B40A82')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('04005AC33890')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('880086C3E88112')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('CE00C43D881120')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('D8005AC2A8F0')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('F600BC2D8F')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('9C005AC2F8F0')); console.log('packet', evaluate(packet), JSON.stringify(packet));
// let [packet, rest] = parsePacket(hexToBinary('9C0141080250320F1802104A08')); console.log('packet', evaluate(packet), JSON.stringify(packet));

let [packet, rest] = parsePacket(data); console.log('packet', evaluate(packet), tostr(packet));