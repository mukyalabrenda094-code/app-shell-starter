import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function ProfileTab() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Workspace</Text>
          <Text style={styles.value}>app-shell-starter (Web + Android)</Text>
          <Text style={[styles.label, { marginTop: 12 }]}>Goal</Text>
          <Text style={styles.value}>Reusable multi-tab shell for future real apps</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 12, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
  value: { fontSize: 15, color: '#0f172a', marginTop: 2 },
});
