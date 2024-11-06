import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useLayoutEffect } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { authUserInput } from '@/utils/auth';
import { sendJSON } from '@/utils/send';
import { urls } from '@/constants/urls';
import { getFromLocal, saveToLocal } from '@/utils/localStorage';
import { useRouter } from 'expo-router';
import { zUser } from '@/store/user';
import { zPosts } from '@/store/posts';
import { uploadInChunks } from '@/utils/uploadInChunks';

import TitleFormat from '@/utils/titleFormat';
import ErrorField from '@/components/ErrorField';
import FormField from '@/components/FormField';
import FormTextArea from '@/components/FormTextArea';
import CustomButton from '@/components/CustomButton';
import CustomAlert from '@/components/CustomAlert';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as DocumentPicker from 'expo-document-picker';

const Create = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState({ name: '', uri: '', type: '', size: 0 });

    const [error, setError] = useState({title: '', description: '', server: ''});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const router = useRouter();
    const postsData = zPosts(state => state.data);
    const addNewPost = zPosts(state => state.add);

    const upload = async () => {
        const result = await DocumentPicker.getDocumentAsync({type: 'video/*'});
        if (!result.canceled) {
            //console.log(result.assets[0]);
            const { uri, name, size, mimeType } = result.assets[0];
            setVideo({ name, uri, type: mimeType, size });
        } else {
            setTimeout(() => {
                setAlert(true);
            }, 100);
        }
    }

    const create = async () => {
        try {
            setLoading(true);
            setError({title: '', description: '', server: ''});

            authUserInput({
                title,
                description,
                video: video?.uri
            }, setError);

            if(title.length > 30) throw new Error('Title is too long.');
            if(description.length > 80) throw new Error('Title is too long.');
            if(!video.uri) throw new Error('No video selected.');

            const fileType = video.type.split('/')[1];
            const fileName = `${Date.now()}.${fileType}`;

            const data = {
                title: TitleFormat(title),
                description: TitleFormat(description),
                filename: fileName,
            }

            await uploadInChunks(video, fileName);
            const response = await sendJSON(urls['createpost'], data, 'POST'); 
            await saveToLocal('posts', [...postsData, response]);
            const {ok, message} = addNewPost(response);
            console.log(message);
            setTimeout(() => {
                router.push('(tabs)/profile');
            }, 100);

            setTitle('');
            setDescription('');
            setVideo({ name: '', uri: '', type: '', size: 0 });
        } catch(error) {
            console.log(error?.message);
            const message = error?.message || 'There\'s something wrong. Please try again later.';
            setError(errorData => ({...errorData, server: message}));
        }

        setLoading(false);
    }

    if(!zUser.getState().email) return (
        <View className="flex-1 w-full h-full px-8 flex justify-center items-center">
            <CustomButton title="Log in" onPress={() => router.push('(user)/login')} contClassName="w-full my-auto px-8" />
        </View>
    )

    if(loading) {
        return (
            <View className="flex-1 w-full h-screen flex justify-center items-center">
                <ActivityIndicator size="large" color="#3345ee" />
                <Text className="text-lg text-gray-100 font-pbold mt-4">Uploading...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView>
                {alert && <CustomAlert visible={alert} onClose={()=>setAlert(false)} title="Upload Video" message="Video Selection Canceled" />}
                <View className="size-full min-h-screen p-4">
                    <Text className="text-secondary font-pbold text-xl pb-4">Upload</Text> 
                    <FormField
                        title="Title"
                        value={title}
                        placeholder="Title"
                        onChange={value => setTitle(value)}
                        contClassName=""
                    />
                    <ErrorField error={error?.title || ''} />
                    <FormTextArea
                        title="Description"
                        value={description}
                        placeholder="Description..."
                        onChange={value => setDescription(value)}
                        noOfLines={4}
                        height={140}
                    />
                    <ErrorField error={error?.description || ''} />
                    <Text className="text-base text-gray-100 font-pmedium">Video</Text>
                    <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => upload()}
                        className="w-full h-[500px] rounded-2xl overflow-hidden bg-black-100 flex justify-center items-center"
                    >
                        {
                            video?.uri ?
                                <Video
                                    source={{ uri: video.uri }}
                                    className="w-full h-full"
                                    useNativeControls
                                    resizeMode={ResizeMode.COVER}
                                    isLooping
                                /> 
                            : <FontAwesome6 name="square-plus" size={80} color="#7B7B8B" />
                        }
                    </TouchableOpacity>
                    <CustomButton title="Create" onPress={() => create()} contClassName="w-full mt-4" />
                    <ErrorField error={error?.server || ''} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create;
