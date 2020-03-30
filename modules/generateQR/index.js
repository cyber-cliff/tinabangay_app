import React, { Component } from 'react';
import { View,StyleSheet,AppRegistry} from 'react-native';
import { Routes} from 'common';
import QRCode from 'react-native-qrcode-svg';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';

class GenerateQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isModalVisible: false,
      valueForQRCode: '',
      isLoading: false,
      firstName: null,
      middleName: null,
      scannedId:null,
      lastName: null,
      sex: null,
      cellularNumber: null,
      address: null,
      birthDate: new Date(),
      qr:"",
      errorMessage: null,

    };
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

  render() {
    

    return (
      <View style={styles.MainContainer}>
    <QRCode
          value={this.state.valueForQRCode ? this.state.valueForQRCode : this.props.state.user.username}
          size={250}
          color="black"
          backgroundColor="white"
        />
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
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
}
});

AppRegistry.registerComponent('default', () => GenerateQR);
