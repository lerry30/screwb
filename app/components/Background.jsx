import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Background = ({ children, style, colors=['#141a1acc', '#0a4d4acc'] }) => {
    return (
        <LinearGradient 
            colors={colors}
            style={style}
        >
                { children }
        </LinearGradient>
    );
}

export default Background;
