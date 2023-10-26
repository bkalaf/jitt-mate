import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { LabelContents } from './LabelContents';
import { IconContents } from './IconContents';

export function createContents(key: ContentsTypes): React.FunctionComponent<{ icon?: IconDefinition; className?: string; children?: string }> {
    console.log(`createContents`, key);
    switch (key) {
        case 'icon': {
            return IconContents;
        }
        case 'label': {
            return LabelContents;
        }
    }
}
