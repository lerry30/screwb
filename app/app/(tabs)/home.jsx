import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getFromLocal } from '@/utils/localStorage';

const Home = () => {
    const [userData, setUserData] = useState({firstname: ''});
    const getUserData = async () => {
        try {
            const user = await getFromLocal('user');
            setUserData(user);
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <SafeAreaView className="flex-1 size-screen">
            <View className="flex-1 size-screen p-8">
                <Text className="font-pbold text-lg text-secondary">Welcome {userData?.firstname || ''}</Text>
            </View> 
        </SafeAreaView>
    )
}

export default Home;
