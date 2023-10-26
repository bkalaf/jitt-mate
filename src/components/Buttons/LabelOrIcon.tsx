import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import * as Config from './../../config.json';
import { createContents } from '../Contents/createContents';

export function LabelOrIcon(props: { children: string; } | { children?: string; icon?: IconDefinition; className?: string; } | { icon: IconDefinition; className?: string; }) {
    const contents = Config.UI.button['icon&label'] as ContentsType[];
    console.log(`contents`, contents);
    const p: { children?: string; className?: string; icon?: IconDefinition; } = { children: undefined, className: undefined, icon: undefined, ...props };
    console.log(`p`, p);
    return (
        <>
            {contents.map(x => createContents(x)).map((El, ix) => (
        
                <El key={ix} icon={p.icon} className={p.className}>
                    {p.children}
                </El>                  
            ))}
        </>
    );
}
