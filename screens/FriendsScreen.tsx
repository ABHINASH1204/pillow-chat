import { View, Text, StyleSheet } from 'react-native';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16110e', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#f7f1ea', fontSize: 20 },
});