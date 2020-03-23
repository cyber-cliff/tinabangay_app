import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';
import { Helper } from 'common';

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
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
  }
};

const initialState = {
  token: null,
  user: null,
  notifications: null
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
  const { notification } = action;
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
    default:
      return {...state, nav: state.nav};
  }
}
export default reducer;