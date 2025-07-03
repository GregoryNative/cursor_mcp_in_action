import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Colors, View, Text, Image, Typography, Avatar, ListItem, TouchableOpacity, Spacings } from 'react-native-ui-lib';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import ordersRepository from '../db/repositories/OrdersRepository';
import { Order, OrderItem } from '../domain/entities/Order';
import { formatTime24to12, formatDate } from '../utils/dateTime';
import { BASE_URL } from '../constants';
import { Divider } from '../components/Divider';
import { ScreenIds, Screens } from '../navigation/screens';
import { OptionsModalPresentationStyle } from 'react-native-navigation';

interface Props {
  item?: {
    id: string;
    orderNumber: string;
  };
  componentId: string;
  isModal?: boolean;
}

enum NavigationButtonId {
  Actions = 'actions',
}

const OrderSummaryItem = ({ item }: { item: OrderItem }) => (
  <ListItem
    height={60}
    marginT-s5
    onPress={() => {
      Navigation.dismissAllModals();
      Navigation.mergeOptions(ScreenIds.HomeBottomTabs, {
        bottomTabs: {
          currentTabIndex: 0,
        }
      });
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: Screens.ProductDetailsModal,
              passProps: {
                productId: item.productId,
              },
              options: {
                modalPresentationStyle: OptionsModalPresentationStyle.pageSheet,
                layout: {
                  backgroundColor: Colors.backgroundDefault,
                  componentBackgroundColor: Colors.backgroundDefault
                }
              }
            }
          }]
        }
      });
    }}
  >
    <ListItem.Part left>
      <Image
        source={{ uri: `${BASE_URL}/${item.image}` }}
        style={styles.productImage}
      />
    </ListItem.Part>
    <ListItem.Part middle marginL-s4 row>
      <Text textDefault>{item.name}</Text>
      <Text textDefault color={Colors.textBlue70} style={styles.quantity}>x {item.quantity}</Text>
    </ListItem.Part>

    <ListItem.Part right marginL-s8 containerStyle={{ width: 108 }}>
      <Text textDefault>${item.totalPrice.toFixed(2)}</Text>
    </ListItem.Part>
  </ListItem>
);

const OrderHeader = ({ orderDetails, componentId, isModal }: { orderDetails: Order, componentId: string, isModal?: boolean }) => (
  <View>
    {/* Sale Info Section */}
    <View>
      <Text headingM>Sale info</Text>
      <Text sectionSmall marginT-s3>Reference ID #{orderDetails.orderReferenceId}</Text>
      <Text sectionSmall>Placed on {formatDate(orderDetails.createdDate, orderDetails.createdTime)}, {formatTime24to12(orderDetails.createdTime)}</Text>
      <Text sectionSmall>Sold By {orderDetails.soldBy}</Text>
      <Text textSmall marginT-6>Total: ${orderDetails.totals.total.toFixed(2)}</Text>
    </View>

    <Divider marginV-s8 />

    {/* Customer Section */}
    {orderDetails.customer?.id ? (
      <>
        <View>
          <Text headingM>Customer</Text>
          <TouchableOpacity
            onPress={() => {
            }}
          >
            <View row centerV marginT-10>
              <Avatar size={60} source={{ uri: `${BASE_URL}/${orderDetails.customer?.avatar}` }} />
              <View marginL-s4>
                <Text textPrimary>{orderDetails.customer?.name} {orderDetails.customer?.lastName}</Text>
                <Text sectionSmall>{orderDetails.customer?.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Divider marginV-s8 />
      </>
    ) : null}

    <Text headingM>Order Summary</Text>
  </View>
);

export const SalesHistoryDetails = (props: Props) => {
  const { item, componentId, isModal } = props;
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === NavigationButtonId.Actions) {
      Alert.alert('Actions', 'Actions button pressed');
    } else if (buttonId === 'cancel' || buttonId === 'done') {
      Navigation.dismissModal(componentId);
    }
  }, componentId);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (item?.id) {
        const details = await ordersRepository.getById(item.id);
        if (details) {
          setOrderDetails(details);
        }
      }
    };

    loadOrderDetails();
  }, [item?.id]);

  useEffect(() => {
    if (item) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: `Sale #${item.orderNumber}`
          }
        }
      });
    }
  }, [item, componentId]);

  if (!item) {
    return (
      <View flex center>
        <Text text40>Select a sale to view details.</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={orderDetails.items}
      extraData={orderDetails}
      renderItem={({ item }) => <OrderSummaryItem item={item} />}
      keyExtractor={item => item.lineItemId}
      ListHeaderComponent={<OrderHeader orderDetails={orderDetails} componentId={componentId} isModal={isModal} />}
    />
  );
};

SalesHistoryDetails.options = () => ({
  topBar: {
    title: {
      ...Typography.headingSmallBold,
    },
    background: {
      color: Colors.backgroundDefault,
    },
    scrollEdgeAppearance: {
      noBorder: true,
      borderColor: 'transparent',
    },
    borderColor: 'transparent',
    rightButtons: [
      {
        id: NavigationButtonId.Actions,
        text: 'Actions',
        ...Typography.textDefaultLight,
        color: Colors.textPrimary,
      }
    ]
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDefault,
  },
  contentContainer: {
    paddingBottom: 32,
    paddingHorizontal: Spacings.s4,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: Colors.grey70,
  },
  quantity: {
    fontWeight: '400',
  },
});

