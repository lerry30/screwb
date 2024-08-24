import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageNames = {
    user: 'user',
    token: 'token',
};

export const saveToLocal = async (name, data) => {
    const storageName = storageNames[name];
    //if(!storageName) throw new Error('Undefined Local Storage Name');
    if(!storageName) return false;

    await AsyncStorage.setItem(storageName, JSON.stringify(data));
    return true;
}

export const getFromLocal = async (name) => {
    const storageName = storageNames[name];
    //if(!storageName) throw new Error('Undefined Local Storage Name');
    if(!storageName) return undefined;

    const user = await AsyncStorage.getItem(storageName);
    return JSON.parse(user || '{}');
}

export const removeFromLocal = async (name) => {
    const storageName = storageNames[name];
    //if(!storageName) throw new Error('Undefined Local Storage Name');
    if(!storageName) return false;

    await AsyncStorage.removeItem(storageName);
    return true;
}
