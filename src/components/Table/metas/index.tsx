import { intDefinition } from './$intDefinition';
import { boolDefinition } from './$boolDefinition';
import { enumDefinition } from './$enumDefinition';
import { flagsDefinition } from './$flagsDefinition';
import { lookupDefinition } from './$lookupDefinition';
import { floatDefinition } from './$floatDefinition';
import { percentageDefinition } from './$percentageDefinition';
import { objectIdMeta } from './objectIdMeta';
import { dollarDefinition } from './$dollarDefinition';
import { dictionaryDefinition } from './$dictionaryDefinition';
import { setDefinition } from './$setMeta';
import { listDefinition } from './$listDefinition';
import { dateDefinition } from './$dateDefinition';
import { barcodeDefinition } from './$barcodeDefinition';
import { stringDefinition } from './$stringDefinition';
import { clothingCareDefinition } from './$clothingCareDefinition';
import { embedDefinition } from './$embedDefinition';
import { materialsDefinition } from './$materialsDefinition';
import { imageDefinition } from './$imageDefinition';
import { toHeader } from '../toHeader';
import { Path, TextareaAutosizeElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { radioDefinition } from './radioDefinition';

export function JITTTextBlockControl(
    {
        maxLength,
        minLength,
        readOnly,
        required,
        rows,
        minRows,
        maxRows
    }: { maxLength?: number; minLength?: number; readOnly?: boolean; required?: boolean; rows?: number; minRows?: number; maxRows?: number } = {},
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    function InnerJITTTextBlockControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const { control, classes, disabled, label, name, onBlur } = useDependencies(props, initialDisable, ...dependencies);
        return (
            <TextareaAutosizeElement
                name={name}
                classes={classes}
                disabled={disabled}
                label={label}
                onBlur={onBlur}
                control={control}
                minRows={minRows ?? 3}
                maxRows={maxRows ?? 10}
                rows={rows}
                required={required}
                aria-readonly={readOnly}
                validation={{
                    required: required ?? false ? 'This field is required.' : undefined,
                    maxLength: maxLength
                        ? {
                              value: maxLength,
                              message: `This field has a maximum length of ${maxLength} characters.`
                          }
                        : undefined,
                    minLength: minLength
                        ? {
                              value: minLength,
                              message: `This field has a minimum length of ${minLength} characters.`
                          }
                        : undefined
                }}
            />
        );
    }

    return InnerJITTTextBlockControl;
}
export function textBlockDefinition<T extends MRT_RowData>(
    name: Path<T>,
    opts: { header?: string; maxLength?: number; minLength?: number; readOnly?: boolean; required?: boolean; rows?: number; minRows?: number; maxRows?: number } = {},
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    return {
        accessorKey: name,
        header: toHeader(opts, name),
        Edit: JITTTextBlockControl(opts, initialDisable, ...dependencies)
    };
}
export const $metas = {
    // dbList: dbListMeta,
    barcode: barcodeDefinition,
    bool: boolDefinition,
    clothingCare: clothingCareDefinition,
    date: dateDefinition,
    dictionary: dictionaryDefinition,
    dollar: dollarDefinition,
    embed: embedDefinition,
    enum: enumDefinition,
    flags: flagsDefinition,
    float: floatDefinition,
    int: intDefinition,
    image: imageDefinition,
    list: listDefinition,
    lookup: lookupDefinition,
    materials: materialsDefinition,
    oid: objectIdMeta,
    percent: percentageDefinition,
    radio: radioDefinition,
    set: setDefinition,
    string: stringDefinition,
    textBlock: textBlockDefinition
};
