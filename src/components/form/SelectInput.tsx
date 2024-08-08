import { OutlinedInput } from '@mui/material';
import { Controller } from 'react-hook-form';
import { ResourceSelect, TSelectProps } from '../select/ResourceSelect';

export function SelectInput({ resource, source, label, ...rest }: TSelectProps & { source: string }) {
    return (
        <Controller
            name={source}
            render={({ field }) => (
                <ResourceSelect formFields={field} label={label} resource={resource} input={<OutlinedInput label={label} />} {...rest} />
            )}
        />
    );
}
