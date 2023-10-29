import * as fs from 'graceful-fs';
import * as path from 'path';

const root = '/home/bobby/Desktop/jitt/jitt/src';
const ignore = 'assets';

type IFileInfo = {
    name: string;
    fullname: string;
    isFolder: false;
    isHook: boolean;
    isProvider: boolean;
    isContext: boolean;
    isCell: boolean;
    isView: boolean;
    isControl: boolean;
    isButton: boolean;
    isPage: boolean;
    isOf: boolean;
    isForm: boolean;
    isFrom: boolean;
    isFor: boolean;
    isTo: boolean;
    isQuery: boolean;
    isMutation: boolean;
    isInterface: boolean;
    isFunction: boolean;
    isEnum: boolean;
    isRealmClass: boolean;
    isTablePart: boolean;
    isLoader: boolean;
    isAction: boolean;
    isRoute: boolean;
};
type IFolderInfo = {
    name: string;
    fullname: string;
    isFolder: true;
    contents: IFSInfo[];
};
type IFSInfo = IFileInfo | IFolderInfo;
const objs = [
    'mercariBrand',
    'mercariCategory',
    'mercariSubCategory',
    'mercariSubSubCategory',
    'brand',
    'classifier',
    'product',
    'sku',
    'listing',
    'draft',
    'productImage',
    'scan',
    'locationSegment',
    'hashTag',
    'hashTagUsage',
    'rn',
    'customItemField'
];
const enums = [
    'apparelType',
    'apparelGroup',
    'itemGroup',
    'sleeveType',
    'sizingType',
    'legType',
    'collarType',
    'cuffType',
    'bookType',
    'movieRating',
    'gameRating',
    'necklineType',
    'backlineType',
    'gender',
    'topAdornment'
];
function handleContents(rootDir: string) {
    return (...files: string[]): IFSInfo[] =>
        files.map((x) => {
            const name = [rootDir, x].join('/');
            const isFolder = fs.statSync(name).isDirectory();
            const contents = !isFolder ? undefined : handleContents(name)(...fs.readdirSync(name));
            const n = path.basename(x, path.extname(x)).replace('.', '');
            return isFolder
                ? {
                      name: x,
                      fullname: name,
                      isFolder,
                      contents: contents as IFSInfo[]
                  }
                : {
                      name: x,
                      fullname: name,
                      isFolder: false,
                      isTo: n.startsWith('to'),
                      isFor: n.startsWith('for'),
                      isFrom: n.startsWith('from'),
                      isRoute: !n.startsWith('use') && n.endsWith('Route'),
                      isAction: !n.startsWith('use') && n.endsWith('Actions'),
                      isLoader: !n.startsWith('use') && n.endsWith('Loader'),
                      isHook: n.startsWith('use'),
                      isProvider: !n.startsWith('use') && n.endsWith('Provider'),
                      isContext: !n.startsWith('use') && n.endsWith('Context'),
                      isCell: !n.startsWith('use') && n.endsWith('Cell'),
                      isView: !n.startsWith('use') && n.endsWith('View'),
                      isControl: !n.startsWith('use') && n.endsWith('Control'),
                      isButton: !n.startsWith('use') && n.endsWith('Buttton'),
                      isPage: !n.startsWith('use') && n.endsWith('Page'),
                      isOf: !n.startsWith('use') && n.startsWith('of'),
                      isForm: !n.startsWith('use') && n.endsWith('Form'),
                      isTablePart: !n.startsWith('use') && n.includes('Table') && !n.endsWith('Context') && !n.endsWith('Cell') ,
                      isMutation: !n.startsWith('use') && (n.endsWith('One') || n.endsWith('Many') || n.startsWith('insert') || n.startsWith('update') || n.startsWith('delete')),
                      isQuery: !n.startsWith('use') && (n.startsWith('fetch')),
                      isInterface: !n.startsWith('use') && n.startsWith('I') && n.substring(1, 2).toUpperCase() === n.substring(1, 2),
                      isFunction: !n.startsWith('use') && n.endsWith('Function'),
                      isRealmClass: !n.startsWith('use') && objs.some((y) => n.toLowerCase() === y.toLowerCase()),
                      isEnum: !n.startsWith('use') && enums.some((y) => n.toLowerCase().includes(y.toLowerCase()))
                  };
        });
}
// folders.map(x => [root, x].join('/')).map(x => {
//     const isDirectory = fs.statSync(x).isDirectory();
//     return {
//         name: x,
//         isFolder: isDirectory,
//         contents: isDirectory ? fs.readdirSync(x) : undefined
//     }
// }

const dests = {
    cell: ['components/Table/Cells', []],
    context: ['components/Contexts', []],
    control: ['components/Forms/Controls', []],
    form: ['components/Forms', []],
    hook: ['hooks', []],
    mutation: ['fetch/mutation', []],
    of: ['util/of', []],
    from: ['util/from', []],
    page: ['components/Pages', []],
    provider: ['contexts/Providers', []],
    query: ['fetch/query', []],
    to: ['util/to', []],
    tablePart: ['components/Table', []],
    view: ['components/Views', []],
    enum: ['DTO/enums', []],
    realmClass: ['DTO', []],
    function: ['common/functions', []],
    button: ['components/Button', []],
    interface: ['types', []],
    loader: ['routing/loaders', []],
    action: ['routing/actions', []],
    route: ['routing/routes', []]
};

function addToDest(key: keyof typeof dests, value: string) {
    const [dir, list] = dests[key] as [string, string[]]
    const fullpath = [root, dir].join('/');
    if (fullpath === path.dirname(value)) {
        console.log(`fullpath: ${fullpath} value: ${value}`)
        return;
    }
    dests[key] = [dir, [...list, value]] as any;
}
const folders = handleContents(root)(...fs.readdirSync(root).filter((x) => x !== ignore));
const flatten = (f: IFSInfo): IFileInfo[] => (f.isFolder ? f.contents.map(flatten).reduce((pv, cv) => [...pv, ...cv], []) : [f]);
const flattened = folders.map(flatten).reduce((pv, cv) => [...pv,...cv], []);

flattened.forEach((x) => {
    if (x.isButton) addToDest('button', x.fullname);
    if (x.isCell) addToDest('cell', x.fullname);
    if (x.isContext) addToDest('context', x.fullname);
    if (x.isControl) addToDest('control', x.fullname);
    if (x.isEnum) addToDest('enum', x.fullname);
    if (x.isHook) addToDest('hook', x.fullname);
    if (x.isForm) addToDest('form', x.fullname);
    if (x.isInterface) addToDest('interface', x.fullname);
    if (x.isMutation) addToDest('mutation', x.fullname);
    if (x.isOf) addToDest('of', x.fullname);
    if (x.isQuery) addToDest('query', x.fullname);
    if (x.isPage) addToDest('page', x.fullname);
    if (x.isProvider) addToDest('provider', x.fullname);
    if (x.isQuery) addToDest('query', x.fullname);
    if (x.isRealmClass) addToDest('realmClass', x.fullname);
    if (x.isView) addToDest('view', x.fullname);
    if (x.isTablePart) addToDest('tablePart', x.fullname)
    if (x.isFunction) addToDest('function', x.fullname);
    if (x.isRoute) addToDest('route', x.fullname);
    if (x.isAction) addToDest('action', x.fullname);
    if (x.isLoader) addToDest('loader', x.fullname);

})
fs.writeFileSync([root, 'fsDestinationInfos.json'].join('/'), JSON.stringify(dests, null, '\t'));
console.log(JSON.stringify(folders, null, '\t'));
fs.writeFileSync([root, 'fsinfo.json'].join('/'), JSON.stringify(folders, null, '\t'));
