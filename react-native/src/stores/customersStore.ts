import * as remx from 'remx';
import customersRepository from '../db/repositories/CustomersRepository';
import { Customer } from '../domain/entities/Customer';

interface State {
  customers: Customer[];
  loading: boolean;
  searchText: string;
  selectedCustomerId: string;
}

const initialState: State = {
  customers: [],
  loading: false,
  searchText: '',
  selectedCustomerId: ''
};

const state = remx.state(initialState);

const getters = remx.getters({
  getCustomers() {
    return state.customers;
  },
  getFilteredCustomers() {
    if (!state.searchText) {
      return state.customers;
    }

    const searchText = state.searchText.toLowerCase();
    return state.customers.filter(customer => 
      customer.name.toLowerCase().includes(searchText) ||
      customer.lastName.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText)
    );
  },
  isLoading() {
    return state.loading;
  },
  getSelectedCustomerId() {
    return state.selectedCustomerId;
  }
});

const setters = remx.setters({
  setCustomers(customers: Customer[]) {
    state.customers = customers;
  },
  setLoading(loading: boolean) {
    state.loading = loading;
  },
  setSearchText(text: string) {
    state.searchText = text;
  },
  setSelectedCustomerId(id: string) {
    state.selectedCustomerId = id;
  }
});

const actions = {
  async loadCustomers() {
    if (state.loading) return;
    
    setters.setLoading(true);
    try {
      const customers = await customersRepository.getAll();
      setters.setCustomers(customers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setters.setLoading(false);
    }
  },

  updateSearch(searchText: string) {
    setters.setSearchText(searchText);
  },

  selectCustomer(customerId: string) {
    setters.setSelectedCustomerId(customerId);
  }
};

export const customersStore = {
  ...getters,
  ...actions
}; 