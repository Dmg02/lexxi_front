import { Controller } from 'react-hook-form';
import { Stack, TextFieldProps, TextField } from '@mui/material';

type TInputProps = TextFieldProps & {
    name: string;
    maskFn?: (value: string) => string;
    tooltip?: string;
    bgColor?: string;
    step?: string;
};

export const Input = ({
    name,
    label,
    helperText,
    type,
    maskFn,
    tooltip,
    bgColor = '#fff',
    step = '1',
    ...other
}: TInputProps) => {
    return (
        <Controller
            name={name}
            render={({ field }) => (
                <Stack direction='row' width='100%'>
                    <TextField
                        label={label}
                        {...field}
                        fullWidth
                        type={type}
                        {...other}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Stack>
            )}
        />
    );
};
