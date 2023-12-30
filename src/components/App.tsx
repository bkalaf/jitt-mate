import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { RealmProvider } from './Providers/RealmProvider';
import { catchError } from './catchError';
import { ToasterProvider } from './Providers/ToasterProvider';
import { LocalForageProvider } from './Providers/LocalForageProvider';
import { router } from './router';
import { ReflectionProvider } from './Contexts/ReflectionProvider';
import { ThemeProvider, createTheme } from '@mui/material';
import * as colors from 'tailwindcss/colors';
import { $$queryClient } from './$$queryClient';
import { AppConfigProvider } from './Contexts/AppConfigContext';

export function alertError(err: unknown) {
    alert((err as Error).message);
    catchError(err);
}
const theme = createTheme({
    palette: {
        callout: {
            light: colors.rose[300],
            main: colors.rose[500],
            dark: colors.rose[800],
            contrastText: colors.white
        },
        neutral: {
            light: colors.gray[300],
            main: colors.gray[500],
            dark: colors.gray[800],
            contrastText: colors.white
        },
        neon: {
            light: colors.lime[300],
            main: colors.lime[500],
            dark: colors.lime[800],
            contrastText: colors.black
        },
        highlight: {
            light: colors.fuchsia[300],
            main: colors.fuchsia[500],
            dark: colors.fuchsia[800],
            contrastText: colors.white
        },
        metal: {
            light: colors.slate[300],
            main: colors.slate[500],
            dark: colors.slate[800],
            contrastText: colors.white
        },
        important: {
            light: colors.cyan[300],
            main: colors.cyan[500],
            dark: colors.cyan[800],
            contrastText: colors.white
        },
        caution: {
            light: colors.yellow[300],
            main: colors.yellow[500],
            dark: colors.yellow[800],
            contrastText: colors.black
        }
    }
});

export function App() {
    return (
        <AppConfigProvider>
            <ThemeProvider theme={theme}>
                <LocalForageProvider>
                    <QueryClientProvider client={$$queryClient}>
                        <ToasterProvider>
                            <RealmProvider>
                                <ReflectionProvider>
                                    <RouterProvider router={router} />
                                </ReflectionProvider>
                            </RealmProvider>
                        </ToasterProvider>
                    </QueryClientProvider>
                </LocalForageProvider>
            </ThemeProvider>
        </AppConfigProvider>
    );
}
