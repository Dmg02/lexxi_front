import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

export function useCustomColors() {
  const theme = useTheme();

  return {
    getAlpha: (color: string, opacity: number) => alpha(color, opacity),
    getPrimaryWithAlpha: (opacity: number) => alpha(theme.palette.primary.main, opacity),
    getBackgroundWithAlpha: (opacity: number) => alpha(theme.palette.background.default, opacity),
    // Add more custom color functions as needed
  };
}