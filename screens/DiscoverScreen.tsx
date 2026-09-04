import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)', accent: '#e0895a' };

export default function DiscoverScreen() {
  const [people, setPeople] = useState<any[]>([]);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const me = userData.user?.id ?? null;
    setUserId(me);
    if (!me) return;

    const { data: profiles } = await supabase.from('profiles').select('id, username, display_name').neq('id', me);
    if (profiles) setPeople(profiles);

    const { data: requests } = await supabase.from('friend_requests').select('addressee_id').eq('requester_id', me);
    if (requests) setSentTo(new Set(requests.map((r) => r.addressee_id)));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function sendRequest(otherId: string) {
    if (!userId) return;
    setSentTo((prev) => new Set(prev).add(otherId));
    await supabase.from('friend_requests').insert({ requester_id: userId, addressee_id: otherId });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover</Text>
      <FlatList
        data={people}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>No one to discover yet.</Text>}
        renderItem={({ item }) => {
          const pending = sentTo.has(item.id);
          return (
            <View style={styles.row}>
              <Text style={styles.name}>{item.display_name || item.username || 'Unnamed user'}</Text>
              <Pressable
                disabled={pending}
                style={[styles.btn, pending && { backgroundColor: colors.surface }]}
                onPress={() => sendRequest(item.id)}
              >
                <Text style={{ color: pending ? colors.text2 : '#fff', fontSize: 12, fontWeight: '700' }}>
                  {pending ? 'Pending' : 'Request'}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  header: { fontSize: 24, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic', marginBottom: 16, paddingHorizontal: 20 },
  empty: { color: colors.text2, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: 14, borderRadius: 14, marginBottom: 10 },
  name: { color: colors.text1 },
  btn: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
});