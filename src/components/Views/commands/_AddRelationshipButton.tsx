import { useCallback } from 'react';
import { useOverlayContext } from '../../Contexts/useOverlayContext';
import { faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { RelationshipView } from '../RelationshipView';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { Row } from '@tanstack/react-table';

/** @deprecated */
export function AddRelationshipButton<T extends EntityBase>({
    listType,
    listOf,
    property,
    row,
    original
}: {
    listType: string;
    listOf: string;
    property: string;
    original: RealmCollections<T>;
    row: Row<T>;
}) {
    const { pushFrame } = useOverlayContext();
    const collectionName = useCollectionRoute();
    const onClick = useCallback(() => {
        pushFrame(RelationshipView, { listType, listOf, property, original: original as RealmCollections<EntityBase>, masterCollection: collectionName, masterRow: row as any });
    }, [collectionName, listOf, listType, original, property, pushFrame, row]);
    return <Button icon={faSquarePlus} onClick={onClick} />;
}
