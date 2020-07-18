import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, TouchableOpacity, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload, DateTime } from 'components';
import {NavigationActions} from 'react-navigation';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ViewDetails from 'modules/declaration/ViewDetails.js';
import CheckinEmployee from 'modules/declaration/CheckinEmployee.js';
import Customer from 'modules/declaration/Customer.js';
import CheckoutEmployee from 'modules/declaration/CheckoutEmployee.js';
const height = Math.round(Dimensions.get('window').height);
class Declaration extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      format: null,
      submitted: false
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  _onFinish(){
    this.setState({
      submitted: true
    })
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    // const { setActiveRoute } = this.props;
    // setActiveRoute(route)
  }

  retrieve = () => {
    const { user, declaration, scannedLocation } = this.props.state;
    console.log('declaration', declaration)
    console.log('scannedLocation', scannedLocation)
    if(user === null || declaration == null){
      return
    }

    if(scannedLocation != null && declaration.id == null){
      this.setState({
        isLoading: true, 
        showDatePicker: false
      })

      parameter = {
        condition: [{
          value: scannedLocation.account_id,
          clause: '=',
          column: 'account_id'
        }]
      }
      Api.request(Routes.merchantRetrieve, parameter, response => {
        console.log('merchant', response.data[0])
        this.setState({isLoading: false})
        if(response.data.length > 0){
          let object = {
            ...this.props.state.declaration,
            merchant: response.data[0],
            viewFlag: false
          }
          const { setDeclaration } = this.props;
          setDeclaration(object)
        }
      }, error => {
        console.log('error', error)
      });
      return
    }

    if(declaration.id == null){
      return
    }

    let parameter = {
      condition: [{
        value: declaration.id,
        clause: '=',
        column: 'id'
      }]
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    console.log('parameter', parameter)
    Api.request(Routes.healthDeclarationRetrieve, parameter, response => {
      this.setState({isLoading: false})
      console.log('merchant', response.data[0].merchant)
      if(response.data[0].content != null && response.data[0].content != ''){
        let parse = JSON.parse(response.data[0].content)
        console.log('content', parse)
        // this.setState({
        //   personalInformation: parse.personalInformation,
        //   symptomsQuestions: parse.symptoms,
        //   countries: parse.travelHistory.countries,
        //   localities: parse.travelHistory.localities,
        //   transportation: parse.travelHistory.transportation,
        //   safetyRelatedQuestions: parse.safety_questions,
        //   format: parse.format != undefined && parse.format != null ? parse.format : declaration.format, 
        //   viewFlag: true
        // })
        const { setDeclaration } = this.props;
        let data = {
          ...this.props.state.declaration,
          id: response.data[0].id,
          content: parse,
          viewFlag: response.data[0].updated_at != null ? true : false,
          updated_at: response.data[0].updated_at,
          merchant: response.data[0].merchant,
          format: parse.format != undefined && parse.format != null ? parse.format : declaration.format
        }
        setDeclaration(data)
      }else{
        const { setDeclaration } = this.props;
        setDeclaration({
          ...this.props.state.declaration,
          viewFlag: false
        })
      }
    });
  }


  _footer = (declaration) => {
    return (
      <View>
        {
          (declaration != null && declaration.merchant != null) && (
            <View style={{
              marginBottom: 100
            }}>
              <Text style={{
                fontWeight: 'bold',
                paddingTop: 10,
                paddingBottom: 10
              }}>
                Data Privacy Notice
              </Text>
              <Text style={{
                textAlign: 'justify'
              }}>
                {declaration.merchant.name}, in line with Republic Act 10173 or the Data Privacy Act of 2012, is committed to protect and secure personal information obtained in the performance of its duties. The establishment collects the following personal information relevant in the advancement of protocols and precautionary measures against COVID-19 Acute Respiratory Disease. The collected personal information will be kept/stored and accessed only by authorized personnel and will not be shared with any outside parties unless the disclosure is required by, or in compliance with applicable laws and regulations
              </Text>
              <Text style={{
                fontWeight: 'bold',
                paddingTop: 10,
                paddingBottom: 10
              }}>
                Declaration and Data Privacy Consent Form:
              </Text>
              <Text style={{
                textAlign: 'justify'
              }}>
                I knowingly and voluntarily agree to the terms of this binding Declaration, and in doing so represent the truthfulness and veracity of the above answers. I understand that failure to answer any question or giving false answer can be penalized in accordance with the law. Relative thereto, I voluntarily and freely consent to the processing and collection of personal data only in relation to COVID-19 internal protocols.
              </Text>
            </View>
          )
        }
      </View>
    )
  } 

  _header = (declaration, user) => {
    return (
      <View style={{
        width: '100%',
        alignItems: 'center'
       }}>
       {
          (declaration != null && declaration.merchant != null && declaration.merchant.logo != null) && (
            <Image
              source={{uri: Config.BACKEND_URL  + declaration.merchant.logo}}
              style={[BasicStyles.profileImageSize, {
                height: 100,
                width: 100,
                borderRadius: 50
              }]}/>
          )
        }
        {
          (declaration != null && declaration.merchant != null && declaration.merchant.logo == null) && (
            <FontAwesomeIcon
              icon={faUserCircle}
              size={100}
              style={{
                color: Color.primary
              }}
            />
          )
        }
        {
          (declaration != null && declaration.merchant != null) && (
            <Text style={{
              fontWeight: 'bold',
              paddingTop: 10,
              paddingBottom: 10,
              color: Color.primary
            }}>{declaration.merchant.name}</Text>
          )
        }
        {
          declaration != null && declaration.viewFlag == false && (
            <View>
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                HEALTH DECLARATION FORM ({declaration.format.toUpperCase()})
              </Text>
              <Text  style={{
                textAlign: 'justify',
                paddingBottom: 10
              }}>
                Hi {user.username}! IMPORTANT REMINDER: Kindly complete this health declaration form honestly. Failure to answer or giving false information is punishable in accordance with Philippine laws.
              </Text>
            </View>
          )
        }  

        {
          (declaration != null && declaration.content != undefined && declaration.content.status != undefined && declaration.content.status != null) && (
            <Text style={{
              color: declaration.content.status == 'danger' ? Color.danger : Color.success
            }}>
              {declaration.content.status.toUpperCase() + '[' + declaration.content.statusLabel.toUpperCase() + ']'}
            </Text>
          )
        }
      </View>
    )
  }

  _submitted(){
    return (
      <View style={{
        width: '100%'
      }}>
        <Text style={{
          color: Color.success,
          paddingTop: 100,
          paddingBottom: 20,
          textAlign: 'center'
        }}>
          Successfully submitted.
        </Text>
        <TouchableHighlight style={{
          height: 50,
          backgroundColor: Color.primary,
          width: '100%',
          marginRight: '1%',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={() => {
          this.navigateToScreen('Dashboard')
        }}
        underlayColor={Color.gray}
          >
            <Text style={{
              color: Color.white,
              textAlign: 'center',
            }}>Back to dashboard</Text>
        </TouchableHighlight>
      </View>

    );
  }

  render() {
    const { user, declaration } = this.props.state;
    const { isLoading, data, submitted } = this.state;
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
            (user != null && submitted == false) && (
               this._header(declaration, user)
            )
          }

          {
            (declaration != null && declaration.viewFlag === true) && (
              <ViewDetails />
            )
          }

          {
            (submitted == true) && (this._submitted())
          }

          {
            (declaration != null && declaration.viewFlag === false && declaration.format === 'customer'  && submitted == false) && (
              <Customer onFinish={() => this._onFinish()}/>
            )
          }

          {
            (declaration != null && declaration.viewFlag === false && declaration.format === 'employee_checkin'  && submitted == false) && (
              <CheckinEmployee onFinish={() => this._onFinish()}/>
            )
          }

          {
            (declaration != null && declaration.viewFlag === false && declaration.format === 'employee_checkout'  && submitted == false) && (
              <CheckoutEmployee onFinish={() => this._onFinish()}/>
            )
          }

          {
            (data != null && data.merchant != null && submitted == false) && (
              <View style={{
                marginBottom: 100
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  paddingTop: 10,
                  paddingBottom: 10
                }}>
                  Data Privacy Notice
                </Text>
                <Text style={{
                  textAlign: 'justify'
                }}>
                  {data.merchant.name}, in line with Republic Act 10173 or the Data Privacy Act of 2012, is committed to protect and secure personal information obtained in the performance of its duties. The establishment collects the following personal information relevant in the advancement of protocols and precautionary measures against COVID-19 Acute Respiratory Disease. The collected personal information will be kept/stored and accessed only by authorized personnel and will not be shared with any outside parties unless the disclosure is required by, or in compliance with applicable laws and regulations
                </Text>
                <Text style={{
                  fontWeight: 'bold',
                  paddingTop: 10,
                  paddingBottom: 10
                }}>
                  Declaration and Data Privacy Consent Form:
                </Text>
                <Text style={{
                  textAlign: 'justify'
                }}>
                  I knowingly and voluntarily agree to the terms of this binding Declaration, and in doing so represent the truthfulness and veracity of the above answers. I understand that failure to answer any question or giving false answer can be penalized in accordance with the law. Relative thereto, I voluntarily and freely consent to the processing and collection of personal data only in relation to COVID-19 internal protocols.
                </Text>
              </View>
            )
          }
          {
            (submitted == false) && (this._footer(declaration))
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
    setDeclaration: (declaration) => dispatch(actions.setDeclaration(declaration))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Declaration);
