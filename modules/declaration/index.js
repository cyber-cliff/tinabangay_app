import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload, DateTime } from 'components';
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
const gender = [{
  title: 'Male',
  value: 'male'
}, {
  title: 'Female',
  value: 'female'
}, {
  title: 'Others',
  value: 'others'
}]
class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      firstName: null,
      middleName: null,
      lastName: null,
      sex: null,
      cellularNumber: null,
      address: null,
      birthDate: null,
      id: null,
      isImageUpload: false
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  retrieve = () => {
    const { user, declaration } = this.props.state;
    if(user === null || declaration == null){
      return
    }
    let parameter = {
      condition: [{
        value: declaration.value,
        clause: '=',
        column: 'id'
      }]
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    console.log('parameter', parameter)
    Api.request(Routes.healthDeclaratioRetrieve, parameter, response => {
      console.log('declaration', response.data[0].merchant)
      this.setState({isLoading: false})
    });
  }

  validate = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.firstName,
      middle_name: this.state.middleName,
      last_name: this.state.lastName,
      sex: this.state.sex,
      cellular_number: this.state.cellularNumber,
      address: this.state.address,
      birth_date: this.state.birthDate
    }
    this.setState({isLoading: true})
    console.log('accountInformationUpdate', parameter)
    Api.request(Routes.accountInformationUpdate, parameter, response => {
      this.setState({isLoading: false})
      console.log(response)
      if(response.data == true){
        this.retrieve()
      }
    }, error => {
      console.log(error)
    });
  }

 

  _inputs = () => {
    const { userLedger, user, location } = this.props.state;
    const { errorMessage } = this.state;
    const iOSGender = gender.map((item, index) => {
                      return {
                        label: item.title,
                        value: item.value
                      };
                    });
    return (
      <View>
        <View>
          <Text style={{
          }}>First Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
            placeholder={'Enter first name'}
          />
        </View>
        <View>
          <Text style={{
          }}>Middle Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(middleName) => this.setState({middleName})}
            value={this.state.middleName}
            placeholder={'Enter middle name'}
          />
        </View>
        <View>
          <Text style={{
          }}>Last Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}
            placeholder={'Enter last name'}
          />
        </View>
        <View style={{
        }}>
          <Text>Gender</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.sex}
                onValueChange={(sex) => this.setState({sex})}
                style={BasicStyles.pickerStyleCreate}
                >
                  {
                    gender.map((item, index) => {
                      return (
                        <Picker.Item
                        key={index}
                        label={item.title} 
                        value={item.value}/>
                      );
                    })
                  }
                </Picker>
            )
          }
          {
            Platform.OS == 'ios' && (
              <RNPickerSelect
                onValueChange={(sex) => this.setState({sex})}
                items={iOSGender}
                style={BasicStyles.pickerStyleIOSNoMargin}
                placeholder={{
                  label: 'Click to select',
                  value: null,
                  color: Color.primary
                }}
                />
            )
          }
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Bith Date</Text>
          <DateTime
            type={'date'}
            placeholder={'Select Date'}
            onFinish={(date) => {
              this.setState({
                birthDate: date.date
              })
            }}
            style={{
              marginTop: 5
            }}
          />
        </View>
        <View>
          <Text style={{
          }}>Cellular Number</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(cellularNumber) => this.setState({cellularNumber})}
            value={this.state.cellularNumber}
            placeholder={'Enter cellular number'}
          />
        </View>
        <View>
          <Text style={{
          }}>Address</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}
            placeholder={'Enter address'}
          />
        </View>
        <View style={{
          marginBottom: 100,
        }}>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.validate()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Next</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
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
        <View style={[Style.MainContainer, {
        }]}>
          {
            user != null && (
               <View style={{
                width: '100%'
               }}>
                <Text  style={{
                  color: Color.primary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingBottom: 10
                }}>
                  Hi {user.username}!
                </Text>
              </View>
            )
          }
          {
            this._inputs()
          }
        </View>
        {isLoading ? <Spinner mode="overlay"/> : null }
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
)(Profile);
