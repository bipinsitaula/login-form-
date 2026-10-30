import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
  Center,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconUser, IconLock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function Login({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      notifications.show({
        title: 'Welcome Back!',
        message: 'You have successfully logged in.',
        color: 'green',
      });
      console.log('Login Data:', data);
    } catch (error) {
       notifications.show({
        title: 'Error',
        message: 'Invalid email/phone or password.',
        color: 'red',
      });
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '20px',
      }}
    >
      <Container size={420} w="100%">
        <Center mb={30}>
          <Box
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #339af0, #15aabf)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 20,
              fontWeight: 800,
              boxShadow: '0 8px 15px rgba(255, 255, 255, 1)'
            }}
          >
            BS
          </Box>
        </Center>

        <Title ta="center" style={{ fontFamily: 'Inter, sans-serif' }} fw={900}>
          Welcome back
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component="button" fw={500} onClick={onSwitchToRegister}>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="xl" p={40} mt={30} radius="lg" style={{
          transition: 'box-shadow 0.3s ease',
        }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Controller
              name="identifier"
              control={control}
              rules={{
                required: 'Email or Phone Number is required',
                validate: (value) => {
                  const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                  const isPhone = /^\d{10}$/.test(value);
                  
                  if (!isEmail && !isPhone) {
                    return 'Please enter a valid email or 10-digit phone number';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Email or Phone Number"
                  placeholder="you@example.com or 98XXXXXXXX"
                  leftSection={<IconUser size={18} stroke={1.5} />}
                  error={errors.identifier?.message as string}
                  size="md"
                  radius="md"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  label="Password"
                  placeholder="Your password"
                  leftSection={<IconLock size={18} stroke={1.5} />}
                  mt="lg"
                  error={errors.password?.message as string}
                  size="md"
                  radius="md"
                />
              )}
            />

            <Group justify="space-between" mt="lg">
              <Controller
                name="remember"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Checkbox 
                    {...rest}
                    checked={value}
                    onChange={onChange}
                    label="Remember me" 
                    size="sm" 
                  />
                )}
              />
              <Anchor component="button" size="sm" fw={500} type="button">
                Forgot password?
              </Anchor>
            </Group>

            <Button
              fullWidth
              mt="xl"
              size="md"
              radius="md"
              type="submit"
              loading={isSubmitting}
              style={{
                background: 'linear-gradient(45deg, #339af0, #15aabf)',
                transition: 'transform 0.2s',
                border: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}