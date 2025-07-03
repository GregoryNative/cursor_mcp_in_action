import * as remx from 'remx';
import OrdersRepository from '../db/repositories/OrdersRepository';
import { Order, OrderSearchParams } from '../domain/entities/Order';

const PAGE_SIZE = 40;

interface SelectedSale {
  id: string;
  orderNumber: string;
}

interface State {
  orders: Order[];
  offset: number;
  loading: boolean;
  hasMore: boolean;
  searchParams: OrderSearchParams;
  selectedSale: SelectedSale | null;
}

const initialState: State = {
  orders: [],
  offset: 0,
  loading: false,
  hasMore: true,
  searchParams: {
    searchText: '',
    limit: PAGE_SIZE,
    offset: 0
  },
  selectedSale: null
};

const state = remx.state(initialState);

const getters = remx.getters({
  getOrders() {
    return state.orders;
  },
  isLoading() {
    return state.loading;
  },
  hasMore() {
    return state.hasMore;
  },
  getSearchParams() {
    return state.searchParams;
  },
  getSelectedSale() {
    return state.selectedSale;
  }
});

const setters = remx.setters({
  setOrders(orders: Order[]) {
    state.orders = orders;
  },
  setOffset(offset: number) {
    state.offset = offset;
  },
  setLoading(loading: boolean) {
    state.loading = loading;
  },
  setHasMore(hasMore: boolean) {
    state.hasMore = hasMore;
  },
  setSearchParams(params: Partial<OrderSearchParams>) {
    state.searchParams = { ...state.searchParams, ...params };
  },
  appendOrders(newOrders: Order[]) {
    state.orders = [...state.orders, ...newOrders];
  },
  setSelectedSale(sale: SelectedSale) {
    state.selectedSale = sale;
  }
});

const actions = {
  async loadOrders(currentOffset: number) {
    if (state.loading || !state.hasMore) return;
    
    setters.setLoading(true);
    try {
      const { orders } = await OrdersRepository.getAll({
        ...state.searchParams,
        offset: currentOffset,
        limit: PAGE_SIZE
      });

      if (orders.length === 0) {
        setters.setHasMore(false);
      } else {
        if (currentOffset === 0) {
          setters.setOrders(orders);
        } else {
          setters.appendOrders(orders);
        }
        setters.setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setters.setLoading(false);
    }
  },

  async searchOrders(currentOffset: number) {
    if (state.loading || !state.hasMore) return;
    
    setters.setLoading(true);
    try {
      const { orders } = await OrdersRepository.searchOrders({
        ...state.searchParams,
        offset: currentOffset,
        limit: PAGE_SIZE
      });

      if (orders.length === 0) {
        setters.setHasMore(false);
        if (currentOffset === 0) {
          setters.setOrders([]);
        }
      } else {
        if (currentOffset === 0) {
          setters.setOrders(orders);
        } else {
          setters.appendOrders(orders);
        }
        setters.setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
    } finally {
      setters.setLoading(false);
    }
  },

  async updateSearch(searchText: string) {
    setters.setSearchParams({ searchText });
    setters.setOffset(0);
    setters.setHasMore(true);
    
    if (searchText) {
      await actions.searchOrders(0);
    } else {
      await actions.loadInitialData();
    }
  },

  async loadInitialData() {
    setters.setOffset(0);
    setters.setHasMore(true);
    await actions.loadOrders(0);
  },

  selectSale(id: string, orderNumber: string) {
    setters.setSelectedSale({ id, orderNumber });
  }
};

export const ordersStore = {
  ...getters,
  ...actions
}; 