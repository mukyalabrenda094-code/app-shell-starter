import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function GeneratorTab() {
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState('Enter a topic or prompt and tap Generate to test the shell.');

  const handleGenerate = () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setPreview('Please type a prompt first.');
      return;
    }
    setPreview(`Draft output for "${trimmed}" - ready to connect real logic or an API later.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>AI Generator</Text>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="What do you want to create?"
          style={styles.input}
        />
        <Pressable onPress={handleGenerate} style={styles.button}>
          <Text style={styles.buttonText}>Generate</Text>
        </Pressable>
        <View style={styles.box}>
          <Text style={styles.boxText}>{preview}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f8fafc' },
  inner: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 15 },
  button: { backgroundColor: '#0f172a', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start' },
  buttonText: { color: '#ffffff', fontWeight: 600, fontSize: 15 },
  box: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16 },
  boxText: { color: '#334155', fontSize: 14 },
});
