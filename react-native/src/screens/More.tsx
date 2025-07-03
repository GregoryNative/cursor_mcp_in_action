import React, { Component } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { Navigation, EventSubscription } from 'react-native-navigation';

interface Props {
    componentId: string;
}

export class More extends Component<Props> {
    private navigationEventListener: EventSubscription;

    static options() {
        return {};
    }

    constructor(props: Props) {
        super(props);
        this.navigationEventListener = Navigation.events().registerBottomTabPressedListener(({ tabIndex }) => {
            // Assuming More tab is the last one (index 2)
            if (tabIndex === 2) {
                Navigation.mergeOptions(this.props.componentId, {
                    sideMenu: {
                        right: {
                            visible: true
                        }
                    }
                });
            }
        });
    }

    componentWillUnmount() {
        // Clean up the event listener
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    render() {
        return null;
    }
}
