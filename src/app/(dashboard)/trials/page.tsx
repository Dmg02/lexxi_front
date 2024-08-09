'use client'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Drawer, IconButton, Stack, TextField, Typography, Autocomplete } from '@mui/material'
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { CardTrial } from '@/components/card';
import { format } from 'date-fns'; // Import this for date formatting

export default function HomePage() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [openDetails, setOpenDetails] = useState<any>(null);
    const [courthouses, setCourthouses] = useState<any[]>([]);
    const [selectedCourthouse, setSelectedCourthouse] = useState<any>(null);
    const [states, setStates] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [publications, setPublications] = useState<any[]>([]);

    useEffect(() => {
        const fetchStates = async () => {
            const supabase = createSupabaseClientSide();
            const { data, error } = await supabase
                .from("states")
                .select("id, name")
                .order('name');

            if (error) {
                console.error('Error fetching states:', error);
            } else {
                setStates(data);
            }
        };

        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCourthouses = async () => {
            if (!selectedState) {
                setCourthouses([]);
                return;
            }

            const supabase = createSupabaseClientSide();
            const { data, error } = await supabase
                .from("courthouses")
                .select("id, name, cities!inner(state_id)")
                .eq('cities.state_id', selectedState.id)
                .order('name');

            if (error) {
                console.error('Error fetching courthouses:', error);
            } else {
                setCourthouses(data);
            }
        };

        fetchCourthouses();
        setSelectedCourthouse(null);
    }, [selectedState]);

    useEffect(() => {
        const fetchTrials = async () => {
            if (!selectedCourthouse || !search) {
                setData([]);
                return;
            }

            const supabase = createSupabaseClientSide();
            const { data, error } = await supabase
                .from("shared_trials")
                .select("*")
                .eq('courthouse_id', selectedCourthouse.id)
                .ilike('case_number', `%${search}%`)

            if (error) {
                console.error('Error:', error);
            } else {
                setData(data);
            }
        };

        fetchTrials();
    }, [selectedCourthouse, search])

    const handleOpenDetails = async (trial: any) => {
        setOpenDetails(trial);
        
        // Fetch publications for the selected trial
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase
            .from("publications")
            .select("*")
            .eq('shared_trial_id', trial.id)
            .order('created_at', { ascending: false }) // Sort by creation date, newest first
            .limit(5); // Limit to the 5 most recent publications, adjust as needed

        if (error) {
            console.error('Error fetching publications:', error);
        } else {
            setPublications(data || []);
        }
    };
    return (
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h3">{'Juicios'}</Typography>
<Box sx={{ my: 2, width: 700 }}>
                <Autocomplete
                    options={states}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Selecciona un Estado" />}
                    onChange={(event, newValue) => {
                        setSelectedState(newValue);
                        setSelectedCourthouse(null);
                        setSearch('');
                        setData([]);
                    }}
                    sx={{ mb: 2 }}
                />
                <Autocomplete
                    options={courthouses}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Selecciona un Tribunal" />}
                    onChange={(event, newValue) => {
                        setSelectedCourthouse(newValue);
                        setSearch('');
                        setData([]);
                    }}
                    sx={{ mb: 2 }}
                    disabled={!selectedState}
                />
                <TextField 
                    label={'Buscar No. Expediente'} 
                    value={search} 
                    onChange={(e: any) => setSearch(e.target.value)}
                    fullWidth
                    disabled={!selectedCourthouse}
                />
            </Box>
            <Stack spacing={0.5} direction={'column'}>
                {data.map((r: any) => (
                    <CardTrial 
                        key={r.id} 
                        record={r} 
                        setOpenDetail={() => handleOpenDetails(r)} 
                    />
                ))}
            </Stack>
            {openDetails && (
                <Drawer
                    anchor={'right'}
                    open={!!openDetails}
                    onClose={() => {
                        setOpenDetails(null);
                        setPublications([]);
                    }}
                    PaperProps={{
                        sx: {
                            zIndex: 0,
                            width: 500,
                            bgcolor: '#f7f7f5',
                            borderRight: 'solid 1px #D6DBE0',
                            p:6
                        },
                    }}
                    SlideProps={{ direction: 'right' }}
                >
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Detalles del Juicio</Typography>
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ mb: 1 }}><strong>No. Expediente:</strong> {openDetails.case_number}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Actor:</strong> {openDetails.plaintiff}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Demandado:</strong> {openDetails.defendant}</Typography>
                        </Box>

                        <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>Publicaciones Recientes</Typography>
                        {publications.length > 0 ? (
                            publications.map((pub) => (
                                <Box key={pub.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                    <Typography sx={{ mb: 1 }}><strong>Fecha de Publicación:</strong> {format(new Date(pub.publication_date), 'dd/MM/yyyy')}</Typography>
                                    <Typography sx={{ mb: 1 }}><strong>Fecha de Acuerdo:</strong> {format(new Date(pub.agreement_date), 'dd/MM/yyyy')}</Typography>
                                    <Typography sx={{ mb: 1 }}><strong>Síntesis:</strong> {pub.summary}</Typography>
                                    <Typography sx={{ mb: 1 }}><strong>Status:</strong> {pub.status}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography>No hay publicaciones recientes para este juicio.</Typography>
                        )}
                    </Drawer>
                )}
            </Box>
    )
}
