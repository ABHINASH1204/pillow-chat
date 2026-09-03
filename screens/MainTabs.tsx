import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './ChatsScreen';
import FriendsScreen from './FriendsScreen';
import DiscoverScreen from './DiscoverScreen';
import RequestsScreen from './RequestsScreen';
import HomeScreen from './HomeScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e0895a',
        tabBarInactiveTintColor: 'rgba(247,241,234,0.4)',
        tabBarStyle: { backgroundColor: '#16110e', borderTopColor: 'rgba(255,255,255,0.09)' },
      }}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Me" component={HomeScreen} />
    </Tab.Navigator>
  );
}