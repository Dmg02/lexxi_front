'use client'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Drawer, IconButton, Stack, TextField, Typography } from '@mui/material'
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { CardTrial } from '@/components/card';

export default function HomePage() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [openDetails, setOpenDetails] = useState<any>(null);

    useEffect(() => {
        const fetch = async () => {

            const supabase = createSupabaseClientSide();
            const { data, error } = await supabase
                .from("shared_trials")
                .select("*")
                .eq('case_number', search)

            if (error) {
                console.error('Error:', error);
            } else {
                setData(prev => [...prev, ...data]);
            }

        };

        fetch();
    }, [search])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3">{'Trials'}</Typography>
            <Box sx={{ my: 2 }}>
                <TextField label={'Search'} value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </Box>
            <Stack spacing={0.5} direction={'column'}>
                {data.map((r: any) => <CardTrial record={r} setOpenDetail={setOpenDetails} />)}
            </Stack>
            {openDetails && (
                <Drawer
                    anchor={'right'}
                    open={!!openDetails}
                    PaperProps={{
                        sx: {
                            zIndex: 0,
                            width: 400,
                            bgcolor: '#fff',
                            borderRight: 'solid 1px #D6DBE0',
                            p: 1
                        },
                    }}
                    SlideProps={{ direction: 'right' }}
                >
                    <Stack direction={'row'} spacing={1} >
                        <Typography variant="subtitle1">{openDetails.id}</Typography>
                        <IconButton size='small' onClick={() => setOpenDetails(null)}>
                            X
                        </IconButton>
                    </Stack>
                    {JSON.stringify(openDetails)}
                </Drawer>
            )}
        </Box>
    )
}

