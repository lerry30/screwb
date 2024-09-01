import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useState, useLayoutEffect } from 'react';
import { getFromLocal, saveToLocal } from '@/utils/localStorage';
import { serverDomain, urls } from '@/constants/urls';
import { authUserInput } from '@/utils/auth';
import { sendForm } from '@/utils/send';
import { zUser } from '@/store/user';

import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import ErrorField from '@/components/ErrorField';
import CustomAlert from '@/components/CustomAlert';
import TitleFormat from '@/utils/titleFormat';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Edit = () => {
    const [userData, setUserData] = useState({ firstname: '', lastname: '', email: '', profileimage: '' });
    const [newProfile, setNewProfile] = useState({uri: '', name: '', type: ''});
    const [error, setError] = useState({ firstname: '', lastname: '', email: '', server: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const user = zUser(state => ({
        firstname: state.firstname,
        lastname: state.lastname,
        email: state.email,
        profileimage: state.profileimage
    }));
    const saveUser = zUser(state => state.setUser);

    const router = useRouter();

    const openImagePicker = async () => {
        setLoading(true);
        const result = await DocumentPicker.getDocumentAsync({type: ['image/png', 'image/jpg', 'image/jpeg']});
        if (!result.canceled) {
            //console.log(result.assets[0]);
            const { uri, name, size, mimeType } = result.assets[0];
            setNewProfile({ name, uri, type: mimeType });
        } else {
            setTimeout(() => {
                setAlert(true);
            }, 100);
        }
        setLoading(false);
    }

    const updateUser = async () => {
        try {
            setLoading(true);
            const shouldStop = authUserInput(userData, setError, ['profileimage']);
            if(shouldStop) throw new Error('Empy Fields');
            
            const form = new FormData();
            form.append('firstname', TitleFormat(userData?.firstname));
            form.append('lastname', TitleFormat(userData?.lastname));
            form.append('email', userData?.email);
            
            if(newProfile?.uri) {
                form.append('file', newProfile);
            }
            
            const response = await sendForm(urls['updateprofile'], form, 'PUT');
            const { id, firstname, lastname, email } = response;
            if(id && firstname && lastname && email) {
                await saveToLocal('user', response);
                saveUser(response);
                Alert.alert('Success', 'Successfully updated');
                setTimeout(() => {
                    router.push('(tabs)/profile');
                }, 2000);
            }
        } catch(error) {
            console.log(error?.message);
            //setError({...error, server: error});
            Alert.alert('Oops', 'There\'s a problem right now. Please try again later.');
        }

        setLoading(false);
    }

    useLayoutEffect(() => {
        const {firstname, lastname, email} = user;
        if(firstname && lastname && email) {
            setUserData(user);
        }
    }, []);

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
                {alert && <CustomAlert visible={alert} onClose={()=>setAlert(false)} title="Profile Image" message="Selecting image for profile canceled." />}
                <View className="size-full px-8 min-h-screen">
                    <View className="w-full h-[10%] flex justify-center">
                        <Link href="(tabs)/profile">
                            <View className="flex flex-row justify-center items-center">
                                <Ionicons name="chevron-back" size={24} color="#5656ff"/>
                                <Text className="text-[#5656ff] text-lg font-pregular align-bottom mt-1">Cancel</Text>
                            </View>
                        </Link>
                    </View>
                    <View className="w-full h-[90%] flex flex-col justify-center items-center">
                        <TouchableOpacity
                            activeOpacity={0.4}
                            onPress={() => openImagePicker()}
                            className="max-w-[150px] max-h-[150px] rounded-full overflow-hidden">
                            {
                                newProfile?.uri ?
                                    <Image className="w-[150px] h-[150px]" source={{uri: newProfile.uri}} resizeMode="cover" />
                                :
                                    userData?.profileimage ?
                                        <Image className="w-[150px] h-[150px]" source={{uri: `${serverDomain}/profiles/${userData?.profileimage}`}} resizeMode="cover" />
                                    :
                                        <MaterialIcons name="account-circle" size={150} color="white" />
                            }
                        </TouchableOpacity>
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
                        <CustomButton title="Save" onPress={() => updateUser()} contClassName="w-full mt-4" />
                        <ErrorField error={error?.server || ''} />
                    </View>
                </View>
           </ScrollView>
        </SafeAreaView>
    )
}

export default Edit;
