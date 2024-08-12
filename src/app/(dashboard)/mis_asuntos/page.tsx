'use client'
import { useState, useEffect } from 'react'
import { Box, 
  ToggleButton, 
  ToggleButtonGroup, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  MenuItem, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Save, Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material'
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

interface Trial {
  id: number;
  shared_trial_id: number;
  case_number: string;
  org_corporation: string;
  risk_factor: string;
  priority: string;
  outcome: string;
  contingency_cost: number;
  start_date: string;
  end_date: string;
  notes: string;
  trial_status: string;
  trial_type_stage: string;
  courthouse: string;
  courthouse_id: number;
  courthouse_name: string;
  custom_description: string;
  [key: string]: any;
}

export default function MisAsuntosPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [view, setView] = useState<'card' | 'table'>('card')
  const [loading, setLoading] = useState(true)
  const [selectedCourthouse, setSelectedCourthouse] = useState<string>('all')
  const [courthouses, setCourthouses] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [localEdits, setLocalEdits] = useState<{[key: string]: any}>({});

  useEffect(() => {
    fetchTrials()
  }, [])

  useEffect(() => {
    setTrials(prevTrials => 
      prevTrials.map(trial => ({
        ...trial,
        ...Object.keys(localEdits)
          .filter(key => key.startsWith(`${trial.id}-`))
          .reduce((acc, key) => {
            const [, field] = key.split('-');
            acc[field] = localEdits[key];
            return acc;
          }, {} as Partial<Trial>)
      }))
    );
  }, [localEdits]);

  const fetchTrials = async () => {
    setLoading(true)
    const supabase = createSupabaseClientSide()
    
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error fetching user:', userError)
      setLoading(false)
      return
    }

    if (!userData.user) {
      console.error('No user found. User might not be authenticated.')
      setLoading(false)
      return
    }

    const { data: orgTrialsData, error: orgTrialsError } = await supabase
      .from("org_trials")
      .select(`
        *,
        shared_trials:shared_trial_id (
          case_number,
          courthouse_id (
            id,
            name
          )
        ),
        teams!inner (id)
      `)
      .eq('teams.user_id', userData.user.id)

    if (orgTrialsError) {
      console.error('Error fetching trials:', orgTrialsError)
      setLoading(false)
    } else {
      console.log('Trials data:', orgTrialsData)
      
      const combinedTrials = orgTrialsData.map(trial => ({
        ...trial,
        case_number: trial.shared_trials.case_number,
        courthouse_id: trial.shared_trials.courthouse_id.id,
        courthouse_name: trial.shared_trials.courthouse_id.name || 'Unknown Courthouse'
      }))
      
      setTrials(combinedTrials)
      
      const uniqueCourthouses = Array.from(new Set(combinedTrials.map(trial => trial.courthouse_name)));
      setCourthouses(['all', ...uniqueCourthouses]);
      
      setLoading(false)
    }
  }
  
  const debouncedSave = debounce(async (id: number, field: string, value: any, supabase: any) => {
    const { data, error } = await supabase
      .from('org_trials')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating trial:', error);
      // TODO: Add user feedback for error
    }
  }, 500);

  const handleSave = (id: number, field: string, value: any) => {
    const supabase = createSupabaseClientSide();
    setTrials(trials.map(trial => 
      trial.id === id ? { ...trial, [field]: value } : trial
    ));
    debouncedSave(id, field, value, supabase);
  };

  const handleChange = (id: number, field: string, value: any) => {
    setLocalEdits(prev => ({
      ...prev,
      [`${id}-${field}`]: value
    }));
    handleSave(id, field, value);
  };

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'card' | 'table') => {
    if (newView !== null) {
      setView(newView)
    }
  }

  const handleCourthouseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourthouse(event.target.value as string);
  };

  const handleOpenDialog = (id: number) => {
    setOpenDialog(id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const renderEditableField = (trial: Trial, field: keyof Trial, type: string = 'text') => {
    const value = localEdits[`${trial.id}-${field}`] ?? trial[field];
  
    const commonSx = {
      transition: 'all 0.2s ease-in-out',
      borderRadius: '3px',
      padding: '3px 6px',
      minHeight: '24px',
      display: 'flex',
      alignItems: 'center',
      '&:hover': { 
        backgroundColor: 'rgba(55, 53, 47, 0.08)',
      },
      '&:focus-within': {
        backgroundColor: 'rgba(55, 53, 47, 0.08)',
        boxShadow: '0 0 0 2px rgba(35, 131, 226, 0.57)',
        transform: 'translateY(-1px)',
      },
      width: '100%', // Added this line
    };
  
    const inputSx = {
      fontSize: '14px',
      padding: 0,
      '&::before, &::after': {
        display: 'none',
      },
      '& .MuiInputBase-input': {
        padding: 0,
        textAlign: 'left', // Added this line
      },
    };
  
    switch (type) {
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(value)}
              onChange={(newValue) => {
                if (newValue) {
                  handleChange(trial.id, field, newValue.toISOString());
                }
              }}
              slotProps={{
                textField: {
                  variant: "standard",
                  sx: { ...commonSx, ...inputSx },
                  InputProps: { disableUnderline: true }
                },
              }}
            />
          </LocalizationProvider>
        );
      case 'select':
        return (
          <TextField
            select
            value={value}
            onChange={(e) => handleChange(trial.id, field, e.target.value)}
            variant="standard"
            sx={{ ...commonSx, ...inputSx }}
            InputProps={{ disableUnderline: true }}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="concluido">Concluido</MenuItem>
          </TextField>
        );
      default:
        return (
          <TextField
            value={value}
            onChange={(e) => handleChange(trial.id, field, e.target.value)}
            variant="standard"
            sx={{ ...commonSx, ...inputSx }}
            InputProps={{ disableUnderline: true }}
          />
        );
    }
  };

  const renderDetailDialog = (trial: Trial) => (
    <Dialog open={openDialog === trial.id} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {trial.case_number}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {[
          { label: 'Description', field: 'custom_description' },
          { label: 'Status', field: 'trial_status', type: 'select' },
          { label: 'Priority', field: 'priority' },
          { label: 'Risk Factor', field: 'risk_factor' },
          { label: 'Outcome', field: 'outcome' },
          { label: 'Contingency Cost', field: 'contingency_cost' },
          { label: 'Start Date', field: 'start_date', type: 'date' },
          { label: 'End Date', field: 'end_date', type: 'date' },
          { label: 'Notes', field: 'notes' },
          { label: 'Corporation', field: 'org_corporation' },
        ].map(({ label, field, type }) => (
          <Box key={field} sx={{ marginBottom: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', marginRight: 1 }}>{label}:</Typography>
            {renderEditableField(trial, field as keyof Trial, type)}
          </Box>
        ))}
        <Typography>Courthouse: {trial.courthouse_name}</Typography>
      </DialogContent>
    </Dialog>
  );

  const filteredTrials = selectedCourthouse === 'all'
    ? trials
    : trials.filter(trial => trial.courthouse_name === selectedCourthouse);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mis Asuntos</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="card" aria-label="card view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          select
          label="Courthouse"
          value={selectedCourthouse}
          onChange={handleCourthouseChange}
          sx={{ minWidth: 200 }}
        >
          {courthouses.map((courthouse) => (
            <MenuItem key={courthouse} value={courthouse}>
              {courthouse === 'all' ? 'All Courthouses' : courthouse}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredTrials.length === 0 ? (
        <Typography>No trials found.</Typography>
      ) : view === 'card' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 4 }}>
          {filteredTrials.map((trial) => (
            <Card key={trial.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{trial.case_number}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                    {renderEditableField(trial, 'custom_description')}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Status:</Typography>
                    {renderEditableField(trial, 'trial_status', 'select')}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Priority:</Typography>
                    {renderEditableField(trial, 'priority')}
                  </Box>
                </Box>
                <Button
                  startIcon={<InfoIcon />}
                  onClick={() => handleOpenDialog(trial.id)}
                  sx={{ mt: 2 }}
                >
                  More Info
                </Button>
              </CardContent>
              {renderDetailDialog(trial)}
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No. Expediente</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>More Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrials.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell>{trial.case_number}</TableCell>
                  <TableCell>{renderEditableField(trial, 'custom_description')}</TableCell>
                  <TableCell>{renderEditableField(trial, 'trial_status', 'select')}</TableCell>
                  <TableCell>{renderEditableField(trial, 'priority')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(trial.id)}>
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}