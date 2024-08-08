import 'react-perfect-scrollbar/dist/css/styles.css'
import '@/app/globals.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import ThemeProvider from '@/utils/theme'

export const metadata = {
  title: 'App title',
  description: 'App description'
}

const RootLayout = ({ children }: any) => {
  const direction = 'ltr';

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <AppRouterCacheProvider>
          <ThemeProvider>
              {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
    </html>
  )
}

export default RootLayout
