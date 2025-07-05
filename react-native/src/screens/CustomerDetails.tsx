import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, View, Text, Avatar, Typography } from 'react-native-ui-lib';
import { BlurView } from '@react-native-community/blur';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import customersRepository from '../db/repositories/CustomersRepository';
import { Customer, CustomerOrder } from '../domain/entities/Customer';
import { formatTime24to12, formatDate } from '../utils/dateTime';
import { BASE_URL } from '../constants';
import { Screens } from '../navigation/screens';
import { getRandomInt } from '../utils/numbers';

interface Props {
  customerId: string;
  orderNumber?: string;
  componentId: string;
  isModal?: boolean;
}

interface SalesHistoryItem {
  id: string;
  saleNumber: string;
  dateTime: string;
  channel: string;
  total: number;
}

const CIRCLE_SIZE = 275 + getRandomInt(0, 50);

const BackgroundCircles = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.circle, {
        backgroundColor: Colors.red30,
        bottom: 70 + getRandomInt(0, 20),
        right: 15 + getRandomInt(0, 15),
      }]} /><View style={[styles.circle, {
        backgroundColor: Colors.red20,
        bottom: 60 + getRandomInt(0, 20),
        right: 230 + getRandomInt(0, 40),
        width: 250,
        height: 250,
      }]} />
      <View style={[styles.circle, {
        backgroundColor: Colors.green30,
        bottom: 60 + getRandomInt(0, 10),
        left: 60 + getRandomInt(0, 30),
      }]} />
      <View style={[styles.circle, {
        backgroundColor: Colors.purple30,
        bottom: 55 + getRandomInt(0, 10),
        left: 10 + getRandomInt(0, 30),
        width: 200,
        height: 200,
      }]} />
    </View>
  );
};

const CustomerHeader = ({ customer }: { customer: Customer }) => (
  <View row centerV height={344}>
    <BackgroundCircles />
    <BlurView
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
      blurType="light"
      blurAmount={40}
      overlayColor="rgba(255, 255, 255, 0.5)"
    />
    <View flex center paddingT-60>
      <Avatar
        size={152}
        source={{ uri: `${BASE_URL}/${customer.avatar}` }}
        containerStyle={styles.avatarContainer}
      />
      <View marginT-s6>
        <Text headingL>{customer.name} {customer.lastName}</Text>
      </View>
    </View>
  </View>
);

const TableHeader = () => (
  <View row style={styles.tableHeader}>
    <View flex-2>
      <Text sectionXSmall>Sale #</Text>
    </View>
    <View flex-3>
      <Text sectionXSmall>Date&Time</Text>
    </View>
    <View flex-1>
      <Text sectionXSmall>Channel</Text>
    </View>
    <View flex-2 right>
      <Text sectionXSmall right>Total</Text>
    </View>
  </View>
);

const TableRow = ({ item }: { item: SalesHistoryItem }) => (
  <TouchableOpacity
    onPress={() => {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: Screens.SalesHistoryDetailsModal,
              passProps: {
                item: {
                  id: item.id,
                  orderNumber: item.saleNumber
                }
              },
              options: {
                modalPresentationStyle: OptionsModalPresentationStyle.formSheet,
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
    <View row style={styles.tableRow}>
      <View flex-2>
        <Text textSmallPrimary>Sale #{item.saleNumber}</Text>
      </View>
      <View flex-3>
        <Text textSmallLight color={Colors.textBlue70}>{item.dateTime}</Text>
      </View>
      <View flex-1>
        <Text textSmallLight color={Colors.textBlue70}>{item.channel}</Text>
      </View>
      <View flex-2 right>
        <Text textSmallLight style={{ fontWeight: '500' }}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const SalesHistoryTab = ({ orders }: { orders: CustomerOrder[] }) => {
  const salesHistory: SalesHistoryItem[] = orders.map(order => ({
    id: order.id,
    saleNumber: order.orderNumber,
    dateTime: `${formatDate(order.created.date, order.created.time)}, ${formatTime24to12(order.created.time)}`,
    channel: order.channel,
    total: order.total
  }));

  return (
    <View flex>
      <TableHeader />
      <ScrollView style={styles.tableContainer}>
        {salesHistory.map(item => (
          <TableRow key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const EmptyTab = () => (
  <View flex center>
    <Text text60>Coming soon</Text>
  </View>
);

export const CustomerDetails = (props: Props) => {
  const { customerId, componentId } = props;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(3);

  useEffect(() => {
    const loadCustomerData = async () => {
      const customerData = await customersRepository.getById(customerId);
      if (customerData) {
        setCustomer(customerData);
        setOrders(customerData.orders);
      }
    };

    loadCustomerData();
  }, [customerId]);

  const segments = [
    { label: 'Customer Info' },
    { label: 'Overview' },
    { label: 'Bookings' },
    { label: 'Sales History' },
    { label: 'Loyalty' }
  ];

  if (!customer) {
    return null;
  }

  return (
    <View flex>
      <CustomerHeader customer={customer} />
      <View marginH-s4>
        <SegmentedControl
          values={segments.map(segment => segment.label)}
          fontStyle={{
            fontFamily: Typography.label.fontFamily,
            fontSize: Typography.label.fontSize,
            fontWeight: Typography.label.fontWeight as '600',
            color: Typography.label.color as string,
          }}
          selectedIndex={selectedSegmentIndex}
          onChange={(event) => {
            setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <View flex marginT-24 marginH-s4>
        {selectedSegmentIndex === 0 && <EmptyTab />}
        {selectedSegmentIndex === 1 && <EmptyTab />}
        {selectedSegmentIndex === 2 && <EmptyTab />}
        {selectedSegmentIndex === 3 && <SalesHistoryTab orders={orders} />}
        {selectedSegmentIndex === 4 && <EmptyTab />}
      </View>
    </View>
  );
};

CustomerDetails.options = () => ({
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
  }
});

const styles = StyleSheet.create({
  contentModalContainer: {
    alignSelf: 'center',
  },
  avatarContainer: {
    borderWidth: 1,
    borderColor: Colors.white,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: Colors.grey70,
  },
  segmentedControl: {
    backgroundColor: Colors.transparent,
    marginHorizontal: 120,
  },
  tableHeader: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60
  },
  tableContainer: {
    flex: 1
  },
  tableRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    opacity: 0.7
  }
}); 