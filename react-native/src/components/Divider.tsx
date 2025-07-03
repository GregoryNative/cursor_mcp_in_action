import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, View } from 'react-native-ui-lib';

export const Divider = (props: any) => {
    return (
        <View style={styles.separator} {...props} />
    );
};

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.separator,
    }
});