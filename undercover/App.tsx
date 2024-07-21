import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './components/Home';
import Incidents from './components/Incidents';
import About from './components/About';
const Tab = createBottomTabNavigator();

export default function App() {
    return (
    <NavigationContainer>
        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
                case 'Home':
                iconName = 'home';
                break;
                case 'Incidents':
                iconName = 'person';
                break;
                case 'About':
                iconName = 'person';
                break;
                default:
                iconName = 'home';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#8A9197',
            tabBarStyle: {
            backgroundColor: '#030B18', 
            borderTopWidth: 0,
            position: 'absolute', 
            elevation: 0, 
            shadowOpacity: 0, 
            height: 55, 
            },
        })}
        >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Incidents" component={Incidents} />
        <Tab.Screen name="About" component={About} />
    </Tab.Navigator>

    </NavigationContainer>
  )
};
