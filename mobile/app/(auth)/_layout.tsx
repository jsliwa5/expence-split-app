import { Stack } from 'expo-router';
import { theme } from '../../src/theme';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: theme.colors.bgPrimary },
      headerTintColor: theme.colors.textPrimary,
      contentStyle: { backgroundColor: theme.colors.bgPrimary },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Create Account', headerShown: false }} />
    </Stack>
  );
}
