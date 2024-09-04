import { useLayoutEffect, useState, useRef, useCallback } from 'react'
import { getData } from '@/utils/send';
import { urls, serverDomain } from '@/constants/urls';
import { useFocusEffect } from '@react-navigation/native';

import FullScreen from '@/components/FullScreen';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [fetchSlice, setFetchSlice] = useState(0);
    const [loading, setLoading] = useState(false);
    const videoRefs = useRef({});

    const NOOFVIDEOSTOFETCH = 4;

    const getVideos = async () => {
        try {
            setLoading(true);
            const response = await getData(
                `${urls['getvideos']}?count=${NOOFVIDEOSTOFETCH}&slice=${fetchSlice}`
            );

            if(response.length === 0) {
                throw new Error('Last video');
            }
            //setVideos(response);
            setVideos(prev => {
                if(prev.length === 0) return response;
                const nVideoData = [];
                const checkIfAlreadyExist = (id) => {
                    for(const item02 of prev)
                        if(id === item02?.videoId) 
                            return true;
                    return false;
                }

                for(const item01 of response) {
                    if(checkIfAlreadyExist(item01.videoId)) continue;
                    nVideoData.push(item01);
                }

                return nVideoData
            });

            setFetchSlice(no => no+1);
        } catch(error) {
            console.log('Funtion: getVideos ', error?.message);
        }

        setLoading(false);
    }

    useLayoutEffect(() => {
        getVideos();
        return () => {
            videoRefs.current = {};
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                // Pause the video when screen is unfocused
                setIsPlaying(false);
                for(const video of Object.values(videoRefs.current)) {
                    video?.pauseAsync();
                }
            }
        }, [])
    );

    return (
        <FullScreen 
            videos={videos}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            listKey={fetchSlice}
            videoRefs={videoRefs}
            loading={loading}
            refetch={getVideos}
        />
    )
}

export default Home;
