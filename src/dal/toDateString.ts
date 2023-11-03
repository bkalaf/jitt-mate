import { ofDate } from './ofDate';


export function toDateString(x?: StringOr<number | Date>) {
    return ofDate(x)?.toLocaleString();
}
