import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput, Button, TouchableHighlight, AsyncStorage
} from 'react-native';


export default function HomeScreen(props) {
  const [txtLogin, setTxtLogin] = useState('');
  const [txtPassword, setTxtPassword] = useState('');

  return (
      <ScrollView
        style={s.container}
        contentContainerStyle={s.contentContainer}>
        <View style={s.welcomeContainer}>
          <Text style={s.title}>Waves Ticket</Text>
          <Image
            source={require('../assets/images/ava.png')}
            style={s.welcomeImage}
          />
        </View>

        <View style={s.getStartedContainer}>
          <TextInput
            style={s.input}
            onChangeText={text => setTxtLogin(text)}
            value={txtLogin}
            placeholder="Логин"
          />
          <TextInput
            style={s.input}
            onChangeText={text => setTxtPassword(text)}
            value={txtPassword}
            placeholder="Пароль"
          />
        </View>

        <View style={s.helpContainer}>
          <TouchableHighlight
            title="Вход"
            style={s.button}
            onPress={async ()=>{
              const seed = 'traffic common hotel rent simple happy garbage hammer shock maximum earn peace';
              await AsyncStorage.setItem('@Store:seed', seed);
              // const value = await AsyncStorage.getItem('@Store:seed');
              const dApp = '3Mqf9mef6PyWRzsCm8ZNzBmTm5BTADAkEB1';
              await AsyncStorage.setItem('@Store:dApp', dApp)
              // console.log(value);
              props.navigation.navigate('Events')
            }}
          >
            <Text style={s.textButton}>Вход</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};



const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  input: {
    margin: 5,
    padding: 10,
    height: 40,
    borderColor: 'rgba(21, 30, 51, 0.3)',
    borderWidth: 1,
    // borderRadius: 20,
    // fontSize: 16,
    // color: '#2e78b7',
    backgroundColor: 'rgba(21, 30, 51, 0.01)',
    // boxShadow: 'inset 0px 0px 10px rgba(21, 30, 51, 0.2)'
  },
  button: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
    height: 40,
    width: 100,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#42a5f5',
    color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  textButton: {
    color: '#fff',
  },
  title: {
    fontSize: 30,
    margin: 30,
  }
});
