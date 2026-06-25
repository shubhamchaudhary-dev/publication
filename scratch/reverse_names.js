const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file.includes('node_modules') || file.includes('dist') || file.includes('.git') || file.includes('.next')) return;
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
            results.push(file);
        }
    });
    return results;
}

const frontendFiles = walk(path.join(__dirname, '../frontend'));
const backendFiles = walk(path.join(__dirname, '../backend'));
const files = [...frontendFiles, ...backendFiles];

let changedFiles = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Email
    content = content.replace(/swapanpublication@gmail\.com/gi, 'swapnapublication@gmail.com');
    
    // Publication Name (exact phrases first)
    content = content.replace(/Swapan Publication/g, 'Swapna Publication');
    content = content.replace(/SwapanPublication/g, 'SwapnaPublication');
    content = content.replace(/swapan publication/gi, 'swapna publication');
    
    // Other instances of the names
    content = content.replace(/Swapan/g, 'Swapna');
    content = content.replace(/swapan/g, 'swapna');
    content = content.replace(/SWAPAN/g, 'SWAPNA');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log(`Reverted: ${file}`);
    }
});

console.log(`Total files reverted: ${changedFiles}`);
