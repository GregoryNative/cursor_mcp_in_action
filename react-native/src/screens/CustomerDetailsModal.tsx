import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Colors, Typography } from 'react-native-ui-lib';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { CustomerDetails } from './CustomerDetails';

enum NavigationButtonId {
    Cancel = 'cancel',
}

interface Props {
    customerId: string;
    orderNumber?: string;
    componentId: string;
}

export const CustomerDetailsModal = (props: Props) => {
    const { componentId } = props;

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === NavigationButtonId.Cancel) {
            Navigation.dismissModal(componentId);
        }
    }, componentId);

    return <CustomerDetails {...props} isModal />;
};

CustomerDetailsModal.options = () => ({
    topBar: {
        title: {
          visible: false,
        },
        background: {
          color: Colors.transparent,
        },
        scrollEdgeAppearance: {
          noBorder: true,
          borderColor: 'transparent',
        },
        drawBehind: true,
        borderColor: 'transparent',
        leftButtons: [
            {
                id: NavigationButtonId.Cancel,
                text: 'Cancel',
                ...Typography.textPrimary,
            }
        ],
    }
}); 