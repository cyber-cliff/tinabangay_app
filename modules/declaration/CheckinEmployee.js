import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, TouchableOpacity, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
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
}, {
  title: '5',
  description: 'Company Related'
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
}]

const modeOfTransportation = [{
  title: 'Airplane'
}, {
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
const companyRelatedQuestions = [
  {
    question: "Have you taken medicines/vitamins/supplements in the past 24 hours? Please indicate specific names.",
    translate: "(Naa ka ba’y gitomar nga mga tambal sulod sa 24 ka oras? Unsa ang mga pangalan sa tambal?)",
    answer: []
  }, {
    question: "What is your purpose of coming here?",
    translate: "(Unsa imong katuyu-an sa pag-ari?)",
    answer: []
  }, {
    question: "Aside from your own work area/section, do you plan to transact with other dept/ section today? To whom in particular?",
    translate: "(Gawas sa imong section, naa ka bay plano mo transact sa lain nga departamento o section? Kang kinsa imong katuyuan?)",
    answer: []
  }
]
class CheckinEmployee extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
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
        type: 'Airplane',
        date: null,
        origin: null,
        number: null,
        seat: null
      },
      company: {
        person_in_contact: [],
        related_questions: companyRelatedQuestions
      },
      format: null,
      status: null,
      statusLabel: null,
      steps: steps,
      newPerson: {
        name: null,
        relation: null
      },
      medicine: null,
      purpose: null,
      office: null
    }
  }

  componentDidMount(){
    const { user } = this.props.state;
    if(user == null){
      return
    }
    console.log('user Info', user)
    if(user.account_information){
      let information = user.account_information
      this.setState({
        personalInformation: {
          ...this.state.personalInformation,
          first_name: information.first_name,
          middle_name: information.middle_name,
          last_name: information.last_name,
          email: user.email,
          gender: information.sex,
          birth_date: information.birth_date,
          contact_number: information.cellular_number,
          address: information.address
        }
      })
    }
  }

  createNew(content){
    const { user, scannedLocation, declaration } = this.props.state;
    if(user == null || scannedLocation == null){
      return
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    let parameter = {
      owner: scannedLocation.account_id,
      account_id: user.id,
      content: JSON.stringify(content),
      to: scannedLocation.account_id,
      from: user.id,
      payload: 'form_submitted/' + declaration.format
    }
    console.log('create HDF', parameter)
    Api.request(Routes.healthDeclarationCreate, parameter, response => {
      this.setState({isLoading: false})
      console.log('response', response.data)
      this.props.onFinish()
    });
  }

  submit(){
    const { declaration, scannedLocation, user } = this.props.state;
    if(scannedLocation == null && declaration.id == null){
      return
    }

    if(this.state.step == 4){
      if(this.state.company.person_in_contact.length < 5){
        this.setState({
          errorMessage: 'List down atleast 5 in contact person.'
        })
        return
      }
      if(this.state.company.related_questions[0].answer.length <= 0){
       this.setState({
          errorMessage: 'Medicine is required.'
        })
        return 
      }
      if(this.state.company.related_questions[1].answer.length <= 0){
       this.setState({
          errorMessage: 'Purpose is required.'
        })
        return 
      }
      if(this.state.company.related_questions[2].answer.length <= 0){
       this.setState({
          errorMessage: 'Office is required.'
        })
        return 
      }
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
      company: this.state.company,
      safety_questions: this.state.safetyRelatedQuestions,
      format: declaration.format,
      status: this.state.status,
      statusLabel: this.state.statusLabel,
      location: scannedLocation
    }
    if(declaration != null && declaration.id == null){
      this.createNew(content)
      return
    }
    
    if(user == null){
      return
    }
    
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    let parameter = {
      ...declaration,
      content: JSON.stringify(content),
      to: declaration.merchant.account_id,
      from: user.id,
      payload: 'form_submitted/' + declaration.format
    }
    console.log('update HDF', parameter)
    Api.request(Routes.healthDeclarationUpdate, parameter, response => {
      this.setState({isLoading: false})
      this.props.onFinish()
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
        || personalInformation.email == null){
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
    if(this.state.newTransportation.date === null || this.state.newTransportation.origin === null || this.state.newTransportation.number === null
      || this.state.newTransportation.seat == null || this.state.newTransportation.type === null){
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
        type: 'Airplane',
        date: null,
        origin: null,
        number: null,
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

  addPersonInContact(){
    if(this.state.newPerson.name === null || this.state.newPerson.relation === null){
      this.setState({
        errorMessage: 'Person fields are required.'
      })
      return
    }
    
    let personInContact = this.state.company.person_in_contact
    personInContact.push(this.state.newPerson)
    this.setState({
      company: {
        ...this.state.company,
        person_in_contact: personInContact
      },
      newPerson: {
        name: null,
        relation: null
      }
    })
  }

  removePersonInContact(indexParam){
    let personInContact = this.state.company.person_in_contact.filter((item, index) => {
      if(index != indexParam){
        return item
      }
    })
    this.setState({
      company: {
        ...this.state.company,
        person_in_contact: personInContact
      }
    })
  }

  addRelatedQuestion(indexParam){
    if(indexParam == 0 && this.state.medicine === null){
      this.setState({
        errorMessage: 'Medicine field is required.'
      })
      return
    }else if(indexParam == 1 && this.state.purpose === null){
      this.setState({
        errorMessage: 'Purpose field is required.'
      })
      return
    }else if(indexParam == 2 && this.state.office === null){
      this.setState({
        errorMessage: 'Office field is required.'
      })
      return
    }
    
    let answer = this.state.company.related_questions[indexParam].answer
    if(indexParam == 0){
      answer.push(this.state.medicine)  
    }else if(indexParam == 1){
      answer.push(this.state.purpose)
    }else if(indexParam == 2){
      answer.push(this.state.office)
    }
    
    let relatedQuestion = {
      ...this.state.company.related_questions[indexParam],
      answer: answer
    }
    let finalRelatedQuestions = this.state.company.related_questions.map((item, index) => {
      if(index == indexParam){
        return relatedQuestion
      }else{
        return item
      }
    })
    this.setState({
      company: {
        ...this.state.company,
        related_questions: finalRelatedQuestions
      },
      medicine: null,
      purpose: null,
      office: null
    })
  }

  _addMedicine(){
    return(
      <View>
        <View style={{
          paddingTop: 10,
          paddingBottom: 10,
          flexDirection: 'row'
        }}>
            <TextInput
              style={[BasicStyles.formControlCreate, {
                marginRight: '1%',
                width: '80%'
              }]}
              onChangeText={(medicine) => this.setState({
                medicine
              })}
              value={this.state.medicine}
              placeholder={'No or write down the medicine'}
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
                this.addRelatedQuestion(0)
              }}
              underlayColor={Color.gray}
                >
                <FontAwesomeIcon icon={faPlus} style={{
                  color: Color.white
                }} />
            </TouchableOpacity>
        </View>
      </View>
    )
  }
  _addPurpose(){
    return(
      <View>
        <View style={{
          paddingTop: 10,
          paddingBottom: 10,
          flexDirection: 'row'
        }}>
            <TextInput
              style={[BasicStyles.formControlCreate, {
                marginRight: '1%',
                width: '80%'
              }]}
              onChangeText={(purpose) => this.setState({
                purpose
              })}
              value={this.state.purpose}
              placeholder={'Purpose'}
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
                this.addRelatedQuestion(1)
              }}
              underlayColor={Color.gray}
                >
                <FontAwesomeIcon icon={faPlus} style={{
                  color: Color.white
                }} />
            </TouchableOpacity>
        </View>
      </View>
    )
  }
  _addOffice(){
    return(
      <View>
        <View style={{
          paddingTop: 10,
          paddingBottom: 10,
          flexDirection: 'row'
        }}>
            <TextInput
              style={[BasicStyles.formControlCreate, {
                marginRight: '1%',
                width: '80%'
              }]}
              onChangeText={(office) => this.setState({
                office
              })}
              value={this.state.office}
              placeholder={'Office'}
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
                this.addRelatedQuestion(2)
              }}
              underlayColor={Color.gray}
                >
                <FontAwesomeIcon icon={faPlus} style={{
                  color: Color.white
                }} />
            </TouchableOpacity>
        </View>
      </View>
    )
  }

   _step4 = () => {
    const { company, errorMessage } = this.state;
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
        <Text>
          List down 5 person your in contact the last 12 hours and your relations.
        </Text>

        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          {
            company.person_in_contact.length > 0 && company.person_in_contact.map((item, index) => {
              return(
                <View style={{
                  flexDirection: 'row',
                  marginBottom: 10
                }}>
                  <View style={{
                    width: '80%',
                    marginRight: '1%'
                  }}>
                    <Text style={{
                      color: Color.primary
                    }}>{item.name.toUpperCase()}</Text>
                    <Text style={{
                      color: Color.black
                    }}>{item.relation.toUpperCase()}</Text>
                    
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
                      this.removePersonInContact(index)
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
            <TextInput
              style={[BasicStyles.formControlCreate, {
                marginRight: '1%'
              }]}
              onChangeText={(name) => this.setState({
                newPerson: {
                  ...this.state.newPerson,
                  name
                }
              })}
              value={this.state.newPerson.name}
              placeholder={'Full name'}
            />

            <TextInput
              style={[BasicStyles.formControlCreate, {
                marginRight: '1%'
              }]}
              onChangeText={(relation) => this.setState({
                newPerson: {
                  ...this.state.newPerson,
                  relation
                }
              })}
              value={this.state.newPerson.relation}
              placeholder={'Relation'}
            />

            <TouchableOpacity style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.addPersonInContact()
              }}
              underlayColor={Color.gray}
                >
                <Text style={{
                  color: Color.white
                }}>
                  Add person
                </Text>
            </TouchableOpacity>
        </View>


        <View style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          {
            company.related_questions.length > 0 && company.related_questions.map((item, index) => {
              return(
                <View style={{
                  marginBottom: 10
                }}>
                  <Text style={{
                    paddingTop: 10,
                    fontWeight: 'bold'
                  }}>
                    {
                      item.question
                    }
                  </Text>
                  <Text style={{
                    fontStyle: 'italic',
                    marginBottom: 20
                  }}>
                    { item.translate}
                  </Text>
                  {
                    (item.answer != undefined && item.answer.length > 0) && (
                      item.answer.map((iItem, iIndex) => {
                        return(
                          <View>
                            <Text>
                              {
                                (iIndex + 1) + ': ' + iItem
                              }
                            </Text>
                          </View>
                        )
                      })
                    )
                  }
                  {
                    (index == 0) && (
                      this._addMedicine()
                    )
                  }
                  {
                    (index == 1) && (
                      this._addPurpose()
                    )
                  }
                  {
                    (index == 2) && (
                      this._addOffice()
                    )
                  }
                </View>

              )
            })
          }
        </View>



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
    const iOSModeOfTransportation = modeOfTransportation.map((item, index) => {
                      return {
                        label: item.title,
                        value: item.title
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
                        item.type.toUpperCase()
                      }
                    </Text>
                    <Text>
                      {
                        item.date + ' from ' + item.origin
                      }
                    </Text>

                    <Text>
                      {
                        'Number: ' + item.number + ' / Seat #: ' + item.seat
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
          <View style={{
          }}>
            <Text>Mode of Transportation</Text>
            {
              Platform.OS == 'android' && (
                <Picker selectedValue={this.state.sex}
                  onValueChange={(sex) => this.setState({sex})}
                  style={BasicStyles.pickerStyleCreate}
                  >
                    {
                      modeOfTransportation.map((item, index) => {
                        return (
                          <Picker.Item
                          key={index}
                          label={item.title} 
                          value={item.title}/>
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
                  items={iOSModeOfTransportation}
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
              onChangeText={(number) => this.setState({
                newTransportation: {
                  ...this.state.newTransportation,
                  number
                }
              })}
              value={this.state.newTransportation.number}
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
            }}>First Name</Text>
            <Text style={{
              color: Color.danger,
              paddingLeft: 5
            }}>*</Text>
          </View>
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
            }}>Middle Name</Text>
            <Text style={{
              color: Color.danger,
              paddingLeft: 5
            }}>*</Text>
          </View>
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
            }}>Last Name</Text>
            <Text style={{
              color: Color.danger,
              paddingLeft: 5
            }}>*</Text>
          </View>
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
            }}>E-mail Address</Text>
            <Text style={{
              color: Color.danger,
              paddingLeft: 5
            }}>*</Text>
          </View>
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
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
            }}>Gender</Text>
            <Text style={{
              color: Color.danger,
              paddingLeft: 5
            }}>*</Text>
          </View>
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
    const { user, declaration } = this.props.state;
    const { isLoading, step } = this.state;
    return (
        <View style={{
          width: '100%'
        }}>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
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
              paddingBottom: 10,
              textAlign: 'center'
            }}>
              {steps[this.state.step].description.toUpperCase()}
            </Text>
          </View>
          { (step == 0) && (this._step0())}
          { (step == 1) && (this._step1())}
          { (step == 2) && (this._step2())}
          { (step == 3) && (this._step3())}
          { (step == 4) && (this._step4())}
        </View>
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
)(CheckinEmployee);
