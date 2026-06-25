const fs = require('fs');

const logPath = 'c:\\Users\\balya\\.gemini\\antigravity\\brain\\d0333db9-14cb-4c4d-b12a-843415043a69\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'c:\\Users\\balya\\Downloads\\orchids-swarn-publication-main\\orchids-swarn-publication-main\\frontend\\app\\browse\\page-recovered.tsx';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let chunk1_120 = [];
let chunk290_310 = [];
let chunk340_400 = [];

function extractChunk(content) {
    const linesArr = content.split('\n');
    let actualCode = [];
    let capturing = false;
    for (const l of linesArr) {
        if (/^\d+: /.test(l)) {
            capturing = true;
        }
        if (capturing) {
            const match = l.match(/^\d+:\s(.*)$/);
            if (match) {
                actualCode.push(match[1]);
            } else if (l.startsWith('The above content')) {
                break;
            } else if (/^\d+:$/.test(l) || /^\d+:\s?$/.test(l)) {
                actualCode.push('');
            }
        }
    }
    return actualCode;
}

for (const l of lines) {
    if (!l) continue;
    try {
        const s = JSON.parse(l);
        if (s.type === 'VIEW_FILE' && s.content.includes('frontend/app/browse/page.tsx')) {
            if (s.content.includes('Showing lines 1 to 120')) {
                chunk1_120 = extractChunk(s.content);
            }
            if (s.content.includes('Showing lines 290 to 310')) {
                chunk290_310 = extractChunk(s.content);
            }
            if (s.content.includes('Showing lines 340 to 400')) {
                chunk340_400 = extractChunk(s.content);
            }
        }
    } catch(e) {}
}

const recoveredContent = [
    "// ==========================================",
    "// RECOVERED FILE FROM AI LOGS (Lines 1-120)",
    "// ==========================================",
    ...chunk1_120,
    "    },",
    "    // ... Add your missing JOURNAL_DATA here ...",
    "};",
    "",
    "// ==========================================",
    "// RECOVERED FILE FROM AI LOGS (Lines 290-310)",
    "// ==========================================",
    ...chunk290_310,
    "",
    "// ==========================================",
    "// RECOVERED FILE FROM AI LOGS (Lines 340-400)",
    "// ==========================================",
    ...chunk340_400,
    "",
    "// ==========================================",
    "// END OF RECOVERED FRAGMENTS",
    "// =========================================="
];

fs.writeFileSync(targetPath, recoveredContent.join('\n'), 'utf8');
console.log('Recovered file written to ' + targetPath);
