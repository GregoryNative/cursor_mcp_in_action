import { Navigation } from "react-native-navigation";
import React from 'react';
import { View, Text } from 'react-native';

Navigation.setDefaultOptions({
  options: {
    bottomTab: {
      fontFamily: 'WixMadeforTextApp-Regular'
    },
    topBar: {
      rightButtons: [
        {
          fontFamily: 'WixMadeforTextApp-Regular'
        }
      ],
      leftButtons: [
        {
          fontFamily: 'WixMadeforTextApp-Regular'
        }
      ]
    },
  }
});

Navigation.registerComponent('HomeScreen', () => () =>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Hello world</Text>
  </View>
)

Navigation.events().registerAppLaunchedListener(async () => {
  await Navigation.setRoot({
    root: {
      component: {
        name: 'HomeScreen'
      }
    }
  });
});