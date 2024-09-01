import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { authUser } from '@/utils/auth';
import { urls } from '@/constants/urls';
import { saveToLocal } from '@/utils/localStorage';
import { zUser } from '@/store/user';
import { zPosts } from '@/store/posts';

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import ErrorField from '@/components/ErrorField';

const LogIn = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [error, setError] = useState({ email: '', password: '', server: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const saveUser = zUser(state => state.setUser);
    const savePosts = zPosts(state => state.setPosts);

    const login = async () => {
        setLoading(true);
        setError({ email: '', password: '' });

        const success = async (response) => {
            try {
                const nUser = {
                    id: response?.id,
                    firstname: response?.firstname || '',
                    lastname: response?.lastname || '',
                    email: response?.email,
                    profileimage: response?.profileimage || '',
                }

                if(!nUser?.id || !nUser?.email) throw new Error('User Credentials Undefined');
                await saveToLocal('user', nUser);

                // save user posts
                const posts = response?.posts;
                const nPosts = posts.map(post => ({id: post?._id, title: post?.title, description: post?.description, video: post?.video    }));
                await saveToLocal('posts', nPosts);

                saveUser(nUser);
                savePosts(nPosts);

                setUserData({ email: '', password: '' });
                router.push('/(tabs)/home');
            } catch(error) {
                console.log(error);
            }
        }

        await authUser({
            userData,
            setError,
            url: urls?.signin || '',
            callback: success,
        });

        setUserData({ email: userData?.email, password: '' });
        setLoading(false);
    }

    if(loading) {
        return (
            <View className="flex-1 w-full h-screen flex justify-center items-center">
                <ActivityIndicator size="large" color="#3345ee" />
            </View>
        )
    }

    return (
        <SafeAreaView>
           <ScrollView>
                <View className="flex-1 size-screen min-h-screen flex flex-col justify-center items-center p-8">
                    <Text className="text-secondary font-pbold text-3xl pb-4">Log In</Text>
                    <FormField
                        title="Email"
                        value={userData?.email}
                        placeholder="example@mail.com"
                        onChange={value => setUserData(data => ({...data, email: value }))}
                        contClassName=""
                        keyboardType="email-address"
                    />
                    <ErrorField error={error?.email || ''} />
                    <FormField
                        title="Password"
                        value={userData?.password}
                        placeholder="Password"
                        onChange={value => setUserData(data => ({...data, password: value }))}
                        contClassName=""
                    />
                    <ErrorField error={error?.password || ''} />
                    <CustomButton title="Log In" onPress={() => login()} contClassName="w-full mt-4" />
                    <ErrorField error={error?.server || ''} />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/signup"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Sign Up
                        </Link>
                    </View>
                </View>
           </ScrollView>
        </SafeAreaView>
    )
}

export default LogIn;
