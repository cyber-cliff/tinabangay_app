import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, TouchableOpacity, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
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
const steps = [{
  title: '1',
  description: 'Personal Information'
}, {
  title: '2',
  description: 'Travel History'
}, {
  title: '3',
  description: 'Symptoms'
}, {
  title: '4',
  description: 'Healthy and Safety - Related Questions'
}]
const symptoms = [{
  question: 'Fever',
  answer: 'no'
}, {
  question: 'Headache',
  answer: 'no'
}, {
  question: 'Sore Throat',
  answer: 'no'
}, {
  question: 'Cough',
  answer: 'no'
}, {
  question: 'Difficulty of Breathing',
  answer: 'no'
}, {
  question: 'Body Weakness',
  answer: 'no'
}, {
  question: 'Unexplained Bruising or Bleeding',
  answer: 'no'
}, {
  question: 'Severe Diarrhea',
  answer: 'no'
}]
const safetyRelated = [{
  question: 'Did you visit any hospital, clinic, or nursing home in the past fourteen (14) days?',
  answer: null
}, {
  question: 'Have you been in contact with a suspected or confirmed SARS – COV (COVID-19) patient for the past fourteen (14) days?',
  answer: null
}, {
  question: 'Do you have any household member/s, or close friend/s who have met a person currently having fever, cough and/or respiratory problems?',
  answer: null
}]
class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      step: 2,
      personalInformation: {
        first_name: null,
        middle_name: null,
        last_name: null,
        email: null,
        gender: null,
        birth_date: null,
        occupation: null,
        contact_number: null,
        address: null
      },
      safetyRelatedQuestions: safetyRelated,
      symptomsQuestions: symptoms,
      others: {
        question: null,
        answer: 'no'
      }
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
      console.log('merchant', response.data[0])
      this.setState({isLoading: false, data: response.data[0]})
    });
  }

  validate = () => {
    const { user } = this.props.state;
    console.log('personalInformation', this.state.personalInformation)
    this.setState({
      step: this.state.step + 1
    })
  }

  submit(){

  }

  updateSafety(indexParam, flag){
    let updated = this.state.safetyRelatedQuestions.map((item, index) => {
      if(index == indexParam){
        return {
          question: item.question,
          answer: flag
        }
      }else{
        return item
      }
    })
    this.setState({
      safetyRelatedQuestions: updated
    })
  }

  updateSymptoms(indexParam, flag){
    let updated = this.state.symptomsQuestions.map((item, index) => {
      if(index == indexParam){
        return {
          question: item.question,
          answer: flag
        }
      }else{
        return item
      }
    })
    this.setState({
      symptomsQuestions: updated
    })
  }

  _step3 = () => {
    const { safetyRelatedQuestions } = this.state;
    return (
      <View>

        {
          safetyRelatedQuestions.map((item, index) => {
            return(
              <View style={{
              }}>
                <Text style={{
                  paddingBottom: 10,
                  paddingTop: 10
                }}>{item.question}</Text>

                <View style={{
                  flexDirection: 'row'
                }}>
                  <TouchableHighlight style={{
                    height: 50,
                    backgroundColor: item.answer == 'no' ? Color.primary : Color.gray,
                    width: '49%',
                    marginRight: '1%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.updateSafety(index, 'no')
                  }}
                  underlayColor={Color.gray}
                    >
                      <Text style={{
                        color: Color.white,
                        textAlign: 'center',
                      }}>No</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={{
                    height: 50,
                    backgroundColor: item.answer == 'yes' ? Color.primary : Color.gray,
                    width: '49%',
                    marginLeft: '1%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.updateSafety(index, 'yes')
                  }}
                  underlayColor={Color.gray}
                    >
                      <Text style={{
                        color: Color.white,
                        textAlign: 'center',
                      }}>Yes</Text>
                  </TouchableHighlight>
                </View>
              </View>
            )
          })
        }
        <View style={{
          marginBottom: 10,
          marginTop: 20
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
                this.submit()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

 _step2 = () => {
    const { symptomsQuestions } = this.state;
    return (
      <View>
        <View>
          <Text style={{
            textAlign: 'justify'
          }}>
          PLEASE CHECK IF YOU HAVE ANY OF THE FOLLOWING AT PRESENT OR DURING THE PAST FOURTEEN (14) DAYS:
          </Text>
        </View>
        {
          symptomsQuestions.map((item, index) => {
            return(
              <View style={{
                flexDirection: 'row',
                marginTop: 15,
                marginBottom: 15
              }}>
                  <TouchableOpacity style={{
                    height: 30,
                    backgroundColor: item.answer == 'yes' ? Color.primary : Color.gray,
                    width: 30,
                    marginRight: '1%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.updateSymptoms(index, (item.answer == 'no' ? 'yes' : 'no'))
                  }}
                  underlayColor={Color.gray}
                    >
                  </TouchableOpacity>

                  <Text style={{
                    width: '90%',
                    lineHeight: 30,
                    paddingLeft: 10
                  }}>
                  {item.question}
                  </Text>
              </View>
            )
          })
        }

        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          marginBottom: 15
        }}>
            <TouchableOpacity style={{
              height: 30,
              backgroundColor: this.state.others.answer == 'yes' ? Color.primary : Color.gray,
              width: 30,
              marginRight: '1%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {
              this.setState({
                others: {
                  ...this.state.others,
                  answer: this.state.others.answer == 'yes' ? 'no' : 'yes'
                }
              })
            }}
            underlayColor={Color.gray}
              >
            </TouchableOpacity>

            <Text style={{
              width: '90%',
              lineHeight: 30,
              paddingLeft: 10
            }}>
            Others(Specify)
            </Text>
        </View>
        <View>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(question) => this.setState({
              others: {
                ...this.state.others,
                question: question
              }
            })}
            value={this.state.others.question}
            placeholder={'Type symptoms here'}
          />
        </View>

        <View style={{
          marginBottom: 10,
          marginTop: 10
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

 
  _step1 = () => {
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
        <View style={{
          marginBottom: 10
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

  _step0 = () => {
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
            onChangeText={(firstName) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                first_name: firstName
              }
            })}
            value={this.state.personalInformation.first_name}
            placeholder={'Enter first name'}
          />
        </View>
        <View>
          <Text style={{
          }}>Middle Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(middleName) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                middle_name: middleName
              }
            })}
            value={this.state.personalInformation.middle_name}
            placeholder={'Enter middle name'}
          />
        </View>
        <View>
          <Text style={{
          }}>Last Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(lastName) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                last_name: lastName
              }
            })}
            value={this.state.personalInformation.last_name}
            placeholder={'Enter last name'}
          />
        </View>

        <View>
          <Text style={{
          }}>E-mail address</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(email) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                email
              }
            })}
            value={this.state.personalInformation.email}
            placeholder={'Enter e-mail address'}
          />
        </View>
        <View style={{
        }}>
          <Text>Gender</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.sex}
                onValueChange={(sex) => this.setState({
                  personalInformation: {
                    ...this.state.personalInformation,
                    gender: sex
                  }
                })}
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
                onValueChange={(sex) => this.setState({
                  personalInformation: {
                    ...this.state.personalInformation,
                    gender: sex
                  }
                })}
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
                personalInformation: {
                  ...this.state.personalInformation,
                  birth_date: date.date
                }
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
            onChangeText={(contact) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                contact_number: contact
              }
            })}
            value={this.state.personalInformation.contact_number}
            placeholder={'Enter contact number'}
          />
        </View>
        <View>
          <Text style={{
          }}>Address</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(address) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                address
              }
            })}
            value={this.state.personalInformation.address}
            placeholder={'Enter address'}
          />
        </View>
        <View style={{
          marginBottom: 10
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
    const { isLoading, data, step } = this.state;
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
                width: '100%',
                alignItems: 'center'
               }}>
               {
                  data != null && data.merchant != null && data.merchant.logo != null && (
                    <Image
                      source={{uri: Config.BACKEND_URL  + data.merchant.logo}}
                      style={[BasicStyles.profileImageSize, {
                        height: 100,
                        width: 100,
                        borderRadius: 50
                      }]}/>
                  )
                }
                {
                  (data != null && data.merchant != null && data.merchant.logo == null) && (
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
                  (data != null && data.merchant != null) && (
                    <Text style={{
                      fontWeight: 'bold',
                      paddingTop: 10,
                      paddingBottom: 10,
                      color: Color.primary
                    }}>{data.merchant.name}</Text>
                  )
                }
                <Text  style={{
                  textAlign: 'justify',
                  paddingBottom: 10
                }}>
                  Hi {user.username}! IMPORTANT REMINDER: Kindly complete this health declaration form honestly. Failure to answer or giving false information is punishable in accordance with Philippine laws.
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>

                  {
                    steps.map((item, index) => {
                      return(
                      <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        backgroundColor: index == this.state.step ? Color.primary : Color.gray,
                        marginRight: 5
                      }}>
                        <Text style={{
                          color: Color.white,
                          textAlign: 'center'
                        }}>{item.title}</Text>
                      </View>
                    )})  
                  }
                </View>
                <View>
                  <Text style={{
                    fontWeight: 'bold',
                    paddingTop: 10,
                    paddingBottom: 10
                  }}>
                    {steps[this.state.step].description.toUpperCase()}
                  </Text>
                </View>
              </View>
            )
          }
          { step == 0 && (this._step0())}
          { step == 1 && (this._step1())}
          { step == 2 && (this._step2())}
          { step == 3 && (this._step3())}

          {
            data != null && data.merchant != null && (
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
