import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Slider from 'components/Slider';
import { Color, BasicStyles } from 'common';
import Dashboard from 'modules/dashboard';
import Notification from 'modules/notification';
import Place from 'modules/place';
import Temperature from 'modules/temperature';
import Ride from 'modules/ride';
import Profile from 'modules/profile';
import GenerateQR from 'modules/generateQR';
import ScanQR from 'modules/scanQR';
import OptionRight from './OptionRight';
import CheckMap from 'modules/checkMap';
class MenuDrawerStructure extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginState: true
    };
  }
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        {this.state.loginState === true && 
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
            {/*Donute Button Image */}
            <FontAwesomeIcon icon={ faBars } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
          </TouchableOpacity>
        }
        
      </View>
    );
  }
}
 
const Dashboard_StackNavigator = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: ({ navigation }) => ({
      title: 'Dashboard',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Notification_StackNavigator = createStackNavigator({
  Notification: {
    screen: Notification,
    navigationOptions: ({ navigation }) => ({
      title: 'Notification',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});


const Profile_StackNavigator = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Place_StackNavigator = createStackNavigator({
  Profile: {
    screen: Place,
    navigationOptions: ({ navigation }) => ({
      title: 'My Visited Places',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Temperature_StackNavigator = createStackNavigator({
  Profile: {
    screen: Temperature,
    navigationOptions: ({ navigation }) => ({
      title: 'My Temperatures',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Ride_StackNavigator = createStackNavigator({
  Profile: {
    screen: Ride,
    navigationOptions: ({ navigation }) => ({
      title: 'My Rides',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const GenQR_StackNavigator = createStackNavigator({
  Profile: {
    screen: GenerateQR,
    navigationOptions: ({ navigation }) => ({
      title: 'Generate QR',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const ScanQR_StackNavigator = createStackNavigator({
  Profile: {
    screen: ScanQR,
    navigationOptions: ({ navigation }) => ({
      title: 'Scan QR',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const CheckMap_StackNavigator = createStackNavigator({
  Profile: {
    screen: CheckMap,
    navigationOptions: ({ navigation }) => ({
      title: 'Check Map',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});


const Drawer = createDrawerNavigator({
  Dashboard: {
    screen: Dashboard_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Dashboard',
    },
  },
  Profile: {
    screen: Profile_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Profile',
    },
  },
  Place: {
    screen: Place_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Place',
    },
  },
  Temperature: {
    screen: Temperature_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Temperature',
    },
  },
  Ride: {
    screen: Ride_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Ride',
    },
  },
  Notification: {
    screen: Notification_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Notification',
    },
  },
  GenerateQR: {
    screen: GenQR_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Generate QR',
    },
  },

  ScanQR: {
    screen: ScanQR_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Scan QR',
    },
  },
  CheckMap: {
    screen: CheckMap_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Check Map',
    },
  },
  
}, {
  contentComponent: Slider
});

export default Drawer;