import { Button, Card, CardContent, CardHeader, Typography, useTheme, Box } from "@mui/material"

export const CardTrial = ({ record: r, setOpenDetail }: { record: any; setOpenDetail: any }) => {
    const theme = useTheme();

    const getStatusColor = (isActive: boolean) => {
        return isActive ? theme.palette.success.main : theme.palette.error.main;
    };

    return (
        <Card 
            sx={{
                width: '100%',
                maxWidth: 345, // Adjust this value to change the card width
                mb: 2, // Margin bottom
                boxShadow: theme.shadows[3],
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: theme.shadows[6],
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {'No. Expediente: ' + r.case_number}
                </Typography>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Actor:</strong> {r.plaintiff}
                    </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Demandado:</strong> {r.defendant}
                    </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Status:</strong>{' '}
                        <span style={{ color: getStatusColor(r.is_active), fontWeight: 'bold' }}>
                            {r.is_active ? 'Activo' : 'Concluido'}
                        </span>
                    </Typography>
                </Box>
                <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => setOpenDetail(r)}
                    sx={{
                        mt: 1,
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    {'Más detalles'}
                </Button>
            </CardContent>
        </Card>
    )
}