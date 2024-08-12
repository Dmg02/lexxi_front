'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Drawer, IconButton, Stack, TextField, Typography, Autocomplete, useMediaQuery, Theme, Grid, Pagination, Button, Snackbar, Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { CardTrial } from '@/components/card';
import { format } from 'date-fns'; 
import { useAuth } from '@/context/useAuth';
import { useCustomColors } from '@/hooks/customColors';

export default function HomePage() {
    const theme = useTheme()
    const { getPrimaryWithAlpha, getBackgroundWithAlpha } = useCustomColors()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [search, setSearch] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [openDetails, setOpenDetails] = useState<any>(null);
    const [courthouses, setCourthouses] = useState<any[]>([]);
    const [selectedCourthouse, setSelectedCourthouse] = useState<any>(null);
    const [states, setStates] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [publications, setPublications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;
    const [subscriptionStatus, setSubscriptionStatus] = useState<'subscribed' | 'not_subscribed' | 'loading'>('not_subscribed');
    const { user } = useAuth(); // This hook provides the current user's information
    const [publicationsPage, setPublicationsPage] = useState(1);
    const [totalPublicationsPages, setTotalPublicationsPages] = useState(1);
    const publicationsPerPage = 3;
    const [trialEntities, setTrialEntities] = useState<any>({ plaintiff: '', defendant: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
                setTotalPages(1);
                return;
            }

            const supabase = createSupabaseClientSide();
            const { data, count, error } = await supabase
                .from("shared_trials")
                .select("*, is_active", { count: 'exact' })
                .eq('courthouse_id', selectedCourthouse.id)
                .ilike('case_number', `%${search}%`)
                .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

            if (error) {
                console.error('Error:', error);
            } else {
                setData(data || []);
                setTotalPages(Math.ceil((count || 0) / itemsPerPage));
            }
        };

        fetchTrials();
    }, [selectedCourthouse, search, page])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleOpenDetails = async (trial: any) => {
        setOpenDetails(trial);
        setSubscriptionStatus('loading');
        setPublicationsPage(1); // Reset to first page when opening details
        await fetchPublications(trial.id, 1);
        await fetchTrialEntities(trial.id);
    };
    
    // Create a new function to fetch publications
    const fetchPublications = async (trialId: number, page: number) => {
        const supabase = createSupabaseClientSide();
        const { data, count, error } = await supabase
            .from("publications")
            .select("*", { count: 'exact' })
            .eq('shared_trial_id', trialId)
            .order('created_at', { ascending: false })
            .range((page - 1) * publicationsPerPage, page * publicationsPerPage - 1);
    
        if (error) {
            console.error('Error fetching publications:', error);
        } else {
            setPublications(data || []);
            setTotalPublicationsPages(Math.ceil((count || 0) / publicationsPerPage));
        }
    };
    const handlePublicationPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPublicationsPage(value);
        fetchPublications(openDetails.id, value);
    };

    const handleSubscribe = async (trial: any) => {
        if (!user) {
            console.error('User not logged in');
            return;
        }
    
        setSubscriptionStatus('loading');
        const supabase = createSupabaseClientSide();
    
        try {
            // Step 1: Get the team info (including organization_id) directly from the teams table
            const { data: teamInfo, error: teamInfoError } = await supabase
                .from('teams')
                .select('id, organization_id')
                .eq('user_id', user.id)
                .single();
    
            if (teamInfoError) throw teamInfoError;
    
            if (!teamInfo) {
                throw new Error('User is not associated with any team');
            }
    
            const { id: teamId, organization_id: organizationId } = teamInfo;
    
            // Step 2: Check if the subscription already exists
            const { data: existingSubscription, error: subscriptionError } = await supabase
                .from('org_trials')
                .select('*')
                .eq('team_id', teamId)
                .eq('shared_trial_id', trial.id)
                .single();
    
            if (subscriptionError && subscriptionError.code !== 'PGRST116') {
                throw subscriptionError;
            }
    
            if (existingSubscription) {
                setSubscriptionStatus('subscribed');
                return;
            }
    
            // Step 3: Create new subscription
            const { error: insertError } = await supabase
                .from('org_trials')
                .insert({
                    team_id: teamId,
                    shared_trial_id: trial.id,
                    created_by: user.id,
                    organization_id: organizationId
                });
    
            if (insertError) throw insertError;
    
            setSubscriptionStatus('subscribed');
            setSnackbarMessage('Te has suscrito exitosamente al juicio');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            console.log('Successfully subscribed to the trial');
        } catch (error) {
            console.error('Error in subscription process:', error);
            setSubscriptionStatus('not_subscribed');
            setSnackbarMessage('Error al suscribirse al juicio');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Add this useEffect to reset and check subscription status when the drawer opens
    useEffect(() => {
        if (openDetails) {
            setSubscriptionStatus('loading'); // Reset status when a new trial is selected
            checkSubscriptionStatus(openDetails);
        } else {
            setSubscriptionStatus('not_subscribed'); // Reset when drawer closes
        }
    }, [openDetails]);

    const checkSubscriptionStatus = async (trial: any) => {
        if (!user || !trial) return;

        const supabase = createSupabaseClientSide();
        
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            const { data: teamMember } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('profile_id', profile.id)
                .single();

            const { data: existingSubscription } = await supabase
                .from('org_trials')
                .select('*')
                .eq('team_id', teamMember.team_id)
                .eq('shared_trial_id', trial.id)
                .single();

            setSubscriptionStatus(existingSubscription ? 'subscribed' : 'not_subscribed');
        } catch (error) {
            console.error('Error checking subscription status:', error);
            setSubscriptionStatus('not_subscribed');
        }
    };

    const fetchTrialEntities = async (trialId: number) => {
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase
            .from("trial_entities")
            .select(`
                id,
                trial_role_id,
                individual:individual_id(name),
                union:union_id(name),
                company:company_id(name)
            `)
            .eq('shared_trial_id', trialId);

        if (error) {
            console.error('Error fetching trial entities:', error);
            return;
        }

        const entities = {
            plaintiff: data.filter(e => e.trial_role_id === 1).map(e => e.individual?.name || e.union?.name || e.company?.name).join(', '),
            defendant: data.filter(e => e.trial_role_id === 4).map(e => e.individual?.name || e.union?.name || e.company?.name).join(', ')
        };

        setTrialEntities(entities);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? theme.palette.success.main : theme.palette.error.main;
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 4,
            width: '100%',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
        }}>
            <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 2, textAlign: 'center', color: theme.palette.primary.main }}>
                {'Busca un Asunto'}
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 700 }}>
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
            
            <Grid container spacing={2} sx={{ mt: 8, mb: 2 }}>
                {data.map((r: any) => (
                    <Grid item xs={4} sm={6} md={4} lg={3} key={r.id}>
                        <CardTrial 
                            record={r} 
                            setOpenDetail={() => handleOpenDetails(r)} 
                        />
                    </Grid>
                ))}
            </Grid>

            <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                sx={{ mt: 4 , mb: 2 }}
            />

            {openDetails && (
                <Drawer
                    anchor={isMobile ? 'bottom' : 'right'}
                    open={!!openDetails}
                    onClose={() => {
                        setOpenDetails(null);
                        setPublications([]);
                        setSubscriptionStatus('not_subscribed');
                    }}
                    PaperProps={{
                        sx: {
                            zIndex: 0,
                            width: isMobile ? '100%' : 500,
                            height: isMobile ? '90%' : '100%',
                            bgcolor: theme.palette.background.paper,
                            borderRight: `solid 1px ${theme.palette.divider}`,
                            p: 3,
                            boxSizing: 'border-box',
                            overflowY: 'auto'
                        },
                    }}
                    SlideProps={{ direction: isMobile ? 'up' : 'right' }}
                >
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Typography variant="h5" gutterBottom>Detalles del Juicio</Typography>
                        <IconButton 
                            onClick={() => {
                                setOpenDetails(null);
                                setPublications([]);
                                setSubscriptionStatus('not_subscribed');
                            }}
                            sx={{ 
                                position: 'absolute',
                                right: -8,
                                top: -8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1 }}><strong>No. Expediente:</strong> {openDetails.case_number}</Typography>
                        <Typography sx={{ mb: 1 }}><strong>Actor:</strong> {trialEntities.plaintiff || openDetails.plaintiff}</Typography>
                        <Typography sx={{ mb: 1 }}><strong>Demandado:</strong> {trialEntities.defendant || openDetails.defendant}</Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Status:</strong>{' '}
                            <span style={{ color: getStatusColor(openDetails.is_active) }}>
                                {openDetails.is_active ? 'Activo' : 'Concluido'}
                            </span>
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>Publicaciones Recientes</Typography>
                    {publications.length > 0 ? (
                        <>
                            {publications.map((pub) => (
                                <Box key={pub.id} sx={{ mb: 3, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, position: 'relative' }}>
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                        }}
                                        size="small"
                                    >
                                    </IconButton>
                                    <Typography sx={{ mb: 1 }}><strong>Fecha de Publicación:</strong> {format(new Date(pub.publication_date), 'dd/MM/yyyy')}</Typography>
                                    <Typography sx={{ mb: 1 }}><strong>Fecha de Acuerdo:</strong> {format(new Date(pub.agreement_date), 'dd/MM/yyyy')}</Typography>
                                    <Typography sx={{ mb: 1 }}><strong>Síntesis:</strong> {pub.summary}</Typography>
                                </Box>
                            ))}
                            <Pagination 
                                count={totalPublicationsPages} 
                                page={publicationsPage} 
                                onChange={handlePublicationPageChange} 
                                color="primary" 
                                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                            />
                        </>
                    ) : (
                        <Typography>No hay publicaciones recientes para este juicio.</Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubscribe(openDetails)}
                        disabled={subscriptionStatus === 'loading' || subscriptionStatus === 'subscribed'}
                        sx={{ 
                            mt: 2,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: getPrimaryWithAlpha(0.8),
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.action.disabledBackground,
                                color: theme.palette.action.disabled,
                            }
                        }}
                    >   
                        {subscriptionStatus === 'subscribed' ? 'Suscrito' : 'Suscribirme'}
                    </Button>
                </Drawer>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                sx={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity} 
                    sx={{ 
                        width: '100%',
                        boxShadow: 24,
                        padding: '16px 24px',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}