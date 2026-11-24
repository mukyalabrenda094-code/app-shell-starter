import { ScrollView, View, Text, StyleSheet } from 'react-native';

const FEED_ITEMS = [
  { id: '1', title: 'Starter Feed Card', desc: 'Reusable shell ready for real app cards, feeds, or playlists.' },
  { id: '2', title: 'Cross-Platform Layout', desc: 'Max-width container keeps wide desktop screens readable and phone screens clean.' },
];

export default function HomeTab() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Home</Text>
        <Text style={styles.sub}>Your main hub or feed lives here.</Text>
        {FEED_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        ))}
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
