import React, { useRef } from 'react';
import { Dimensions, View, Animated, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
//import LottieView from 'lottie-react-native';

export default function Loading({lodingType, message}) {

  // const animationRef = useRef<LottieView | null>(null);
  // const animationProgress = useRef(new Animated.Value(0)).current;

  return (
    <View
      style={{
        backgroundColor: 'rgba(52, 52, 52, 0.4)',
        height: Dimensions.get('screen').height,
        width: '100%',
        alignSelf: 'center',
        position: 'absolute',
        zIndex: 1,
        display: lodingType ? 'flex' : 'none',
        justifyContent: 'center',
      }}>
      <View style={LoadingStyle.lottieContainer}>
        <Text style = {{fontWeight:700}}>Loading...</Text>
        {/* <LottieView
          ref={animationRef.current}
          source={require('../../assets/images/Updatedloader.json')}
          style={LoadingStyle.lottieElement}
          autoPlay
          speed={5.0}
          onAnimationFinish={() => { }}
        /> */}
      </View>
    </View>
  );
}

const LoadingStyle = StyleSheet.create({
    lottieContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //marginBottom: globalMargin.MARGING_200,
       // marginVertical: globalMargin.MARGING_150
    },
    lottieElement: {
        height: 80,
        width: 80
    }
});