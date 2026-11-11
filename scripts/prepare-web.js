/**
 * @file prepare-web.js
 * @description Copies static web application assets into the Capacitor `www/` output folder.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'www');

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const child of fs.readdirSync(src)) {
            copyRecursive(path.join(src, child), path.join(dest, child));
        }
    } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const item of ['index.html', 'manifest.json', 'src', 'assets']) {
    const srcPath = path.join(ROOT_DIR, item);
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, path.join(OUT_DIR, item));
    }
}

console.log('Successfully prepared Capacitor web assets in ./www');
