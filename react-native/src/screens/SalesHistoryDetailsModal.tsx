import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Colors, Typography } from 'react-native-ui-lib';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { SalesHistoryDetails } from './SalesHistoryDetails';

enum NavigationButtonId {
    Cancel = 'cancel',
    Done = 'done',
}

interface Props {
    item?: {
        id: string;
        orderNumber: string;
    };
    componentId: string;
}

export const SalesHistoryDetailsModal = (props: Props) => {
    const { componentId } = props;

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === NavigationButtonId.Cancel) {
            Navigation.dismissModal(componentId);
        } else if (buttonId === NavigationButtonId.Done) {
            Navigation.dismissAllModals();
        }
    }, componentId);

    return <SalesHistoryDetails {...props} isModal />;
};

SalesHistoryDetailsModal.options = () => ({
    topBar: {
        title: {
            ...Typography.titleBold,
        },
        leftButtons: [
            {
                id: NavigationButtonId.Cancel,
                text: 'Cancel',
                ...Typography.textPrimary,
            }
        ],
        rightButtons: [
            {
                id: NavigationButtonId.Done,
                text: 'Done',
                ...Typography.textPrimary,
            }
        ],
        background: {
            color: Colors.backgroundDefault,
        },
        scrollEdgeAppearance: {
            noBorder: true,
            borderColor: 'transparent',
        },
        borderColor: 'transparent',
    }
}); 