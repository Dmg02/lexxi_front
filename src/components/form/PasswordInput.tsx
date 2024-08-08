import { useState } from 'react';
import { Input } from './Input';
import Iconify from '../iconify/Iconify';
import { IconButton, TextFieldProps } from '@mui/material';

type TInputProps = TextFieldProps & {
    name?: string;
    label?: string;
};

export const PasswordInput = ({
    name = 'password',
    label = 'Password',
    ...rest
}: TInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Input
            name={name}
            type={showPassword ? 'text' : 'password'}
            label={label}
            required={true}
            placeholder= 'Password'
            InputProps={{
                endAdornment: (
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                ),
            }}
            {...rest}
        />
    );
};
