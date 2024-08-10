"use client"
import { Input } from '@/components/form/Input';
import { PasswordInput } from '@/components/form/PasswordInput';
import { Page } from '@/components/page/Page';
import { useThemeMode } from '@/utils/theme';
import { Button, Stack, styled, Box, Typography, useTheme } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation'

type TInputs = {
    email: string;
    password: string;
};

const Login = () => {
    const theme = useTheme();
    const router = useRouter()

    const form = useForm<TInputs>({
        defaultValues: { email: '', password: '' },
    });

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TInputs> = async (data) => {
        const { error } = await createSupabaseClientSide().auth.signInWithPassword({ email: data.email, password: data.password });
        if (error) {
            console.log(error);
            return;
        };
        router.push('/')
    };

    return (
        <RootStyle title='Login'>
            <ContainerStyle>
                <TextSection />

                <Box sx={sx.boxSX}>
                    <Typography variant='h4' sx={{ mb: 5 }}>
                        Welcome! <br />
                        Log in to continue
                    </Typography>

                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3}>
                                <Input name='email' required={true} label='Email' placeholder='Email' />
                                <PasswordInput />
                            </Stack>

                            <Box marginY={2}>
                                <Button
                                    fullWidth
                                    size='large'
                                    type='submit'
                                    variant='contained'
                                    sx={{
                                        backgroundColor: theme.palette.common.black,
                                        height: '56px',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.active,
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Box>
                        </form>
                    </FormProvider>
                </Box>
            </ContainerStyle>
        </RootStyle>
    );
};

const TextSection = () => {
    const {darkMode} = useThemeMode();
    const theme = useTheme();

    return (
        <SectionStyle>
            <Typography sx={sx.typographySX}>
                <Box sx={{width: '400px', height: '100px'}} component='img' src={'Lexxi.svg'} />
                <br />
                Run {' '}
                <Box component='span' sx={{ color: theme.palette.background.default, backgroundColor: theme.palette.text.primary, borderRadius: '10px', px: 2 }}>
                    it
                </Box>{' '}
            </Typography>
        </SectionStyle>
    );
};

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

const ContainerStyle = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.paper,
    overflow: 'hidden',
    position: 'relative',
    padding: '0px 40px',
    '&::before': {
        content: "''",
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        background: theme.palette.background.neutral,
        transformOrigin: 'bottom',
        transform: 'skew(-13.9deg, 0deg)',
        zIndex: 0,
    },
}));

const SectionStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: { display: 'none' },
    width: '100%',
    maxWidth: 450,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '52px',
    background: theme.palette.background.paper,
}));

const sx = {
    typographySX: {
        mt: 5,
        mb: 5,
        zIndex: 1,
        fontSize: '55px',
        fontWeight: 500,
        lineHeight: '87.44px',
        letterSpacing: '5px',
    },
    boxSX: {
        width: '100%',
        maxWidth: 450,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 1,
        marginLeft: { xs: '0px', md: '52px' },
    },
};

export default Login;
