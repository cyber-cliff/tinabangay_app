import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
class Notifications extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  componentDidMount(){
    this.retrieve()
  }

  retrieve = () => {
    const { setNotifications } = this.props;
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      account_id: user.id
    }
    this.setState({isLoading: true})
    Api.request(Routes.notificationsRetrieve, parameter, notifications => {
      this.setState({isLoading: false})
      setNotifications(notifications.size, notifications.data)
    }, error => {
      console.log('error', error)
    })
  }

  redirect(route){
    const reset = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({
          routeName: 'declarationStack'
      })]
    });
    this.props.navigation.dispatch(reset);
  }
  updateNotification = (searchParameter, notification, route) => {
    const { setDeclaration, setNotifications } = this.props;
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      id: notification.id
    }
    Api.request(Routes.notificationUpdate, parameter, response => {
      let retrieveParameter = {
        account_id: user.id
      }
      Api.request(Routes.notificationsRetrieve, retrieveParameter, notifications => {
        setNotifications(notifications.size, notifications.data);
        setDeclaration(searchParameter)
        this.redirect(route)
      });
    })
  }

  viewNotification = (notification, index) => {
    const { notifications } = this.props.state;
    const { setDeclaration } = this.props;
    setDeclaration(null)
    let route = null;
    let searchParameter = null
    switch(notification.payload){
      case 'form_request':
        route = 'Declaration';
        searchParameter = {
          column: 'id',
          value: notification.payload_value
        }
        break;
      case 'form_submitted':
        route = 'Declaration'
        searchParameter = {
          column: 'id',
          value: notification.payload_value
        }
        break;
    }
    if(notifications.unread > index){
      console.log('hello')
      this.updateNotification(searchParameter, notification, route);
    }else{
      console.log('hi')
      setDeclaration(searchParameter)
      this.redirect(route)
    }
  }

  render() {
    const { notifications } = this.props.state;
    const { selected, isLoading } = this.state;

    return (
      <ScrollView
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              this.retrieve()
            }
          }
        }}
        >
        {notifications == null || (notifications != null && notifications.notifications == null) && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
        {isLoading ? <Spinner mode="overlay"/> : null }
        <View style={[Style.MainContainer, {
          minHeight: height
        }]}>
          {
            notifications && (
              <FlatList
                data={notifications.notifications}
                extraData={selected}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableHighlight
                      onPress={() => {this.viewNotification(item, index)}}
                      underlayColor={Color.gray}
                      >
                      <View style={[Style.TextContainer, {
                        backgroundColor: notifications.unread > index ? Color.lightGray : Color.white
                      }]}>
                        <Text
                          style={[BasicStyles.titleText, {
                            paddingTop: 10
                          }]}>
                          {item.title}
                        </Text>
                        <Text
                          style={BasicStyles.normalText}>
                          {item.description}
                        </Text>

                        <Text
                          style={[BasicStyles.normalText, {
                            paddingBottom: 10
                          }]}>
                          {item.created_at_human}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            )
          }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setDeclaration: (declaration) => dispatch(actions.setDeclaration(declaration)),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);