import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';

export default function GeneratorTab() {
  const { user, workspace } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState('Enter a prompt, generate a draft, and save it to your cloud history.');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleGenerate = async () => {
    setStatusMsg('');
    const trimmed = prompt.trim();
    if (!trimmed) {
      setPreview('Please type a prompt first.');
      return;
    }

    const generatedText = `Draft output for "${trimmed}" (${workspace?.name ?? 'Personal Workspace'}).`;
    setPreview(generatedText);

    if (!user) {
      setStatusMsg('Draft shown locally. Sign in on the Profile tab to save history to Supabase.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('history_items').insert({
      user_id: user.id,
      workspace_id: workspace?.id ?? null,
      prompt: trimmed,
      result_text: generatedText,
    });
    setSaving(false);

    if (error) {
      setStatusMsg(`Save failed: ${error.message}`);
    } else {
      setPrompt('');
      setStatusMsg('Saved to cloud History!');
    }
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
        <Pressable onPress={handleGenerate} disabled={saving} style={styles.button}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Generate & Save'}</Text>
        </Pressable>
        <View style={styles.box}>
          <Text style={styles.boxText}>{preview}</Text>
          {statusMsg ? <Text style={styles.status}>{statusMsg}</Text> : null}
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
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
  box: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, gap: 8 },
  boxText: { color: '#334155', fontSize: 14 },
  status: { color: '#0f172a', fontWeight: '600', fontSize: 13 },
});
