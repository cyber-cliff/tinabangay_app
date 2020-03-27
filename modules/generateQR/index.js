import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker,StyleSheet,TouchableOpacity,Linking,AppRegistry} from 'react-native';
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
import QRCode from 'react-native-qrcode-svg';
import { RNCamera as Camera } from "react-native-camera";
import QRCodeScanner from 'react-native-qrcode-scanner';
import Button from "react-native-button";
 import Modal from 'react-native-modal';
var screen = Dimensions.get("window");
const width = Math.round(Dimensions.get('window').width);

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

class GenerateQR extends Component {
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
      lastName: null,
      sex: null,
      cellularNumber: null,
      address: null,
      birthDate: new Date(),
      qr:"",
      changeTemperature:"",
    };
  }

  componentDidMount(){
    this.retrieve()
  }

  

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onRead=e=>{
    this.setState({qr:e.data})
    this._toggleModal();
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

  
  reloadProfile = () => {
    const { user, token } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'id'
      }]
    }
    this.setState({isLoading: true})
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({isLoading: false})
      const { updateUser } = this.props;
      updateUser(response.data[0])
    });
  }

  getTextInputValue = () => {
    const { user } = this.props.state;
    // Function to get the value from input
    // and Setting the value to the QRCode
    this.setState({ valueForQRCode: user.username});
  };
  render() {
    
    return (
      <View style={styles.MainContainer}>
    {/* <QRCode
          //QR code value
          value={this.state.valueForQRCode ? this.state.valueForQRCode : this.props.state.user.username}
          //size of QR Code
          size={250}
          //Color of the QR Code (Optional)
          color="black"
          //Background Color of the QR Code (Optional)
          backgroundColor="white"
        /> */}
      <QRCodeScanner
        onRead={this.onRead}
        reactivate="true"
        reactivateTimeout={3000}
      />
      <Text>{this.state.qr} </Text>
      <Modal
          isVisible={this.state.isModalVisible}
          style={{
            justifyContent: "center",
            borderRadius: 20,
            shadowRadius: 10,
            width: screen.width - 50,
            backgroundColor: "white"
          }}
        >
          {this.props.state.user.account_type==="ADMIN"? <View><Text>Admin</Text><Text>{this.props.state.user.username}</Text></View>  :
          this.props.state.user.account_type==="USER"?<View><Text>User</Text><Text>{this.props.state.user.username}</Text></View>:
          <View><Text>Agent</Text><Text>{this.props.state.user.username}</Text>
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
          value={this.state.changeTemperature}
        /> 
         <Button
        style={{ fontSize: 18, color: "white" }}
        containerStyle={{
          padding: 8,
          marginLeft: 70,
          marginRight: 70,
          height: 40,
          borderRadius: 6,
          backgroundColor: "mediumseagreen",
          marginTop: 20
        }}
      >
        <Text style={{ justifyContent: "center", color: "white" }}>Update Temperature</Text>
      </Button>
      </View>
      }
          

        </Modal>
        
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps,
  
)(GenerateQR);

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
  }
});

AppRegistry.registerComponent('default', () => GenerateQR);
