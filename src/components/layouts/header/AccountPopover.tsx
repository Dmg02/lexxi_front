import { useState } from 'react';
import { Divider, Typography, MenuItem, Stack, Switch, useTheme, Avatar, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useThemeMode } from '@/utils/theme';
import MenuPopover from '@/components/menu-popover/MenuPopover';
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/useAuth';

export default function AccountPopover() {
    const { darkMode, changeMode } = useThemeMode()
    const theme = useTheme();
    const router = useRouter();
    const { user } = useAuth()

    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    };
    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    return (
        <>
            <IconButton
                onClick={handleOpenPopover}
                sx={{
                    p: 0,
                    ...(openPopover && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar />
            </IconButton>

            <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
                <Stack sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant='subtitle2' noWrap>{user.email}</Typography>
                    <Typography variant='caption' noWrap>{user.role}</Typography>

                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography>Dark mode</Typography>
                        <Switch
                            checked={darkMode}
                            onClick={(e: any) => changeMode(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                  },
                                }}
                        />
                    </Stack>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={async () => {
                    try {
                        await createSupabaseClientSide().auth.signOut();
                        router.push('/login')
                    } catch (error) {
                        console.log('e', error);
                        
                    }
                }} sx={(theme) => ({ m: 1, color: theme.palette.error.main })}>
                    Logout
                </MenuItem>
            </MenuPopover>
        </>
    );
}
