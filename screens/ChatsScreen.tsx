import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../lib/supabase';

const colors = { bg: '#16110e', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)', surface: 'rgba(255,255,255,0.06)', accent: '#e0895a' };

export default function ChatsScreen() {
  const [conversations, setConversations] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('conversations').select('id, created_at');
    if (!error && data) setConversations(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createConversation() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data: convo, error } = await supabase.from('conversations').insert({}).select().single();
    if (error || !convo) return console.log('create error', error);

    await supabase.from('conversation_members').insert({ conversation_id: convo.id, user_id: userId });
    load();
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Chats</Text>
        <Pressable style={styles.newBtn} onPress={createConversation}>
          <Text style={styles.newBtnText}>+ New chat</Text>
        </Pressable>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>It's quiet in here — no conversations yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>Conversation {item.id.slice(0, 8)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  header: { fontSize: 24, color: colors.text1, fontFamily: 'Fraunces_600SemiBold_Italic' },
  newBtn: { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  newBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  empty: { color: colors.text2, textAlign: 'center', marginTop: 40 },
  row: { backgroundColor: colors.surface, marginHorizontal: 20, marginBottom: 10, padding: 14, borderRadius: 14 },
  rowText: { color: colors.text1 },
});