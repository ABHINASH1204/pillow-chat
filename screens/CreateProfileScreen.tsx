import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', surface: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.09)', accent: '#e0895a', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)' };

export default function CreateProfileScreen({ navigation }: any) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [message, setMessage] = useState('');

  async function save() {
    if (!displayName.trim() || !username.trim()) {
      setMessage('Name and username are required');
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);

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
    else navigation.replace('Home', { screen: 'Me' });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.sub}>This is how others will see you on Pillow</Text>

      <Text style={styles.label}>Display name</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Your full name" placeholderTextColor={colors.text2} style={styles.input} />

      <Text style={styles.label}>Username</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="yourname" placeholderTextColor={colors.text2} style={styles.input} />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="A short line about you (optional)"
        placeholderTextColor={colors.text2}
        style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
        multiline
      />

      <Text style={styles.label}>Birthday (optional)</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          value={birthDay}
          onChangeText={setBirthDay}
          placeholder="Day (e.g. 12)"
          placeholderTextColor={colors.text2}
          keyboardType="number-pad"
          style={[styles.input, { flex: 1 }]}
        />
        <TextInput
          value={birthMonth}
          onChangeText={setBirthMonth}
          placeholder="Month (1-12)"
          placeholderTextColor={colors.text2}
          keyboardType="number-pad"
          style={[styles.input, { flex: 1 }]}
        />
      </View>

      {message ? <Text style={{ color: 'red', marginTop: 8 }}>{message}</Text> : null}

      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 6 },
  sub: { fontSize: 13, color: colors.text2, marginBottom: 20 },
  label: { color: colors.text2, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, color: colors.text1 },
  button: { backgroundColor: colors.accent, borderRadius: 24, padding: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700' },
});