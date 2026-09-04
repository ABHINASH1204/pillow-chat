import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', accent: '#e0895a', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)' };

export default function HomeScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      setProfile(p);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Login');
  }

  const name = profile?.display_name?.trim() || 'Set your name';
  const username = profile?.username?.trim() || 'username';
  const bio = profile?.bio?.trim();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.slice(0, 2).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>@{username}</Text>
      {bio ? <Text style={styles.bio}>{bio}</Text> : null}

      <Pressable style={[styles.button, { backgroundColor: colors.surface, marginTop: 20, marginBottom: 10 }]} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={[styles.buttonText, { color: colors.text1 }]}>Edit Profile</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: colors.text1, fontSize: 24, fontFamily: 'Fraunces_600SemiBold_Italic' },
  name: { fontSize: 20, color: colors.text1, fontFamily: 'PlusJakartaSans_700Bold' },
  username: { fontSize: 13, color: colors.text2, marginTop: 4 },
  bio: { fontSize: 13, color: colors.text2, marginTop: 10, textAlign: 'center', maxWidth: 260 },
  button: { backgroundColor: colors.accent, borderRadius: 28, paddingVertical: 14, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15 },
});