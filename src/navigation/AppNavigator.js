import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../SplashScreen";
import LoginContainer from "../modules/AuthGrp/screens/LoginContainer";
import MEDManagmentDetailsContainer from "../modules/MedManagmentGrp/screens/MEDManagmentDetailsContainer";
import FillDocumentContainer from "../modules/DocumnentGrp/screens/FillDocumentContainer";
import TabNavigation from "../modules/TabNavigation";
import QRCodeScannerContainer from "../modules/AuthGrp/screens/QRCodeScannerContainer";
import EnterRegistredCode from "../modules/AuthGrp/screens/EnterRegistredCode";
import QRCodeScanCamera from "../modules/AuthGrp/component/QRCodeScanCamera";
import SDLClockinOutDeleteContainer from "../modules/SdlGrp/screens/SDLClockinOutDeleteContainer";
import SDLContainer from "../modules/SdlGrp/screens/SDLContainer";
import { navigationRef } from "../common/Helpers/NavigationService";
import UnscheduledContainer from "../modules/UnscheduledSDLGrp/screens/UnscheduledContainer";



const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="QRCodeScannerContainer"
          component={QRCodeScannerContainer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="QRCodeScanCamera"
          component={QRCodeScanCamera}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EnterRegistredCode"
          component={EnterRegistredCode}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="LoginContainer"
          component={LoginContainer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SDLContainer"
          component={SDLContainer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SDLClockinOutDeleteContainer"
          component={SDLClockinOutDeleteContainer}
          options={{
            headerShown: false,
          }}
        />


        <Stack.Screen
          name="MEDManagmentDetailsContainer"
          component={MEDManagmentDetailsContainer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="UnscheduledContainer"
          component={UnscheduledContainer}
          options={{
            headerShown: false,
          }}
        />



        <Stack.Screen
          name="FillDocumentContainer"
          component={FillDocumentContainer}
          options={{
            headerShown: false,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
