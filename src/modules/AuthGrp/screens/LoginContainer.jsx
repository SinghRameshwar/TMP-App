import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { apiCallWithproviderCodeAndRespondeHandel } from '../data/apiCallandResult';

const LoginScreen = ({ navigation }) => {
  const [loginClick, setloginClick] = useState(false);
  const [useName, setuseName] = useState('');
  const [password, setpassword] = useState('');



  const LoginBtnAction = () => {
    if (!loginClick) {

      if (useName === '' || useName === undefined) {
        Alert.alert('Warning', 'Enter User Name!');
        return;
      }

      if (password === '' || password === undefined) {
        Alert.alert('Warning', 'Enter Password!');
        return;
      }
      setloginClick(true)
      apiCallWithproviderCodeAndRespondeHandel({
        userName: useName,   //'alexmorrison',
        password: password, //'Cuckoo@4796',
        setloginClick: setloginClick,
        navigation: navigation

      })
    }

  }

  const keyBoardDismiss = () =>{
    Keyboard.dismiss()
  }


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/images/login_bg.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={()=> keyBoardDismiss()}>
        <Image
          source={require("../../../assets/images/app_logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Log in</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            onChangeText={(text) => setuseName(text)}
          />

          <TextInput
            style={[styles.input, styles.marginTop]}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={(text) => setpassword(text)}
          />

          <TouchableOpacity style={styles.loginButton} onPress={() => LoginBtnAction()}>
            <Text style={styles.loginButtonText}>{loginClick ? 'Loading...' : 'Log in'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Note!','Development is in progress!')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style = {{height:150}}/>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    marginBottom: 20,
    width:150,
    height:150
  },
  loginContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 10,
  },
  loginText: {
    color: '#14669A',
    fontWeight: '900',
    fontSize: 24,
    fontFamily: 'Reddit Sans',
    marginBottom: 20,
  },
  input: {
    borderRadius: 40,
    backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
  },

  button: {
    borderRadius: 40,
    backgroundColor: '#59B852',
    padding: 10,
    paddingHorizontal: 20,
  },

  marginTop: {
    marginTop: 16,
  },

  loginButton: {
    backgroundColor: '#59B852',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  forgotPasswordText: {
    color: '#14669A',
    marginTop: 15,
    fontWeight: '400',
    fontSize: 16,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
