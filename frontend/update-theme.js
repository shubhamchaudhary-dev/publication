const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
};

const files = walk('./app');
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // We want to replace standard bg-[#F8FAFC] with the gradient, except hover and table rows if possible.
    // We'll just replace 'bg-[#F8FAFC]' with 'bg-gradient-to-br from-[#FFFBEA]/50 to-[#FFFFFF]' 
    // It's a soft yellowish-white gradient.
    const gradient = 'bg-gradient-to-br from-[#FFFBEA]/50 to-[#FFFFFF]';
    const newContent = content.replace(/([^:]|^)bg-\[\#F8FAFC\]/g, '$1' + gradient);
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        replacedCount++;
    }
});

console.log('Replaced background in ' + replacedCount + ' files.');
