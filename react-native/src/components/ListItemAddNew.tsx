import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';

interface ListItemAddNewProps {
    icon: ImageSourcePropType;
    title: string;
    onPress: () => void;
}

export const ListItemAddNew: React.FC<ListItemAddNewProps> = ({
    icon,
    title,
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View
                paddingH-s5
                paddingV-s4
                bg-backgroundDefault
                row
                centerV
            >
                <Image 
                    source={icon}
                    style={{ width: 24, height: 24, tintColor: Colors.textPrimary }}
                />
                <Text textPrimary marginL-s4 flex>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}; 