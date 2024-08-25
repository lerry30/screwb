import { View, Text, TextInput } from 'react-native';

const FormTextArea = ({ title, value, placeholder, onChange, noOfLines=4, height=200 }) => {
    return (
        <View className="space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
            <TextInput
                className="w-full p-4 bg-black-100 rounded-2xl border-2 border-black-100 focus:border-secondary flex-1 text-white font-psemibold text-base"
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7B7B8B"
                onChangeText={onChange}
                multiline={true}
                numberOfLines={noOfLines}
                style={{textAlignVertical: 'top', height: height}}
            />
        </View>
    )
}

export default FormTextArea;
