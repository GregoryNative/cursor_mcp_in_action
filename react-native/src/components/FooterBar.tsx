import React from 'react';
import { View, Text, Button, Colors } from 'react-native-ui-lib';

interface FooterBarProps {
    totalSum: number;
    itemsCount: number;
    buttonText: string;
    onButtonPress: () => void;
    currency?: string;
}

export const FooterBar: React.FC<FooterBarProps> = ({
    totalSum,
    itemsCount,
    buttonText,
    onButtonPress,
    currency = '$'
}) => {
    return (
        <View paddingH-s5 paddingV-s4 bg-backgroundDefault style={{ borderTopWidth: 1, borderTopColor: Colors.separator }}>
            <View row spread>
                <View flex>
                    <Text titleBold>Total {currency}{totalSum.toFixed(2)}</Text>
                    <Text bodySmall>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</Text>                    
                </View>
                <Button
                    bodyBold
                    labelStyle={{ color: Colors.textDefaultLight }}
                    label={buttonText}
                    size={Button.sizes.large}
                    backgroundColor={Colors.textPrimary}
                    borderRadius={100}
                    onPress={onButtonPress}
                />
            </View>
        </View>
    );
}; 