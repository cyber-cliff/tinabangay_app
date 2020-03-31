import Color from './Color.js';
import { faEdit, faComments, faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
export default {
  company: 'Increment Technologies',
  APP_NAME: '@Tinabangay_',
  APP_NAME_BASIC: 'BirdsEye',
  APP_EMAIL: 'support@birdseye.increment.ltd',
  APP_WEBSITE: 'www.birdseye.increment.ltd',
  APP_HOST: 'com.birdseye',
  DrawerMenu: [{
    title: 'Dashboard',
    route: 'Dashboard'
  }, {
    title: 'My Visited Places',
    route: 'Place'
  }, {
    title: 'My Rides',
    route: 'Ride'
  }, {
    title: 'My Temperature',
    route: 'Temperature'
  }, {
    title: 'My Profile',
    route: 'Profile'
  }
  // {
  //   title: 'Generate QR',
  //   route: 'GenerateQR'
  // },
  // {
  //   title: 'Scan QR',
  //   route: 'ScanQR'
  // },
  // {
  //   title: 'Check Map',
  //   route: 'CheckMap'
  // }
  ],
  pusher: {
    broadcast_type: 'pusher',
    channel: 'birdseye',
    notifications: 'App\\Events\\Notifications',
    typing: 'typing'
  },
  tutorials: [
    {
      key: 1,
      title: 'Welcome to BirdsEye!',
      text: 'Let\'s be one in Fighting COVID-19!',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }, 
    {
      key: 2,
      title: 'Visited Places',
      text: 'Track your visited locations if it was affected by COVID-19.',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }, 
    {
      key: 3,
      title: 'Transporation Routes',
      text: 'Track your previous transportation if it was affected by COVID-19.',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }, 
    {
      key: 4,
      title: 'QR Code',
      text: 'Use your QR Code to ease the data recording from agencies.',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }, 
    {
      key: 5,
      title: 'That\'s It!',
      text: 'We can now trace and map your locations!',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray]
    }
  ],
  transportationTypes: [{
    title: 'Bus',
    value: 'bus'
  }, {
    title: 'Jeep',
    value: 'jeep'
  }, {
    title: 'Plane',
    value: 'plane'
  }, {
    title: 'Private Cars',
    value: 'private_car'
  }, {
    title: 'Van',
    value: 'van'
  }, {
    title: 'Motorcycle',
    value: 'motorcycle'
  }],
  patientStatus: [{
    title: 'Death',
    value: 'death'
  }, {
    title: 'Positive',
    value: 'positive'
  }, {
    title: 'PUM',
    value: 'pum'
  }, {
    title: 'PUI',
    value: 'pui'
  }, {
    title: 'Negative',
    value: 'negative'
  }, {
    title: 'Recovered',
    value: 'recovered'
  }],
  retrieveDataFlag: 1,
  validateEmail(email){
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9]*$/
    if(reg.test(email) === false){
      return false
    }else{
      return true
    }
  }
}