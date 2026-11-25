import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../lib/auth-context';

export default function ProfileTab() {
  const { user, workspace, loading, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    setFeedback('');
    if (!email.trim() || password.length < 6) {
      setFeedback('Enter a valid email and a password (at least 6 characters).');
      return;
    }
    setBusy(true);
    if (mode === 'signin') {
      const res = await signIn(email, password);
      setBusy(false);
      setFeedback(res.error ? `Sign in error: ${res.error}` : 'Signed in!');
    } else {
      const res = await signUp(email, password);
      setBusy(false);
      if (res.error) {
        setFeedback(`Sign up error: ${res.error}`);
      } else if (res.needsConfirmation) {
        setFeedback('Account created! Check your email to confirm, or disable email confirmation in Supabase Auth.');
      } else {
        setFeedback('Account created and signed in!');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Profile</Text>

        {loading ? (
          <View style={styles.card}>
            <Text style={styles.value}>Checking session...</Text>
          </View>
        ) : user ? (
          <View style={styles.card}>
            <Text style={styles.label}>Signed-In Account</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>Active Workspace</Text>
            <Text style={styles.value}>{workspace?.name ?? 'Personal Workspace'}</Text>

            <Pressable onPress={signOut} style={[styles.button, { marginTop: 16 }]}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (min 6 chars)"
              secureTextEntry
              style={styles.input}
            />
            <Pressable onPress={handleSubmit} disabled={busy} style={styles.button}>
              <Text style={styles.buttonText}>
                {busy ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFeedback('');
                setMode(mode === 'signin' ? 'signup' : 'signin');
              }}
              style={styles.switchBtn}
            >
              <Text style={styles.switchText}>
                {mode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </Text>
            </Pressable>
          </View>
        )}

        {feedback ? (
          <View style={styles.card}>
            <Text style={styles.value}>{feedback}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 8 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  value: { fontSize: 15, color: '#0f172a' },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 15 },
  button: { backgroundColor: '#0f172a', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start' },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
  switchBtn: { marginTop: 4, alignSelf: 'flex-start' },
  switchText: { color: '#334155', fontSize: 14, fontWeight: '500' },
});
