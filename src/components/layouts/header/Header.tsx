import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, IconButton, Box } from '@mui/material';
import AccountPopover from './AccountPopover';
import useResponsive from '@/hooks/useResponsive';
import { HEADER, NAV, bgBlur } from '@/utils/cssStyles';
import Iconify from '@/components/iconify/Iconify';


export function Header({ onOpenNav }: { onOpenNav?: VoidFunction }) {
    const theme = useTheme();
    const isDesktop = useResponsive('up', 'lg');


    return (
        <AppBar
            sx={{
                borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
                ...bgBlur({ color: theme.palette.background.default }),
                height: HEADER.H_MOBILE,
                ...(isDesktop && {
                    width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
                    height: HEADER.H_DASHBOARD_DESKTOP,
                }),
            }}
        >

            <Toolbar sx={{ height: 1, px: { lg: 5 }, py: { xs: 1, lg: 0 }, pl: !isDesktop ? 1 : undefined  }}>
                {!isDesktop && (
                    <IconButton onClick={onOpenNav} sx={{ color: 'text.primary' }}>
                        <Iconify icon='eva:menu-2-fill' />
                    </IconButton>
                )}

                <Stack flexGrow={1} direction='row' alignItems='center' justifyContent='flex-end' spacing={{ xs: 0.5, md: 3 }}>
                    <Box>
                    </Box>
                    <AccountPopover />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}