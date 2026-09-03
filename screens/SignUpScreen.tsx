import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = {
  bg: '#16110e',
  surface: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.09)',
  accent: '#e0895a',
  text1: '#f7f1ea',
  text2: 'rgba(247,241,234,0.56)',
};

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Check your email to confirm, then log in.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.sub}>Join Pillow — it's free</Text>

      <TextInput placeholder="Email" placeholderTextColor={colors.text2} value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor={colors.text2} value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? <Text style={{ color: colors.accent, fontFamily: 'PlusJakartaSans_700Bold' }}>Log in</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 6 },
  sub: { fontSize: 14, color: colors.text2, marginBottom: 24 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, color: colors.text1, marginBottom: 12, fontFamily: 'PlusJakartaSans_500Medium' },
  message: { color: colors.text2, fontSize: 13, marginBottom: 12 },
  button: { backgroundColor: colors.accent, borderRadius: 28, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15 },
  link: { color: colors.text2, textAlign: 'center', marginTop: 20, fontSize: 13.5 },
});