import { alpha } from '@mui/material/styles';

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        neutral: string;
    }
    interface SimplePaletteColorOptions {
        lighter: string;
        darker: string;
    }
    interface PaletteColor {
        lighter: string;
        darker: string;
    }
}

const GREY = {
    0: '#FFFFFF',
    100: '#F7F7F5', // Notion-inspired grey
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#5D5B57', // Text menu color
    600: '#373530', // Main text color
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
};

const PRIMARY = {
    lighter: '#F0F0F0',
    light: '#E0E0E0',
    main: '#0070F3', // A blue color similar to Vercel/Next.js
    dark: '#0050A0',
    darker: '#003070',
    contrastText: '#FFFFFF',
};

const SECONDARY = {
    lighter: '#D6E4FF',
    light: '#84A9FF',
    main: '#3366FF',
    dark: '#1939B7',
    darker: '#091A7A',
    contrastText: '#FFFFFF',
};

const INFO = {
    lighter: '#CAFDF5',
    light: '#61F3F3',
    main: '#00B8D9',
    dark: '#006C9C',
    darker: '#003768',
    contrastText: '#FFFFFF',
};

const SUCCESS = {
    lighter: '#D8FBDE',
    light: '#86E8AB',
    main: '#36B37E',
    dark: '#1B806A',
    darker: '#0A5554',
    contrastText: '#FFFFFF',
};

const WARNING = {
    lighter: '#FFF5CC',
    light: '#FFD666',
    main: '#FFAB00',
    dark: '#B76E00',
    darker: '#7A4100',
    contrastText: GREY[800],
};

const ERROR = {
    lighter: '#FFE9D5',
    light: '#FFAC82',
    main: '#FF5630',
    dark: '#B71D18',
    darker: '#7A0916',
    contrastText: '#FFFFFF',
};

const COMMON = {
    common: { black: '#000000', white: '#FFFFFF' },
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: alpha(GREY[500], 0.24),
    action: {
        hover: alpha(GREY[500], 0.08),
        selected: alpha(GREY[500], 0.16),
        disabled: alpha(GREY[500], 0.8),
        disabledBackground: alpha(GREY[500], 0.24),
        focus: alpha(GREY[500], 0.24),
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
    textColors: {
        primary: GREY[600],
        secondary: GREY[500],
        disabled: GREY[400],
    },
};

export default function palette(themeMode: 'light' | 'dark') {
    return themeMode === 'light' ? lightPalette : darkPalette;
}

export const lightPalette = {
    ...COMMON,
    mode: 'light',
    text: {
        primary: GREY[600], // Main text color
        secondary: GREY[500], // Text menu color
        disabled: GREY[400],    
    },
    background: {
        paper: '#FFFFFF',
        default: '#FFFFFF',
        neutral: GREY[100] // Notion-inspired grey
    },
    action: {
        ...COMMON.action,
        active: GREY[600],
    },
} as const;

export const darkPalette = {
    ...COMMON,
    mode: 'dark',
    text: {
        primary: '#FFFFFF',
        secondary: GREY[400],
        disabled: GREY[500],
    },
    background: {
        paper: '#1F1F1F', // Dark theme background
        default: '#1F1F1F',
        neutral: '#2F2F2F',
    },
    action: {
        ...COMMON.action,
        active: GREY[400],
    },
} as const;
