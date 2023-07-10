import { readdirSync, readFileSync } from 'fs';
import { extname } from 'path';

try {
    const i18n = JSON.parse(readFileSync(`./i18n.json`, 'utf-8'));
    const i18nKeys = Object.keys(i18n);

    const files = readdirSync(`./dist`, 'utf-8');

    files.forEach(filename => {
        if (extname(filename) === '.js') {
            const fileContent = readFileSync(`./dist/${filename}`, 'utf-8');
            const test1 = i18nKeys.every(key => {
                if (fileContent.includes(`i18n('${key}')`)) {
                    console.log(`Найдено i18n('${key}')`);
                    return false;
                }
                return true;
            });
            const test2 = i18nKeys.every(key => {
                if (fileContent.includes(`i18n("${key}")`)) {
                    console.log(`Найдено i18n('${key}')`);
                    return false;
                }
                return true;
            });

            if (test1 === false || test2 === false) {
                console.log('Найден как минимум 1 вызов i18n');
                process.exit(1);
            }
        }
    });
} catch (e) {
    console.log('Unknown error');
    console.log(e);
    process.exit(1);
}
