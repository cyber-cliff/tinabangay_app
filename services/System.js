import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import { Helper } from 'common';
import { Platform, Linking } from 'react-native';
export default {
  checkVersion(callback){
    if(Platform.OS === 'android'){
      VersionCheck.needUpdate()
      .then(async res => {
        if(typeof res != undefined && typeof res != 'undefined'){
          if (res.isNeeded) {
            Linking.openURL(res.storeUrl);  // open store if update is needed.
          }else{
            callback(true)
          }
        }else{
          callback(true)
        }
      });
    }else if(Platform.OS === 'ios'){
      callback(true)
    }
  }
}