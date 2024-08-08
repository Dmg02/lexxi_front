"use client"
import { Header } from "@/components/layouts/header/Header";
import { NavVertical } from "@/components/layouts/nav/NavVertical";
import { AuthProvider, useAuth } from "@/context/useAuth";
import useResponsive from "@/hooks/useResponsive";
import { HEADER, NAV } from "@/utils/cssStyles";
import { Box, LinearProgress } from "@mui/material";
import { useState } from "react";

export default function Layout({children}: any) {
  return (
        <AuthProvider>
          <Page>
            {children}
          </Page>
        </AuthProvider>
  );
}


const Page = ({children}) => {
    const [open, setOpen] = useState(false);
    const isDesktop = useResponsive('up', 'lg');
    const { user } = useAuth();

    if (!user) {
        return <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <LinearProgress color='inherit' sx={{ width: 1, maxWidth: 360 }} />
        </Box>
    }

    return (
        <>
        <Header onOpenNav={() => setOpen(true)} />
          <Box sx={{ display: { lg: 'flex' }, minHeight: { lg: 1 } }}>
              <NavVertical openNav={open} onCloseNav={() => setOpen(false)} />
              <Box
                  component='main'
                  sx={{
                      flexGrow: 1,
                      py: `${HEADER.H_MOBILE + 5}px`,
                      px: '8px',
                      ...(isDesktop && {
                          px: 2,
                          py: `${HEADER.H_DASHBOARD_DESKTOP + 8}px`,
                          width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
                      }),
                  }}
              >
                  {children}
              </Box>
          </Box>
          </>
    )
}