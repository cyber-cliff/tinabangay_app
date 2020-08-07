import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, Confirmation, GooglePlacesAutoCompleteWithMap } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
const height = Math.round(Dimensions.get('window').height);
class LinkedAccounts extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      data: null,
      errorMessage: null,
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'owner'
      }, {
        value: user.id,
        clause: 'or',
        column: 'account_id'
      }],
      sort: {
        updated_at: 'desc'
      }
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.linkedAccountsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      console.log('LinkedAccounts', response.data)
      if(response.data.length > 0){
        this.setState({
          data: response.data
        })
      }else{
        this.setState({
          data: null
        })
      }
    }, error => {
      console.log(error)
    });
  }

  _data = () => {
    const { selected, data } = this.state;
    const { user } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        position: 'relative',
        zIndex: -1,
        minHeight: height
      }}>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              marginBottom: 10,
              borderColor: Color.gray,
              borderWidth: 1,
              position: 'relative',
              zIndex: -1,
              backgroundColor: Color.white
            }}>
              <View style={Style.TextContainer}>
                <View style={{
                  flexDirection: 'row'
                }}>
                  <Text
                    style={[BasicStyles.titleText, {
                      paddingTop: 10,
                      fontWeight: 'bold',
                      color: Color.primary
                    }]}>
                    {
                      (user != null && parseInt(item.owner) == user.id) ? item.account.username : item.owner_account.username
                    }
                  </Text>
                </View>
                <View>
                  <Text style={[BasicStyles.normalText, {
                    paddingBottom: 10
                  }]}>
                    Linked on {item.created_at_human}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  render() {
    const { user } = this.props.state;
    const { isLoading, data } = this.state;
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
        {isLoading ? <Spinner mode="overlay"/> : null }
        {
          data == null && (
            <Empty />
          )
        }
        {
          data !== null && (this._data())
        }
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkedAccounts);
