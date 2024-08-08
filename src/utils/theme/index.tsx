'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions, StyledEngineProvider, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { createCustomShadow } from './customShadows';
import { createShadow } from './shadows';
import GlobalStyles from './globalStyles';
import typography from './typography';

type Props = {
    children: React.ReactNode;
};

type TThemeContext = {
    darkMode: boolean;
    changeMode: (v: boolean) => void;
}
const ThemeContext = createContext<TThemeContext>({} as TThemeContext);

export const useThemeMode = () => useContext(ThemeContext);


export default function ThemeProvider({ children }: Props) {
    const [darkMode, setDarkMode] = useState(false)

    const changeMode = useCallback((mode: boolean) => {
        localStorage.setItem('mode', String(mode) === 'true' ? 'dark' : 'light')
        setDarkMode(localStorage.getItem('mode') === 'dark' ? true : false)
    }, []);

    const themeOptions: ThemeOptions = {
        palette: darkMode ? darkPalette : lightPalette,
        typography,
        shape: { borderRadius: 8 },
        shadows: createShadow(),
        customShadows: createCustomShadow() as any,
    };

    const theme = createTheme(themeOptions);

    return (
        <ThemeContext.Provider value={{darkMode, changeMode}}>
            <StyledEngineProvider injectFirst>
                <MUIThemeProvider theme={theme}>
                    <CssBaseline />
                    <GlobalStyles />
                    {children}
                </MUIThemeProvider>
            </StyledEngineProvider>
        </ThemeContext.Provider>
    );
}
