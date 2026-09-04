import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)', accent: '#e0895a' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function FriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const me = userData.user?.id;
    if (!me) return;

    const { data: links } = await supabase.from('friendships').select('user_a, user_b').or(`user_a.eq.${me},user_b.eq.${me}`);
    if (!links || links.length === 0) { setFriends([]); return; }

    const otherIds = links.map((l) => (l.user_a === me ? l.user_b : l.user_a));
    const { data: profiles } = await supabase.from('profiles').select('id, display_name, username, birth_day, birth_month').in('id', otherIds);
    if (profiles) setFriends(profiles);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>No friends yet — send requests from Discover.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.display_name || item.username}</Text>
            {item.birth_day && item.birth_month ? (
              <Text style={styles.bday}>🎂 {item.birth_day} {MONTHS[item.birth_month - 1]}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  header: { fontSize: 24, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 16, paddingHorizontal: 20 },
  empty: { color: colors.text2, textAlign: 'center', marginTop: 40 },
  row: { backgroundColor: colors.surface, padding: 14, borderRadius: 14, marginBottom: 10 },
  name: { color: colors.text1, fontSize: 15 },
  bday: { color: colors.accent, fontSize: 12, marginTop: 4, fontWeight: '600' },
});