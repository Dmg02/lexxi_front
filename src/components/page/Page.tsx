import { ReactNode, forwardRef } from 'react'
import { BoxProps, Box } from '@mui/material'

interface IPageProps extends BoxProps {
    children: ReactNode
    title?: string
    favicon?: string
}

export const Page = forwardRef<HTMLDivElement, IPageProps>(({ children, title = '', favicon, ...other }, ref) => {
    return (
        <Box ref={ref} {...other}>
            {children}
        </Box>
    )
})
