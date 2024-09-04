import { View, TouchableOpacity, TextInput, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';

import CustomAlert from '@/components/CustomAlert';
import Feather from '@expo/vector-icons/Feather';
import AppLogo from '@/assets/logo.png';

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [alert, setAlert] = useState(false);

    const router = useRouter();
    const inputRef = useRef(null);

    const removeFocus = () => {
        inputRef.current.blur(); // Remove focus
        console.log('close');
    }

    useEffect(() => {
        //keyboardDidShow
        //keyboardDidHide
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', removeFocus);
        // Clean up the event listeners
        return () => {
            keyboardDidHideListener.remove();
        };
  }, []);

    return (
        <SafeAreaView>
            <View className="w-full h-full flex flex-col justify-center items-center p-4">
                {alert && <CustomAlert visible={alert} onClose={()=>setAlert(false)} title="Empty Search" message="Please type something in the search bar to find what you're looking for." />}
                <Image className="h-[70px] mb-[30px]" source={AppLogo} resizeMode="contain" />
                <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
                    <TextInput
                        ref={inputRef}
                        className="text-base mt-0.5 text-white flex-1 font-pregular"
                        value={query}
                        placeholder="Search..."
                        placeholderTextColor="#CDCDE0"
                        onChangeText={value => setQuery(value)}
                        autoFocus
                    />

                    <TouchableOpacity
                        onPress={() => {
                            if (query === '') {
                                setAlert(true);
                                return;
                            }

                            router.push(`/search/${query}`);
                        }}
                    >
                        <Feather name="search" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchInput;

