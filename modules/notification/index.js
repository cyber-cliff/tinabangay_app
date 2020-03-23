import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions} from 'react-navigation';
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
      console.log(notifications.data.length)
      setNotifications(notifications.size, notifications.data)
    })
  }

  retrieveRequest = (route) => {
    const { user, searchParameter } = this.props.state;
    const { setUserLedger } = this.props;
    if(user == null){
      return;
    }
    let parameter = {
      account_id: user.id,
      offset: 0,
      limit: 10,
      sort: {
        column: 'created_at',
        value: 'desc'
      },
      value: searchParameter == null ? '%' : searchParameter.value,
      column: searchParameter == null ? 'created_at' : searchParameter.column,
      type: user.account_type
    }
    Api.request(Routes.requestRetrieve, parameter, response => {
      const { setRequests } = this.props;
      setUserLedger(response.ledger)
      if(response.data !=  null){
        setRequests(response.data)
      }else{
        setRequests(null)
      }
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
    });
  }

  updateNotification = (searchParameter, notification, route) => {
    const { setSearchParameter, setNotifications } = this.props;
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
        setSearchParameter(searchParameter)
        if(route == 'Requests'){
          setTimeout(() => {
            this.retrieveRequest(route)
          }, 1000)
          return
        }
        const navigateAction = NavigationActions.navigate({
          routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
      });
    })
  }

  viewNotification = (notification, index) => {
    const { notifications } = this.props.state;
    const { setSearchParameter } = this.props;
    setSearchParameter(null)
    let route = null;
    let searchParameter = null
    switch(notification.payload){
      case 'request':
        route = 'Requests';
        searchParameter = {
          column: 'id',
          value: notification.payload_value
        }
        break;
      case 'ledger':
        route = 'Dashboard'
        break;
      case 'thread':
        route = 'Messenger';
        // searchParameter = {
        //   column: 'id',
        //   value: notification.payload_value
        // }
        searchParameter = null
        break;
    }
    if(notifications.unread > index){
      this.updateNotification(searchParameter, notification, route);
    }else{
      setSearchParameter(searchParameter)
      if(route == 'Requests'){
        setTimeout(() => {
          this.retrieveRequest(route)
        }, 1000)
        return
      }
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
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
    setRequests: (requests) => dispatch(actions.setRequests(requests)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setSearchParameter: (searchParameter) => dispatch(actions.setSearchParameter(searchParameter)),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);