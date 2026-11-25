import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';

interface HistoryRow {
  id: string;
  prompt: string;
  result_text: string;
  created_at: string;
}

export default function HistoryTab() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('history_items')
      .select('id, prompt, result_text, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    setLoading(false);
    if (!error && data) {
      setItems(data);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadHistory} />}
    >
      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>History</Text>
          <Pressable onPress={loadHistory} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>
        </View>

        {!user ? (
          <View style={styles.row}>
            <Text style={styles.rowText}>Sign in on the Profile tab to view your saved cloud history.</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.row}>
            <Text style={styles.rowText}>No saved history items yet. Create one in AI Generator!</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.promptText}>{item.prompt}</Text>
              <Text style={styles.resultText}>{item.result_text}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  refreshBtn: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  refreshText: { color: '#0f172a', fontWeight: '600', fontSize: 13 },
  row: { backgroundColor: '#ffffff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', gap: 4 },
  promptText: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  resultText: { fontSize: 13, color: '#475569' },
});
