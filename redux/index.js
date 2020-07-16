import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';
import { Helper } from 'common';

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  SET_LOCATION: 'SET_LOCATION',
  SET_ALL_LOCATION: 'SET_ALL_LOCATION',
  SET_PREVIOUS_ROUTE: 'SET_PREVIOUS_ROUTE',
  SET_SCANNED_USER: 'SET_SCANNED_USER',
  SET_SCANNED_LOCATION:'SET_SCANNED_LOCATION',
  SET_ACTIVE_ROUTE: 'SET_ACTIVE_ROUTE',
  SET_HEALTH_DECLARATION: 'SET_HEALTH_DECLARATION',
  nav: null,
}

export const actions = {
  login: (user, token) => {
    return { type: types.LOGIN, user, token };
  },
  logout() {
    return { type: types.LOGOUT };
  },
  updateUser: (user) => {
    return { type: types.UPDATE_USER, user };
  },
  setNotifications(unread, notifications){
    return { type: types.SET_NOTIFICATIONS, unread, notifications};
  }, 
  updateNotifications(unread, notification){
    return { type: types.UPDATE_NOTIFICATIONS, unread, notification};
  },
  setLocation(location){
    return { type: types.SET_LOCATION, location};
  },
  setAllLocation(locations){
    return { type: types.SET_ALL_LOCATION, locations};
  },
  setPreviousRoute(previousRoute){
    return { type: types.SET_PREVIOUS_ROUTE, previousRoute};
  },
  setScannedUser(scannedUser){
    return { type: types.SET_SCANNED_USER, scannedUser};
  },
  setScannedLocation(scannedLocation){
    return { type: types.SET_SCANNED_LOCATION, scannedLocation};
  },
  setActiveRoute(activeRoute){
    return { type: types.SET_ACTIVE_ROUTE, activeRoute};
  },
  setDeclaration(declaration){
    return { type: types.SET_HEALTH_DECLARATION, declaration}
  }
};

const initialState = {
  token: null,
  user: null,
  notifications: null,
  location: null,
  locations: null,
  previousRoute: null,
  scannedUser: null,
  scannedLocation:null,
 
  activeRoute: null,
  declaration: null
}

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${Helper.APP_NAME}${key}`, value)
  } catch (e) {
    // saving error
  }
}

const reducer = (state = initialState, action) => {
  const { type, user, token } = action;
  const { unread } = action;
  const { notification, location, locations } = action;
  const { previousRoute, scannedUser } = action;
  const { scannedLocation }=action;
  
  const { activeRoute, declaration } = action;
  switch (type) {
    case types.LOGOUT:
      AsyncStorage.clear();
      return Object.assign({}, initialState);
    case types.LOGIN:
      storeData('token', token);
      console.log('LOGIN', true);
      Data.setToken(token)
      return { ...state, user, token };
    case types.UPDATE_USER:
      return {
        ...state,
        user
      }
    case types.SET_NOTIFICATIONS:
      let notifications = {
        unread,
        notifications: action.notifications
      }
      console.log('notifications', true);
      return {
        ...state,
        notifications
      }
    case types.UPDATE_NOTIFICATIONS:
      let updatedNotifications = null
      if(state.notifications == null){
        let temp = []
        temp.push(notification)
        updatedNotifications = {
          unread,
          notifications: temp
        }
      }else{
        let oldNotif = state.notifications
        if(oldNotif.notifications == null){
          let temp = []
          temp.push(notification)
          updatedNotifications = {
            unread,
            notifications: temp
          }
        }else{
          if(parseInt(notification.id) != parseInt(oldNotif.notifications[oldNotif.notifications.length - 1].id)){
            oldNotif.notifications.unshift(notification)
            updatedNotifications = {
              unread: oldNotif.unread + unread,
              notifications: oldNotif.notifications
            }
          }else{
            updatedNotifications = {
              unread: oldNotif.unread + unread,
              notifications: oldNotif.notifications
            }
          }
        }
      }
      return {
        ...state,
        notifications: updatedNotifications
      }
    case types.SET_LOCATION:
      return {
        ...state,
        location
      }
    case types.SET_ALL_LOCATION:
      return {
        ...state,
        locations
      }
    case types.SET_PREVIOUS_ROUTE:
      return {
        ...state,
        previousRoute
      }
    case types.SET_SCANNED_USER:
      return {
        ...state,
        scannedUser
      }
    case types.SET_SCANNED_LOCATION:
      return {
        ...state,
        scannedLocation
      }
    case types.SET_ACTIVE_ROUTE:
      return {
        ...state,
        activeRoute
      }
    case types.SET_HEALTH_DECLARATION:
      return {
        ...state,
        declaration
      }
  
    default:
      return {...state, nav: state.nav};
  }
}
export default reducer;