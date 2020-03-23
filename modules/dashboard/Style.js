import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  ScrollView: {
    padding: 10
  },
  MainContainer: {
    width: '100%',
    alignItems: 'center'
  },
  TextContainer: {
    flex: 1
  },
  Card: {
    borderRadius: 10,
    width: width - 20,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold' 
  },
  numberText: {
    color: Color.white,
    fontSize: 30 
  },
  btn: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    marginLeft: '5%'
  },
  titleTextSummary: {
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10
  },
  normalText: {
    fontSize: 12,
    color: Color.gray,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10
  }
}