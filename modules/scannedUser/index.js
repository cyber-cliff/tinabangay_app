import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Confirmation, Spinner, Empty, ImageUpload, GooglePlacesAutoComplete, DateTime } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ScannedUserPlaces from 'modules/place/places.js';
import ScannedUserRides from 'modules/ride/rides.js';
import ScannedUserTemperatures from 'modules/temperature/temperatures.js';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
class ScannedUser extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      activePage: 'places',
      addFlag: null,
      errorMessage: null,
      value: null,
      remarks: null,
      patientStatus: null,
      templocation:{},
    }
  }

  componentDidMount(){
  }

   manageLocation = (location) => {
   
    this.setState({
      templocation: location
    })

    
  }

  submit = () => {
    const { user, scannedUser } = this.props.state;
    const { addFlag } = this.state;
    if(addFlag == null || user == null || scannedUser == null){
      this.setState({
        errorMessage: 'Invalid Accessed!'
      })
      return
    }
    if(addFlag == 'temperature'){
      if(this.state.value == null || this.state.value > 100){
        this.setState({
          errorMessage: 'Invalid Temperature!'
        })
        return
      }
      let location ={
        id:this.props.state.scannedUser,
        account_id:user.id,
        temperature_id:null,
        longitude:this.state.templocation.longitude,
        latitude:this.state.templocation.latitude,
        route:this.state.templocation.route,
        locality:this.state.templocation.locality,
        country:this.state.templocation.country,
        region:this.state.templocation.region,
        created_at:null,
        updated_at:null,
        deleted_at:null     
      }
      let parameter = {
        temperature_location:location,
        account_id: scannedUser.id,
        added_by: user.id,
        value: this.state.value,
        remarks: this.state.remarks ? this.state.remarks : null
        
      }
      this.setState({isLoading: true})
      console.log(this.state.templocation)
      Api.request(Routes.temperaturesCreate, parameter, response => {
        console.log(response.data)
        this.setState({
          isLoading: false,
          addFlag: null,
          activePage: 'places',
          value: null,
          remarks: null,
          errorMessage: null,
          showConfirmation: false
        })
      }, error => {
        console.log(error)
      });
    }else if(addFlag == 'patient'){
      let parameter = {
        temperature_location: null,
        account_id: scannedUser.id,
        added_by: user.id,
        status: this.state.patientStatus,
      }
      this.setState({isLoading: true})
      Api.request(Routes.patientsCreate, parameter, response => {
        console.log(response)
        this.setState({
          isLoading: false,
          addFlag: null,
          activePage: 'places',
          value: null,
          remarks: null,
          errorMessage: null,
          showConfirmation: false
        })
      }, error => {
        console.log(error)
      });
    }else if(addFlag == 'ride'){
     let parameter = {
        account_id: user.id,
        owner: scannedUser.id,
        payload: 'qr'
      }
      this.setState({isLoading: true})
      Api.request(Routes.ridesCreate, parameter, response => {
        console.log(response)
        this.setState({
          isLoading: false,
          addFlag: null,
          activePage: 'places',
          value: null,
          remarks: null,
          errorMessage: null,
          showConfirmation: false
        })
      }, error => {
        console.log(error)
      }); 
    }
  }
  _newPatient = () => {
    const patientStatus = Helper.patientStatus.map((item, index) => {
      return {
        label: item.title,
        value: item.value
      };
    })
    return (
      <View>
        <View style={{
            marginTop: 10
          }}>
            <Text>Select Status</Text>
            {
              Platform.OS == 'android' && (
                <Picker selectedValue={this.state.patientStatus}
                onValueChange={(patientStatus) => this.setState({patientStatus})}
                style={BasicStyles.pickerStyleCreate}
                >
                  {
                    Helper.patientStatus.map((item, index) => {
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
                  onValueChange={(patientStatus) => this.setState({patientStatus})}
                  items={patientStatus}
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
        </View>
    );
  }

  _newTemperature = () => {
    return (
      <View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Temperature</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(value) => this.setState({value})}
            value={this.state.value}
            keyboardType={'numeric'}
            placeholder={'E.q. 35.00'}
          />
        </View>

        <View>
          <Text style={{
            paddingTop: 10
          }}>Remarks(Optional)</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(remarks) => this.setState({remarks})}
            value={this.state.remarks}
            multiline={true}
            placeholder={'Type Remarks'}
          />
        </View>
          <View style={{
          position: 'relative',
          backgroundColor: Color.white,
          zIndex: 2
        }}>
          <Text style={{
            paddingTop: 10
          }}>Location</Text>
          <GooglePlacesAutoComplete 
            onFinish={(location) => this.manageLocation(location)}
            placeholder={'Start typing location'}
            onChange={() => {}}
          />
        </View>

      
      </View>
    );
  }
  _agentOption = () => {
    const { user, scannedUser } = this.props.state;
    return (
      <View>
       
          <View style={{
            flexDirection: 'row'
          }}>
          {
            scannedUser.transportation != null && (
              <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '32%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 20
              }}
              onPress={() => {this.addRide()}}
              underlayColor={Color.gray}
                >
                <Text style={{
                  color: Color.white,
                  textAlign: 'center',
                }}>Add Ride</Text>
              </TouchableHighlight>
            )
          }
          {
            (user.account_type == 'AGENCY' || user.account_type == 'AGENCY_LEVEL_1' || user.account_type == 'ADMIN') && (
              <TouchableHighlight style={{
                  height: 50,
                  backgroundColor: Color.primary,
                  width: '32%',
                  marginBottom: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginTop: 20,
                  marginLeft: '1%'
                }}
                onPress={() => {this.setState({
                  addFlag: 'temperature'
                })}}
                underlayColor={Color.gray}
                  >
                <Text style={{
                  color: Color.white,
                  textAlign: 'center',
                }}>Add Temperature</Text>
              </TouchableHighlight>
            )
          }
            {
              (user.account_type == 'AGENCY_LEVEL_1' || user.account_type == 'ADMIN') && (
                <TouchableHighlight style={{
                    height: 50,
                    backgroundColor: Color.primary,
                    width: '32%',
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginTop: 20,
                    marginLeft: '1%'
                  }}
                  onPress={() => {this.setState({
                    addFlag: 'patient'
                  })}}
                  underlayColor={Color.gray}
                    >
                  <Text style={{
                    color: Color.white,
                    textAlign: 'center',
                  }}>Add Patient</Text>
                </TouchableHighlight>

              )
            }
          </View>
        {
          this.state.errorMessage != null && (
            <View>
              <Text style={{
                color: Color.danger,
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: 'center'
              }}>{this.state.errorMessage}</Text>
            </View>
          )
        }
        {
          this.state.addFlag == 'temperature' && (this._newTemperature())
        }

        {
          this.state.addFlag == 'patient' && (this._newPatient())
        }
        {
          (this.state.addFlag != null && this.state.addFlag != 'ride') && (
            <View>
              <View>
                <TouchableHighlight style={{
                      height: 50,
                      backgroundColor: Color.primary,
                      width: '100%',
                      marginBottom: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5
                    }}
                    onPress={() => {this.validate()}}
                    underlayColor={Color.gray}
                      >
                    <Text style={{
                      color: Color.white,
                      textAlign: 'center',
                    }}>Submit</Text>
                </TouchableHighlight>
              </View>
              <View>
                <TouchableHighlight style={{
                      height: 50,
                      backgroundColor: Color.danger,
                      width: '100%',
                      marginBottom: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5
                    }}
                    onPress={() => {this.setState({
                      addFlag: null
                    })}}
                    underlayColor={Color.gray}
                      >
                    <Text style={{
                      color: Color.white,
                      textAlign: 'center',
                    }}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          )
        }
      </View>

    );
  }

  _userHistory = () => {
    const { user } = this.props.state;
    return (
      <View>
        <View style={{
          flexDirection: 'row'
        }}>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: this.state.activePage == 'places' ? 'green' : Color.gray,
                width: '32%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 20
              }}
              onPress={() => {this.setState({
                activePage: 'places'
              })}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Places</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: this.state.activePage == 'rides' ? 'green' : Color.gray,
                width: '32%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 20,
                marginLeft: '1%'
              }}
              onPress={() => {this.setState({
                activePage: 'rides'
              })}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Rides</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: this.state.activePage == 'temperatures' ? 'green' : Color.gray,
                width: '32%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 20,
                marginLeft: '1%'
              }}
              onPress={() => {this.setState({
                activePage: 'temperatures'
              })}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Temperature</Text>
          </TouchableHighlight>
        </View>
      </View>
    ); 
  }

  _places = () => {
    return(
      <View>
        <ScannedUserPlaces />
      </View>
    );
  }

  _rides = () => {
    return(
      <View>
        <ScannedUserRides />
      </View>
    );
  }

  _temperatures = () => {
    return(
      <View>
        <ScannedUserTemperatures />
      </View>
    );
  }

  _userInfo = (scannedUser) => {
    return (
      <View>
        <View>
          <Text style={{
            fontWeight: 'bold'
          }}>User Information</Text>
        </View>
        <View style={{
          alignItems: 'center'
        }}>
        {
          scannedUser.profile != null && scannedUser.profile.url != null && (
            <Image
              source={{uri: Config.BACKEND_URL  + scannedUser.profile.url}}
              style={150}/>
          )
        }
        {
          (scannedUser.profile == null || (scannedUser.profile != null && scannedUser.profile.url == null)) && (
            <FontAwesomeIcon
              icon={faUserCircle}
              size={150}
              style={{
                color: this.props.color ? this.props.color : Color.primary
              }}
            />
          )
        }
        </View>
        <View style={{
          alignItems: 'center'
        }}>
          {
            (scannedUser.account_information.first_name != null && scannedUser.account_information.last_name != null) && (
              <Text style={{
                fontWeight: 'bold'
              }}>
                {
                  scannedUser.account_information.first_name + ' ' + scannedUser.account_information.last_name
                }
              </Text>
            )
          }
          {
            (scannedUser.account_information.first_name == null || scannedUser.account_information.last_name == null) && (
              <Text style={{
                fontWeight: 'bold'
              }}>
                {
                  scannedUser.username
                }
              </Text>
            )
          }
          {
            scannedUser.transportation != null && (
              <Text style={{
                fontWeight: 'bold'
              }}>
              {
                scannedUser.transportation.type.toUpperCase() + '(' + scannedUser.transportation.model.toUpperCase() + ':' + scannedUser.transportation.number.toUpperCase() + ')'
              }
            </Text>
            )
          }
        </View>
      </View>
    );
  }

  render() {
    const { user, scannedUser } = this.props.state;
    const { isLoading} = this.state;
    return (
      <ScrollView
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
          }
        }}
        >
        {isLoading ? <Spinner mode="overlay"/> : null }
        {
          scannedUser == null && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text style={{
                color: Color.danger
              }}>Invalid Accessed!</Text>
            </View>
          )
        }
        {
          scannedUser != null && (this._agentOption())
        }
        {
          scannedUser !== null && (this._userInfo(scannedUser))
        }
        {
          scannedUser !== null && (this._userHistory())
        }
        {
          this.state.activePage == 'places' && (
            this._places()
          )
        }
        {
          this.state.activePage == 'rides' && (
            this._rides()
          )
        }
        {
          this.state.activePage == 'temperatures' && (
            this._temperatures()
          )
        }
        {
          this.state.showConfirmation && (
            <Confirmation
              visible={this.state.showConfirmation}
              onCancel={() => this.onCancel()}
              onContinue={() =>this.onContinue()}
            />
          )
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
)(ScannedUser);
