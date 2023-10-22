import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();
    console.info('error', error);
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <div>
                    <h1>Oops!</h1>
                    <h2>{error.status}</h2>
                    <p>{error.statusText}</p>
                    {error.data?.message && <p>{error.data.message}</p>}
                </div>
                <div>
                    <button className='bg-red-500 border-white border-2 text-white uppercase font-bold text-xl' onClick={() => navigate('/')}>
                        Redirect
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div>Oops</div>
                <div>
                    <button className='bg-red-500 border-white border-2 text-white uppercase font-bold text-xl' onClick={() => navigate('/')}>
                        Redirect
                    </button>
                </div>
            </div>
        );
    }
}
