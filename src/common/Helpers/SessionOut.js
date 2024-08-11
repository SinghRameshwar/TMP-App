import AsyncStorage from '@react-native-async-storage/async-storage';
import {replace} from './NavigationService';
import { fetchedMEDDetilService, fetchedMEDManagListService, fetchedSDLService, fetchedSDLTskListService } from '../../redux/action';

export const SessionOut = async (dispatch) => {
  await AsyncStorage.removeItem('@loginData');
  dispatch(fetchedSDLService([]));
  dispatch(fetchedSDLTskListService([]));
  dispatch(fetchedMEDManagListService([]));
  dispatch(fetchedMEDDetilService([]));
  replace('LoginContainer');
  // AsyncStorage.getAllKeys()
  //   .then(keys => AsyncStorage.multiRemove(keys))
  //   .then(() => {
  //     replace('LoginScreen');
  //   });
};