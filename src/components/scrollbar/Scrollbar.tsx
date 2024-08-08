import { memo } from 'react';
import { Box } from '@mui/material';
import { Props } from 'simplebar-react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import SimpleBar from 'simplebar-react';
import { alpha, styled } from '@mui/material/styles';

interface ScrollbarProps extends Props {
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
}

export default memo(function Scrollbar({ children, sx, ...other }: ScrollbarProps) {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
        return (
            <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
                {children}
            </Box>
        );
    }

    return (
        <StyledRootScrollbar>
            <StyledScrollbar clickOnTrack={false} sx={sx} {...other}>
                {children}
            </StyledScrollbar>
        </StyledRootScrollbar>
    );
});

const StyledRootScrollbar = styled('div')(() => ({
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
}));

const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
    maxHeight: '100%',
    '& .simplebar-scrollbar': {
        '&:before': {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
        },
        '&.simplebar-visible:before': {
            opacity: 1,
        },
    },
    '& .simplebar-mask': {
        zIndex: 'inherit',
    },
}));
