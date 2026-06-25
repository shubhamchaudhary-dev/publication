const fs = require('fs');
const path = require('path');

const directoriesToSearch = ['frontend', 'backend'];
const excludeDirs = ['node_modules', '.next', 'dist', 'build', '.git'];

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && !excludeDirs.includes(name)) {
            walkSync(filePath, callback);
        }
    });
}

let modifiedCount = 0;

directoriesToSearch.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        walkSync(fullPath, function(filePath) {
            // Only process text files (js, jsx, ts, tsx, html, css, json, md, env)
            const ext = path.extname(filePath).toLowerCase();
            if (!['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.env'].includes(ext)) {
                return;
            }

            const originalContent = fs.readFileSync(filePath, 'utf8');
            let newContent = originalContent;

            // Replace Swarna
            newContent = newContent.replace(/Swarna Publication/g, 'Swapan Publication');
            newContent = newContent.replace(/SwarnaPublication/g, 'SwapanPublication');
            newContent = newContent.replace(/SWARNA PUBLICATION/g, 'SWAPAN PUBLICATION');
            newContent = newContent.replace(/Swarna/g, 'Swapan');
            newContent = newContent.replace(/SWARNA/g, 'SWAPAN');
            newContent = newContent.replace(/swarna/g, 'swapan');

            // Replace Swapna
            newContent = newContent.replace(/Swapna Publication/g, 'Swapan Publication');
            newContent = newContent.replace(/SwapnaPublication/g, 'SwapanPublication');
            newContent = newContent.replace(/SWAPNA PUBLICATION/g, 'SWAPAN PUBLICATION');
            newContent = newContent.replace(/Swapna/g, 'Swapan');
            newContent = newContent.replace(/SWAPNA/g, 'SWAPAN');
            newContent = newContent.replace(/swapna/g, 'swapan');

            if (originalContent !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                modifiedCount++;
                console.log('Modified:', filePath);
            }
        });
    }
});

console.log('Total files modified:', modifiedCount);
