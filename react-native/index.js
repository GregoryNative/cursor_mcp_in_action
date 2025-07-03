import { Navigation } from "react-native-navigation";
import SQLite from 'react-native-sqlite-storage';
import { registerScreens } from "./src/navigation/registers";
import { Routes } from "./src/navigation/routes";
import SyncManager from "./src/db/SyncManager";
import "./src/styles";

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

let isAppLaunching = false;

registerScreens();

Navigation.setDefaultOptions({
  options: {
    bottomTab: {
      fontFamily: 'WixMadeforTextApp-Regular'
    },
    topBar: {
      rightButtons: [
        {
          fontFamily: 'WixMadeforTextApp-Regular'
        }
      ],
      leftButtons: [
        {
          fontFamily: 'WixMadeforTextApp-Regular'
        }
      ]
    },
  }
});

Navigation.events().registerAppLaunchedListener(async () => {
  // UNCOMMENT TO TRIGGER SYNC AGAIN
  // await SyncManager.clearAllData()
  
  if (!isAppLaunching) {
    isAppLaunching = true;
    try {
      const isSynced = await SyncManager.isEverythingSynced();
      await Navigation.setRoot(isSynced ? Routes.Home : Routes.Sync);
    } catch (error) {
      await Navigation.setRoot(Routes.Sync);
    } finally {
      isAppLaunching = false;
    }
  }
});