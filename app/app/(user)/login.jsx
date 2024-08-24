import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { authUser } from '@/utils/auth';
import { urls } from '@/constants/urls';
import { saveToLocal } from '@/utils/localStorage'

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import ErrorField from '@/components/ErrorField';

const LogIn = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [error, setError] = useState({ email: '', password: '' });
    const router = useRouter();

    const login = async () => {
        setError({ email: '', password: '' });

        const success = async (response) => {
            try {
                const nData = {
                    id: response?.id,
                    firstname: response?.firstname || '',
                    lastname: response?.lastname || '',
                    email: response?.email,
                    profileimage: response?.profileimage || ''
                }

                if(!nData?.id || !nData?.email) throw new Error('User Credentials Undefined');
                await saveToLocal('user', nData);

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
    }

    return (
        <SafeAreaView className="flex-1 size-screen">
           <ScrollView contentContainerStyle={{height: '100%'}}>
                <View className="flex-1 size-screen flex flex-col justify-center items-center p-8">
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
