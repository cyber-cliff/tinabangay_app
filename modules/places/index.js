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
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
const height = Math.round(Dimensions.get('window').height);
class Places extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount(){
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
      isLoading: true, 
      showDatePicker: false
    })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        let data = response.data[0]
        this.setState({
          id: data.id,
          firstName: data.first_name,
          middleName: data.middle_name,
          lastName: data.last_name,
          sex: data.sex,
          cellularNumber: data.cellular_number,
          address: data.address,
          birthDate: data.birth_date
        })
        if(data.birth_date != null){
          this.setState({
            dateFlag: true,
            birthDateLabel: data.birth_date
          })
        }
      }else{
        this.setState({
          id: null,
          firstName: null,
          middleName: null,
          lastName: null,
          sex: null,
          cellularNumber: null,
          address: null,
          birthDate: new Date(),
        })
      }
    });
  }

  setDate = (event, date) => {
    this.setState({
      showDatePicker: false,
      dateFlag: true,
      birthDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      birthDateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
    });
    console.log('date', this.state.neededOn);
  }

  _datePicker = () => {
    const { showDatePicker, birthDate } = this.state;
    return (
      <View>
        { showDatePicker && <DateTimePicker value={new Date()}
            mode={'date'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
      </View>
    );
  }

  render() {
    const { user } = this.props.state;
    const { isLoading, isImageUpload } = this.state;
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
        {isImageUpload ? 
          <ImageUpload
            visible={isImageUpload}
            onSelect={(url) => {
              this.setState({isImageUpload: false, isLoading: false})
              this.updateProfile(url)
            }}
            onCLose={() => {
              this.setState({isImageUpload: false, isLoading: false})
            }}/> : null}
        {this._datePicker()}
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
)(Places);
