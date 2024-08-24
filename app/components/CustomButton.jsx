import { TouchableOpacity, Text, ActiveIndicator } from 'react-native';

const CustomButton = ({ title, onPress, contClassName, textClassName }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`bg-secondary rounded-xl min-h-[62px] flex justify-center items-center ${contClassName}`}
        >
            <Text className={`text-primary font-psemibold text-lg ${textClassName}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;
