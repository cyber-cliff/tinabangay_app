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
import Places from 'modules/places';
import Profile from 'modules/profile';
import OptionRight from './OptionRight';
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

const Places_StackNavigator = createStackNavigator({
  Profile: {
    screen: Places,
    navigationOptions: ({ navigation }) => ({
      title: 'Places',
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
  Places: {
    screen: Places_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Places',
    },
  },
  Notification: {
    screen: Notification_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Notification',
    },
  },
}, {
  contentComponent: Slider
});

export default Drawer;