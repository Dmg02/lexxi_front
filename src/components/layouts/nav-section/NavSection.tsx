import useActiveLink from '@/hooks/useActiveLink';
import { ICON, NAV } from '@/utils/cssStyles';
import {
    alpha,
    styled,
    List,
    Stack,
    StackProps,
    ListItemButtonProps,
    ListItemIcon,
    ListSubheader,
    ListItemButton,
    Link as MuiLink,
    ListItemText,
} from '@mui/material';
import Link from "next/link";

type StyledItemProps = Omit<NavItemProps, 'item'> & {
    caption?: boolean;
    disabled?: boolean;
};

type NavListRootProps = {
    data: NavListProps;
    depth: number;
};

type INavItem = {
    item: NavListProps;
    depth: number;
    open?: boolean;
    active?: boolean;
    isExternalLink?: boolean;
};

type NavItemProps = INavItem & ListItemButtonProps;

type NavListProps = {
    title: string;
    path: string;
    icon?: React.ReactElement;
    info?: React.ReactElement;
    caption?: string;
    disabled?: boolean;
    roles?: string[];
    children?: any;
};

interface NavSectionProps extends StackProps {
    data: {
        subheader: string;
        items: NavListProps[];
    }[];
}

export function NavSection({ data, sx, ...other }: NavSectionProps) {
    return (
        <Stack sx={sx} {...other}>
            {data.map((group) => {
                const key = group.subheader || group.items[0].title;

                return (
                    <List key={key} disablePadding sx={{ px: 2 }}>
                        <StyledSubheader disableSticky sx={{ textAlign: 'start' }}>{`${group.subheader}`}</StyledSubheader>

                        {group.items.map((list) => (
                            <NavList key={list.title + list.path} data={list} depth={1} />
                        ))}
                    </List>
                );
            })}
        </Stack>
    );
}

function NavList({ data, depth }: NavListRootProps) {
    const { active, isExternalLink } = useActiveLink(data.path);

    return <NavItem item={data} depth={depth} open={active} active={active} isExternalLink={isExternalLink} />;
}

function NavItem({ item, depth, open, active, isExternalLink, ...other }: NavItemProps) {
    const { title, path, icon, disabled, caption } = item;

    return (
        <Link href={path}>
            <StyledItem depth={depth} active={active} disabled={disabled} caption={!!caption} {...other}>
                <StyledIcon>{icon}</StyledIcon>
                <ListItemText primary={`${title}`} />
            </StyledItem>
        </Link>
    );
}

const StyledItem = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'active' && prop !== 'caption',
})<StyledItemProps>(({ active, disabled, depth, caption, theme }) => {
    const isLight = theme.palette.mode === 'light';

    const subItem = depth !== 1;

    const activeStyle = {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        ...(!isLight && {
            color: theme.palette.primary.light,
        }),
    };

    const activeSubStyle = {
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
    };

    return {
        position: 'relative',
        textTransform: 'capitalize',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1.5),
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        height: NAV.H_DASHBOARD_ITEM,

        ...(subItem && {
            height: NAV.H_DASHBOARD_ITEM_SUB,
            ...(depth > 2 && {
                paddingLeft: theme.spacing(depth),
            }),
            ...(caption && {
                height: NAV.H_DASHBOARD_ITEM,
            }),
        }),

        ...(active && {
            ...activeStyle,
            '&:hover': {
                ...activeStyle,
            },
        }),

        ...(subItem &&
            active && {
                ...activeSubStyle,
                '&:hover': {
                    ...activeSubStyle,
                },
            }),

        ...(disabled && {
            '&.Mui-disabled': {
                opacity: 0.64,
            },
        }),
    };
});

const StyledIcon = styled(ListItemIcon)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON.NAV_ITEM,
    height: ICON.NAV_ITEM,
});

const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
    ...theme.typography.overline,
    fontSize: 11,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
}));
