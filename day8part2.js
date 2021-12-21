const fs = require('fs');

const raw = fs.readFileSync('day8_input.txt', 'utf-8');
const data = raw.trim().split('\n').map(line => line.split(' | ').map(p => p.split(' ')));

const digit_segments = [
    "abcefg", // 0
    "cf", // 1
    "acdeg", // 2
    "acdfg", // 3
    "bcdf", // 4
    "abdfg", // 5
    "abdefg", // 6
    "acf", // 7
    "abcdefg", // 8
    "abcdfg", // 9
];

const reverse_digit_segments = Object.fromEntries(digit_segments.map((code, i) => [code, i]));

function union(a, b) {
    return new Set([...a, ...b]);
}
function intersect(a, b) {
    return new Set([...a].filter(x => b.has(x)));
}

// mini-kanren-like
function var_(name) {
    return new Var(name);
}
class Var {
    constructor(name) {
        this.name = name;
    }
    toString() {
        return "_."+this.name;
    }
}
function isVar(x) {
    return x instanceof Var;
}
function find(x, state) {
    while (isVar(x)) {
        if (!(x.name in state)) return x;
        const nx = state[x.name];
        // console.log('find', x, nx);
        if (isVar(nx) && nx.name == x.name) return x;
        x = nx;
    }
    return x;
}

function unify(a, b) {
    return {
        * run(state) {
            const aa = find(a, state);
            const bb = find(b, state);
            const avar = isVar(aa);
            const bvar = isVar(bb);
            if (!avar && !bvar) {
                if (aa === bb) {
                    yield state;
                } else {
                    //console.log('unify fail', state, aa, bb);
                }
            } else {
                const nstate = {...state};
                if (avar) {
                    nstate[aa.name] = bb;
                }
                else if (bvar) {
                    nstate[bb.name] = aa;
                }
                yield nstate;
            }
        }
    }
}

class Conj {
    constructor(goals) {
        this.goals = goals;
    }
    
    *run(state) {
        // this.goals.sort((a, b) => a.length - b.length);
        if (this.goals.length == 0) {
            yield state;
            return;
        }

        const next = new Conj(this.goals.slice(1));
        for (const nstate of this.goals[0].run(state)) {
            yield* next.run(nstate);
        }
    }
}
class Disj {
    constructor(goals) {
        this.goals = goals;
    }
    
    *run(state) {
        const iters = this.goals.map(g => g.run(state));
        let i = 0;
        while (iters.length > 0) {
            if (i >= iters.length) i = 0;
            const next = iters[i].next();
            if (next.done) {
                iters.splice(i, 1);
                continue;
            }
            yield next.value;
            i++;
        }
    }
}

function decodeWires(map, wires) {
    const decodedWires = [...wires].map(x => map['' + x]);
    decodedWires.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    const decoded = decodedWires.join('');
    const num = reverse_digit_segments[decoded];
    // console.log('decoded', wires, decoded, num);
    return num;
}

let finalAnswer = 0;
line: for (const line of data) {
    // map of input wire -> segment correlation possibilities
    const wireMap = {
        a: new Set("abcdefg"),
        b: new Set("abcdefg"),
        c: new Set("abcdefg"),
        d: new Set("abcdefg"),
        e: new Set("abcdefg"),
        f: new Set("abcdefg"),
        g: new Set("abcdefg"),
    };
    for (const digit of line[0]) {
        const digitWireMap = {
            a: new Set(),
            b: new Set(),
            c: new Set(),
            d: new Set(),
            e: new Set(),
            f: new Set(),
            g: new Set(),
        };
        for (const segments of digit_segments) {
            if (segments.length != digit.length) continue;

            const segs = new Set(segments);
            for (const wire of digit) {
                digitWireMap[wire] = union(digitWireMap[wire], segs);
            }
        }
        for (const wire of digit) {
            wireMap[wire] = intersect(wireMap[wire], digitWireMap[wire]);
        }
    }

    // now we have a conjunction of disjunctions, choices for each wire and we need to pick one for each wire that doesn't conflict with everything else
    // console.log('map', wireMap);

    const wireMapEntries = Object.entries(wireMap);
    wireMapEntries.sort((a, b) => a[1].size - b[1].size);
    const query = new Conj(wireMapEntries.map(([k, vals]) => new Disj([...vals].map(v => {
        return new Conj([
            unify(var_(k), v),
            unify(var_('s'+v), k),
        ]);
    }))));
    // const answer = query.run({}).next().value;
    
    query: for (const ans of query.run({})) {
        // console.log('answer', ans);

        const output = [];
        for (const wires of line[1]) {
            const num = decodeWires(ans, wires);

            // the logic program is under-constrained, so we filter answers to those that actually
            // work
            if (num === undefined) continue query;

            output.push(num);
        }
        console.log(output.join(''));
        finalAnswer += +output.join('');
        continue line;
    }
    console.log("no results", wireMap, line);
    throw new Error("no results");
}

console.log("final output sum", finalAnswer);