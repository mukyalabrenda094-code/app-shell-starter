import { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';

export default function HomeTab() {
  const { user, workspace } = useAuth();
  const [savedCount, setSavedCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    if (!user) {
      setSavedCount(0);
      return;
    }
    const { count } = await supabase
      .from('history_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setSavedCount(count ?? 0);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Home</Text>
        <Text style={styles.sub}>
          {user ? `Signed in as ${user.email}` : 'Sign in on the Profile tab to sync cloud history.'}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Workspace</Text>
          <Text style={styles.cardDesc}>
            {user ? workspace?.name ?? 'Personal Workspace' : 'Guest mode (no cloud workspace active)'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cloud History Items</Text>
          <Text style={styles.cardDesc}>
            {user ? `${savedCount} saved item(s) synced in Supabase` : '0 synced items until you sign in'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  sub: { fontSize: 14, color: '#475569', marginBottom: 4 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#475569' },
});
