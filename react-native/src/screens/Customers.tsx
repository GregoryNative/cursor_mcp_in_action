import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Colors, View, Text, Avatar, Typography, ListItem, Spacings } from 'react-native-ui-lib';
import { useNavigationSearchBarUpdate } from 'react-native-navigation-hooks';
import { Screens } from '../navigation/screens';
import { Customer } from '../domain/entities/Customer';
import { BASE_URL } from '../constants';
import { customersStore } from '../stores/customersStore';
import { useConnect } from 'remx';
import { FlashList } from '@shopify/flash-list';

interface Props {
    componentId: string;
}

export const Customers = ({ componentId }: Props) => {
    const customers = useConnect(() => customersStore.getFilteredCustomers());

    useEffect(() => {
        customersStore.loadCustomers();
    }, []);

    useNavigationSearchBarUpdate(({ text }) => {
        customersStore.updateSearch(text || '');
    }, componentId);

    const onCustomerPress = useCallback((customer: Customer) => {
        Navigation.push(componentId, {
            component: {
                name: Screens.CustomerDetails,
                passProps: {
                    customerId: customer.id
                },
                options: {
                    topBar: {
                        title: {
                            text: `${customer.name} ${customer.lastName}`,
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

    const renderItem = useCallback(({ item }: { item: Customer }) => {
        return (
            <ListItem
                activeBackgroundColor={Colors.grey60}
                activeOpacity={0.3}
                height={72}
                centerH
                onPress={() => onCustomerPress(item)}
                style={styles.itemContainer}
            >
                <ListItem.Part left paddingR-12>
                    <Avatar 
                        size={44}
                        source={{ uri: `${BASE_URL}/${item.avatar}` }}
                    />
                </ListItem.Part>
                <ListItem.Part middle column>
                    <Text textPrimary>
                        {item.name} {item.lastName}
                    </Text>
                    <Text sectionSmall>
                        {item.email}
                    </Text>
                </ListItem.Part>
            </ListItem>
        );
    }, [onCustomerPress]);

    return (
        <View flex bg-backgroundDefault>
            <FlashList
                data={customers}
                renderItem={renderItem}
                keyExtractor={(item: Customer) => item.id}
                estimatedItemSize={72}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: Spacings.s4,
    },
    itemContainer: {
        marginHorizontal: 16,
    },
});

Customers.options = () => ({
    topBar: {
        title: {
            text: 'Customers',
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