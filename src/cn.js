const fs = require('fs');
const path = require('path');

function renameFiles(directory, fromExt, toExt) {
    // Read the directory
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(directory, file.name);

            if (file.isDirectory()) {
                // If it's a directory, recursively process it
                renameFiles(fullPath, fromExt, toExt);
            } else {
                // Skip cn.js and .tsx files
                if (file.name === 'cn.js' || path.extname(file.name) === '.tsx') {
                    return;
                }

                // Check if file has the extension we want to change
                if (path.extname(file.name) === fromExt) {
                    const newPath = path.join(
                        directory,
                        path.basename(file.name, fromExt) + toExt
                    );

                    // Rename the file
                    fs.rename(fullPath, newPath, err => {
                        if (err) {
                            console.error(`Error renaming ${file.name}:`, err);
                        } else {
                            console.log(`Renamed ${file.name} to ${path.basename(newPath)}`);
                        }
                    });
                }
            }
        });
    });
}

// Usage example:
// First argument is the directory to start from
// Second argument is the extension to change from (including the dot)
// Third argument is the extension to change to (including the dot)
const args = process.argv.slice(2);
if (args.length !== 3) {
    console.log('Usage: node cn.js <directory> <fromExt> <toExt>');
    console.log('Example: node cn.js . .js .ts');
    process.exit(1);
}

const [directory, fromExt, toExt] = args;
renameFiles(path.resolve(directory), fromExt, toExt);