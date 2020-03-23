import Color from './Color.js';
import { faEdit, faComments, faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
export default {
  company: 'Increment Technologies',
  APP_NAME: '@Tinabangay_',
  APP_NAME_BASIC: 'Tinabangay',
  APP_EMAIL: 'support@tinabangay.ph',
  APP_WEBSITE: 'www.tinabangay.increment.ltd',
  APP_HOST: 'com.tinabangay',
  DrawerMenu: [{
    title: 'Dashboard',
    route: 'Dashboard'
  }, {
    title: 'Profile',
    route: 'Profile'
  }],
  pusher: {
    broadcast_type: 'pusher',
    channel: 'tinabangay',
    notifications: 'App\\Events\\Notifications',
    typing: 'typing'
  },
  tutorials: [
    {
      key: 1,
      title: 'Welcome to Tinabangay!',
      text: 'Instruction here!',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }
  ],
  validateEmail(email){
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9]*$/
    if(reg.test(email) === false){
      return false
    }else{
      return true
    }
  }
}