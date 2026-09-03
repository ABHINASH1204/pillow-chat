import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', accent: '#e0895a', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)' };

export default function HomeScreen({ navigation }: any) {
  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pillow Chat 🎉</Text>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 24 },
  button: { backgroundColor: colors.accent, borderRadius: 28, paddingVertical: 14, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15 },
});