import { Stack } from 'expo-router';
import { theme } from '../../src/theme';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: theme.colors.bgPrimary },
      headerTintColor: theme.colors.textPrimary,
      contentStyle: { backgroundColor: theme.colors.bgPrimary },
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )
    }}>
      <Stack.Screen name="index" options={{ title: 'My Groups' }} />
      <Stack.Screen name="group/[id]" options={{ title: 'Group Detail' }} />
      <Stack.Screen name="group/[id]/add-expense" options={{ title: 'Add Expense', presentation: 'modal' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
