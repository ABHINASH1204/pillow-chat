import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)', accent: '#e0895a' };

export default function RequestsScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const me = userData.user?.id ?? null;
    setUserId(me);
    if (!me) return;

    const { data: reqs } = await supabase
      .from('friend_requests')
      .select('id, requester_id')
      .eq('addressee_id', me)
      .eq('status', 'pending');

    if (!reqs || reqs.length === 0) { setRequests([]); return; }

    const requesterIds = reqs.map((r) => r.requester_id);
    const { data: profiles } = await supabase.from('profiles').select('id, display_name, username').in('id', requesterIds);

    const merged = reqs.map((r) => ({
      ...r,
      profile: profiles?.find((p) => p.id === r.requester_id),
    }));
    setRequests(merged);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function respond(requestId: string, requesterId: string, accept: boolean) {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (accept && userId) {
      const [a, b] = [userId, requesterId].sort();
      await supabase.from('friendships').insert({ user_a: a, user_b: b });
      await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId);
    } else {
      await supabase.from('friend_requests').update({ status: 'declined' }).eq('id', requestId);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>No pending requests.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.profile?.display_name || item.profile?.username || 'Someone'}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={styles.acceptBtn} onPress={() => respond(item.id, item.requester_id, true)}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Accept</Text>
              </Pressable>
              <Pressable style={styles.declineBtn} onPress={() => respond(item.id, item.requester_id, false)}>
                <Text style={{ color: colors.text1, fontSize: 12 }}>✕</Text>
              </Pressable>
            </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: 14, borderRadius: 14, marginBottom: 10 },
  name: { color: colors.text1 },
  acceptBtn: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  declineBtn: { backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
});