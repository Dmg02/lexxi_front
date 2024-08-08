import { PopoverProps, Popover, styled, alpha } from '@mui/material';

type MenuPopoverArrowValue =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-top'
    | 'left-center'
    | 'left-bottom'
    | 'right-top'
    | 'right-center'
    | 'right-bottom';

interface MenuPopoverProps extends Omit<PopoverProps, 'open'> {
    open: HTMLElement | null;
    arrow?: MenuPopoverArrowValue;
    disabledArrow?: boolean;
}

export default function MenuPopover({ open, children, arrow = 'top-right', disabledArrow, sx, ...other }: MenuPopoverProps) {
    return (
        <Popover
            open={!!open}
            anchorEl={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: {
                    p: 1,
                    width: 'auto',
                    overflow: 'inherit',
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        px: 1,
                        typography: 'body2',
                        borderRadius: 0.75,
                        '& svg': { mr: 2, width: 20, height: 20, flexShrink: 0 },
                    },
                    ...sx,
                },
            }}
            {...other}
        >
            {!disabledArrow && <StyledArrow arrow={arrow} />}

            {children}
        </Popover>
    );
}

const StyledArrow = styled('span')<{ arrow: MenuPopoverArrowValue }>(({ arrow, theme }) => {
    const SIZE = 12;

    const POSITION = -(SIZE / 2);

    const borderStyle = `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`;

    const topStyle = {
        borderRadius: '0 0 3px 0',
        top: POSITION,
        borderBottom: borderStyle,
        borderRight: borderStyle,
    };

    const bottomStyle = {
        borderRadius: '3px 0 0 0',
        bottom: POSITION,
        borderTop: borderStyle,
        borderLeft: borderStyle,
    };

    const leftStyle = {
        borderRadius: '0 3px 0 0',
        left: POSITION,
        borderTop: borderStyle,
        borderRight: borderStyle,
    };

    const rightStyle = {
        borderRadius: '0 0 0 3px',
        right: POSITION,
        borderBottom: borderStyle,
        borderLeft: borderStyle,
    };

    return {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            zIndex: 1,
            width: SIZE,
            height: SIZE,
            content: "''",
            display: 'block',
            position: 'absolute',
            transform: 'rotate(-135deg)',
            background: theme.palette.background.paper,
        },
        ...(arrow === 'top-left' && { ...topStyle, left: 20 }),
        ...(arrow === 'top-center' && { ...topStyle, left: 0, right: 0, margin: 'auto' }),
        ...(arrow === 'top-right' && { ...topStyle, right: 20 }),

        ...(arrow === 'bottom-left' && { ...bottomStyle, left: 20 }),
        ...(arrow === 'bottom-center' && { ...bottomStyle, left: 0, right: 0, margin: 'auto' }),
        ...(arrow === 'bottom-right' && { ...bottomStyle, right: 20 }),

        ...(arrow === 'left-top' && { ...leftStyle, top: 20 }),
        ...(arrow === 'left-center' && { ...leftStyle, top: 0, bottom: 0, margin: 'auto' }),
        ...(arrow === 'left-bottom' && { ...leftStyle, bottom: 20 }),

        ...(arrow === 'right-top' && { ...rightStyle, top: 20 }),
        ...(arrow === 'right-center' && { ...rightStyle, top: 0, bottom: 0, margin: 'auto' }),
        ...(arrow === 'right-bottom' && { ...rightStyle, bottom: 20 }),
    };
});
