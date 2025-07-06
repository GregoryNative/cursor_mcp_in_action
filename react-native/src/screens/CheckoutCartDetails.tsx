import React, { Component } from 'react';
import { Alert, FlatList, Image, TouchableOpacity } from 'react-native';
import { View, Text, Button, Colors, Typography } from 'react-native-ui-lib';
import { Navigation } from 'react-native-navigation';
import { connect } from 'remx';
import { cartStore, CartItem } from '../stores/cartStore';
import { BASE_URL } from '../constants';

interface Props {
    componentId: string;
    items: CartItem[];
    total: number;
}

enum NavigationButtonId {
    Actions = 'actions',
}

class CheckoutCartDetailsComponent extends Component<Props> {
    static options() {
        return {
            topBar: {
                title: {
                    text: 'Cart',
                },
                scrollEdgeAppearance: {
                    noBorder: true,
                    color: Colors.backgroundDefault,
                },
                backButton: {
                    visible: true,
                    showTitle: false,
                    color: Colors.textDefault,
                },
                rightButtons: []
            },
            bottomTabs: {
                visible: false,
            }
        };
    }

    constructor(props: Props) {
        super(props);
        this.navigationButtonPressed = this.navigationButtonPressed.bind(this);
        Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({ buttonId }: { buttonId: string }) {
        switch (buttonId) {
            case NavigationButtonId.Actions:
                Alert.alert('Button Pressed', 'Actions button was pressed');
                break;
        }
    }

    render() {
        const { items, total } = this.props;

        return null;
    }
}

export const CheckoutCartDetails = connect(() => ({
    items: cartStore.getItems(),
    total: cartStore.getTotal()
}))(CheckoutCartDetailsComponent);
