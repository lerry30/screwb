import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';

import { useLayoutEffect, useState } from 'react';
import { sendFormUpdate } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';
import { getFromLocal, removeFromLocal, saveToLocal } from '@/utils/localStorage';
import { Video, ResizeMode } from 'expo-av';

import * as DocumentPicker from 'expo-document-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Profile = () => {
    const [user, setUser] = useState({id: '', firstname: '', lastname: '', email: '', profileimage: ''});
    const [posts, setPosts] = useState([]);
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
            //await removeFromLocal('posts');
            const user = await getFromLocal('user') || {};
            if(Object.values(user).length > 0) {
                setUser(user);

                const userPosts = await getFromLocal('posts') || [];
                setPosts(userPosts.reverse());
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

    if(Object.values(user).length === 0) return <></>

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="flex-1 w-full h-full px-8 py-2 min-h-screen">
                    <View className="w-full h-[40px] flex justify-center items-end">
                        <Link href="(user)/edit">
                            <Text className="text-blue-500 text-lg font-pregular">Edit</Text>
                        </Link>
                    </View>
                    <View className="w-full h-[280px] flex justify-end items-center flex-col pb-4">
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
                    <View className="pb-[10px] flex flex-col gap-4">
                        {
                            posts.map((post, index) => {
                                if(!post?.video) return null;
                                return (
                                    <View key={index} className="relative w-full h-[520px] p-4 flex flex-col justify-end">
                                        <Video 
                                            source={{uri: `${serverDomain}/videos/${post.video}`}}
                                            className="absolute top-0 left-0 right-0 bottom-0 rounded-2xl"
                                            resizeMode={ResizeMode.COVER}
                                            useNativeControls
                                            isLooping
                                        />
                                        <Text className="text-white text-lg font-pregular">{post.title}</Text>
                                        <Text className="text-white text-lg font-pthin">{post.description}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;
