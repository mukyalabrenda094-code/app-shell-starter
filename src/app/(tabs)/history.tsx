import { ScrollView, View, Text, StyleSheet } from 'react-native';

const SAMPLE_HISTORY = ['Starter shell created', 'Tabs wired: Home, AI Generator, History, Profile'];

export default function HistoryTab() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>History</Text>
        <Text style={styles.sub}>Recent items and saved activity appear here.</Text>
        {SAMPLE_HISTORY.map((entry, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.rowText}>{entry}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 10 },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  sub: { fontSize: 14, color: '#475569', marginBottom: 4 },
  row: { backgroundColor: '#ffffff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  rowText: { fontSize: 14, color: '#0f172a' },
});
