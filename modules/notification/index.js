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

  componentDidMount(){
    this.retrieve()
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
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }],
      sort: {
        created_at: 'desc'
      }
    }
    this.setState({isLoading: true})
    console.log(parameter)
    Api.request(Routes.notificationsRetrieve, parameter, response => {
      console.log(response)
      this.setState({isLoading: false})
      setNotifications(response.length, response.data.length > 0 ? response.data : null)
    })
  }

  _status = (item) => {
    return (
      <View>
        {
          item.status == 'death' && (
            <View style={{
              backgroundColor: 'black',
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )
        }

        {
          item.status == 'positive' && (
            <View style={{
              backgroundColor: Color.danger,
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )
        }
        {
          item.status == 'pum' && (
            <View style={{
              backgroundColor: Color.warning,
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )
        }

        {
          item.status == 'pui' && (
            <View style={{
              backgroundColor: Color.primary,
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )
        }
        {
          item.status == 'negative' && (
            <View style={{
              backgroundColor: 'green',
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          )
        }

        {
          item.status == 'tested' && (
            <View style={{
              backgroundColor: Color.warning,
              borderRadius: 2,
              marginRight: 20,
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 10
            }}>
              <Text style={{
                color: Color.white,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                {item.status.toUpperCase()}. Please be responsible and be on quarantine until the results.
              </Text>
            </View>
          )
        }
      </View>
    );
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
            !notifications && (
              <Empty />
            )
          }
          {
            notifications && (
              <FlatList
                data={notifications.notifications}
                extraData={selected}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableHighlight
                      onPress={() => {console.log('hi')}}
                      underlayColor={Color.gray}
                      >
                      <View style={[Style.TextContainer, {
                        backgroundColor: notifications.unread > index ? Color.lightGray : Color.white
                      }]}>
                        <Text
                          style={[BasicStyles.titleText, {
                            paddingTop: 10
                          }]}>
                          New Status
                        </Text>

                        {
                          this._status(item)
                        }

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