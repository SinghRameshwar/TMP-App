import React, { useState, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { RNCamera } from 'react-native-camera';
import { Text } from "react-native-paper";
import NavigationBar from "./NavigationBar";

const QRCodeScanCamera = ({ route, navigation }) => {
  const [scannedData, setScannedData] = useState(null);
  const [reActiveScan, setreActiveScan] = useState(false);
  const callBack = route.params.callBack
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (event) => {
    if (isScanning) {
      setIsScanning(false);
      if (event.data) {
        callBack(event.data)
        navigation.goBack();
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationBar navigation = {navigation} title = 'Scan QR Code'/>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={isScanning ? handleScan : null}
      />
      {!isScanning && <Text style={styles.message}>QR Code Scanned!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default QRCodeScanCamera;
