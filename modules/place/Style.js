import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  ScrollView: {
    padding: 10
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: Color.normalGray
  },
  sectionHeadingStyle: {
    paddingBottom: 10,
    alignItems: 'center'
  },
}