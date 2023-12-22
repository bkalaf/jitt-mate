import { fromOID } from '../../../dal/fromOID';
import { NavLink } from 'react-router-dom';
import { getProperty } from '../../Contexts/getProperty';

export function LookupCell<TV extends EntityBase, T extends EntityBase>(property: (keyof TV & string) | ((x: T) => string)) {
    function InnerLookupCell(props: MRT_ColumnDefFunctionParams<'Edit', TV, T>) {
        const value = props.cell.getValue() as Optional<Entity<TV>>;
        const path = value ? ['/data', value.objectSchema().name, fromOID(value._id)].join('/') : '';
        const handler = typeof property === 'function' ? property : (x: T) => getProperty(property as string)(x) as string;
        return value != null ? (
            <NavLink to={path} className='flex items-center justify-center w-auto h-full transition-all duration-500 ease-in-out delay-75 hover:bg-lime-500 min-w-fit hover:text-white'>
                {value ? handler(value as any) : null}
            </NavLink>
        ) : null;
    }
    return InnerLookupCell;
}
