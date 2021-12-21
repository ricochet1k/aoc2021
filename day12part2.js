const fs = require('fs');

const raw = fs.readFileSync('day12_input.txt', 'utf-8');
const paths = {};
raw.trim().split('\n').forEach(line => {
    const [a, b] = line.split('-');
    if (!paths[a]) paths[a] = [];
    paths[a].push(b);
    if (!paths[b]) paths[b] = [];
    paths[b].push(a);
});

let small = {};
for (const key in paths) {
    if (key == key.toLowerCase()) small[key] = true;
}

let pathCount = 0;

function walk(at, path, visited, twice) {
    if (at == 'end') {
        console.log('path', path.join(','));
        pathCount += 1;
        return;
    }
    for (let to of paths[at]) {
        if (!small[to] || !visited[to]) {
            walk(to, path.concat([to]), {...visited, [to]: true}, twice);
        }
        if (!twice && small[to] && visited[to] && to != 'start') {
            walk(to, path.concat([to]), visited, true);
        }
    }
}

walk('start', ['start'], {start: true}, false);

console.log('count', pathCount);