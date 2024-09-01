import { View, Text } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { getData } from '@/utils/send';
import { urls } from '@/constants/urls';
import { formatNumber } from '@/utils/number';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const ReactionStats = ({id}) => {
    const [stats, setStats] = useState({heart: 0, like: 0, dislike: 0, haha: 0});

    const getPostReaction = async () => {
        try {
            if(!id) throw new Error('Post id is not defined');
            const response = await getData(`${urls['postreactions']}?id=${id}`);
            if(response) {
                setStats({
                    heart: response.heart,
                    like: response.like,
                    dislike: response.dislike,
                    haha: response.haha,
                });
            }
        } catch(error) {
            console.log('Function: getPostReaction ', error?.message);
        }
    }

    useLayoutEffect(() => {
        getPostReaction();
    }, []);

    return (
        <View className="w-full flex flex-row space-x-4 mt-2">
            <View className="h-[24px] flex flex-row justify-center items-center bg-red-900/50 px-1 rounded-lg">
                <AntDesign name="heart" size={14} color="#FE000077" />
                <Text className="text-white/75 text-[12px] font-pbold ml-1 mt-[2px]">{formatNumber(stats.heart)}</Text>
            </View>
            <View className="h-[24px] flex flex-row justify-center items-center bg-blue-900/50 px-1 rounded-lg">
                <MaterialIcons name="thumb-up" size={14} color="#387ADF77" />
                <Text className="text-white/75 text-[12px] font-pbold ml-1 mt-[2px]">{formatNumber(stats.like)}</Text>
            </View>
            <View className="h-[24px] flex flex-row justify-center items-center bg-green-900/50 px-1 rounded-lg">
                <MaterialIcons name="thumb-down" size={14} color="#387ADF77" />
                <Text className="text-white/75 text-[12px] font-pbold ml-1 mt-[2px]">{formatNumber(stats.dislike)}</Text>
            </View>
            <View className="h-[24px] flex flex-row justify-center items-center bg-yellow-900/50 px-1 rounded-lg">
                <FontAwesome5 name="laugh-squint" size={14} color="#F9E40077" />
                <Text className="text-white/75 text-[12px] font-pbold ml-1 mt-[2px]">{formatNumber(stats.haha)}</Text>
            </View>
        </View>
    )
}

export default ReactionStats;
