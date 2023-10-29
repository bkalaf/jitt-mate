import { useOverlayContext } from './Contexts/useOverlayContext';
import { Button } from './Buttons/Button';


export function Index() {
    const { pushFrame } = useOverlayContext();
    return (
        <div className='flex'>
            <Button onClick={() => pushFrame(() => <div>HELLO WORLD</div>)}>Test Frame</Button>
        </div>
    );
}
