import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList,TouchableOpacity,Button} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, SystemNotification } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewMap from 'modules/checkMap';
import DisplayScan from 'modules/scanQR/Scanner.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker, faUniversity, faKaaba, faBold } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
var screen = Dimensions.get("window");

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalState:false,
      isLoading: false,
      selected: null,
      data: null,
      showMapFlag: false,
      showScanner:false
    }
  }

  componentDidMount(){
    const { user } = this.props.state;
    let consentparameter = {
      condition: [{
        value: this.props.state.user.id,
        clause: '=',
        column: 'account_id'
      }]
    }

    Api.request(Routes.consentRetrieve, consentparameter, response => {
      console.log(response.data.length)
      if(response.data.length>0)
      {
        this.setState({consent:true});
      }
      else
      {
        this.setState({modalState:true});
      }
    });
    if(user != null){
      this.retrieve()
    }
    
  
  }

  retrieve = () => {
    let parameter = {
      status: 'positive'
    }
    console.log(this.state.consent);
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

  addComplaints = () => {

  }

  manageScannedData = (data) => {
    
    this.setState({
      showScanner: false
    })
    if(data != null){
      if(this.props.state.scannedUser!=null)
      {
      this.redirect('scannedUserStack')
      }
      else
      {
        console.log('here')
        this.redirect('scannedLocationStack')
      }
    }
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
              onPress={() => {this.setState({
                showMapFlag: true
              })}}
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
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: Color.black,
                      borderRadius: 2,
                      padding: 5
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        DEATH 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
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
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: Color.danger,
                      borderRadius: 2,
                      padding: 5,
                      marginLeft: 10,
                      marginRight: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        POSITIVE 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
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
                  </View>

                   <View style={{
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10
                  }}>
                    <View style={{
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: Color.warning,
                      borderRadius: 2,
                      padding: 5
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        PUM 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
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

                    <View style={{
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: Color.primary,
                      borderRadius: 2,
                      padding: 5,
                      marginLeft: 10,
                      marginRight: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        PUI
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
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

                  <View style={{
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10
                  }}>
                    <View style={{
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: 'green',
                      borderRadius: 2,
                      padding: 5,
                      marginRight: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        NEGATIVE 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.negative_size} 
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      width: '50%',
                      flexDirection: 'row',
                      backgroundColor: 'green',
                      borderRadius: 2,
                      padding: 5,
                      marginRight: 10
                    }}>
                      <Text style={{
                        color: Color.white,
                        width: '60%'
                      }}>
                        RECOVERED 
                      </Text>
                      <View style={{
                        backgroundColor: Color.white,
                        marginLeft: 1,
                        borderRadius: 2,
                        minWidth: '20%',
                        marginRight: 5
                      }}>
                        <Text style={{
                          color: 'black',
                          padding: 2,
                          textAlign: 'center'
                        }}>
                          {item.recovered_size} 
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
              onPress={() => {this.setState({
                showScanner: true
              })}}
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
            value={`account/${user.code}`}
            size={width - 40}
            color="black"
            backgroundColor="white"
          />
        </View>
      </View>
    );
  }

  _status = (status, location) => {
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          marginBottom: 10
        }}>
          <Text>My Status</Text>
        </View>
        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: Helper.getColor(status.status),
          width: '100%',
          marginBottom: 10
        }}>
          <Text style={{
            color: Color.white,
            textAlign: 'center',
            paddingTop: 10,
            paddingBottom: 10
          }}>
            {status.status_label}
          </Text>
        </View>
        {
          location != null && (
            <TouchableHighlight style={{
              height: 50,
              backgroundColor: Color.primary,
              width: '100%',
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {this.addComplaints()}}
            underlayColor={Color.gray}
              >
            <Text style={{
              color: Color.white,
              textAlign: 'center',
            }}>Send complaints to your barangay(Coming soon)</Text>
          </TouchableHighlight>
          )
        }
      </View>
    );
  }

  modalOff=()=>{
    
    let parameter = {
      account_id: this.props.state.user.id   
    }
    this.setState({isLoading:true});
    Api.request(Routes.consentCreate, parameter, response => {
      this.setState({isLoading: false})
      console.log(response.data)
      if(response.data>0)
      {
        this.setState({modalState:!this.state.modalState});
      }

      
    });

  }
  
  _modal=()=>{
    const { user } = this.props.state;
    return (
    <View>
      <Modal isVisible={this.state.modalState} 
      style={{
       
        paddingBottom:15,
        justifyContent: "center",
        borderRadius: 20,
        shadowRadius: 10,
        width: screen.width - 50,
        backgroundColor: "white",
        zIndex:5,
        position:"relative",
        minHeight:"80%",
        flex:0,

      }}>
        <View
        style={{
        
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          height:50,
         borderWidth:2,
         width:"100%",
          backgroundColor: '#005b96',
        }}>
        <Text
        style={{
          color:"white",
          fontSize:15,
          fontWeight:"bold",
         marginTop:15,
          textAlign:"center"
        }}>Consent Request</Text>
        </View>
             <Text style={{
                paddingLeft:15,
                paddingRight:15,
                
            paddingTop:15,
            justifyContent:"center"
            }}>Hi {user.username}!{"\n"}{"\n"}

Welcome to BirdsEye. We would like you to know that we need to collect these data from you to help us compare and trace to the affected individual from Covid-19. {"\n"}{"\n"}

(1) Personal information such as: username, e-mail address, password, first name, middle name, last name, birth date, address and gender{"\n"}{"\n"}

(2) Your visited locations or places which includes route, locality, coordinates, country, date and time{"\n"}{"\n"}

(3) Your used transportations which includes the information of the vehicle, the date and time{"\n"}{"\n"}

(4) Your reported symptoms{"\n"}{"\n"}

(5) Your recorded temperature{"\n"}{"\n"}

By clicking the accept button, you fully give us a consent to use these informations.{"\n"}{"\n"}

Thank you and stay safe.{"\n"}{"\n"}

Regards,{"\n"}{"\n"}


BirdsEye Team{"\n"}{"\n"}{"\n"}
</Text>
       <View
       style={{
         paddingLeft:15,
         paddingRight:15,
       }}>
          <Button
                onPress={()=>this.modalOff()} 
                title="Accept"
                color="red"
                style={[{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width:'50%'
                  
                  
                }]}
                >
                
              </Button>
          </View>
          </Modal>
        </View>
    )
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
        {this.state.consent?null:user != null && (this._modal())}
        <View style={[Style.MainContainer, {
          minHeight: height
        }]}>
          {isLoading ? <Spinner mode="overlay"/> : null }
          {
            (data != null && this.state.showMapFlag)&& (
              <ViewMap 
                visible={this.state.showMapFlag}
                data={this.state.data}
                close={() => this.setState({
                  showMapFlag: false
                })}
              />
            )
          }
          {
            (this.state.showScanner)&&(
              <DisplayScan
              visible={this.state.showScanner}
              close={(data) => this.manageScannedData(data)}
             >
              </DisplayScan>
            )
          }
          <View style={Style.MainContainer}>
            {(user != null && user.overall_status != null) && (this._status(user.overall_status, user.location))}
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
