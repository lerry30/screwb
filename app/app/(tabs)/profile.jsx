import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';

import { useLayoutEffect, useState } from 'react';
import { sendFormUpdate } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';
import { getFromLocal, removeFromLocal, saveToLocal } from '@/utils/localStorage';

import * as DocumentPicker from 'expo-document-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Profile = () => {
    const [user, setUser] = useState({id: '', firstname: '', lastname: '', email: '', profileimage: ''});
    const router = useRouter();

    const openImagePicker = async () => {
        const result = await DocumentPicker.getDocumentAsync({type: ['image/png', 'image/jpg', 'image/jpeg']});
        if (!result.canceled) {
            //console.log(result.assets[0]);
            const { uri, name, size, mimeType } = result.assets[0];

            const form = new FormData();
            form.append('file', { name, uri, type: mimeType });
            
            const { profileimage } = await sendFormUpdate(urls['profileimage'], form);
            const nUser = { ...user, profileimage };
            setUser(nUser);
            saveToLocal('user', nUser);
        } else {
            setTimeout(() => {
                Alert.alert("Document picked", JSON.stringify(result, null, 2));
            }, 100);
        }
    };

    const getUserData = async () => {
        try {
            //await removeFromLocal('user');
            const user = await getFromLocal('user');
            if(Object.values(user).length > 0) {
                setUser(user);
            } else {
                router.push('/(user)/signup');
            }
        } catch(error) {
            console.log(error);
        }
    }

    useLayoutEffect(() => {
        getUserData();
    }, []);

    return (
        <SafeAreaView className="flex-1 size-screen">
            <View className="flex-1 size-screen px-8">
                <View className="w-full h-[10%] flex justify-center items-end">
                    <Link href="(user)/edit">
                        <Text className="text-blue-500 text-lg font-pregular">Edit</Text>
                    </Link>
                </View>
                <View className="w-full h-[40%] flex justify-end items-center flex-col pb-4">
                    <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => openImagePicker()}
                        className="max-w-[150px] max-h-[150px] rounded-full overflow-hidden"
                    >
                        {
                            user?.profileimage ?
                                <Image className="w-[150px] h-[150px]" source={{uri: `${serverDomain}/profiles/${user?.profileimage}`}} resizeMode="cover" />
                            :
                                <MaterialIcons name="account-circle" size={150} color="white" />
                        }
                    </TouchableOpacity>
                    <Text className="font-pbold text-xl text-secondary">{`${user?.firstname} ${user?.lastname}`}</Text>
                    <Text className="font-pthin text-white/75">{user?.email}</Text>
                </View>
                <View className="w-full h-1/2 bg-red-900">

                </View>
            </View> 
        </SafeAreaView>
    )
}

export default Profile;
