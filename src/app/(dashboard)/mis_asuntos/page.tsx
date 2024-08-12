'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, MenuItem } from '@mui/material'
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'

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
}

export default function MisAsuntosPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [view, setView] = useState<'card' | 'table'>('card')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedCourthouse, setSelectedCourthouse] = useState<string>('all')
  const [courthouses, setCourthouses] = useState<string[]>([])

  useEffect(() => {
    fetchTrials()
  }, [])

  const fetchTrials = async () => {
    setLoading(true)
    const supabase = createSupabaseClientSide()
    
    // Get the user's auth data
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

    // Fetch trials with courthouse information
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
      
      // Extract unique courthouses
      const uniqueCourthouses = Array.from(new Set(combinedTrials.map(trial => trial.courthouse_name)));
      setCourthouses(['all', ...uniqueCourthouses]);
      
      setLoading(false)
    }
  }
  
  const handleSave = async (id: number) => {
    setLoading(true)
    const supabase = createSupabaseClientSide()
    
    const { data, error } = await supabase
      .from('org_trials')
      .update({ risk_factor: editValue })
      .eq('id', id)

    if (error) {
      console.error('Error updating trial:', error)
    } else {
      setTrials(trials.map(trial => 
        trial.id === id ? { ...trial, risk_factor: editValue } : trial
      ))
    }

    setEditingId(null)
    setEditValue('')
    setLoading(false)
  }

  const handleEdit = (id: number, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'card' | 'table') => {
    if (newView !== null) {
      setView(newView)
    }
  }

  const handleCourthouseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourthouse(event.target.value as string);
  };

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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 4 }}>
          {filteredTrials.map((trial) => (
            <Card key={trial.id}>
              <CardContent>
                <Typography variant="h6">{trial.case_number}</Typography>
                <Typography>Status: {trial.trial_status}</Typography>
                <Typography>Priority: {trial.priority}</Typography>
                {editingId === trial.id ? (
                  <>
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      label="Risk Factor"
                    />
                    <Button onClick={() => handleSave(trial.id)}>Save</Button>
                  </>
                ) : (
                  <>
                    <Typography>Risk Factor: {trial.risk_factor}</Typography>
                    <Button onClick={() => handleEdit(trial.id, trial.risk_factor)}>Edit</Button>
                  </>
                )}
                <Typography>Corporation: {trial.org_corporation}</Typography>
                <Typography>Courthouse: {trial.courthouse_name}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No. Expediente</TableCell>
                <TableCell>Corporación</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Risk Factor</TableCell>
                <TableCell>Courthouse</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrials.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell>{trial.case_number}</TableCell>
                  <TableCell>{trial.org_corporation}</TableCell>
                  <TableCell>{trial.trial_status}</TableCell>
                  <TableCell>{trial.priority}</TableCell>
                  <TableCell>
                    {editingId === trial.id ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      trial.risk_factor
                    )}
                  </TableCell>
                  <TableCell>{trial.courthouse_name}</TableCell>
                  <TableCell>
                    {editingId === trial.id ? (
                      <Button onClick={() => handleSave(trial.id)}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEdit(trial.id, trial.risk_factor)}>Edit</Button>
                    )}
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