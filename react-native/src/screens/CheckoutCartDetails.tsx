import React, { Component } from 'react';
import { Alert, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { View, Text, Button, Colors, Typography, Assets } from 'react-native-ui-lib';
import { Navigation } from 'react-native-navigation';
import { connect } from 'remx';
import { cartStore, CartItem } from '../stores/cartStore';
import { BASE_URL } from '../constants';
import { Divider, FooterBar, ListItemAddNew } from '../components';

interface Props {
    componentId: string;
    items: CartItem[];
    total: number;
    itemsCount: number;
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

    handleAddCustomAmount = () => {
        Alert.alert('Add Custom Amount', 'This feature will be implemented');
    };

    handleAddDiscount = () => {
        Alert.alert('Add Discount', 'This feature will be implemented');
    };

    handleCharge = () => {
        Alert.alert('Charge', `Processing payment of $${this.props.total.toFixed(2)}`);
    };

    renderCartItem = ({ item, index }: { item: CartItem; index: number }) => {
        const { product, quantity, options } = item;
        const isOutOfStock = product.inventory.status === 'out_of_stock';
        
        return (
            <View>
                <View paddingH-s5 paddingV-s4 row>
                    <Image 
                        source={{ uri: `${BASE_URL}/${product.image}` }}
                        style={{ width: 56, height: 56, borderRadius: 8 }}
                    />
                    <View flex marginL-s4>
                        <View row spread>
                            <View flex>
                                <Text bodyBold>{product.name}</Text>
                                <Text bodySmall color={Colors.textBlue70}>Qty: {quantity}</Text>
                                {options && Object.keys(options).length > 0 && (
                                    <Text bodySmall color={Colors.textBlue70}>
                                        {Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                    </Text>
                                )}
                                {isOutOfStock && (
                                    <Text bodySmall color={Colors.textDanger}>Out of stock</Text>
                                )}
                            </View>
                            <Text bodyBold>${(product.price * quantity).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
                {index < this.props.items.length - 1 && (
                    <View paddingL-s5>
                        <Divider />
                    </View>
                )}
            </View>
        );
    };

    renderSummarySection = () => {
        const { total } = this.props;
        const subtotal = total - 22.75; // Assuming some calculation for subtotal
        const tax = 0.00;
        
        return (
            <View paddingH-s5 paddingV-s4>
                <View row spread marginB-s4>
                    <Text bodySmall>Subtotal</Text>
                    <Text bodySmall>${subtotal.toFixed(2)}</Text>
                </View>
                <View row spread marginB-s4>
                    <Text bodySmall>Tax</Text>
                    <Text bodySmall color={Colors.textPrimary}>${tax.toFixed(2)}</Text>
                </View>
                <View row spread>
                    <Text bodySmallBold>Total</Text>
                    <Text bodySmallBold>${total.toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    render() {
        const { items, total, itemsCount } = this.props;
        
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View flex bg-backgroundDefault>
                    <FlatList
                        data={items}
                        renderItem={this.renderCartItem}
                        keyExtractor={(item) => `${item.product.id}-${JSON.stringify(item.options)}`}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            <View>
                                <Divider />
                                
                                <ListItemAddNew
                                    icon={Assets.icons.cart}
                                    title="Add Custom Amount"
                                    onPress={this.handleAddCustomAmount}
                                />
                                
                                <ListItemAddNew
                                    icon={Assets.icons.discount}
                                    title="Add a Discount"
                                    onPress={this.handleAddDiscount}
                                />
                                
                                <View paddingL-s5>
                                    <Divider />
                                </View>
                                
                                {this.renderSummarySection()}
                            </View>
                        }
                    />
                    
                    <FooterBar
                        totalSum={total}
                        itemsCount={itemsCount}
                        buttonText="Charge"
                        onButtonPress={this.handleCharge}
                        currency="$"
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export const CheckoutCartDetails = connect(() => ({
    items: cartStore.getItems(),
    total: cartStore.getTotal(),
    itemsCount: cartStore.getItemsCount()
}))(CheckoutCartDetailsComponent);
