import fs from 'fs';
import path from 'path';
function addJsExtensionToImports(directory) {
    var files = fs.readdirSync(directory);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path.join(directory, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            addJsExtensionToImports(filePath);
        }
        else if (filePath.endsWith('.js')) {
            var content = fs.readFileSync(filePath, 'utf8');
            // Only replace import paths that are relative (start with './' or '../')
            content = content.replace(/from ['"](\.\/|\.\.\/)([\.\/\w_-]+)['"];/g, "from '$1$2.js';");
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}
addJsExtensionToImports('./dist');
