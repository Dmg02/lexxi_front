import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material"


// "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
// "organization_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
// "shared_trial_id": "b5f8c3d9-2a8a-4f1d-b3d9-8b79f4c1e359",
// "organization_customers_id": "c2e3e7b8-1d5f-4d8a-9f3b-7e2a9c1d8b5a",
// "team_id": "d1c2b3a4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
// "custom_description": "High-priority labor dispute case",
// "trial_status_id": "e5d4c3b2-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
// "trial_type_stages": "f6e5d4c3-b2a1-d3c4-e5f6-a7b8c9d0e1f2",
// "risk_factor": "Medium",
// "priority": "High",
// "outcome": null,
// "contingency_cost": 50000,
// "start_date": "2024-01-15T09:00:00+00:00",
// "end_date": null,
// "notes": "Ongoing negotiations with labor union",
// "created_at": "2024-01-15T08:30:00+00:00",
// "updated_at": "2024-01-20T14:45:00+00:00"

export const CardTrial = ({ record: r, setOpenDetail }: { record: any; setOpenDetail: any }) => {
    return (
        <Card>
            <Typography variant={'h6'} textAlign={'center'}>{r.id}</Typography>
            <CardContent>
                <Typography>{'risk_factor: ' + r.risk_factor}</Typography>
                <Typography>{'shared_trial_id: ' + r.shared_trial_id}</Typography>
                <Typography>{'trial_status_id: ' + r.trial_status_id}</Typography>
                <Typography>{'start_date: ' + r.start_date}</Typography>
                <Typography>{'priority: ' + r.priority}</Typography>
                <Typography>{'trial_status_id: ' + r.trial_status_id}</Typography>
                <Typography>{'trial_type_stages: ' + r.trial_type_stages}</Typography>
                <Typography>{'notes: ' + r.notes}</Typography>
                <Button fullWidth sx={{ mt: 2 }} variant={'contained'} onClick={() => setOpenDetail(r)}>{'Open Details'}</Button>
            </CardContent>
        </Card>
    )
}