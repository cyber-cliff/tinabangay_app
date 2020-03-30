import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, SystemNotification } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker, faUniversity } from '@fortawesome/free-solid-svg-icons';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      data: null
    }
  }

  componentDidMount(){
    const { user } = this.props.state;
    if(user != null){
      this.retrieve()
    }
  }

  retrieve = () => {
    let parameter = {
      status: 'positive'
    }
    console.log('hi')
    this.setState({
      isLoading: true
    })
    Api.request(Routes.tracingPlaces, parameter, response => {
      this.setState({
        isLoading: false
      })
      console.log(response)
      if(response.data.length > 0){
        this.setState({
          data: response.data
        })
      }else{
        this.setState({
          data: null
        })
      }
    });
  }

  redirect = (route) => {
    this.props.navigation.navigate(route)
  }
  
  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  _data = () => {
    const { data, selected } = this.state;
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          borderRadius: 2,
          backgroundColor: Color.primary,
          marginBottom: 20,
          marginTop: 20
        }}>
          <Text style={{
            color: Color.white,
            textAlign: 'justify',
            padding: 10
          }}>
            List of places visited by affected individual(Hot Places)
          </Text>
        </View>

        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
              }}
              onPress={() => {}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>View on Map</Text>
          </TouchableHighlight>
        </View>

        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              borderColor: Color.gray,
              borderWidth: 1,
              marginBottom: 10
            }}>
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <FontAwesomeIcon
                      icon={faUniversity}
                      style={{
                        color: 'green',
                        marginLeft: 10,
                        marginTop: 5
                      }}
                    ></FontAwesomeIcon>
                    <Text
                      style={[BasicStyles.normalText, {
                        color: Color.darkGray,
                        paddingLeft: 0,
                        marginBottom: 2
                      }]}>
                      {item.route + ', ' + item.locality}
                    </Text>
                  </View>
                  <View>
                    <Text style={[BasicStyles.normalText, {
                      marginTop: 0
                    }]}>
                      {item.country}
                    </Text>
                  </View>
                  
                  <View style={{
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10
                  }}>
                    <View style={{
                      width: '30%',
                      flexDirection: 'row',
                      backgroundColor: Color.black,
                      borderRadius: 2,
                      padding: 5
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '80%'
                      }}>
                        DEATH 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        width: '20%'
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.death_size} 
                        </Text>
                      </View>
                    </View>



                    <View style={{
                      width: '30%',
                      flexDirection: 'row',
                      backgroundColor: Color.danger,
                      borderRadius: 2,
                      padding: 5,
                      marginLeft: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '80%'
                      }}>
                        POSITIVE 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        width: '20%'
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.positive_size} 
                        </Text>
                      </View>
                    </View>


                    <View style={{
                      width: '30%',
                      flexDirection: 'row',
                      backgroundColor: Color.warning,
                      borderRadius: 2,
                      padding: 5,
                      marginLeft: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '80%'
                      }}>
                        PUM 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        width: '20%'
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.pum_size} 
                        </Text>
                      </View>
                    </View>

                  </View>

                  <View style={{
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10
                  }}>
                    <View style={{
                      width: '30%',
                      flexDirection: 'row',
                      backgroundColor: Color.primary,
                      borderRadius: 2,
                      padding: 5
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '80%'
                      }}>
                        PUM 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        width: '20%'
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.pui_size} 
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      width: '30%',
                      flexDirection: 'row',
                      backgroundColor: 'green',
                      borderRadius: 2,
                      padding: 5,
                      marginLeft: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '80%'
                      }}>
                        PUM 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        width: '20%'
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.pui_size} 
                        </Text>
                      </View>
                    </View>



                  </View>
                </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
  _qrCode = () => {
    const { user } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          borderRadius: 2,
          backgroundColor: Color.primary,
          marginBottom: 20
        }}>
          <Text style={{
            color: Color.white,
            textAlign: 'justify',
            padding: 10
          }}>
            Hi {user.username}! Below is your qr code. Show this to frontliners everytime they read your temperature or show this to DOH authorized personnel.
          </Text>
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
              }}
              onPress={() => {}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Scan QR Code</Text>
          </TouchableHighlight>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>

          <QRCode
            value={user.username}
            size={width - 40}
            color="black"
            backgroundColor="white"
          />
        </View>
      </View>
    );
  }

  render() {
    const { isLoading, data } = this.state;
    const { user } = this.props.state;
    return (
      <ScrollView 
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            this.retrieve()
          }
        }}
        >
        {isLoading ? <Spinner mode="overlay"/> : null }
        <View style={[Style.MainContainer, {
          minHeight: height
        }]}>
          <View style={Style.MainContainer}>
            {user != null && (this._qrCode())}
            {data != null && (this._data())}
          </View>
        </View>
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
)(Dashboard);
