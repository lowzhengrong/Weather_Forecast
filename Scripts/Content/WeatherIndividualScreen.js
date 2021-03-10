import React, {useRef} from 'react';
import 
{
  View,
  Text,
  Platform,
  ImageBackground,
  SafeAreaView,
} 
from 'react-native';
import 
{
  getScreenWidth,
  fetchTimeout,
  encryptData,
  alertDialog,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import GetLocation from 'react-native-get-location'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';

export default class WeatherIndividualScreen extends React.Component 
{

  constructor(props) {
    super(props);
    this.state = 
    {
      bln_Loading: false,
    }
  }

  componentDidMount()
  {
    
  }
  
  render() 
  {
    return (
      <SafeAreaView
        style={{width: '100%',
                height: '100%',
                flex: 1,
                backgroundColor: GLOBALS.THEMECOLOR,}}>
        <View
          style={{flex: 1,
                  width: "100%",
                  height: "100%"}}>
          <View
            style={{width: "100%",
                    height: 48,
                    justifyContent: "center",}}>
            <View
              style={{width: "100%",
                      paddingLeft: 48,
                      paddingRight: 48,}}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                allowFontScaling={false}
                style={{fontSize: 18,
                        width: "100%",
                        color: '#FFFFFF',
                        textAlign: "center",
                        fontFamily: "SFProText-Bold",}}>
                TITLE
              </Text>
            </View>
          </View>
          <View
            style={{width: "100%",
                    height: "100%",}}>
            <Text>Individual</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

}
