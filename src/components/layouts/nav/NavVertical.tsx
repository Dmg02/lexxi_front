"use client"
import { useEffect } from 'react';
import { Box, Stack, Drawer } from '@mui/material';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { NAV } from '@/utils/cssStyles';
import useResponsive from '@/hooks/useResponsive';
import { useThemeMode } from '@/utils/theme';
import { NavSection } from '../nav-section/NavSection';
import { usePathname, useRouter } from 'next/navigation'

type Props = {
    openNav: boolean;
    onCloseNav: VoidFunction;
};

export function NavVertical({ openNav, onCloseNav }: Props) {
    const { darkMode } = useThemeMode();
    const router = useRouter()
    const pathname = usePathname();


    const isDesktop = useResponsive('up', 'lg');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
    }, [pathname]);

    return (
        <Box component='nav' sx={{ flexShrink: { lg: 0 }, width: { lg: NAV.W_DASHBOARD } }}>
            <Drawer
                {...(isDesktop
                    ? {
                          open: true,
                          variant: 'permanent',
                          PaperProps: {
                              sx: { zIndex: 0, width: NAV.W_DASHBOARD, bgcolor: 'transparent', borderRightStyle: 'dashed' },
                          },
                      }
                    : {
                          open: openNav,
                          onClose: onCloseNav,
                          ModalProps: { keepMounted: true },
                          PaperProps: { sx: { width: NAV.W_DASHBOARD } },
                      })}
            >
                <Scrollbar sx={{ height: 1, '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' } }}>
                    <Stack spacing={3} sx={{ pt: 3, pb: 2, px: 2.5, flexShrink: 0 }}>
                        <Box>
                            <img src={darkMode ? '/sticker.webp' : '/sticker.webp'} onClick={() => router.push('/')} style={{ cursor: 'pointer' }} />
                        </Box>
                    </Stack>
                    <NavSection data={[{
                        subheader: 'General',
                        items: [
                            { title: 'Trials', path: '/trials' },
                            { title: 'My trials', path: '/my_trials' },
                        ],
                    }]} />
                    <Box sx={{ flexGrow: 1 }} />
                </Scrollbar>
            </Drawer>
        </Box>
    );
}