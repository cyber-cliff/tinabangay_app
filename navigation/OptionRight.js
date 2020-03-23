import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faBell} from '@fortawesome/free-solid-svg-icons';
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
    const { messenger, notifications } = this.props.state;;
    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <TouchableOpacity onPress={() => this.navigateToScreen('Notification')}>
            <View style={{ flexDirection: 'row'}}>
              <FontAwesomeIcon icon={ faBell } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
              {
                notifications && notifications.unread > 0 &&
                (
                  <Text style={{
                    color: Color.white,
                    backgroundColor: Color.danger,
                    borderRadius: 2,
                    paddingLeft: 6,
                    paddingRight: 6,
                    paddingTop: 4,
                    paddingBottom: 4,
                    fontSize: 11,
                    marginLeft: -20
                  }}>{notifications.unread}</Text>
                )
              }
              {
                notifications && notifications.unread > 0 && Platform.OS == 'ios' &&
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