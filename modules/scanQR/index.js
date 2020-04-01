import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker,StyleSheet,TouchableOpacity,Linking,AppRegistry} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner,GooglePlacesAutoComplete} from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle ,faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Button from "react-native-button";
import { Formik } from 'formik'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as yup from 'yup'
import Modal from 'react-native-modal';
var screen = Dimensions.get("window");

class ScanQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isModalVisible: false,
      // Default Value of the TextInput
      valueForQRCode: '',
      // Default value for the QR Code
      isLoading: false,
      firstName: null,
      middleName: null,
      scannedId:'',
      lastName: null,
      sex: null,
      cellularNumber: null,
      address: null,
      birthDate: new Date(),
      changeTemperature:"",
      userStatus:"",
      newPlaceFlag: false,
      showDatePicker: false,
      dateLabel: null,
      dateFlag: false,
      date: new Date(),
      showTimePicker: false,
      timeLabel: null,
      timeFlag: false,
      time: new Date(),
      location: null, 
      selected: null,
      errorMessage: null,
      displayScan:false,
      data:null,
      dataTemp:null,
      dataLoc:null,
      dataRide:[],

    };
  }

  componentDidMount(){
    this.retrieve() 
  }

  
  retrieveLoc = () => {
    const { user } = this.props.state;
    console.log(this.state.scannedId)
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: this.state.scannedId,
        clause: '=',
        column: 'account_id'
      }],
      sort: {
        route: 'asc'
      }
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false,
      showTimePicker: false
    })
    Api.request(Routes.visitedPlacesRetrieve, parameter, response => {
      console.log(response.data)
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({dataLoc: response.data})
      }else{
        this.setState({dataLoc: null})
      }
    });
  }

 
  

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
//====================================From Places for Google Auto Complete====================//
manageLocation = (location) => {
  this.setState({
    location: location
  })
}

submit = () => {
  const { user, location } = this.props.state;
  const { date, time } = this.state;
  if(user == null){
    this.setState({errorMessage: 'Invalid Account.'})
    return
  }
  if(location == null || (location != null && location.route)){
    this.setState({errorMessage: 'Location is required.'})
    return
  }
  if(date == null){
    this.setState({errorMessage: 'Date is required.'})
    return
  }
  if(time == null){
    this.setState({errorMessage: 'Time is required.'})
    return
  }
  this.setState({errorMessage: null})
  let parameter = {
    account_id: user.id,
    longitude: location.longitude,
    latitude: location.latitude,
    route: location.route,
    region: location.region,
    country: location.country,
    date: date,
    time: time
  }
  Api.request(Routes.visitedPlacesCreate, parameter, response => {
    this.setState({isLoading: false})
    console.log(response)
    if(response.data > 0){
      this.setState({
        newPlaceFlag: false,
        timeFlag: false,
        showTimePicker: false,
        time: new Date(),
        timeLabel: null,
        showDatePicker: false,
        dateFlag: false,
        date: new Date(),
        dateLabel: null
      })
      this.retrieve()
    }
  },error => {
    this.setState({isResponseError: true})
    });
  // this.setState({newPlaceFlag: false})
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
      <View style={{
        marginTop: 20
      }}>
        <TouchableHighlight style={{
              height: 50,
              backgroundColor: Color.warning,
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
              backgroundColor: Color.warning,
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
      <View style={{
        position: 'relative',
        backgroundColor: Color.white,
        zIndex: 2
      }}>
        <GooglePlacesAutoComplete 
          onFinish={(location) => this.manageLocation(location)}
          placeholder={'Start typing location'}
        />
      </View>

      <View style={{
        position: 'relative',
        zIndex: 0
      }}>
        <TouchableHighlight style={{
              height: 50,
              backgroundColor: Color.primary,
              width: '100%',
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {this.submit()}}
            underlayColor={Color.gray}
              >
            <Text style={{
              color: Color.white,
              textAlign: 'center',
            }}>Submit</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

_data = () => {
  const { dataTemp, selected } = this.state;
  return (
    
      <FlatList
        data={dataTemp}
        extraData={selected}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        renderItem={({ item, index }) => (
          <View style={{
            borderRadius: 5,
            borderColor: Color.gray,
            borderWidth: 1
          }}>
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
 
  );
}

_places = () => {
  const { dataLoc, selected } = this.state;
  return (
    <View style={{
      backgroundColor: Color.white,
      position: 'relative',
      zIndex: -1
    }}>
      
      <FlatList
        data={dataLoc}
        extraData={selected}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        renderItem={({ item, index }) => (
          <View style={{
            borderRadius: 5,
            marginBottom: 10,
            borderColor: Color.gray,
            borderWidth: 1,
            position: 'relative',
            zIndex: -1
          }}>
            <TouchableHighlight
              onPress={() => {console.log('hello list')}}
              underlayColor={Color.gray}
              >
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
                    {item.date_human + ':' + item.time + ' - ' + item.route}
                  </Text>
                </View>
                <Text
                  style={[BasicStyles.normalText, {
                    color: Color.darkGray
                  }]}>
                  {item.locality + ',' + item.country}
                </Text>
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
                        There was a PUI in this area.
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
                        There was a COVID Positve in this area.
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
                        There was a PUM in this area.
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
                        There was a PUI in this area.
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
                        The Area was clear
                      </Text>
                    </View>
                  )
                }

                
              </View>
            </TouchableHighlight>
      
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
          

            <View style={{
                
                alignItems: 'center',
                justifyContent: 'center',

              }}>
                
                <TouchableOpacity style={{
                   height: 50,
                   backgroundColor: Color.primary,
                   width: '80%',
                   marginBottom: 20,
                   alignItems: 'center',
                   justifyContent: 'center',
                    borderRadius: 5,
                    }}
                
                    onPress={() => {this.setState({displayScan: true})}}>
                    <Text style={styles.buttonText}>
                    Scan User
                     </Text>

                </TouchableOpacity> 
                       
              </View>

    </View>
  );
}

//=================================================================================//
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


  onRead=e=>{
    this.setState({qr:e.data});
    let parameter = {
      condition: [{
        value: e.data,
        clause: '=',
        column: 'username'
      }]
    }
    Api.request(Routes.accountRetrieve, parameter, response => {
      if(response.data.length > 0){
          console.log(response)
          this.setState({scannedId:response.data[0].id})
          this.retrieveLoc(response.data[0].id)
          this.retrieveTemp(response.data[0].id)
          
      }
    }, error => {
      this.setState({isResponseError: true})
    })
    

    console.log(this.state.scannedId)
    
    this.setState({isModalVisible:true})
    console.log("Not User!")
  }

  retrieveRide = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: this.state.scannedId,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false,
      showTimePicker: false
    })
    Api.request(Routes.ridesRetrieve, parameter, response => {
      console.log(response.data)
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({dataRide: response.data})
      }else{
        this.setState({dataRide: null})
      }
    }, error => {
      this.setState({isLoading: false})
      console.log(error)
    });
  }
  onReadUserType=e=>{
   this.setState({qr:e.data});
    let parameter = {
      condition: [{
        value: e.data,
        clause: '=',
        column: 'username'
      }]
    }
    Api.request(Routes.accountRetrieve, parameter, response => {
      if(response.data.length > 0){
          console.log(response)
          this.setState({scannedId:response.data[0].id})
          this.retrieveRide()
          
      }
    }, error => {
      this.setState({isResponseError: true})
    })
    

    console.log(this.state.scannedId)
    
    this.setState({isModalVisible:true})
    console.log("User!")
  }

  _dataRide = () => {
    const { dataRide, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        position: 'relative',
        zIndex: -1
      }}>
        <FlatList
          data={dataRide}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              marginBottom: 10,
              borderColor: Color.gray,
              borderWidth: 1,
              position: 'relative',
              zIndex: -1
            }}>
              <TouchableHighlight
                onPress={() => {console.log('hello list')}}
                underlayColor={Color.gray}
                >
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
                      {item.code ? item.code: ''} {item.type}
                    </Text>
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      paddingTop: 10,
                      color: Color.darkGray
                    }]}>
                    {item.from} - {item.to}
                  </Text>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: Color.darkGray
                    }]}>
                    {item.from_date_human} - {item.to_date_human}
                  </Text>
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
                          There was a death in this route.
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
                          There was a COVID Positve in this route.
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
                          There was a PUM in this route.
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
                          There was a PUI in this route.
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
                          This route is clear.
                        </Text>
                      </View>
                    )
                  }

                  
                </View>
              </TouchableHighlight>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  changeTemp=(values)=>{
    console.log(this.state.scannedId)
    const { user } = this.props.state;
    // console.log("Button Press!!!");
//=======================This is for change temperature on Agent===================================//
    let parameter = {
      account_id: this.state.scannedId, // account id of the user
      added_by:user.id, // account id of the agent
      remarks:"test",
      value: values.changeTemperature, // float temperature readings
      }
      Api.request(Routes.temperaturesCreate, parameter, response => {
      console.log(response)
      }, error => {
      this.setState({isResponseError: true})
      })
//====================================================================================//
let parameter2 = {
  account_id: this.state.scannedId, // account id of the user
  added_by: user.id, // account id of the agent
  value: values.changeTemperature, // float temperature readings
  status: this.state.userStatus
  }
{this.user.account_type==="AGENCY_LEVEL_1" || this.user.account_type==="ADMIN" ? 
// //====================This is change Status and Temp on Agent & Admin====================================//

     null:  Api.request(Routes.patientsCreate, parameter2, response => {
      console.log(response)
      }, error => {
      this.setState({isResponseError: true})
      }) 
    }

//====================================================================================//
      this.setState({isModalVisible:false})
      this.scanner.reactivate()
  }

  retrieveTemp = (data) => {
    const { user } = this.props.state;
    console.log(this.state.scannedId)
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: this.state.scannedId,
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
        this.setState({dataTemp: response.data})
      }else{
        this.setState({dataTemp: null})
      }
    });
  }

_TempStatusInput=()=>
{
  const { isLoading, newPlaceFlag, data } = this.state;
  return(   
  <Formik initialValues={{changeTemperature:''}}   onSubmit={values=>{
    this.changeTemp(values);
  }}
  validationSchema={
    yup.object().shape({
        changeTemperature: yup
        .string()
        .matches( /^\d/,'Only Numerical Values Allowed')
        .required('Please Input Users Temperature')
        .trim('Input does not allow Spaces'),
          })
    }>
  
  {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
<View>
  <Text
    style={{
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 15
    }}
  >
    INPUT USER TEMPERATURE
  </Text>
  <TextInput
  placeholder="Input Temperature"
  style={styles.destinationInput}
  value={values.changeTemperature}
  onChangeText={handleChange('changeTemperature')}
  onBlur={() => setFieldTouched('changeTemperature')}
  
/> 
{touched.changeTemperature && errors.changeTemperature &&
                            <Text style={{ fontSize: 15, color: 'red' }}>{errors.changeTemperature}</Text>
                        }

{this.props.state.user.account_type==="AGENCY_LEVEL_1" || this.props.state.user.account_type==="ADMIN" ?  
<View>
 <RNPickerSelect
    onValueChange={value => {
      this.setState({
          userStatus: value           
       });
    }}
    value={this.state.userStatus}
    items={[
        { label: 'Death', value: 'death' },
        { label: 'Positive', value: 'positive' },
        { label: 'PUI', value: 'pui' },
        { label: 'PUM', value: 'pum' },
        { label: 'Negative', value: 'negative' },
     
    ]}
/>

<View style={{
                
                alignItems: 'center',
                justifyContent: 'center',

              }}>
                
<TouchableOpacity style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}
                            disabled={(!isValid) || (!this.state.userStatus)}
                            onPress={handleSubmit}>
                            <Text style={styles.buttonText}>
                                Update User Temperature
                    </Text>

                        </TouchableOpacity> 
                       
              </View> 
              </View> : 
              <View style={{
                
                alignItems: 'center',
                justifyContent: 'center',

              }}>
                <TouchableOpacity style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}
                            disabled={(!isValid)}
                            onPress={handleSubmit}>
                            <Text style={styles.buttonText}>
                                Update User Temperature
                    </Text>

                        </TouchableOpacity> 
                        </View> }
 

</View>
  )}
</Formik>
  )
}


_toggleDisplay=()=>{
  this.setState({displayScan:true});
}


_modal=()=>{
  return (
  <View >
    <Modal isVisible={this.props.visible} 
    style={{
      padding: 0,
      margin: 0,
      position: 'relative'
    }}>
      {this._qrdisplay()}
      <View style={{
        width: 200,
        position: 'absolute',
        top: 10,
        right: 10
      }}>
        <TouchableOpacity
              onPress={() => this.props.close()} 
              style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                borderRadius: 5
              }, {
                width: '25%',
                backgroundColor: Color.danger
              }]}
              >
              <Text style={{
                color: Color.white,
                textAlign: 'center'
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
  )
}

_qrdisplay=()=>{
  

  return (
    <View style={styles.MainContainer}>
    <QRCodeScanner
      ref={(node) => { this.scanner = node }}
      onRead={this.props.state.user.account_type==="USER"? this.onReadUserType : this.onRead}
      reactivateTimeout={8000}
     
    />
    <Text>{this.state.displayScan} </Text>
    <Modal
        isVisible={this.state.isModalVisible}
        style={{
          justifyContent: "center",
          borderRadius: 20,
          shadowRadius: 10,
          width: screen.width - 50,
          backgroundColor: "white",
          zIndex:5,
          position:"relative",
        }}
      >
        <TouchableOpacity
              onPress={() => this.setState({isModalVisible:false})} 
              style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                borderRadius: 5
              }, {
                width: '25%',
                backgroundColor: Color.danger
              }]}
              >
              <Text style={{
                color: Color.white,
                textAlign: 'center'
              }}>Close</Text>
            </TouchableOpacity>
        {this.props.state.user.account_type==="ADMIN"? <View><Text>Admin</Text><Text>{this.props.state.user.username}</Text>{this.state.displayScan ?  
        this._TempStatusInput() : 
        <React.Fragment><Text>User Temperatures:</Text>
        {this._data()
        }<Text>{"\n"}
        {"\n"}User Locations
        </Text>{this._places()}
        </React.Fragment>}
        </View>  :
        this.props.state.user.account_type==="USER"?<View><Text>User</Text>{this._dataRide()}</View> :
        <React.Fragment>
        {this.state.displayScan ?  
        this._TempStatusInput() : 
        <React.Fragment><Text>{"\n"}User Temperatures:</Text>
        {this._data()}
       <Text>{"\n"}
        {"\n"}User Locations
        </Text>{this._places()}
        </React.Fragment>
        }
        </React.Fragment>
        
    }          
      </Modal>
      
    </View>
  );
}

  render() {
    return (
      <View style={styles.container}>
        {this._modal()}
      </View>
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
  
)(ScanQR);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  },
  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F44336',
    marginBottom: 20,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  destinationInput: {
    borderWidth: 0.5,
    borderColor: "grey",
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    backgroundColor: "white"
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
}
});

AppRegistry.registerComponent('default', () => ScanQR);
