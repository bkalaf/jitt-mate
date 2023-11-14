import { createRow } from 'material-react-table';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { IRealmObject } from '../../../dal/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoltLightning, faDumpsterFire, faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';
import { BSON } from 'mongodb';
import { toOID } from '../../../dal/toOID';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { MRT_TableOptionFunctionParams } from '../CollectionTableMRT';

export function createRenderToolbarInternalActions<T extends AnyObject>(outerProps: { defaultObject?: Partial<T> }) {
    function RenderToolbarInternalActions<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderToolbarInternalActions'>) {
        const collectionName = useCollectionRoute();
        const onClickInsert = useCallback(
            () => props.table.setCreatingRow(createRow(props.table, (outerProps.defaultObject as T) ?? ({ _id: new BSON.ObjectId() } as any as T) ?? true)),
            [props.table]
        );
        const db = useLocalRealm();
        const invalidator = useInvalidator(collectionName);
        const onClickLightning = useCallback(() => {
            const updaters = Object.entries(props.table.getState().rowSelection)
                .filter((x) => x[1])
                .map((x) => x[0])
                .map(toOID);
            updaters
                .filter((x) => x != null)
                .map((oid: BSON.ObjectId) => db.objectForPrimaryKey<IRealmObject<any>>(collectionName, oid))
                .forEach((obj) => obj?.update());
            invalidator.onSuccess();
        }, [collectionName, db, invalidator, props.table]);
        const onClickDelete = useCallback(() => {
            const oids = Object.entries(props.table.getState().rowSelection)
                .filter((x) => x[1])
                .map((x) => x[0])
                .map(toOID)
                .map((x) => db.objectForPrimaryKey(collectionName, x));
            db.delete(oids);
            invalidator.onSuccess();
        }, [collectionName, db, invalidator, props.table]);
        return (
            <>
                <IconButton color='info' className='flex' title='Insert a new record.' onClick={onClickInsert}>
                    <FontAwesomeIcon icon={faSquarePlus} className='w-5 h-5' />
                </IconButton>
                <IconButton color='warning' className='flex' title='Update a record' onClick={onClickLightning} disabled={!props.table.getIsSomeRowsSelected()}>
                    <FontAwesomeIcon icon={faBoltLightning} className='w-5 h-5' />
                </IconButton>
                <IconButton color='error' className='flex' title='Delete selection' onClick={onClickDelete} disabled={!props.table.getIsSomeRowsSelected()}>
                    <FontAwesomeIcon icon={faDumpsterFire} className='w-5 h-5' />
                </IconButton>
            </>
        );
    }
    return RenderToolbarInternalActions;
}
