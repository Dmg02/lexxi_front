import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material"


export const CardTrial = ({ record: r, setOpenDetail }: { record: any; setOpenDetail: any }) => {
    return (
        <Card>
            <CardContent>
                <Typography>{'No. Expediente: ' + r.case_number}</Typography>
                <Typography>{'Actor: ' + r.plaintiff}</Typography>
                <Typography>{'Demandado: ' + r.defendant}</Typography>
                <Typography>{'Status: ' + r.is_active ? 'Activo' : 'Concluido'}</Typography>
                <Button fullWidth sx={{ mt: 2 }} variant={'contained'} onClick={() => setOpenDetail(r)}>{'Más detalles'}</Button>
            </CardContent>
        </Card>
    )
}