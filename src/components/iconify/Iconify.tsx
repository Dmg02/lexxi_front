import { forwardRef } from 'react';
import { Icon, IconifyIcon  } from '@iconify/react';
import { Box, BoxProps } from '@mui/material';

type IconifyProps = IconifyIcon | string;
interface Props extends BoxProps {
    icon: IconifyProps;
}

const Iconify = forwardRef<SVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
    <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
));

export default Iconify;
