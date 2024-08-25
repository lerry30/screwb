import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { authUserInput } from '@/utils/auth';
import { sendForm } from '@/utils/send';
import { urls } from '@/constants/urls';
import { getFromLocal, saveToLocal } from '@/utils/localStorage';
import { useRouter } from 'expo-router';

import TitleFormat from '@/utils/titleFormat';
import ErrorField from '@/components/ErrorField';
import FormField from '@/components/FormField';
import FormTextArea from '@/components/FormTextArea';
import CustomButton from '@/components/CustomButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as DocumentPicker from 'expo-document-picker';

const Create = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState({ name: '', uri: '', type: '' });

    const [error, setError] = useState({title: '', description: '', server: ''});

    const router = useRouter();

    const upload = async () => {
        const result = await DocumentPicker.getDocumentAsync({type: 'video/*'});
        if (!result.canceled) {
            //console.log(result.assets[0]);
            const { uri, name, size, mimeType } = result.assets[0];
            setVideo({ name, uri, type: mimeType });
        } else {
            setTimeout(() => {
                Alert.alert('Upload Video', 'Video Selection Canceled.');
            }, 100);
        }
    }

    const create = async () => {
        try {
            setError({title: '', description: '', server: ''});

            authUserInput({
                title,
                description,
                video: video?.uri
            }, setError);

            if(title.length > 20) throw new Error('Title is too long.');
            if(description.length > 50) throw new Error('Title is too long.');
            if(!video?.uri) throw new Error('No video selected.');

            const form = new FormData();
            form.append('title', TitleFormat(title));
            form.append('description', TitleFormat(description));
            form.append('file', video);

            const response = await sendForm(urls['createpost'], form); 
            const posts = await getFromLocal('posts') || [];
            posts.push(response);
            await saveToLocal('posts', posts);
            setTimeout(() => {
                router.push('(tabs)/profile');
            }, 100);
        } catch(error) {
            console.log(error?.message);
            const message = error?.message || 'There\'s something wrong. Please try again later.';
            setError(errorData => ({...errorData, server: message}));
        }

        setTitle('');
        setDescription('');
        setVideo({ name: '', uri: '', type: '' });
    }

    return (
        <SafeAreaView>
            <ScrollView>
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
