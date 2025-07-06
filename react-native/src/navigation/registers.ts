import { Navigation } from "react-native-navigation";
import { Screens } from "./screens";

export function registerScreens() {
  Navigation.registerComponent(Screens.More, () => require('../screens/More').More);
  Navigation.registerComponent(Screens.SyncScreen, () => require('../screens/Sync').SyncScreen);
  Navigation.registerComponent(Screens.SideMenu, () => require('../screens/SideMenu').SideMenu);
  // checkout
  Navigation.registerComponent(Screens.Checkout, () => require('../screens/Checkout').CheckoutMaster);
  Navigation.registerComponent(Screens.CheckoutCartDetails, () => require('../screens/CheckoutCartDetails').CheckoutCartDetails);
  Navigation.registerComponent(Screens.ProductDetailsModal, () => require('../screens/ProductDetailsModal').ProductDetailsModal);
  // sales history
  Navigation.registerComponent(Screens.SalesHistory, () => require('../screens/SalesHistory').SalesHistory);
  Navigation.registerComponent(Screens.SalesHistoryDetails, () => require('../screens/SalesHistoryDetails').SalesHistoryDetails);
  Navigation.registerComponent(Screens.SalesHistoryDetailsModal, () => require('../screens/SalesHistoryDetailsModal').SalesHistoryDetailsModal);
}