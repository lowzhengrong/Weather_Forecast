import React, {useRef} from 'react';
import 
{
  View,
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
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
      strTitle: "",
    }
  }

  componentDidMount()
  {
    const {params} = this.props.route
    let strTitle = ""
    if(params != undefined && params != null)
    {
      if(params.title != undefined && params.title != null && params.title != "")
      {
        strTitle = params.title
      }
    }
    this.setState({
      strTitle: strTitle,
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }
  
  handleBackPress = () => {
    this.processBack()
    return true
  }

  processBack()
  {
    this.props.navigation.goBack()
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
                {this.state.strTitle}
              </Text>
            </View>
            <TouchableOpacity
                style={{width: 48,
                        height: 48,
                        padding: 5,
                        left: 0,
                        position:'absolute',
                        alignItems:  "center" ,
                        justifyContent: "center",}}
                onPress={()=> {this.processBack()}}>
                <Image 
                  style = {{width: 24,
                            height: 24,}}
                  source={require("../../Images/Icon/back_icon.png")}/>
              </TouchableOpacity>
          </View>
          <View
            style={{width: "100%",
                    height: "100%",
                    flex: 1,}}>
            <Text>Individual</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  

}
