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
  danger: '#f08a9c',
};

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.sub}>Sign in to your Pillow account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.text2}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.text2}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {message ? <Text style={styles.error}>{message}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>

      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? <Text style={{ color: colors.accent, fontFamily: 'PlusJakartaSans_700Bold' }}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 6 },
  sub: { fontSize: 14, color: colors.text2, marginBottom: 24 },
  input: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: 16, padding: 14, color: colors.text1, marginBottom: 12, fontFamily: 'PlusJakartaSans_500Medium',
  },
  error: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  button: { backgroundColor: colors.accent, borderRadius: 28, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15 },
  link: { color: colors.text2, textAlign: 'center', marginTop: 20, fontSize: 13.5 },
});