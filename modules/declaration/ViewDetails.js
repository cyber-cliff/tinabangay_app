import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, TouchableOpacity, Text} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload, DateTime } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
class ViewDetails extends Component{
  constructor(props){
    super(props);
  }

  _localities = (localities) => {
    return (
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
    )
  }

  _contries = (countries) => {
    return (
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
    )
  } 

  _transportation = (transportation) => {
    return (
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
  _travelHistory = (travelHistory) => {
    return (
      <View>
        {
          (travelHistory.transportation != undefined && travelHistory.transportation.length > 0) && (
            this._transportation(travelHistory.transportation)
          )
        }
        {
          (travelHistory.countries != undefined && travelHistory.countries.length > 0) && (
            this._countries(travelHistory.countries)
          )
        }

        {
          (travelHistory.localities != undefined && travelHistory.localities.length > 0) && (
            this._localities(travelHistory.localities)
          )
        }
      </View>

    );
  }

  _personalInformation = (personalInformation) => {
    return (
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

          {
            personalInformation.occupation != undefined && (
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  personalInformation.occupation
                }
              </Text>
            )
          }

          {
            personalInformation.address != undefined && (
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'Address: ' + personalInformation.address
                }
              </Text>
            )
          }

          {
            personalInformation.birth_date != undefined && (
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'Birth Date: ' + personalInformation.birth_date
                }
              </Text>
            )
          }

          {
            personalInformation.email != undefined && (
              <Text style={{
                paddingTop: 2,
                paddingBottom: 2
              }}>
                {
                  'E-mail address: ' + personalInformation.email.toLowerCase()
                }
              </Text>
            )
          }

          {
            typeof personalInformation.contact_number != undefined && (
              <Text style={{
                  paddingTop: 2,
                  paddingBottom: 2
                }}>
                  {
                    'Contact number: ' + personalInformation.contact_number
                  }
                </Text>
            )
          }

          {
            typeof personalInformation.department != undefined && (
              <Text style={{
                  paddingTop: 2,
                  paddingBottom: 2
                }}>
                  {
                    'Department: ' + personalInformation.department
                  }
                </Text>
            )
          }

          {
            typeof personalInformation.temperature != undefined && (
              <Text style={{
                  paddingTop: 2,
                  paddingBottom: 2
                }}>
                  {
                    'Temperature: ' + personalInformation.temperature + ' Degree Celsius'
                  }
                </Text>
            )
          }

          {
            typeof personalInformation.immediate_superior != undefined && (
              <Text style={{
                  paddingTop: 2,
                  paddingBottom: 2
                }}>
                  {
                    'Immediate Superior: ' + personalInformation.immediate_superior
                  }
                </Text>
            )
          }
        </View>
    );
  }

  _symptoms = (symptoms) => {
    return (
    <View>
       {
        symptoms && symptoms.length > 0 && (
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
              symptoms.map((item, index) => {
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

  _safetyQuestions = (safetyQuestions) => {
    return (
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
          safetyQuestions.map((item, index) => {
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
    )
  }

  _company = (company) => {
    return (
      <View>

        <Text style={{
          textAlign: 'justify',
          fontWeight: 'bold'
        }}>
          COMPANY RELATED - QUESTIONS
        </Text>
        {
          (company.person_in_contact != undefined && company.person_in_contact.length > 0) && (
            <View>
              <Text style={{
                textAlign: 'justify',
                paddingTop: 10
              }}>
                People in contact last 12 hours and its relation:
              </Text>
              {
                company.person_in_contact.map((item, index) => {
                  return (
                    <Text style={{
                      paddingTop: 10
                    }}>
                      {
                        item.name.toUpperCase() + (item.relation != undefined ? ' - Relation(' + item.relation + ')' : ' - Department(' + item.department + ')' )
                      }
                    </Text> 
                  )
                })
              }
            </View>
          )
        }
        {
          (company.related_questions != undefined && company.related_questions.length > 0) && (
            company.related_questions.map((item, index) => {
              return (
                <View>
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
                </View>
              )
            })
          )
        }
      </View>

    )
  }
  _viewDetails = () => {
    const { declaration } = this.props.state;
    return (
      <View>
        {
          <View>
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: Color.gray,
                textAlign: 'center'
              }}>
                Submitted on {declaration.updated_at_human}
              </Text>
          </View>
        }

        {
          (declaration.content.personalInformation != undefined) && (
            this._personalInformation(declaration.content.personalInformation)
          )
        }

        {
          declaration.content.travelHistory != undefined && (
            this._travelHistory(declaration.content.travelHistory)
          )
        }

       {
        declaration.content.symptoms != undefined && (
          this._symptoms(declaration.content.symptoms)
        )
       }

       {
        declaration.content.safety_questions != undefined && (
          this._safetyQuestions(declaration.content.safety_questions)
        )
       }

       {
        declaration.content.company != undefined && (
          this._company(declaration.content.company)
        )
       }

      </View>
    )
  }

  render() {
    const { declaration } = this.props.state;
    return (
        <View style={[Style.MainContainer, {
        }]}>
          
          {
            (declaration != null && declaration.viewFlag == true && declaration.content != undefined) && (
              this._viewDetails()
            )
          }
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
)(ViewDetails);
