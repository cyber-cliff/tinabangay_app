import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBell, faBus, faMapMarker, faUsers} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Color, BasicStyles } from 'common';

const width = Math.round(Dimensions.get('window').width);
import { connect } from 'react-redux';
class NavigationDrawerStructureRight extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null
    }
  }
  goTo = (screen) => {
    this.props.navigationProps.navigate(screen)
  }

  navigateToScreen = (route) => {
    const { setActiveRoute } = this.props;
    setActiveRoute(route)
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigationProps.dispatch(navigateAction);
  }
  
  render() {
    const { notifications, user, activeRoute } = this.props.state;
    return (
      <View style={{ flexDirection: 'row', width: width - (width * .20)}}>

        <View style={{
          width: '25%'
        }}>
          <TouchableOpacity onPress={() => this.navigateToScreen('LinkedAccounts')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faUsers } size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
                color: activeRoute == 'LinkedAccounts' ? Color.secondary : Color.white
              }]}/>
            </View>
          </TouchableOpacity>   
        </View>

        {
          (user != null && user.account_type != 'USER') &&
          (
            <View style={{
          width: '25%'
        }}>
              <TouchableOpacity onPress={() => this.navigateToScreen('Location')}>
                <View style={{ flexDirection: 'row'}}>
                  <FontAwesomeIcon icon={ faMapMarker } size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
                color: activeRoute == 'Location' ? Color.secondary : Color.white
              }]}/>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
        <View style={{
          width: '25%'
        }}>
          <TouchableOpacity onPress={() => this.navigateToScreen('Transportation')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faBus } size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
                color: activeRoute == 'Transportation' ? Color.secondary : Color.white
              }]}/>
            </View>
          </TouchableOpacity>   
        </View>
        <View style={{
          width: '25%'
        }}>
          <TouchableOpacity onPress={() => this.navigateToScreen('Notification')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faBell } size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
                color: activeRoute == 'Notification' ? Color.secondary : Color.white
              }]}/>
              {
                notifications && notifications.unread > 0 &&
                (
                  <View style={{
                    ackgroundColor: Color.danger,
                    borderRadius: 5,
                    fontSize: 11,
                    marginLeft: -20
                  }}>
                    <Text
                      style={{
                        color: Color.white,
                        paddingLeft: 5,
                        paddingRight: 5,
                        paddingTop: 2,
                        paddingBottom: 2,
                        lineHeight: 20,
                        textAlign: 'center'
                      }}>{notifications.unread}</Text>
                  </View>
                )
              }
            </View>
          </TouchableOpacity>   
        </View>
        
      </View>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(NavigationDrawerStructureRight);