import React, { useEffect } from 'react';
import { View, Colors, Typography, Button } from 'react-native-ui-lib';
import { useNavigationSearchBarUpdate } from 'react-native-navigation-hooks';
import { ProductsList } from '../components/ProductsList';
import { productsStore } from '../stores/productsStore';
import { cartStore } from '../stores/cartStore';
import { connect } from 'remx';

interface Props {
    componentId: string;
    itemsCount: number;
}

interface SearchBarUpdateEvent {
    text: string;
    isFocused: boolean;
}

const CheckoutMasterComponent = ({ componentId, itemsCount }: Props) => {
    useNavigationSearchBarUpdate(({ text }: SearchBarUpdateEvent) => {
        productsStore.updateSearch(text);
    }, componentId);

    useEffect(() => {
        productsStore.loadInitialData();
    }, []);

    const handleCheckoutPress = () => {
    };

    return (
        <View flex bg-backgroundLight>
            <ProductsList componentId={componentId} />
            {itemsCount > 0 && (
                <View padding-s4 bg-backgroundLight>
                    <Button
                        label={`Go to Cart (${itemsCount} ${itemsCount === 1 ? 'item' : 'items'})`}
                        size={Button.sizes.large}
                        backgroundColor="#116DFF"
                        borderRadius={10}
                        onPress={handleCheckoutPress}
                        textDefaultLight
                    />
                </View>
            )}
        </View>
    );
};

CheckoutMasterComponent.options = () => ({
    topBar: {
        title: {
            text: 'Checkout',
        },
        largeTitle: {
            visible: true,
        },
        searchBar: {
            visible: true,
            placeholder: '',
            hideTopBarOnFocus: true,
            hideNavBarOnFocus: true,
            backgroundColor: Colors.searchBackground,
        },
        background: {
            translucent: true,
        },
        scrollEdgeAppearance: {
            noBorder: true,
            borderColor: 'transparent',
        },
        borderColor: 'transparent',
    },
    layout: {
        backgroundColor: Colors.backgroundLight,
        componentBackgroundColor: Colors.backgroundLight,
    },
});

export const CheckoutMaster = connect(() => ({
    itemsCount: cartStore.getItemsCount()
}))(CheckoutMasterComponent);
