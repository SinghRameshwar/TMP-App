import { View, Image } from "react-native";
import React from "react";

const AppLogo = ({ navigation }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Image
        source={require("../../assets/images/splash_bg.jpg")}
        resizeMode="cover"
      />
      <Image
        source={require("../../assets/images/app_logo.png")}
        style={{position:'absolute', width:150, height:150}}
        resizeMode="contain"
      />
    </View>
  );
};

export default AppLogo;
