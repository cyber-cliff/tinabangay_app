import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload } from 'components';
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
class Temperature extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      selected: null
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
        column: 'account_id'
      }]
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.temperaturesRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({data: response.data})
      }else{
        this.setState({data: null})
      }
    });
  }
  

  _data = () => {
    const { data, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.primary,
        borderRadius: 5
      }}>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 10,
              marginBottom: 10
            }}>
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <Text
                      style={[BasicStyles.titleText, {
                        paddingTop: 10,
                        color: Color.white,
                        fontSize: 20
                      }]}>
                      {item.value} Degree Celsius
                    </Text>
                  </View>
                  {
                    item.remarks != null && (
                        <Text
                          style={[BasicStyles.normalText, {
                            color: Color.white
                          }]}>
                          {item.remarks}
                        </Text>
                      )
                  }
                  {
                    item.added_by_account != null && (
                      <Text
                        style={[BasicStyles.normalText, {
                          color: Color.white
                        }]}>
                        {item.added_by_account.username}
                      </Text>
                    )
                  }
                  {
                    item.temperature_location && (
                      <View>
                        <FontAwesomeIcon
                          icon={faMapMarker}
                          style={{
                            color: Color.white
                          }}
                        ></FontAwesomeIcon>
                        <Text
                          style={[BasicStyles.normalText, {
                            color: Color.white
                          }]}>
                          {item.temperature_location.route + ', ' + item.temperature_location.locality + ', ' + item.temperature_location.country}
                        </Text>
                      </View>
                    )
                  }

                  <Text
                    style={[BasicStyles.normalText, {
                      paddingBottom: 10,
                      color: Color.white
                    }]}>
                    {item.country}
                  </Text>
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
        {
          data != null && (this._data())
        }
        {isLoading ? <Spinner mode="overlay"/> : null }
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Temperature);
