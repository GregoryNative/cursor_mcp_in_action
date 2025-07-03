import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Colors, TouchableOpacity, Typography } from 'react-native-ui-lib';
import { Navigation } from 'react-native-navigation';
import { Routes } from '../navigation/routes';

interface Props {
    componentId: string;
}

interface MenuItem {
    title: string;
    destructive?: boolean;
    onPress: () => void;
}

export const SideMenu = ({ componentId }: Props) => {
    const menuItems: MenuItem[] = [
        {
            title: 'Settings',
            onPress: () => {
                console.log('Settings pressed');
                Navigation.mergeOptions(componentId, {
                    sideMenu: {
                        right: {
                            visible: false
                        }
                    }
                });
            }
        },
        {
            title: 'Profile',
            onPress: () => {
                console.log('Profile pressed');
                Navigation.mergeOptions(componentId, {
                    sideMenu: {
                        right: {
                            visible: false
                        }
                    }
                });
            }
        },
        {
            title: 'Help',
            onPress: () => {
                console.log('Help pressed');
                Navigation.mergeOptions(componentId, {
                    sideMenu: {
                        right: {
                            visible: false
                        }
                    }
                });
            }
        },
        {
            title: 'About',
            onPress: () => {
                console.log('About pressed');
                Navigation.mergeOptions(componentId, {
                    sideMenu: {
                        right: {
                            visible: false
                        }
                    }
                });
            }
        },
        {
            title: 'Sync',
            onPress: () => {
                console.log('About pressed');
                Navigation.mergeOptions(componentId, {
                    sideMenu: {
                        right: {
                            visible: false
                        }
                    }
                });
                Navigation.setRoot(Routes.Sync)
            }
        }
    ];

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity 
            key={item.title}
            style={styles.menuItem} 
            onPress={item.onPress}
        >
            <Text textDefault style={styles.menuText} color={item.destructive ? Colors.textDanger : Colors.textDefault}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text headingM>Menu</Text>
            </View>
            <View style={styles.menuItems}>
                {menuItems.map(renderMenuItem)}
            </View>
            <View flexG />
            {renderMenuItem({
                title: 'Logout',
                destructive: true,
                onPress: () => {
                    console.log('About pressed');
                }
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDefault
    },
    header: {
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey60
    },
    headerText: {
        ...Typography.textHeadingBold,
    },
    menuItems: {
        paddingTop: 20,
        flex: 1
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.grey60
    },
    menuText: {
        ...Typography.text70,
    }
});

SideMenu.options = () => ({
    layout: {
        backgroundColor: Colors.backgroundDefault
    }
}); 