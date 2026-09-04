import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)', accent: '#e0895a' };

export default function FriendsScreen() {
  const [people, setPeople] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    setUserId(userData.user?.id ?? null);

    const { data } = await supabase.from('profiles').select('id, username, display_name');
    if (data) setPeople(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addFriend(otherId: string) {
    if (!userId) return;
    await supabase.from('friendships').insert({ user_a: userId, user_b: otherId });
    load();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      <FlatList
        data={people}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.display_name || item.username || 'Unnamed user'}</Text>
            <Pressable style={styles.addBtn} onPress={() => addFriend(item.id)}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Add</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  header: { fontSize: 24, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 16, paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: 14, borderRadius: 14, marginBottom: 10 },
  name: { color: colors.text1 },
  addBtn: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
});