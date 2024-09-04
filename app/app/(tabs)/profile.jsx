import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

import { useLayoutEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { sendForm } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';
import { getFromLocal, removeFromLocal, saveToLocal } from '@/utils/localStorage';
import { zUser } from '@/store/user';
import { zPosts } from '@/store/posts';

import * as DocumentPicker from 'expo-document-picker';
import ReactionStats from '@/components/ReactionStats';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from '@/components/CustomButton';
import Background from '@/components/Background';
import CustomAlert from '@/components/CustomAlert';
import CreatePost from '@/assets/create-new-post.png';

const Profile = () => { 
    const [videos, setVideos] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [prevVideoIndex, setPrevVideoIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const router = useRouter();
    const saveUser = zUser(state => state.setUser);
    const user = zUser(state => (
        {
            id: state.id,
            firstname: state.firstname,
            lastname: state.lastname,
            email: state.email,
            profileimage: state.profileimage
        }
    ));
    const posts = zPosts(state => state.data);
    const removeUserData = zUser(state => state.removeAllData);
    const removePostsData = zPosts(state => state.removeAllData);

    const videoRefs = useRef({});
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const viewedItems = viewableItems.map(item => item.index)
        setVisibleItems(prev => [...prev, ...viewedItems]);
    }).current;

    const openImagePicker = async () => {
        try {
            setLoading(true);
            const result = await DocumentPicker.getDocumentAsync({type: ['image/png', 'image/jpg', 'image/jpeg']});
            if (!result.canceled) {
                //console.log(result.assets[0]);
                const { uri, name, size, mimeType } = result.assets[0];

                const form = new FormData();
                form.append('file', { name, uri, type: mimeType });
                
                const { profileimage } = await sendForm(urls['profileimage'], form, 'PUT');
                const nUser = {...user, profileimage};
                saveUser(nUser);
                await saveToLocal('user', nUser);
            } else {
                setTimeout(() => {
                    setAlert(true);
                }, 100);
            }
        } catch(error) {
            console.log(error?.message);
        }

        setLoading(false);
    };

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

    const logout = async () => {
        try {
            setLoading(true);
            await removeFromLocal('user');
            await removeFromLocal('posts');
            
            removeUserData();
            removePostsData();

            setTimeout(() => {
                router.push('(user)/login');
            }, 100);
        } catch(error) {
            console.log(error);
            Alert.alert('Log out failed', 'Unable to logout. Please try again later.');
        }

        setLoading(false);
    }

    useLayoutEffect(() => {
        const {id, firstname, lastname, email} = user;
        if(!id || !firstname || !lastname || !email) {
            router.push('/(user)/login');
        }
        return () => {
            videoRefs.current = {};
        }
    }, []);
    
    useFocusEffect(
        useCallback(() => { 
            setVideos(posts);
            return () => {
                // Pause the video when screen is unfocused
                for(const video of Object.values(videoRefs.current)) {
                    video?.pauseAsync();
                }
            }
        }, [])
    );

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
                        <View className="w-full h-full flex flex-col justify-end p-4">
                            <Text className="text-white text-lg font-pregular">{item.title}</Text>
                            <Text className="text-white text-lg font-pthin">{item.description}</Text>
                        </View>
                    </Background>
                </View>
                <ReactionStats id={item.id} />
            </TouchableOpacity>
        )
    }

    if(!user?.email) return (
        <View className="flex-1 w-full h-full px-8 flex justify-center items-center">
            <CustomButton title="Log in" onPress={() => router.push('(user)/login')} contClassName="w-full my-auto px-8" />
        </View>
    )

    if(loading) {
        return (
            <View className="flex-1 w-full h-screen flex justify-center items-center">
                <ActivityIndicator size="large" color="#3345ee" />
            </View>
        )
    }

    return (
        <SafeAreaView>
            {alert && <CustomAlert visible={alert} onClose={()=>setAlert(false)} title="Profile Image" message="Selecting image for profile canceled." />}
            <View className="w-full h-full px-8 pt-2 pb-20 min-h-screen">
                <View className="w-full h-[40px] flex justify-center items-end">
                    <Link href="(user)/edit">
                        <Text className="text-blue-500 text-lg font-pregular">Edit</Text>
                    </Link>
                </View>
                <FlatList
                    data={videos}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={() => (
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
                            <Text className="font-pebold text-xl text-secondary">{`${user?.firstname} ${user?.lastname}`}</Text>
                            <Text className="font-pthin text-white/75">{user?.email}</Text>
                        </View>
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                    renderItem={renderItem}
                    ListFooterComponent={() => (
                        <CustomButton title="Log out" onPress={() => logout()} contClassName="w-full mt-4 bg-red-500" />
                    )}
                    ListEmptyComponent={() => (
                        <View className="w-full h-[70vh] flex-1 flex justify-center items-center">
                            <Image className="w-1/2 h-[50vw]" source={CreatePost} resizeMode="contain" />
                            <Text className="text-white text-lg font-pbold">No posts yet. Create one now.</Text>
                            <CustomButton title="Create a new post" onPress={() => router.push('/(tabs)/create')} contClassName="px-4 mt-[40px]" />
                        </View>
                    )}
                />
            </View> 
        </SafeAreaView>
    )
}

export default Profile;


//initialNumToRender={10}
//maxToRenderPerBatch={10}

