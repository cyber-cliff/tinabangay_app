import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload, Empty } from 'components';
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
class Temperatures extends Component{
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
    const { scannedUser } = this.props.state;
    if(scannedUser === null){
      return
    }
    let parameter = {
      condition: [{
        value: scannedUser.id,
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
        console.log(response.data)
        this.setState({data: response.data})
      }else{
        this.setState({data: null})
      }
     
    });
  }
  

  _data = () => {
    const { data, selected } = this.state;
    return (
      <View>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              borderColor: Color.gray,
              borderWidth: 1,
              marginBottom: 10
            }}>
              {console.log(item.temperature_location)}
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <Text
                      style={[BasicStyles.titleText, {
                        paddingTop: 10,
                        color: Color.primary,
                        fontWeight: 'bold'
                      }]}>
                      {item.value} Degree Celsius
                    </Text>
                  </View>
                  {
                    item.remarks != null && (
                        <Text
                          style={[BasicStyles.normalText, {
                            color: Color.darkGray
                          }]}>
                          {item.remarks}
                        </Text>
                      )
                  }
                  {
                    item.temperature_location && (
                      <View style={{
                        flexDirection: 'row'
                      }}>
                        <FontAwesomeIcon
                          icon={faMapMarker}
                          style={{
                            color: Color.darkGray,
                            marginLeft: 17
                          }}
                        ></FontAwesomeIcon>
                        <Text
                          style={[BasicStyles.normalText, {
                            color: Color.darkGray,
                            paddingLeft: 0,
                            marginBottom: 10
                          }]}>
                            
                          {item.temperature_location.route + ', ' + item.temperature_location.locality + ', ' + item.temperature_location.country}
                        </Text>
                      </View>
                    )
                  }
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
        <View style={[Style.MainContainer, {
          minHeight: height
        }]}>
          {isLoading ? <Spinner mode="overlay"/> : null }
          {
            data != null && (this._data())
          }
          {
            data == null && (
              <Empty />
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
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Temperatures);
