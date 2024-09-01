import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayoutEffect, useState, useRef, useCallback } from 'react'
import { getData } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';
import { Video, ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { zUser } from '@/store/user';

import Background from '@/components/Background';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feedback from '@/components/Feedback';

const { height } = Dimensions.get('window');

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [renderList, setRenderList] = useState(0);
    const [fetchSlice, setFetchSlice] = useState(0);
    const [loading, setLoading] = useState(false);
    const videoRefs = useRef({});

    const email = zUser(state => state?.email);

    const NOOFVIDEOSTOFETCH = 4;

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

    const getVideos = async () => {
        try {
            setLoading(true);
            const response = await getData(
                `${urls['getvideos']}?count=${NOOFVIDEOSTOFETCH}&slice=${fetchSlice}`
            );

            if(response.length === 0) {
                console.log('Last video');
                return;
            }
            //setVideos(response);
            setVideos(prev => {
                if(prev.length === 0) return response;
                const nVideoData = [];
                const checkIfAlreadyExist = (id) => {
                    for(const item02 of prev)
                        if(id === item02?.videoId) 
                            return true;
                    return false;
                }

                for(const item01 of response) {
                    if(checkIfAlreadyExist(item01.videoId)) continue;
                    nVideoData.push(item01);
                }

                return nVideoData
            });

            setFetchSlice(no => no+1);
        } catch(error) {
            console.log('Funtion: getVideos ', error);
        }

        setLoading(false);
    }

    useLayoutEffect(() => {
        getVideos();
        return () => {
            videoRefs.current = {};
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Pause the video when screen is unfocused
                setIsPlaying(false);
                for(const video of Object.values(videoRefs.current)) {
                    video?.pauseAsync();
                }
            }
        }, [])
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity 
            activeOpacity={1}
            onPress={() => handlePlayPause(index)}
        >
            <View className="relative w-full h-screen flex-1 bg-black-700 overflow-hidden">
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
                    <View className="w-full h-full flex flex-row items-end px-2 pt-4 pb-[50px]">
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
            key={fetchSlice}
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
            onEndReached={() => getVideos()}
            getItemLayout={(data, index) => (
                { length: height, offset: height * index, index }
            )}
        />
    )
}

export default Home;
