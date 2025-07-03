import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Colors, View, Text, Icon, Assets, TouchableOpacity, Typography } from 'react-native-ui-lib';
import { FlashList } from '@shopify/flash-list';
import { useNavigationSearchBarUpdate } from 'react-native-navigation-hooks';
import { ScreenIds, Screens } from '../navigation/screens';
import { ordersStore } from '../stores/ordersStore';
import { Order } from '../domain/entities/Order';
import { useConnect } from 'remx';
import { formatTime24to12 } from '../utils/dateTime';
import { Divider } from '../components/Divider';

const SaleItemComponent = ({ item, onPress }: { item: Order; onPress: (item: Order) => void }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View
                row
                centerV
                marginH-s5
                paddingH-s7
                paddingV-s4
                bg-backgroundDefault
            >
                <View row centerV paddingR-s4>
                    <Icon source={Assets.icons.creditCard} size={24} tintColor={Colors.textDefault} />
                </View>
                <View flex>
                    <Text sectionSmall>{formatTime24to12(item.createdTime)}</Text>
                    <Text textDefault>{item.orderNumber}</Text>
                    <Text sectionSmall>{item.soldBy}</Text>
                </View>
                <Text textDefault>${item.totals.total.toFixed(2)}</Text>
            </View>
            <Divider marginH-24 />
        </TouchableOpacity>
    );
};

interface Props {
    componentId: string;
}

export const SalesHistory = ({ componentId }: Props) => {
    const orders = useConnect(() => ordersStore.getOrders());
    const isLoading = useConnect(() => ordersStore.isLoading());
    const hasMore = useConnect(() => ordersStore.hasMore());

    useEffect(() => {
        ordersStore.loadInitialData();
    }, []);

    useNavigationSearchBarUpdate(({ text }: { text: string }) => {
        ordersStore.updateSearch(text);
    }, componentId);

    const onSalePress = useCallback((item: Order) => {
        Navigation.push(componentId, {
            component: {
                name: Screens.SalesHistoryDetails,
                passProps: {
                    item: {
                        id: item.id,
                        orderNumber: item.orderNumber,
                    }
                },
                options: {
                    topBar: {
                        title: {
                            text: `Sale ${item.orderNumber}`
                        },
                        backButton: {
                            visible: true,
                        },
                    },
                    bottomTabs: {
                        visible: false,
                    },
                },
            },
        });
    }, [componentId]);

    const renderItem = useCallback(({ item }: { item: Order }) => {
        return (
            <SaleItemComponent 
                item={item} 
                onPress={onSalePress} 
            />
        );
    }, [onSalePress]);

    const onEndReached = useCallback(() => {
        if (!isLoading && hasMore) {
            ordersStore.loadOrders(orders.length);
        }
    }, [isLoading, hasMore, orders.length]);

    return (
        <View flex bg-backgroundDefault>
            <FlashList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item: Order) => item.id}
                estimatedItemSize={96}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

SalesHistory.options = () => ({
    topBar: {
        title: {
            text: 'Sales History',
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

const styles = StyleSheet.create({
    selectedItem: {
        backgroundColor: Colors.separator,
        borderRadius: 8,
    },
});