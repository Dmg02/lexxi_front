'use client'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Drawer, IconButton, Stack, TextField, Typography, Autocomplete, Button, List, ListItem, ListItemText } from '@mui/material'
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { CardTrial } from '@/components/card';
import { format } from 'date-fns'; // Import this for date formatting

export default function HomePage() {
    const [data, setData] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [newTeamName, setNewTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    
    const handleCreateTeam = async () => {
        if (!newTeamName) return;
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase
            .from("teams")
            .insert({ name: newTeamName })
            .select();
        if (error) {
            console.error('Error creating team:', error);
        } else {
            setTeams([...teams, data[0]]);
            setNewTeamName('');
        }
    };

    const handleSelectTeam = async (team: any) => {
        setSelectedTeam(team);
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase
            .from("team_members")
            .select("*")
            .eq('tea3m_id', team.id);
        if (error) {
            console.error('Error fetching team members:', error);
        } else {
            setTeamMembers(data);
        }
    };

    return (
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h3">{'User Settings'}</Typography>
            
            {/* Team Management Section */}
            <Box sx={{ my: 2, width: 700 }}>
                <Typography variant="h5">Team Management</Typography>
                <Box sx={{ display: 'flex', my: 2 }}>
                    <TextField 
                        label="New Team Name" 
                        value={newTeamName} 
                        onChange={(e) => setNewTeamName(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" onClick={handleCreateTeam}>Create Team</Button>
                </Box>
                <Autocomplete
                    options={teams}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Select a Team" />}
                    onChange={(event, newValue) => handleSelectTeam(newValue)}
                    sx={{ mb: 2 }}
                />
            </Box>

            {/* Team Details Drawer */}
            {selectedTeam && (
                <Drawer
                    anchor={'right'}
                    open={!!selectedTeam}
                    onClose={() => setSelectedTeam(null)}
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
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Team Details</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Team Name:</strong> {selectedTeam.name}</Typography>
                    
                    <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>Team Members</Typography>
                    {teamMembers.length > 0 ? (
                        <List>
                            {teamMembers.map((member) => (
                                <ListItem key={member.id}>
                                    <ListItemText primary={member.name} secondary={member.email} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No team members found.</Typography>
                    )}
                </Drawer>
            )}
        </Box>
    )
}