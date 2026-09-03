import { View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }: any) {
  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace('Login');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to Pillow Chat! 🎉</Text>
      <Button title="Log out" onPress={handleLogout} />
    </View>
  );
}