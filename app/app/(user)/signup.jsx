import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { authUser } from '@/utils/auth';
import { urls } from '@/constants/urls';
import { saveToLocal } from '@/utils/localStorage';

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import ErrorField from '@/components/ErrorField';
import TitleFormat from '@/utils/titleFormat';

const SignUp = () => {
    const [userData, setUserData] = useState({ firstname: '', lastname: '', email: '', password: '' });
    const [error, setError] = useState({ firstname: '', lastname: '', email: '', password: '', server: '' });
    const router = useRouter();

    const createUser = async () => {
        setError({ firstname: '', lastname: '', email: '', password: '' });

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

                setUserData({ firstname: '', lastname: '', email: '', password: '' });
                router.push('/(tabs)/home');
            } catch(error) {
                console.log(error);
            }
        }

        await authUser({
            userData: {
                ...userData,
                firstname: TitleFormat(userData?.firstname),
                lastname: TitleFormat(userData?.lastname),
            },
            setError,
            url: urls?.signup || '',
            callback: success,
        });

        setUserData({ ...userData, password: '' });
    }

    return (
        <SafeAreaView className="flex-1 size-screen">
           <ScrollView contentContainerStyle={{height: '100%'}}>
                <View className="flex-1 size-screen flex flex-col justify-center items-center p-8">
                    <Text className="text-secondary font-pbold text-3xl pb-4">Signup</Text>
                    <FormField
                        title="First Name"
                        value={userData?.firstname}
                        placeholder="First Name"
                        onChange={value => setUserData(data => ({...data, firstname: value }))}
                        contClassName=""
                    />
                    <ErrorField error={error?.firstname || ''} />
                    <FormField
                        title="Last Name"
                        value={userData?.lastname}
                        placeholder="Last Name"
                        onChange={value => setUserData(data => ({...data, lastname: value }))}
                        contClassName=""
                    />
                    <ErrorField error={error?.lastname || ''} />
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
                    <CustomButton title="Sign Up" onPress={() => createUser()} contClassName="w-full mt-4" />
                    <ErrorField error={error?.server || ''} />
                    
                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Already have an account?
                        </Text>
                        <Link
                            href="/login"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Log In
                        </Link>
                    </View>
                </View>
           </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp;
