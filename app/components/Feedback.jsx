import { View, Text, TouchableOpacity } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { sendJSON } from '@/utils/send';
import { urls } from '@/constants/urls';
import { formatNumber } from '@/utils/number';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Feedback = ({ video, checkUserAccount }) => {
    const [feedbackCounts, setFeedbackCounts] = useState({
        heart: video.heart,
        like: video.like,
        dislike: video.dislike,
        haha: video.haha
    });

    const [prevReactions, setPrevReactions] = useState([]);

    const feedback = async (reaction) => {
        try {
            checkUserAccount();
            const videoId = video.videoId;
            if (videoId && reaction) {
                const data = { feedback: reaction, postId: videoId };
                const response = await sendJSON(urls['feedback'], data, 'PUT');
                if (response) {
                    setFeedbackCounts(prevState => ({
                        ...prevState,
                        [reaction]: response[reaction]
                    }));

                    setPrevReactions(prevState => {
                        if (prevState.includes(reaction)) {
                            return prevState.filter(act => act !== reaction);
                        } else {
                            return [...prevState, reaction];
                        }
                    });
                }
            }
        } catch (error) {
            console.log('Function: feedback ', error);
        }
    };

    const getPrevUserReactions = async () => {
        try {
            const videoId = video.videoId;
            if (videoId) {
                const response = await sendJSON(urls['reactions'], { postId: videoId }, 'POST');
                if (response?.reactions?.length > 0) {
                    setPrevReactions(response.reactions);
                }
            }
        } catch (error) {
            console.log('Function: getPrevUserReactions ', error?.message);
        }
    };

    useLayoutEffect(() => {
        getPrevUserReactions();
    }, []);

    return (
        <View className="w-[16%] space-y-6">
            <TouchableOpacity
                onPress={() => feedback('heart')}
                className="w-full aspect-square flex justify-center items-center bg-neutral-900/50 rounded-xl"
            >
                <AntDesign name="heart" size={30} color={feedbackCounts.heart > video.heart || prevReactions.includes('heart') ? "#FE0000" : "white"} />
                <Text className="text-white text-sm font-pbold">{formatNumber(feedbackCounts.heart)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => feedback('like')}
                className="w-full aspect-square flex justify-center items-center bg-neutral-900/50 rounded-xl"
            >
                <MaterialIcons name="thumb-up" size={30} color={feedbackCounts.like > video.like || prevReactions.includes('like') ? "#387ADF" : "white"} />
                <Text className="text-white text-sm font-pbold">{formatNumber(feedbackCounts.like)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => feedback('dislike')}
                className="w-full aspect-square flex justify-center items-center bg-neutral-900/50 rounded-xl"
            >
                <MaterialIcons name="thumb-down" size={30} color={feedbackCounts.dislike > video.dislike || prevReactions.includes('dislike') ? "#387ADF" : "white"} />
                <Text className="text-white text-sm font-pbold">{formatNumber(feedbackCounts.dislike)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => feedback('haha')}
                className="w-full aspect-square flex justify-center items-center bg-neutral-900/50 rounded-xl"
            >
                <FontAwesome5 name="laugh-squint" size={30} color={feedbackCounts.haha > video.haha || prevReactions.includes('haha') ? "#F9E400" : "white"} />
                <Text className="text-white text-sm font-pbold">{formatNumber(feedbackCounts.haha)}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Feedback;
