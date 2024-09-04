import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Feather from '@expo/vector-icons/Feather';

const SearchIcon = () => {
    const router = useRouter();

    return (
        <SafeAreaView>
            <View className="w-full flex items-end">
                <TouchableOpacity
                    onPress={() => router.push('/search/searchinput')}
                    className="px-2"
                >
                    <Feather name="search" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SearchIcon;
