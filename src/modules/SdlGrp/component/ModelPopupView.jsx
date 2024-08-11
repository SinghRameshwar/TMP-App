import React from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModelPopupView({ buttomModelPopupViewDismiss, selectedButtomPopupAction }) {
  return (
    <TouchableWithoutFeedback onPress={buttomModelPopupViewDismiss}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.popupContainer}>
            <Text style={styles.headerText}>Select One</Text>
            <View style={styles.dividerSmall} />

            <TouchableOpacity style={styles.button} onPress={() => selectedButtomPopupAction('1')}>
              <Text style={styles.buttonText}>SDL Task List</Text>
            </TouchableOpacity>

            <View style={styles.dividerLarge} />

            <TouchableOpacity style={styles.button} onPress={() => selectedButtomPopupAction('2')}>
              <Text style={styles.buttonText}>Unscheduled SDL</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  popupContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%', // Make sure the popup container takes the full width
  },
  headerText: {
    fontWeight: '400',
    textAlign: 'center',
    padding: 16,
    fontSize: 12,
    color: 'grey',
  },
  dividerSmall: {
    height: 2,
    backgroundColor: 'grey',
    width: 50,
  },
  button: {
    justifyContent: 'center', // Center the text vertically
    padding:16
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  dividerLarge: {
    height: 1,
    backgroundColor: 'grey',
    width: '90%',
    marginVertical: 8,
  },
});
