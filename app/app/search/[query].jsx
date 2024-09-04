import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { useLayoutEffect, useState, useRef } from 'react';
import { getData } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';

import * as DocumentPicker from 'expo-document-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Background from '@/components/Background';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FullScreen from '@/components/FullScreen';
import NotFound from '@/assets/search-not-found.png';
import CustomButton from '@/components/CustomButton';

const Search = () => {
    const [videos, setVideos] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [prevVideoIndex, setPrevVideoIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const router = useRouter();
    const {query} = useLocalSearchParams();

    const videoRefs = useRef({});
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const viewedItems = viewableItems.map(item => item.index)
        setVisibleItems(prev => [...prev, ...viewedItems]);
    }).current;

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        if(playbackStatus.isLoaded) {
            // Check if the video is playing
            setIsPlaying(playbackStatus.isPlaying);
        } else if (playbackStatus.error) {
            console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
        }
    };

    const handlePlayPause = (index) => {
        setPrevVideoIndex(index);
        if(prevVideoIndex !== index) {            
            videoRefs.current[prevVideoIndex]?.pauseAsync();
            videoRefs.current[index]?.playAsync();
            setIsPlaying(true);
            return;
        }

        setIsPlaying(playing => {
            if(isPlaying) {
                videoRefs.current[index]?.pauseAsync();
                return false;
            }

            videoRefs.current[index]?.playAsync();
            return true;
        });
    }

    const search = async () => {
        try {
            if(!query) {
                router.push('search/searchinput');
                throw new Error('Unable to search for empty search value.');
            }

            const response = await getData(`${urls['search']}?for=${query}`);
            if(response?.length > 0) {
                setVideos(response);
            }
        } catch(error) {
            console.log('Function: search ', error?.message);
        }
    }

    useLayoutEffect(() => {
        search();
        return () => {
            // Pause the video when screen is unfocused
            setIsPlaying(false);
            for(const video of Object.values(videoRefs.current)) {
                video?.pauseAsync();
            }

            videoRefs.current = {};
            onViewableItemsChanged.current = null;
        }
    }, []);

    const renderItem = ({item, index}) => {
        const isVisible = visibleItems.includes(index);
        if(!isVisible) {
            return (
                <View key={index} className="relative w-full h-[520px] bg-gray-900/50 rounded-2xl overflow-hidden flex justify-center items-center">
                    <ActivityIndicator size="large" color="#3345ee" />
                    <Text className="text-lg text-gray-100 font-pbold mt-4">Loading...</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity 
                key={index}
                activeOpacity={1}
                onPress={() => handlePlayPause(index)}
                className="mt-4"
            >
                <View className="relative w-full h-[520px] bg-black-700 rounded-2xl overflow-hidden">
                    <Video
                        ref={ref => {videoRefs.current[index]=ref}}
                        source={{uri: `${serverDomain}/videos/${item.video}`}}
                        className="absolute top-0 left-0 right-0 bottom-0"
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                    />
                    <Background 
                        colors={['#0000', '#0000', '#000a']} 
                        style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                        <View className="w-full h-full flex flex-col p-4">
                            <View className="w-full flex items-end">
                                <TouchableOpacity onPress={()=>setFullScreen(true)}>
                                    <MaterialCommunityIcons name="resize" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex flex-col mt-auto">
                                <View className="flex flex-row items-center space-x-2">
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
                        </View>
                    </Background>
                </View>
            </TouchableOpacity>
        )
    }

    if(loading) {
        return (
            <View className="flex-1 w-full h-screen flex justify-center items-center">
                <ActivityIndicator size="large" color="#3345ee" />
            </View>
        )
    }

    if(fullScreen) {
        return (
            <FullScreen 
                videos={videos}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                videoRefs={videoRefs}
                loading={loading}
                home={false}
            />
        )
    }

    return (
        <SafeAreaView>
            <View className="w-full h-full px-2 pt-2 pb-20 min-h-screen">
                <View className="w-full h-[40px] flex justify-center">
                    <Link href="(tabs)/home">
                        <View className="w-full flex flex-row items-center">
                            <Ionicons name="chevron-back" size={24} color="#5656ff"/>
                            <Text className="text-[#5656ff] text-lg font-pregular align-bottom mt-1">Back</Text>
                        </View>
                    </Link>
                </View>
                <FlatList
                    data={videos}
                    keyExtractor={(item) => item.videoId}
                    ListHeaderComponent={() => (
                        <View className="w-full pb-4">
                            <Text className="font-pbold text-gray-100">Search Results for {query}</Text>
                        </View>
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <View className="w-full h-[70vh] flex-1 flex justify-center items-center">
                            <Image className="w-1/2 h-[50vw]" source={NotFound} resizeMode="contain" />
                            <Text className="text-white text-lg font-pbold">No search results found for '{query}'.</Text>
                            <CustomButton title="Go back to home" onPress={() => router.push('/(tabs)/home')} contClassName="w-1/2 mt-[40px]" />
                        </View>
                    )}
                />
            </View> 
        </SafeAreaView>
    )
}

export default Search;
