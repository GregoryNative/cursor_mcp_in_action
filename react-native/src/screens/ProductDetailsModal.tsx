import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
    View,
    Text,
    Colors,
    Typography,
    Button,
    Image,
    LoaderScreen,
    Spacings,
    Constants
} from 'react-native-ui-lib';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import productsRepository from '../db/repositories/ProductsRepository';
import { Product } from '../domain/entities/Product';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '../constants';
import { Divider } from '../components/Divider';
import { capitalizeFirstLetter } from '../utils/strings';
import { cartStore } from '../stores/cartStore';

enum NavigationButtonId {
    Cancel = 'cancel',
}

interface Props {
    productId: string;
    componentId: string;
}

export const ProductDetailsModal = ({ productId, componentId }: Props) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === NavigationButtonId.Cancel) {
            Navigation.dismissModal(componentId);
        }
    }, componentId);

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setSelectedOptions({}); // Reset selections
            const productData = await productsRepository.getProductById(productId);
            setProduct(productData);

            if (productData) {
                Navigation.mergeOptions(componentId, {
                    topBar: {
                        title: {
                            text: productData.name
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error loading product details:", error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Check if product has options and validate all are selected
        if (product.options) {
            const totalOptions = Object.keys(product.options).length;
            const selectedOptionsCount = Object.keys(selectedOptions).length;
            
            if (totalOptions > 0 && selectedOptionsCount !== totalOptions) {
                Alert.alert('Required Options', 'Please select all options before adding to cart');
                return;
            }
        }

        cartStore.addItem(product, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined);
        Navigation.dismissModal(componentId);
    };

    const renderOptions = () => {
        if (!product?.options || Object.keys(product.options).length === 0) {
            return null;
        }

        return Object.entries(product.options).map(([optionName, values]) => (
            <View key={optionName} marginB-16 marginT-s4>
                <Text textDefaultLight style={{ fontWeight: '700', color: Colors.textDefault }} marginB-s3>{capitalizeFirstLetter(optionName)}</Text>
                <View row style={{ flexWrap: 'wrap' }}>
                    {values.map((value) => (
                        <Button
                            key={value}
                            style={{ minWidth: 110 }}
                            marginB-s2
                            labelStyle={{
                                ...Typography.bodySmallBold,
                                color: selectedOptions[optionName] === value ? Colors.textDefaultLight : Colors.textDefault,
                            }}
                            backgroundColor={selectedOptions[optionName] === value ? Colors.backgroundInverted : Colors.separator}
                            label={value}
                            marginR-s5
                            borderRadius={6}
                            onPress={() => handleOptionSelect(optionName, value)}
                        />
                    ))}
                </View>
            </View>
        ));
    };

    return (
        <View flex bg-backgroundDefault>
            {loading ? (
                <LoaderScreen />
            ) : product ? (
                <View flex>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View row>
                            {/* Left Side: Image */}
                            <View flex-1 paddingR-40>
                                <Image
                                    source={{ uri: `${BASE_URL}/${product.image}` }}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                    nativeID={`image${product.id}Dest`}
                                />
                            </View>

                            {/* Right Side: Details */}
                            <View flex-1>
                                <View row spread paddingV-s4>
                                    <Text sectionSmall>SKU</Text>
                                    <Text textSmallLight style={{ fontWeight: '500' }}>{product.sku}</Text>
                                </View>
                                <Divider />
                                <View row spread paddingV-s4>
                                    <Text sectionSmall>Discount</Text>
                                    <Button link textSmallLight labelStyle={{ color: Colors.textPrimary, fontWeight: '500' }} label="Add Discount" onPress={() => Alert.alert('Info', 'Add discount clicked')} />
                                </View>
                                <Divider />
                                <View row spread paddingV-s4>
                                    <Text sectionSmall>Price</Text>
                                    <Text textDefault style={{ fontWeight: '700', fontSize: 20 }}>${product.price.toFixed(2)}</Text>
                                </View>
                                <Divider />
                            </View>
                        </View>

                        {/* Options Section Below Image/Details */}
                        {renderOptions()}
                    </ScrollView>

                    {/* Bottom Button */}
                    <View paddingH-s8 paddingB-s6>
                        <Button
                            textDefaultLight
                            label="Add to Cart"
                            size={Button.sizes.large}
                            backgroundColor="#116DFF"
                            borderRadius={10}
                            onPress={handleAddToCart}
                        />
                    </View>
                </View>
            ) : (
                <View center flex>
                    <Text text60>Product not found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 40,
        paddingTop: Spacings.s4,
        paddingBottom: Spacings.s6,
    },
    productImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: Colors.grey70,
        borderWidth: 1,
        borderColor: Colors.separator,
    },
});

ProductDetailsModal.options = () => ({
    topBar: {
        title: {
            ...Typography.headingS,
        },
        leftButtons: [
            {
                id: NavigationButtonId.Cancel,
                text: 'Cancel',
                ...Typography.labelMedium,
                color: Colors.textPrimary,
            }
        ],
        rightButtons: [],
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