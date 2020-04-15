import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBell, faBus, faMapMarker} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Color, BasicStyles } from 'common';

import { connect } from 'react-redux';
class NavigationDrawerStructureRight extends Component {
  constructor(props){
    super(props);
  }
  goTo = (screen) => {
    this.props.navigationProps.navigate(screen)
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigationProps.dispatch(navigateAction);
  }
  
  render() {
    const { notifications, user } = this.props.state;;
    return (
      <View style={{ flexDirection: 'row' }}>
        {
          (user != null && user.account_type != 'USER') &&
          (
            <View>
              <TouchableOpacity onPress={() => this.navigateToScreen('Location')}>
                <View style={{ flexDirection: 'row'}}>
                  <FontAwesomeIcon icon={ faMapMarker } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
        <View>
          <TouchableOpacity onPress={() => this.navigateToScreen('Transportation')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faBus } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
            </View>
          </TouchableOpacity>   
        </View>
        <View>
          <TouchableOpacity onPress={() => this.navigateToScreen('Notification')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faBell } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(NavigationDrawerStructureRight);