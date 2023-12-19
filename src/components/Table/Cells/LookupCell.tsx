import { fromOID } from '../../../dal/fromOID';
import { NavLink } from 'react-router-dom';

export function LookupCell<TV extends EntityBase, T extends EntityBase>(property: keyof TV & string) {
    function InnerLookupCell(props: MRT_ColumnDefFunctionParams<'Edit', TV, T>) {
        const value = props.cell.getValue() as Optional<Entity<TV>>;
        const path = value ? ['/data', value.objectSchema().name, fromOID(value._id)].join('/') : '';
        return value != null ? (
            <NavLink to={path} className='flex items-center justify-center w-auto h-full transition-all duration-500 ease-in-out delay-75 hover:bg-lime-500 min-w-fit hover:text-white'>
                {value[property] as string}
            </NavLink>
        ) : null;
    };
    return InnerLookupCell;
}
