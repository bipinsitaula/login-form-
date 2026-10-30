import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Box,
  Center,
  Group,
  ActionIcon,
} from '@mantine/core';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { IconAt, IconLock, IconUser, IconPhone, IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumbers: [{ number: '' }], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });

  const onSubmit = async (data: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phoneNumbers: data.phoneNumbers.map((p: any) => p.number),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! Please login.',
        color: 'green',
      });
      onSwitchToLogin();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create account. Email might already be taken.',
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
          Create an account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Already have an account?{' '}
          <Anchor size="sm" component="button" fw={500} onClick={onSwitchToLogin}>
            Sign in
          </Anchor>
        </Text>

        <Paper withBorder shadow="xl" p={40} mt={30} radius="lg" style={{
          transition: 'box-shadow 0.3s ease',
        }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Name"
                  placeholder="Your Name"
                  leftSection={<IconUser size={18} stroke={1.5} />}
                  error={errors.name?.message as string}
                  size="md"
                  radius="md"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Email"
                  placeholder="you@example.com"
                  leftSection={<IconAt size={18} stroke={1.5} />}
                  mt="lg"
                  error={errors.email?.message as string}
                  size="md"
                  radius="md"
                />
              )}
            />

            <Box mt="lg">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Phone Numbers</Text>
                <ActionIcon variant="light" color="blue" onClick={() => append({ number: '' })}>
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>

              {fields.map((item, index) => (
                <Group key={item.id} mt="xs" align="flex-start">
                  <Controller
                    name={`phoneNumbers.${index}.number` as const}
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{10}$/, 
                        message: 'Must be a valid 10-digit number'
                      }
                    }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        placeholder="Enter phone number"
                        leftSection={<IconPhone size={18} stroke={1.5} />}
                        error={errors.phoneNumbers?.[index]?.number?.message as string}
                        size="md"
                        radius="md"
                        style={{ flex: 1 }}
                      />
                    )}
                  />
                  {fields.length > 1 && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      mt={4}
                      onClick={() => remove(index)}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Box>

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
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

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: (val) => {
                  if (watch('password') !== val) {
                    return 'Your passwords do not match';
                  }
                },
              }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  leftSection={<IconLock size={18} stroke={1.5} />}
                  mt="lg"
                  error={errors.confirmPassword?.message as string}
                  size="md"
                  radius="md"
                />
              )}
            />

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
              Sign up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}