import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsScreen from './ChatsScreen';
import ThreadScreen from './ThreadScreen';
import FriendsScreen from './FriendsScreen';
import DiscoverScreen from './DiscoverScreen';
import RequestsScreen from './RequestsScreen';
import HomeScreen from './HomeScreen';

const Tab = createBottomTabNavigator();
const ChatsStack = createNativeStackNavigator();

function ChatsStackScreen() {
  return (
    <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="ChatsList" component={ChatsScreen} />
      <ChatsStack.Screen name="Thread" component={ThreadScreen} />
    </ChatsStack.Navigator>
  );
}

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
      <Tab.Screen name="Chats" component={ChatsStackScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Me" component={HomeScreen} />
    </Tab.Navigator>
  );
}