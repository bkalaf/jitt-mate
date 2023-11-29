import React from 'react';
import { AutocompleteRenderGroupParams } from '@mui/material';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { $cn } from '../../util/$cn';
import { GroupItems, GroupHeader } from './ProductTaxonomy';

export function renderGroup(props: AutocompleteRenderGroupParams) {
    const { key, group, children } = props;
    console.log('renderGroup', React.Children.toArray(children));
    console.log(React.Children.toArray(children)[0]);
    const disabled = (React.Children.toArray(children)[0] as JSX.Element).props['aria-disabled'];
    console.log(disabled);
    const cn = $cn({}, { hidden: disabled ?? false }, 'flex flex-col-reverse empty:hidden');
    return (
        <li key={key} {...cn}>
            <GroupItems className='empty:hidden'>{children}</GroupItems>
            <GroupHeader className='only:hidden'>{toProperFromCamel(group)}</GroupHeader>
        </li>
    );
}
