import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { Navigation } from 'react-native-navigation';
import { Routes } from '../navigation/routes';
import SyncManager from '../db/SyncManager';

enum SyncStatus {
    SYNCING = 'syncing',
    ERROR = 'error',
    DONE = 'done'
}

interface State {
    status: SyncStatus;
    error?: string;
    seconds: number;
    dots: number;
}

export class SyncScreen extends React.Component<any, State> {
    private timerInterval?: NodeJS.Timeout;

    state: State = {
        status: SyncStatus.SYNCING,
        seconds: 0,
        dots: 1
    };

    async componentDidMount() {
        this.timerInterval = setInterval(() => {
            this.setState(prevState => ({ 
                seconds: prevState.seconds + 1,
                dots: (prevState.dots % 3) + 1
            }));
        }, 1000);

        try {
            await SyncManager.syncAll();
            this.setState({ status: SyncStatus.DONE });
            
            Navigation.setRoot(Routes.Home);
        } catch (error) {
            this.setState({ 
                status: SyncStatus.ERROR,
                error: error instanceof Error ? error.message : 'Sync failed'
            });
        } finally {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
        }
    }

    componentWillUnmount() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    private getDots = () => '.'.repeat(this.state.dots);

    render() {
        const { status, error, seconds } = this.state;

        return (
            <View flex center>
                {status === SyncStatus.SYNCING && (
                    <View center>
                        <Text text50>Syncing data {this.getDots()}</Text>
                        <Text text70>{seconds} seconds</Text>
                    </View>
                )}
                {status === SyncStatus.ERROR && (
                    <View>
                        <Text text50 red10>Sync failed</Text>
                        <Text text70 red10>{error}</Text>
                    </View>
                )}
            </View>
        );
    }

    static options() {
        return {
            topBar: {
                visible: false
            }
        };
    }
}