import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Background = ({ children, className }) => {
    return (
        <LinearGradient 
            colors={[ '#141a1acc', '#0a4d4acc']}
            className={`flex-1 size-screen ${className}`}>
                { children }
        </LinearGradient>
    );
}

export default Background;
