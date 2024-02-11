import fs from 'fs';
import path from 'path';
function addJsExtensionToImports(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            addJsExtensionToImports(filePath);
        }
        else if (filePath.endsWith('.js') && !filePath.endsWith('.json')) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/from ['"](\.\/|\.\.\/)([\.\/\w_-]+)['"];/g, "from '$1$2.js';");
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}
addJsExtensionToImports('./dist');
