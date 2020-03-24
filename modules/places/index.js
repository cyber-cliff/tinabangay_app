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
      isLoading: false,
      newPlaceFlag: false,
      showDatePicker: false,
      dateLabel: null,
      dateFlag: false,
      date: new Date(),
      showTimePicker: false,
      timeLabel: null,
      timeFlag: false,
      time: new Date()
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
      date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      dateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
    });
    console.log('date', this.state.date);
  }

  _datePicker = () => {
    const { showDatePicker, date } = this.state;
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

  setTime = (event, date) => {
    console.log(date)
    this.setState({
      showTimePicker: false,
      timeFlag: true,
      time: date.getHours() + ':' + date.getMinutes,
      timeLabel: date.getHours() + ':' + date.getMinutes
    });
    console.log('date', this.state.time);
  }

  _timePicker = () => {
    const { showTimePicker, time } = this.state;
    return (
      <View>
        { showTimePicker && <DateTimePicker value={new Date()}
            mode={'time'}
            display="default"
            onCancel={() => this.setState({showTimePicker: false})}
            onConfirm={this.setTime} 
            onChange={this.setTime} />
        }
      </View>
    );
  }

  _newPlace = () => {
    return (
      <View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.secondary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showDatePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.dateFlag == false ? 'Click to add date' : this.state.dateLabel}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.secondary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showTimePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.timeFlag == false ? 'Click to add time' : this.state.timeLabel}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.secondary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showTimePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Add Location</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    const { user } = this.props.state;
    const { isLoading, newPlaceFlag } = this.state;
    return (
      <ScrollView
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              // this.retrieve()
            }
          }
        }}
        >
        <View style={{
          borderRadius: 5,
          backgroundColor: Color.danger,
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10
        }}>
          <Text style={{
            color: Color.white
          }}>
            Hi {user.username}! We would like to ask your help to input places you have been visited for the past months. Please, be honest and help use fight COVID-19.
          </Text>
        </View>

        <TouchableHighlight
          style={[BasicStyles.btn, {
            backgroundColor: Color.primary,
            width: '100%',
            marginTop: 20
          }]}
          onPress={() => {
            this.setState({newPlaceFlag: true})
          }}
        >
          <Text style={{
            color: Color.white
          }}>Add visited places</Text>
        </TouchableHighlight>
        {
          newPlaceFlag == true && (
            this._newPlace()
          )
        }
        {isLoading ? <Spinner mode="overlay"/> : null }
        {this._datePicker()}
        {this._timePicker()}
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
