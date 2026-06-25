const fs = require('fs');

const logPath = 'c:\\Users\\balya\\.gemini\\antigravity\\brain\\d0333db9-14cb-4c4d-b12a-843415043a69\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'c:\\Users\\balya\\Downloads\\orchids-swarn-publication-main\\orchids-swarn-publication-main\\frontend\\app\\browse\\page.tsx';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
for (const line of lines) {
    if (!line) continue;
    const step = JSON.parse(line);
    // Find the step where I viewed frontend/app/browse/page.tsx completely
    // It was step 77 where I viewed 589 lines.
    if (step.step_index === 77 && step.type === 'VIEW_FILE') {
        const content = step.content;
        
        // Extract the actual file content from the tool output
        // The tool output format:
        // Created At: ...
        // Completed At: ...
        // File Path: ...
        // Total Lines: ...
        // Total Bytes: ...
        // Showing lines 1 to 589
        // The following code has been modified...
        // 1: ...
        
        const linesArr = content.split('\n');
        let actualCode = [];
        let capturing = false;
        
        for (const l of linesArr) {
            if (l.startsWith('1: ')) {
                capturing = true;
            }
            if (capturing) {
                // Remove line number like "123: "
                const match = l.match(/^\d+:\s(.*)$/);
                if (match) {
                    actualCode.push(match[1]);
                } else if (l.startsWith('The above content shows the entire, complete file contents')) {
                    break;
                } else if (l.startsWith('The above content does NOT show the entire file contents')) {
                    break;
                } else {
                    // Empty lines might just be \r or empty, so they won't match \d+:
                    // wait, empty lines in view_file still have line numbers like "123: "
                    if (/^\d+:$/.test(l)) {
                        actualCode.push('');
                    } else if (/^\d+:\s?$/.test(l)) {
                        actualCode.push('');
                    }
                }
            }
        }
        
        fs.writeFileSync(targetPath, actualCode.join('\n'), 'utf8');
        console.log(`Successfully restored ${actualCode.length} lines to ${targetPath}`);
        break;
    }
}
