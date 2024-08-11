'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material'
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
}

export default function MisAsuntosPage() {
  const [trials, setTrials] = useState<Trial[]>([])
  const [view, setView] = useState<'card' | 'table'>('card')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchTrials()
  }, [])

  const fetchTrials = async () => {
    setLoading(true)
    const supabase = createSupabaseClientSide()
    
    // First, get the user's auth data
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error fetching user:', userError)
      setLoading(false)
      return
    }
    console.log('User data:', userData)
  
    if (!userData.user) {
      console.error('No user found. User might not be authenticated.')
      setLoading(false)
      return
    }
  
    // Then, get the user's profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq('user_id', userData.user.id)
      .single()
  
    if (profileError) {
      console.error('Error fetching profile:', profileError)
      setLoading(false)
      return
    }
    console.log('Profile data:', profileData)
  
    if (!profileData) {
      console.error('No profile found for this user.')
      setLoading(false)
      return
    }
  
    // Now, get the user's team using the profile ID
    const { data: teamData, error: teamError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq('profile_id', profileData.id)
      .single()
  
    if (teamError) {
      console.error('Error fetching team:', teamError)
      setLoading(false)
      return
    }
    console.log('Team data:', teamData)
  
    if (!teamData) {
      console.error('No team found for this user.')
      setLoading(false)
      return
    }
  
    // Finally, get the trials for the user's team
    const { data: orgTrialsData, error: orgTrialsError } = await supabase
      .from("org_trials")
      .select(`
        *,
        shared_trials:shared_trial_id (
          case_number
        )
      `)
      .eq('team_id', teamData.team_id)
  
    if (orgTrialsError) {
      console.error('Error fetching trials:', orgTrialsError)
      setLoading(false)
    } else {
      console.log('Trials data:', orgTrialsData)
      
      // Combine org_trials data with shared_trials data
      const combinedTrials = orgTrialsData.map(trial => ({
        ...trial,
        case_number: trial.shared_trials.case_number,
      }))
      
      setTrials(combinedTrials)
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mis Asuntos</Typography>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="card" aria-label="card view">
          <ViewModuleIcon />
        </ToggleButton>
        <ToggleButton value="table" aria-label="table view">
          <ViewListIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      
      {loading ? (
        <Typography>Loading...</Typography>
      ) : trials.length === 0 ? (
        <Typography>No trials found.</Typography>
      ) : view === 'card' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {trials.map((trial) => (
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trials.map((trial) => (
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