import { pipeDecorators } from '../pipeDecorators';
import { datatype } from '../decorators/datatype';
import { outputFormatter } from '../decorators/outputFormatter';
import { initializer } from '../decorators/initializer';
import { dateFromNow } from '../../common/date/dateFromNow';


export const asCurrentTimestamp = pipeDecorators(datatype('date'), outputFormatter(x => x.toLocaleString()), initializer(async () => dateFromNow()));
