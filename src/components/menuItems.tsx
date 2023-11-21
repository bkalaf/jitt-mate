import { Box } from '@mui/material';
import { useRealmContext } from '../hooks/useRealmContext';
import { toProperFromCamel } from '../common/text/toProperCase';
import { elementColors } from '../dto/collections/elementColors';

export function TemporaryPlaceholder() {
    return <h4 className='flex justify-center w-full text-2xl font-extrabold text-center font-rubik'>LOADING...</h4>;
}

const toNode = (text: string, colorKey: keyof typeof elementColors, ...children: Array<[string, { value: string; label: string; children: any[]; color: string }]>) =>
    [
        text,
        {
            value: text,
            label: toProperFromCamel(text),
            children: children,
            color: elementColors[colorKey]
        }
    ] as [string, { value: string; label: string; children: any[]; color: string }];

const list = [
    toNode('mercari', 'blue', toNode('mercariBrand', 'cyan'), toNode('mercariCategory', 'cyan'), toNode('mercariSubCategory', 'cyan'), toNode('mercariSubSubCategory', 'cyan')),
    toNode('products', 'rose', toNode('brand', 'pink'), toNode('productLine', 'pink'), toNode('product', 'pink'), toNode('classifier', 'pink')),
    toNode('files', 'slate', toNode('productImage', 'neutral'), toNode('attachment', 'neutral')),
    toNode('inventory', 'orange', toNode('locationSegment', 'yellow'), toNode('sku', 'yellow')),
    toNode('details', 'green', toNode('apparel', 'lime'), toNode('media', 'lime'), toNode('cable', 'lime')),
    toNode('sales', 'purple', toNode('draft', 'magenta'), toNode('listing', 'magenta'))
];

export const menuItems = Object.fromEntries(list.map(([name, x]) => [name, { ...x, children: Object.fromEntries(x.children) }]));
console.log(JSON.stringify(menuItems, null, '\t'));

