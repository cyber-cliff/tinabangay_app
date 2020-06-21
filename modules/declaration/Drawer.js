import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Declaration from 'modules/declaration';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

class HeaderOptions extends Component {
  constructor(props){
    super(props);
  }
  back = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Notification'
    });
    this.props.navigationProps.dispatch(navigateAction);
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon icon={ faChevronLeft } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

const DeclarationStack = createStackNavigator({
  declarationScreen: {
    screen: Declaration, 
    navigationOptions: ({ navigation }) => ({
      title: 'Health Declaration',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      drawerLabel: 'Health Declaration',
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeclarationStack);