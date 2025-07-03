import { Typography } from "react-native-ui-lib";
import { Layout, LayoutRoot, Options } from "react-native-navigation";

import { ScreenIds, Screens } from "./screens";
import { Colors } from "react-native-ui-lib";


const checkoutRoute: Layout = {
    stack: {
        id: ScreenIds.CheckoutRoot,
        children: [
            {
                component: {
                    name: Screens.Checkout,
                }
            }
        ],
        options: {
            bottomTab: {
                text: "Checkout",
                icon: {
                    uri: 'cart',
                    scale: 4,
                },
            }
        }
    },
};

const ordersRoute: Layout = {
    stack: {
        id: ScreenIds.SalesHistoryRoot,
        children: [
            {
                component: {
                    name: Screens.SalesHistory,
                }
            }
        ],
        options: {
            bottomTab: {
                text: "Sales History",
                icon: {
                    uri: 'receipt',
                    scale: 4,
                },
            }
        }
    },
};

const moreRoute: Layout = {
    component: {
        name: Screens.More,
        options: {
            bottomTab: {
                text: "More",
                icon: {
                    uri: 'menu',
                    scale: 4,
                },
                selectTabOnPress: false,
            }
        }
    }
};

const homeRoute: LayoutRoot = {
    root: {
        sideMenu: {
            center: {
                bottomTabs: {
                    id: ScreenIds.HomeBottomTabs,
                    children: [
                        checkoutRoute,
                        ordersRoute,
                        moreRoute
                    ],
                    options: {
                        bottomTab: {
                            ...Typography.bottomTab,
                            textColor: Typography.textDefault.color,
                            selectedTextColor: Typography.bottomTab.color,
                            iconColor: Typography.textDefault.color,
                            selectedIconColor: Typography.bottomTab.color,
                        },
                        bottomTabs: {
                            translucent: true,
                            drawBehind: false,
                        },
                    } as Options,
                }
            },
            right: {
                component: {
                    name: Screens.SideMenu,
                    options: {
                        layout: {
                            backgroundColor: Colors.backgroundDefault
                        }
                    }
                },
            }
        },
    }
};

const syncRoute: LayoutRoot = {
    root: {
        component: {
            name: Screens.SyncScreen
        }
    }
};

export const Routes = {
    Home: homeRoute,
    Sync: syncRoute
}; 