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
import { faUserCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
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

const stepsEmployeeIn = [{
  title: '1',
  description: 'Personal Information'
}, {
  title: '2',
  description: 'Company Questions'
}, {
  title: '3',
  description: 'Travel History'
}, {
  title: '4',
  description: 'Symptoms'
}, {
  title: '5',
  description: 'Healthy and Safety - Related Questions'
}]

const symptoms = [{
  question: 'Fever (Lagnat)',
  answer: 'no'
}, {
  question: 'Headache (Sakit ng ulo)',
  answer: 'no'
}, {
  question: 'Sore Throat (Namamagang lalamunan)',
  answer: 'no'
}, {
  question: 'Cough (Ubo)',
  answer: 'no'
}, {
  question: 'Difficulty of Breathing (Kahirapan sa paghinga)',
  answer: 'no'
}, {
  question: 'Body Weakness (Paghihina ng katawan)',
  answer: 'no'
}, {
  question: 'Unexplained Bruising or Bleeding (hindi maipaliwanag na mga pasa)',
  answer: 'no'
}, {
  question: 'Severe Diarrhea (Matinding pagtatae)',
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
}, {
  question: 'Have you taken medicines/vitamins/supplements in the past 24 hours? Please indicate specific names.',
  answer: 'null'
}]

const modeOfTransportation = [{
  title: 'PUJ'
}, {
  title: 'Bus'
}, {
  title: 'Tricycle'
}, {
  title: 'Bicycle'
}, {
  title: 'Own Motorcycle'
}, {
  title: 'Grab/Angkas/Habal-Habal'
}, {
  title: 'Taxi'
}, {
  title: 'Private car'
}, {
  title: 'Ng lakaw'
}, {
  title: 'Others'
}]
class Declaration extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      step: 0,
      errorMessage: null,
      personalInformation: {
        first_name: null,
        middle_name: null,
        last_name: null,
        email: null,
        gender: 'male',
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
      },
      countries: [],
      localities: [],
      transportation: [],
      newCountry: null,
      newLocality: null,
      newTransportation: {
        date: null,
        origin: null,
        flight: null,
        seat: null
      },
      viewFlag: null,
      format: null,
      status: null,
      statusLabel: null
    }
  }

  componentDidMount(){
    this.setState({
      fotmat: this.props.state.declaration.format
    })
    this.retrieve()
  }

  retrieve = () => {
    const { user, declaration, scannedLocation } = this.props.state;
    if(user === null || declaration == null){
      return
    }
    if(declaration != null && declaration.id === null){
      if(scannedLocation == null){
        return
      }
      this.setState({
        isLoading: true, 
        showDatePicker: false
      })
      let parameter = {
        condition: [{
          value: scannedLocation.account_id,
          clause: '=',
          column: 'account_id'
        }]
      }
      Api.request(Routes.merchantRetrieve, parameter, response => {
        if(response.data.length > 0){
          let object = {
            merchant: response.data[0]
          }
          this.setState({
            data: object
          })
        }
        this.setState({isLoading: false})
      }, error => {
        console.log('error', error)
      });
      this.setState({
        viewFlag: false
      })
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
    Api.request(Routes.healthDeclarationRetrieve, parameter, response => {
      this.setState({isLoading: false, data: response.data[0]})
      if(response.data[0].content != null && response.data[0].content != ''){
        let parse = JSON.parse(response.data[0].content)
        // console.log('personalInformation', parse.personalInformation)
        // console.log('symptomsQuestions', parse.symptoms)
        // console.log('countries', parse.travelHistory.countries)
        // console.log('localities', parse.travelHistory.localities)
        // console.log('transportation', parse.travelHistory.transportation)
        // console.log('safetyRelatedQuestions', parse.safety_questions)
        this.setState({
          personalInformation: parse.personalInformation,
          symptomsQuestions: parse.symptoms,
          countries: parse.travelHistory.countries,
          localities: parse.travelHistory.localities,
          transportation: parse.travelHistory.transportation,
          safetyRelatedQuestions: parse.safety_questions,
          format: parse.format != undefined && parse.format != null ? parse.format : declaration.format, 
          viewFlag: true
        })
      }else{
        this.setState({
          viewFlag: false
        })
      }
    });
  }

  createNew(content){
    const { user, scannedLocation } = this.props.state;
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    let parameter = {
      owner: scannedLocation.account_id,
      account_id: user.id,
      content: content,
      to: scannedLocation.account_id,
      from: user.id
    }
    parameter.content = JSON.stringify(content)
    Api.request(Routes.healthDeclarationCreate, parameter, response => {
      this.setState({isLoading: false, data: response.data[0]})
    });
  }

  submit(){
    const { data } = this.state;
    const { declaration } = this.props.state;
    if(this.state.step == 3){
      for (var i = 0; i < this.state.safetyRelatedQuestions.length; i++) {
        let item = this.state.safetyRelatedQuestions[i]
        if(item.answer == 'yes'){
          this.setState({
            status: 'danger',
            statusLabel: 'Exposed in safety related questions.'
          })
        }
        if(item.answer == null){
          this.setState({
            errorMessage: 'Please answer each question.'
          })
          return
        }
      }
    }
    if(data === null){
      return
    }
    if(this.state.symptomsQuestions.length > 0){
      this.setState({
        status: 'danger',
        statusLabel: 'With symptoms'
      })
    }
    let content = {
      personalInformation: this.state.personalInformation,
      symptoms: this.state.symptomsQuestions,
      travelHistory: {
        countries: this.state.countries,
        localities: this.state.localities,
        transportation: this.state.transportation
      },
      safety_questions: this.state.safetyRelatedQuestions,
      format: declaration.format,
      status: this.state.status,
      statusLabel: this.state.statusLabel
    }
    if(declaration != null && declaration.id == null){
      this.createNew(content)
      return
    }
    
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    let parameter = data
    parameter.content = JSON.stringify(content)
    Api.request(Routes.healthDeclarationUpdate, parameter, response => {
      this.setState({isLoading: false, data: response.data[0]})
    });
  }

  validate = () => {
    const { user } = this.props.state;
    const { personalInformation } = this.state;
    this.setState({
      errorMessage: null
    })
    if(this.state.step == 0){
      console.log('personalInformation', personalInformation)
      if(personalInformation.first_name == null || personalInformation.middle_name == null || personalInformation.last_name == null
        || personalInformation.birth_date == null || personalInformation.email == null || personalInformation.address == null || personalInformation.contact_number == null
        || personalInformation.occupation == null || personalInformation.gender == null){
        this.setState({
          errorMessage: 'All fields are required.'
        })
        return
      }else if(Helper.validateEmail(personalInformation.email) == false){
        this.setState({
          errorMessage: 'Invalid e-mail address.'
        })
        return
      }
    }
    if(this.state.step == 2){
      let symptoms = this.state.symptomsQuestions;
      if(this.state.others.answer == 'yes' && (this.state.others.question == null || this.state.others.question == '')){
        this.setState({
          errorMessage: 'Others(Specify) is required once selected.'
        })
        return
      }
      if(this.state.others.answer == 'yes' && this.state.others.question != null){
        symptoms.push(this.state.others)
        this.setState({
          symptomsQuestions: symptoms
        })
      }
    }
    this.setState({
      step: this.state.step + 1,
      errorMessage: null
    })
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

  addCountry(){
    if(this.state.newCountry === null || this.state.newCountry === ''){
      return
    }
    let flag = false
    for (var i = 0; i < this.state.countries.length; i++) {
      let item = this.state.countries[i]
      if(item.title.toLowerCase() == this.state.newCountry.toLowerCase()){
        flag = true
        break
      }
    }
    if(flag == false){
      let countries = this.state.countries
      countries.push({
        title: this.state.newCountry
      })
      this.setState({
        countries: countries
      })
    }
    this.setState({
      newCountry: null
    })
  }

  removeCountry(indexParam){
    let countries = this.state.countries.filter((item, index) => {
      if(index != indexParam){
        return item
      }
    })
    this.setState({
      countries: countries
    })
  }

  addLocality(){
    if(this.state.newLocality === null || this.state.newLocality === ''){
      return
    }
    let flag = false
    for (var i = 0; i < this.state.localities.length; i++) {
      let item = this.state.localities[i]
      if(item.title.toLowerCase() == this.state.newLocality.toLowerCase()){
        flag = true
        break
      }
    }
    if(flag == false){
      let localities = this.state.localities
      localities.push({
        title: this.state.newLocality
      })
      this.setState({
        localities: localities
      })
    }
    this.setState({
      newLocality: null
    })
  }

  removeLocality(indexParam){
    let localities = this.state.localities.filter((item, index) => {
      if(index != indexParam){
        return item
      }
    })
    this.setState({
      localities: localities
    })
  }

  addTransportation(){
    if(this.state.newTransportation.date === null || this.state.newTransportation.origin === null || this.state.newTransportation.flight === null
      || this.state.newTransportation.seat == null){
      this.setState({
        errorMessage: 'Transportation fields are required.'
      })
      return
    }
    
    let transportation = this.state.transportation
    transportation.push(this.state.newTransportation)
    this.setState({
      transportation: transportation,
      newTransportation: {
        date: null,
        origin: null,
        flight: null,
        seat: null
      }
    })
  }

  removeTransportation(indexParam){
    let transportation = this.state.transportation.filter((item, index) => {
      if(index != indexParam){
        return item
      }
    })
    this.setState({
      transportation: transportation
    })
  }

  _viewDetails = () => {
    const { data, personalInformation, transportation, countries, localities, symptomsQuestions, safetyRelatedQuestions } = this.state;
    return (
      <View>
        {
          <View>
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: Color.danger
              }}>
                Submitted on {data.updated_at}
              </Text>
          </View>
        }
        {
          personalInformation && (
            <View>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                PERSONAL INFORMATION
              </Text>
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  personalInformation.first_name + ' ' + personalInformation.middle_name + ' ' + personalInformation.last_name + '(' + personalInformation.gender.toUpperCase() + ')'
                }
              </Text>

              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  personalInformation.occupation + ' from ' + personalInformation.address
                }
              </Text>
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'Birth Date: ' + personalInformation.birth_date
                }
              </Text>

              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'E-mail address: ' + personalInformation.email.toLowerCase()
                }
              </Text>

              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'Contact number: ' + personalInformation.contact_number
                }
              </Text>
            </View>
          )
        }
        {
          transportation && transportation.length > 0 && (
            <View style={{
              paddingBottom: 10,
              paddingTop: 10
            }}>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                TRANSPORTATION USED
              </Text>
              {
                transportation.map((item, index) => {
                  return(
                    <View>
                      <Text style={{
                        paddingTop: 10
                      }}>
                        {
                          item.date + ' from ' + item.origin
                        }
                      </Text>
                      <Text>
                        {
                          'Flight #: ' + item.flight + ' / Seat #: ' + item.seat
                        }
                      </Text>
                    </View>
                  )
                })
              }
            </View>
          )
        }

        {
          countries && countries.length > 0 && (
            <View style={{
              paddingBottom: 10,
              paddingTop: 10
            }}>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                VISITED COUNTRIES
              </Text>
              {
                countries.map((item, index) => {
                  return (
                    <Text style={{
                      paddingTop: 10
                    }}>
                      {
                        item.title
                      }
                    </Text> 
                  )
                })
              }
          </View>
        )}


        {
          localities && localities.length > 0 && (
            <View style={{
              paddingBottom: 10,
              paddingTop: 10
            }}>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                VISITED CITIES/MUNICIPALITIES
              </Text>
              {
                localities.map((item, index) => {
                  return (
                    <Text style={{
                      paddingTop: 10
                    }}>
                      {
                        item.title
                      }
                    </Text> 
                  )
                })
              }
          </View>
        )}

        {
          symptomsQuestions && symptomsQuestions.length > 0 && (
            <View style={{
              paddingBottom: 10,
              paddingTop: 10
            }}>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                SYMPTOMS
              </Text>
              {
                symptomsQuestions.map((item, index) => {
                  return (
                    <Text style={{
                      color: item.answer == 'yes' ? Color.danger : Color.black,
                      paddingTop: 10
                    }}>
                      {
                        '[' + item.answer.toUpperCase() + ']' + item.question
                      }
                    </Text> 
                  )
                })
              }
          </View>
        )}


        {
          safetyRelatedQuestions && safetyRelatedQuestions.length > 0 && (
            <View style={{
              paddingBottom: 10,
              paddingTop: 10
            }}>
              <Text style={{
                textAlign: 'justify',
                fontWeight: 'bold'
              }}>
                HEALTH AND SAFETY - RELATED QUESTIONS
              </Text>
              {
                safetyRelatedQuestions.map((item, index) => {
                  return (
                    <Text style={{
                      color: item.answer == 'yes' ? Color.danger : Color.black,
                      paddingTop: 10
                    }}>
                      {
                        '[' + item.answer.toUpperCase() + ']' + item.question
                      }
                    </Text> 
                  )
                })
              }
          </View>
        )}



      </View>
    )
  }

  _step3 = () => {
    const { safetyRelatedQuestions, errorMessage } = this.state;
    return (
      <View>

        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5
            }}>
              <Text style={{
                color: Color.danger
              }}>{errorMessage}</Text>
            </View>
          )
        }

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
              }}>Next</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

 _step2 = () => {
    const { symptomsQuestions, errorMessage } = this.state;
    return (
      <View>


        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5
            }}>
              <Text style={{
                color: Color.danger
              }}>{errorMessage}</Text>
            </View>
          )
        }

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
    const { countries, localities, errorMessage, transportation } = this.state;
    return (
      <View>
        

        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5
            }}>
              <Text style={{
                color: Color.danger
              }}>{errorMessage}</Text>
            </View>
          )
        }


        <View>
          <Text style={{
            textAlign: 'justify',
            fontWeight: 'bold'
          }}>
          Transportation used the past 14 days:
          </Text>
        </View>


        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          {
            transportation.length > 0 && transportation.map((item, index) => {
              return(
                <View style={{
                  flexDirection: 'row',
                  marginBottom: 10
                }}>
                  <View style={{
                    width: '80%',
                    marginRight: '1%'
                  }}>
                    <Text>
                      {
                        item.date + ' from ' + item.origin
                      }
                    </Text>

                    <Text>
                      {
                        'Flight #: ' + item.flight + ' / Seat #: ' + item.seat
                      }
                    </Text>
                  </View>

                  <TouchableOpacity style={{
                      height: 50,
                      backgroundColor: Color.danger,
                      width: '19%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.removeTransportation(index)
                    }}
                    underlayColor={Color.gray}
                      >
                      <FontAwesomeIcon icon={faTrash} style={{
                        color: Color.white
                      }}/>
                  </TouchableOpacity>

                </View>

              )
            })
          }
        </View>


        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
        
        <View>
          <Text style={{
            paddingTop: 10
          }}>Date</Text>
          <DateTime
            type={'date'}
            placeholder={'Select Date'}
            onFinish={(date) => {
              this.setState({
                newTransportation: {
                  ...this.state.newTransportation,
                  date: date.date
                }
              })
            }}
            style={{
              marginTop: 5
            }}
          />
        </View>

          <View style={{
            paddingBottom: 10
          }}>
            <Text>Origin</Text>
            <TextInput
              style={BasicStyles.formControlCreate}
              onChangeText={(origin) => this.setState({
                newTransportation: {
                  ...this.state.newTransportation,
                  origin
                }
              })}
              value={this.state.newTransportation.origin}
              placeholder={'Type port origin here'}
            />
            </View>



            <View style={{
              paddingBottom: 10
            }}>
            <Text>Number #</Text>
            <TextInput
              style={BasicStyles.formControlCreate}
              onChangeText={(flight) => this.setState({
                newTransportation: {
                  ...this.state.newTransportation,
                  flight
                }
              })}
              value={this.state.newTransportation.flight}
              placeholder={'Type flight #, plate number ...'}
            />
            </View>



            <View style={{
              paddingBottom: 10
            }}>
            <Text>Seat #</Text>
            <TextInput
              style={BasicStyles.formControlCreate}
              onChangeText={(seat) => this.setState({
                newTransportation: {
                  ...this.state.newTransportation,
                  seat
                }
              })}
              value={this.state.newTransportation.seat}
              placeholder={'Type seat # here'}
            />
            </View>



            <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.addTransportation()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Add</Text>
          </TouchableHighlight>
        </View>




        <View>
          <Text style={{
            textAlign: 'justify',
            fontWeight: 'bold'
          }}>
          Countries visited for the past fourteen (14) days:
          </Text>
        </View>
        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          {
            countries.length > 0 && countries.map((item, index) => {
              return(
                <View style={{
                  flexDirection: 'row',
                  marginBottom: 10
                }}>
                  <Text style={{
                    width: '80%',
                    marginRight: '1%',
                    lineHeight: 50
                  }}>
                    {
                      item.title
                    }
                  </Text>

                  <TouchableOpacity style={{
                      height: 50,
                      backgroundColor: Color.danger,
                      width: '19%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.removeCountry(index)
                    }}
                    underlayColor={Color.gray}
                      >
                      <FontAwesomeIcon icon={faTrash} style={{
                        color: Color.white
                      }}/>
                  </TouchableOpacity>

                </View>

              )
            })
          }
        </View>

        <View style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 10
        }}>
            <TextInput
              style={[BasicStyles.formControlCreate, {
                width: '80%',
                marginRight: '1%'
              }]}
              onChangeText={(newCountry) => this.setState({
                newCountry
              })}
              value={this.state.newCountry}
              placeholder={'Type country here'}
            />

            <TouchableOpacity style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '19%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.addCountry()
              }}
              underlayColor={Color.gray}
                >
                <FontAwesomeIcon icon={faPlus} style={{
                  color: Color.white
                }} />
            </TouchableOpacity>
        </View>




        <View>
          <Text style={{
            textAlign: 'justify',
            fontWeight: 'bold'
          }}>
          Cities / municipalities in the Philippines visited for the past fourteen (14) days:
          </Text>
        </View>

        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          {
            localities.length > 0 && localities.map((item, index) => {
              return(
                <View style={{
                  flexDirection: 'row',
                  marginBottom: 10
                }}>
                  <Text style={{
                    width: '80%',
                    marginRight: '1%',
                    lineHeight: 50
                  }}>
                    {
                      item.title
                    }
                  </Text>

                  <TouchableOpacity style={{
                      height: 50,
                      backgroundColor: Color.danger,
                      width: '19%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.removeLocality(index)
                    }}
                    underlayColor={Color.gray}
                      >
                      <FontAwesomeIcon icon={faTrash} style={{
                        color: Color.white
                      }}/>
                  </TouchableOpacity>

                </View>

              )
            })
          }
        </View>

        <View style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 10
        }}>
            <TextInput
              style={[BasicStyles.formControlCreate, {
                width: '80%',
                marginRight: '1%'
              }]}
              onChangeText={(newLocality) => this.setState({
                newLocality
              })}
              value={this.state.newLocality}
              placeholder={'Type city or town here'}
            />

            <TouchableOpacity style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '19%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.addLocality()
              }}
              underlayColor={Color.gray}
                >
                <FontAwesomeIcon icon={faPlus} style={{
                  color: Color.white
                }} />
            </TouchableOpacity>
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
    const { errorMessage } = this.state;
    const iOSGender = gender.map((item, index) => {
                      return {
                        label: item.title,
                        value: item.value
                      };
                    });
    return (
      <View>

        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5
            }}>
              <Text style={{
                color: Color.danger
              }}>{errorMessage}</Text>
            </View>
          )
        }
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


        <View>
          <Text style={{
          }}>Occupation</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(occupation) => this.setState({
              personalInformation: {
                ...this.state.personalInformation,
                occupation
              }
            })}
            value={this.state.personalInformation.occupation}
            placeholder={'Enter occupation'}
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
    const { isLoading, data, step, viewFlag } = this.state;
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
                <Text style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  HEALTH DECLARATION FORM
                </Text>
                {
                  viewFlag == false && (
                    <Text  style={{
                      textAlign: 'justify',
                      paddingBottom: 10
                    }}>
                      Hi {user.username}! IMPORTANT REMINDER: Kindly complete this health declaration form honestly. Failure to answer or giving false information is punishable in accordance with Philippine laws.
                    </Text>
                  )
                }
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>

                  {
                    viewFlag == false && steps.map((item, index) => {
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
                {
                  viewFlag == false && (
                    <View>
                      <Text style={{
                        fontWeight: 'bold',
                        paddingTop: 10,
                        paddingBottom: 10
                      }}>
                        {steps[this.state.step].description.toUpperCase()}
                      </Text>
                    </View>
                  )
                }                
              </View>
            )
          }
          { (step == 0 && viewFlag == false) && (this._step0())}
          { (step == 1 && viewFlag == false) && (this._step1())}
          { (step == 2 && viewFlag == false) && (this._step2())}
          { (step == 3 && viewFlag == false) && (this._step3())}
          { viewFlag == true && (this._viewDetails())}

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
)(Declaration);
