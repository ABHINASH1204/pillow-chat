import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import MonthPicker from './MonthPicker';

const colors = { bg: '#16110e', surface: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.09)', accent: '#e0895a', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)' };

export default function EditProfileScreen({ navigation }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (p) {
        setDisplayName(p.display_name || '');
        setUsername(p.username || '');
        setBio(p.bio || '');
        setBirthDay(p.birth_day ? String(p.birth_day) : '');
        setBirthMonth(p.birth_month || null);
      }
    });
  }, []);

  async function save() {
    if (!userId) return;
    const day = parseInt(birthDay, 10);
    const month = birthMonth ?? 0;

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        birth_day: day >= 1 && day <= 31 ? day : null,
        birth_month: month >= 1 && month <= 12 ? month : null,
      })
      .eq('id', userId);
    if (error) setMessage(error.message);
    else navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Display name</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} style={styles.input} placeholderTextColor={colors.text2} />

      <Text style={styles.label}>Username</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" style={styles.input} placeholderTextColor={colors.text2} />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="A short line about you"
        placeholderTextColor={colors.text2}
        style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
        multiline
      />

      <Text style={styles.label}>Birthday — Day</Text>
      <TextInput
        value={birthDay}
        onChangeText={setBirthDay}
        placeholder="Day (1-31)"
        placeholderTextColor={colors.text2}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Birthday — Month</Text>
      <MonthPicker value={birthMonth} onChange={setBirthMonth} />

      {message ? <Text style={{ color: 'red', marginTop: 8 }}>{message}</Text> : null}

      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 60 },
  back: { color: colors.text1, marginBottom: 20 },
  title: { fontSize: 22, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 24 },
  label: { color: colors.text2, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, color: colors.text1 },
  button: { backgroundColor: colors.accent, borderRadius: 24, padding: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700' },
});