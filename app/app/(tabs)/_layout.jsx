import { Text } from 'react-native';
import { Tabs } from 'expo-router';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#FFA001',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
                backgroundColor: '#161622',
                height: 68,
                paddingTop: 4,
                paddingBottom: 8,
            }
        }}>
            <Tabs.Screen 
                name="home"
                options={{
                    tabBarLabel: ({color}) => <Text className="font-pbold text-[12px]" style={{color: `${color}`}}>Home</Text>,
                    tabBarIcon: ({color}) => (
                        <Ionicons name="home-sharp" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    tabBarLabel: ({color}) => <Text className="font-pbold text-[12px]" style={{color: `${color}`}}></Text>,
                    tabBarIcon: ({color}) => (
                        <AntDesign name="pluscircleo" size={38} color={color} />
                    )
                }}
            />
            <Tabs.Screen 
                name="profile"
                options={{
                    tabBarLabel: ({color}) => <Text className="font-pbold text-[12px]" style={{color: `${color}`}}>Profile</Text>,
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="account" size={28} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}

export default TabLayout;
