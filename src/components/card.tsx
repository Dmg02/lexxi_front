import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material"


export const CardTrial = ({ record: r, setOpenDetail }: { record: any; setOpenDetail: any }) => {
    return (
        <Card>
            <CardContent>
                <Typography>{'No. Expediente: ' + r.case_number}</Typography>
                <Typography>{'Actor: ' + r.plaintiff}</Typography>
                <Typography>{'Demandado: ' + r.defendant}</Typography>
                <Button fullWidth sx={{ mt: 2 }} variant={'contained'} onClick={() => setOpenDetail(r)}>{'Más detalles'}</Button>
                <Button fullWidth sx={{ mt: 2 }} variant={'outlined'} onClick={() => setOpenDetail(r)}>{'Suscribirme'}</Button>
            </CardContent>
        </Card>
    )
}