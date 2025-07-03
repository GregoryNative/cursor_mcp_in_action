import * as remx from 'remx';
import ProductsRepository from '../db/repositories/ProductsRepository';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const PAGE_SIZE = 50;

interface State {
  products: Product[];
  totalCount: number;
  offset: number;
  loading: boolean;
  hasMore: boolean;
  searchText: string;
}

const initialState: State = {
  products: [],
  totalCount: 0,
  offset: 0,
  loading: false,
  hasMore: true,
  searchText: '',
};

const state = remx.state(initialState);

const getters = remx.getters({
  getProducts() {
    return state.products;
  },
  getTotalCount() {
    return state.totalCount;
  },
  isLoading() {
    return state.loading;
  },
  hasMore() {
    return state.hasMore;
  },
  getSearchText() {
    return state.searchText;
  },
});

const setters = remx.setters({
  setProducts(products: Product[]) {
    state.products = products;
  },
  setTotalCount(count: number) {
    state.totalCount = count;
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
  setSearchText(text: string) {
    state.searchText = text;
  },
  appendProducts(newProducts: Product[]) {
    state.products = [...state.products, ...newProducts];
  },
});

const actions = {
  async loadProducts(currentOffset: number) {
    if (state.loading || !state.hasMore) return;
    
    setters.setLoading(true);
    try {
      const newProducts = await ProductsRepository.fetchProducts(PAGE_SIZE, currentOffset) as Product[];
      if (newProducts.length === 0) {
        setters.setHasMore(false);
      } else {
        if (currentOffset === 0) {
          setters.setProducts(newProducts);
        } else {
          setters.appendProducts(newProducts);
        }
        setters.setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setters.setLoading(false);
    }
  },

  async searchProducts(currentOffset: number) {
    if (state.loading || !state.hasMore) return;
    
    setters.setLoading(true);
    try {
      const searchResults = await ProductsRepository.searchProducts(state.searchText, PAGE_SIZE, currentOffset) as Product[];
      if (searchResults.length === 0) {
        setters.setHasMore(false);
        if (currentOffset === 0) {
          setters.setProducts([]);
        }
      } else {
        if (currentOffset === 0) {
          setters.setProducts(searchResults);
        } else {
          setters.appendProducts(searchResults);
        }
        setters.setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setters.setLoading(false);
    }
  },

  async updateSearch(searchText: string) {
    setters.setSearchText(searchText);
    setters.setOffset(0);
    
    if (searchText) {
      setters.setHasMore(true);
      await actions.searchProducts(0);
    } else {
      setters.setHasMore(true);
      await actions.loadInitialData();
    }
  },

  async loadInitialData() {
    try {
      const count = await ProductsRepository.getProductsCount() as number;
      setters.setTotalCount(count);
      await actions.loadProducts(0);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  },
};

export const productsStore = {
  ...getters,
  ...actions
}; 