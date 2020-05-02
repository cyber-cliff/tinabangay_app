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
import Transportation from 'modules/transportation';
import Location from 'modules/location';
import LinkedAccounts from 'modules/linkedAccounts';
import Symptoms from 'modules/symptoms';
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
  Place: {
    screen: Place,
    navigationOptions: ({ navigation }) => ({
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
  Temperature: {
    screen: Temperature,
    navigationOptions: ({ navigation }) => ({
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
  Ride: {
    screen: Ride,
    navigationOptions: ({ navigation }) => ({
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
  GenerateQR: {
    screen: GenerateQR,
    navigationOptions: ({ navigation }) => ({
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
  ScanQR: {
    screen: ScanQR,
    navigationOptions: ({ navigation }) => ({
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
  CheckMap: {
    screen: CheckMap,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Transportation_StackNavigator = createStackNavigator({
  Transportation: {
    screen: Transportation,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Location_StackNavigator = createStackNavigator({
  Location: {
    screen: Location,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const LinkedAccounts_StackNavigator = createStackNavigator({
  LinkedAccounts: {
    screen: LinkedAccounts,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Symptoms_StackNavigator = createStackNavigator({
  Symptoms: {
    screen: Symptoms,
    navigationOptions: ({ navigation }) => ({
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
      drawerLabel: '',
    },
  },
  Profile: {
    screen: Profile_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Place: {
    screen: Place_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Temperature: {
    screen: Temperature_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Ride: {
    screen: Ride_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Notification: {
    screen: Notification_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  GenerateQR: {
    screen: GenQR_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  ScanQR: {
    screen: ScanQR_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  CheckMap: {
    screen: CheckMap_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Transportation: {
    screen: Transportation_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Location: {
    screen: Location_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  LinkedAccounts: {
    screen: LinkedAccounts_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  Symptoms: {
    screen: Symptoms_StackNavigator,
    navigationOptions: {
      drawerLabel: '',
    },
  },
  
}, {
  contentComponent: Slider
});

export default Drawer;