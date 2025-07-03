import * as remx from 'remx';
import { Product } from '../domain/entities/Product';

export interface CartItem {
  product: Product;
  quantity: number;
  options?: Record<string, string>;
}

interface State {
  items: CartItem[];
}

const initialState: State = {
  items: [],
};

const state = remx.state(initialState);

const getters = remx.getters({
  getItems() {
    return state.items;
  },
  getTotal() {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
  getItemsCount() {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }
});

const setters = remx.setters({
  setItems(items: CartItem[]) {
    state.items = items;
  },
});

const actions = {
  addItem(product: Product, options?: Record<string, string>) {
    const existingItemIndex = state.items.findIndex(
      item => item.product.id === product.id && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      setters.setItems(updatedItems);
    } else {
      setters.setItems([...state.items, { product, quantity: 1, options }]);
    }
  },

  removeItem(product: Product, options?: Record<string, string>) {
    const updatedItems = state.items.filter(
      item => !(item.product.id === product.id && 
      JSON.stringify(item.options) === JSON.stringify(options))
    );
    setters.setItems(updatedItems);
  },

  updateItemQuantity(product: Product, quantity: number, options?: Record<string, string>) {
    const updatedItems = state.items.map(item => {
      if (item.product.id === product.id && 
          JSON.stringify(item.options) === JSON.stringify(options)) {
        return { ...item, quantity };
      }
      return item;
    });
    setters.setItems(updatedItems);
  },

  clearCart() {
    setters.setItems([]);
  }
};

export const cartStore = {
  ...getters,
  ...actions
}; 