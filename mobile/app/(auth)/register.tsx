import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { register as registerApi, login as loginApi } from '../../src/api/auth';
import { theme } from '../../src/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!username.trim()) return 'Username is required.';
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async () => {
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await registerApi({ firstName, lastName, username, email, password });
      const loginResponse = await loginApi({ email, password });
      await login(loginResponse.token);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>SplitEase</Text>
        <Text style={styles.subtitle}>Create your account to get started.</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor={theme.colors.textSecondary}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={{ width: theme.spacing.md }} />
          <View style={styles.flex1}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor={theme.colors.textSecondary}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe"
          placeholderTextColor={theme.colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Min. 6 characters"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeat your password"
          placeholderTextColor={theme.colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.bgPrimary,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  form: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme.colors.bgPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
  linkText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});
