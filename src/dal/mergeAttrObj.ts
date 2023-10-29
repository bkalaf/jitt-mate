import { AttributeObject, IHashTag } from './types';


export function mergeAttrObj(left: AttributeObject & { hashTags: IHashTag[]; }, right: AttributeObject & { hashTags: IHashTag[]; }) {
    const { hashTags: leftHashTags, ...leftRemain } = left;
    const { hashTags: rightHashTags, ...rightRemain } = right;
    return { hashTags: [...leftHashTags ?? [], ...rightHashTags ?? []], ...leftRemain, ...rightRemain };
}
