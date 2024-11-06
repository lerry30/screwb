import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayoutEffect, useState, useRef } from 'react'
import { Video, ResizeMode } from 'expo-av';
import { serverDomain } from '@/constants/urls';
import { zUser } from '@/store/user';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Background from '@/components/Background';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feedback from '@/components/Feedback';
import SearchIcon from '@/components/SearchIcon';

// Function to get the status bar height
const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
const height = Math.ceil(Dimensions.get('window').height + statusBarHeight + 5);

const FullScreen = ({videos, isPlaying, setIsPlaying, listKey=0, videoRefs, loading, home=true, refetch=()=>{}}) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const email = zUser(state => state?.email);

    const checkUserAccount = () => {
        if(!email) {
            router.push('(user)/login');
            return;
        }
    }

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index;

            const prevVideo = videoRefs.current[currentVideoIndex];
            if(prevVideo && typeof prevVideo.setStatusAsync === 'function') {
                prevVideo.setStatusAsync({ positionMillis: 0 });
            }

            setCurrentVideoIndex(currentIndex);
        }
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Video is considered visible if 50% is visible
    };

    const handlePlayPause = (videoId) => {
        setIsPlaying(playing => {
            if(isPlaying) {
                videoRefs.current[currentVideoIndex]?.pauseAsync();
                return false;
            }

            videoRefs.current[currentVideoIndex]?.playAsync();
            return true;
        });
    }

    useLayoutEffect(() => {
        return () => {
            videoRefs.current = null;
        }
    }, []);

    const renderItem = ({ item, index }) => (
        <TouchableOpacity 
            activeOpacity={1}
            onPress={() => handlePlayPause(index)}
            style={{height: height}}
        >
            <View className="relative w-full flex-1 bg-black-700 overflow-hidden">
                <Video
                    ref={ref => {videoRefs.current[index]=ref}}
                    source={{uri: `${serverDomain}/videos/${item.video}`}}
                    className="absolute top-0 left-0 right-0 bottom-0"
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={currentVideoIndex === index}  // Play only the current video
                    isLooping
                />
                <Background 
                    colors={['#0000', '#0000', '#000a']} 
                    style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                    <View className={`w-full h-full flex flex-col px-2 pt-2 ${home?'pb-[80px]':'pb-8'}`}>
                        { home && <SearchIcon />}
                        <View className="flex flex-row items-end mt-auto">
                            <View className="w-[84%] flex flex-col">
                                <View className="flex flex-row items-center gap-2 mb-[10px]">
                                    {
                                        item?.profileimage ?
                                            <Image className="w-[40px] h-[40px] rounded-full" source={{uri: `${serverDomain}/profiles/${item.profileimage}`}} resizeMode="cover" />
                                        :
                                            <MaterialIcons name="account-circle" size={40} color="white" />
                                    }
                                    <Text className="text-white font-pregular">{`${item.firstname} ${item.lastname}`}</Text>
                                </View>
                                <Text className="text-white text-lg font-pregular">{item.title}</Text>
                                <Text className="text-white text-lg font-pthin">{item.description}</Text>
                            </View>
                            <Feedback video={item} checkUserAccount={checkUserAccount} />
                        </View>
                    </View>
                </Background>
            </View>
        </TouchableOpacity>
    )

    if(loading) {
        return (
            <View className="flex-1 w-full h-screen flex justify-center items-center">
                <ActivityIndicator size="large" color="#3345ee" />
            </View>
        )
    }

    return (
        <FlatList
            key={listKey}
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.videoId}
            snapToAlignment="start"
            snapToInterval={height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            pagingEnabled
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onEndReached={() => refetch()}
            getItemLayout={(data, index) => (
                { length: height, offset: height * index, index }
            )}
        />
    )
}

export default FullScreen;
