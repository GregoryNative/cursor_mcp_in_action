import React, { useCallback, useEffect } from 'react';
import { View, Text, Card, Colors, Spacings } from 'react-native-ui-lib';
import { FlashList } from '@shopify/flash-list';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { productsStore, Product } from '../stores/productsStore';
import { useConnect } from 'remx';
import { BASE_URL } from '../constants';
import { Screens } from '../navigation/screens';
import { cartStore } from '../stores/cartStore';
import productsRepository from '../db/repositories/ProductsRepository';

interface Props {
    componentId: string;
}

export const ProductsList: React.FC<Props> = ({ componentId }) => {
    const products = useConnect(() => productsStore.getProducts());
    const totalCount = useConnect(() => productsStore.getTotalCount());
    const loading = useConnect(() => productsStore.isLoading());
    const hasMore = useConnect(() => productsStore.hasMore());
    const searchText = useConnect(() => productsStore.getSearchText());

    const handleEndReached = useCallback(() => {
        if (!loading && hasMore) {
            if (searchText) {
                productsStore.searchProducts(products.length);
            } else {
                productsStore.loadProducts(products.length);
            }
        }
    }, [searchText, loading, hasMore, products.length]);

    const handleProductPress = useCallback(async (product: Product) => {
        try {
            const productDetails = await productsRepository.getProductById(product.id);

            if (!productDetails) {
                console.error("Product details not found");
                return;
            }

            if (!productDetails.options || Object.keys(productDetails.options).length === 0) {
                cartStore.addItem(productDetails);
                return;
            }

            Navigation.showModal({
                stack: {
                    children: [{
                        component: {
                            name: Screens.ProductDetailsModal,
                            passProps: {
                                productId: product.id
                            },
                            options: {
                                modalPresentationStyle: OptionsModalPresentationStyle.pageSheet,
                                layout: {
                                    backgroundColor: Colors.backgroundDefault,
                                    componentBackgroundColor: Colors.backgroundDefault
                                },
                                animations: {
                                    push: {
                                        sharedElementTransitions: [
                                            {
                                                fromId: `image${product.id}`,
                                                toId: `image${product.id}Dest`,
                                                interpolation: { type: 'linear' }
                                            },
                                        ],
                                    },
                                },
                            }
                        }
                    }]
                }
            });
            // transition animation example
            // Navigation.push(componentId, {
            //     component: {
            //         name: Screens.ProductDetailsModal,
            //         passProps: {
            //             productId: product.id
            //         },
            //         options: {
            //             modalPresentationStyle: OptionsModalPresentationStyle.pageSheet,
            //             layout: {
            //                 backgroundColor: Colors.backgroundDefault,
            //                 componentBackgroundColor: Colors.backgroundDefault
            //             },
            //             animations: {
            //                 push: {
            //                     sharedElementTransitions: [
            //                         {
            //                             fromId: `image${product.id}`,
            //                             toId: `image${product.id}Dest`,
            //                             interpolation: { type: 'spring' }
            //                         },
            //                     ],
            //                 },
            //             },
            //         }
            //     }
            // });
        } catch (error) {
            console.error("Error handling product press:", error);
        }
    }, []);

    const renderEmptyComponent = useCallback(() => {
        if (loading && products.length === 0) return null;

        if (searchText) {
            return (
                <View flex flexG center>
                    <Text textDefault>No products found for "{searchText}"</Text>
                </View>
            );
        }

        return (
            <View flex center>
                <Text textDefault>No products available</Text>
            </View>
        );
    }, [searchText, loading, products.length]);

    const renderItem = useCallback(({ item }: { item: Product }) => {
        return (
            <Card
                row
                borderRadius={10}
                height={92}
                marginB-16
                padding-2
                bg-backgroundLight
                onPress={() => handleProductPress(item)}
            >
                <Card.Image
                    width={90}
                    height={90}
                    source={{ uri: `${BASE_URL}/${item.image}` }}
                    nativeID={`image${item.id}`}
                    style={{ backgroundColor: Colors.grey60 }}
                />
                <View flex row marginL-s4 spread centerV>
                    <Text textDefault numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text textDefault marginR-s6>
                        ${item.price.toFixed(2)}
                    </Text>
                </View>
            </Card>
        );
    }, [handleProductPress]);

    const keyExtractor = useCallback((item: Product) => item.id, []);

    return (
        <View flex bg-backgroundLight>
            <FlashList
                data={products}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={92}
                contentContainerStyle={{ paddingHorizontal: Spacings.s4, paddingBottom: Spacings.s4, backgroundColor: Colors.backgroundLight }}
                showsVerticalScrollIndicator={true}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmptyComponent}
                ListHeaderComponent={() => (
                    <View paddingV-s2>
                        <Text sectionSmall>
                            Products {totalCount.toLocaleString('en-US', { useGrouping: true })}
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => (
                    loading ? (
                        <View center>
                            <Text textDefault>Loading more...</Text>
                        </View>
                    ) : null
                )}
            />
        </View>
    );
}; 