import {NavigationContainerRef} from '@react-navigation/native';
import React from 'react';

// Define your RootStackParamList type
type RootStackParamList = {
  TimeSheetStatus: undefined;
  LoginScreen: undefined;
};

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export const replace = (name: keyof RootStackParamList, params?: any) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name, params }],
  });
};