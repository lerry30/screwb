import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { Video, ResizeMode } from 'expo-av'
import { useRouter } from 'expo-router';

import Background from '@/components/Background';
import BackgroundVideo from '@/assets/videos/background.mp4';
import CustomButton from '@/components/CustomButton';

const HomePage = () => {
    const router = useRouter();

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="relative flex-1 size-screen min-h-screen">
                    {/*<Video 
                        source={BackgroundVideo}
                        className="absolute flex-1 size-screen top-0 left-0 bottom-0 right-0"
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        isLooping
                        isMuted
                    />*/}

                    <Background className="absolute top-0 bottom-0 left-0 right-0">
                        <View className="flex-1 size-screen p-8 flex justify-center items-center">
                            <Text className="text-secondary-200 font-pthin text-lg text-center">Screwb is a small and lightweight app that lets you watch short videos within a limited time, helping you break your scrolling addiction. It provides an incredible experience while reminding you to take breaks. Once you reach the maximum scroll limit, the app will automatically stop.</Text>
                            <CustomButton title="Get Started" onPress={() => router.push('/(tabs)/home')} contClassName="w-full mt-4" />
                        </View>
                    </Background>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomePage;
