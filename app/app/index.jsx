import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av'
import { useRouter } from 'expo-router';
import { getFromLocal } from '@/utils/localStorage';
import { useLayoutEffect } from 'react';
import { zUser } from '@/store/user';
import { zPosts } from '@/store/posts';

import Background from '@/components/Background';
import BackgroundVideo from '@/assets/videos/background.mp4';
import AppLogo from '@/assets/logo.png';
import CustomButton from '@/components/CustomButton';

const HomePage = () => {
    const router = useRouter();
    const saveUser = zUser(state => state?.setUser);
    const savePosts = zPosts(state => state?.setPosts);

    // save user and posts data to store
    useLayoutEffect(() => {
        (async () => {
            try {
                const user = await getFromLocal('user');
                const posts = await getFromLocal('posts');

                const userStatus = saveUser(user);
                const postsStatus = savePosts(posts);

                console.log(userStatus.message, postsStatus.message);
                if(!userStatus?.ok) throw new Error(userStatus?.message);
                if(!postsStatus?.ok) throw new Error(postsStatus?.message);
            } catch(error) {
                console.log(error?.message);
            }
        })();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="relative flex-1 size-screen min-h-screen">
                    <Video 
                        source={BackgroundVideo}
                        className="absolute flex-1 size-screen top-0 left-0 bottom-0 right-0"
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        isLooping
                        isMuted
                    />

                    <Background style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                        <View className="flex-1 size-screen p-8 flex justify-center items-center space-y-[40px]">
                            <Image className="h-[70px]" source={AppLogo} resizeMode="contain" />
                            <Text className="text-white font-pthin text-lg text-center">Screwb is a small and lightweight app that lets you watch short videos within a limited time, helping you break your scrolling addiction. It provides an incredible experience while reminding you to take breaks. Once you reach the maximum scroll limit, the app will automatically stop.</Text>
                            <CustomButton title="Get Started" onPress={() => router.push('/(tabs)/home')} contClassName="w-full mt-[40px]" />
                        </View>
                    </Background>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomePage;
