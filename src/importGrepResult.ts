import path from 'path';
import { normalizeNewLine } from './dal/normalizeNewLine';
import * as fs from 'graceful-fs';

const ROOT = '/home/bobby/Desktop/jitt/jitt';

function parseRow(row: string) {
    const [relativePath, importStatement] = row.split(':');
    const [_, quotedPath] = importStatement.split(' from ');
    const filePath = quotedPath.replaceAll(';', '').replaceAll("'", '');
    const source = path.join(ROOT, filePath);
}
function importGrepResult(filename?: string) {
    const path1 = path.join(ROOT, '/src/hooks/useColumnDefs');
    const result = path.relative(path1, '/home/bobby/Desktop/jitt/jitt/src/components/Button/index.tsx');
    console.log(path1);
    console.log(result.substring(1));
}
// ./src/components/Button ./src/hooks
// ./src/hooks/useColumnDefs.tsx:import { useCollectionRoute } from './useCollectionRoute';
// ./src/components/Table/Controls/TextFieldInput.tsx:import { identity } from '../../../common/functions/identity';

console.log(path.dirname('./src/components/Table/Controls/TextFieldInput.tsx'));
console.log(path.join(ROOT, path.dirname('./src/components/Table/Controls/TextFieldInput.tsx'), path.dirname('../../../common/functions/identity.tsx    ')));
// const p1 = path.join(ROOT, './src/hooks/useCollectionRoute.tsx');
// const p2 = path.join(ROOT, './src/components/Button/useCollectionRoute.tsx');
// const p3 = path.join(ROOT, './src/hooks/useColumnDefs.tsx');

// // path.relative(sourcePath, importTargetPath).replaceAll(path.extname(importTargetPath), '').substring(1)
// console.log(path.relative(p1, p3))
// console.log(path.relative(p3, p1));
// console.log(path.relative(p2, p3));
// console.log(path.relative(p3 , p2));

// function
// importGrepResult();

//"/home/bobby/Desktop/jitt/jitt/src/components/Contexts/useOverlayContext.tsx",

/* ./src/components/Contexts/Overlay.tsx:import { useOverlayContext } from './useOverlayContext';
./src/components/Table/Cells/useLoadInsertForm.tsx:import { useOverlayContext } from '../../Contexts/useOverlayContext';
./src/components/Index.tsx:import { useOverlayContext } from './Contexts/useOverlayContext';
*/
const name = 'useOverlayContext';
const filename = '/home/bobby/Desktop/jitt/jitt/src/components/Contexts/useOverlayContext.tsx';
const destfolders = 'hooks';
const destname = path.join(ROOT, destfolders, path.basename(filename));

const grepoutput = `./src/components/Contexts/Overlay.tsx:import { useOverlayContext } from './useOverlayContext';
./src/components/Table/Cells/useLoadInsertForm.tsx:import { useOverlayContext } from '../../Contexts/useOverlayContext';
./src/components/Index.tsx:import { useOverlayContext } from './Contexts/useOverlayContext';
`;

normalizeNewLine(grepoutput)
    .split('\n')
    .filter(x => x != null && x.length > 0)
    .map((x) => x.split(':'))
    .map(([target, importStatement]) => {
        const [leftImport, rightImport] = importStatement.split(' from ');
        rightImport.replaceAll(';', '').replaceAll("'", '');
        const relative = path.relative(target , destname);
        console.log(`RELATIVE: ${relative}`)  
        const newImportStatement = [leftImport, " from '", path.join(relative.startsWith('../') ? relative.substring(3) : relative, name), "';"].join('');
        const sourceText = fs.readFileSync(target).toString();
        const nextSource = sourceText.replace(importStatement, newImportStatement);

        console.log(`mv ${filename} ${destname}`);
        console.log(`old-import: ${importStatement}`);
        console.log(`new-import: ${newImportStatement}}`);
        console.log(nextSource);
    });
