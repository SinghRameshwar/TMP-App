import { SafeAreaView, Image, View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native'
import Loading from '../../../common/component/Loading';
import { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MessageString } from '../../../assets/Strings';
import { ScrollView } from 'react-native-gesture-handler';
import BackNavigationWithTitleBar from '../../../common/component/BackNavigationWithTitleBar';
import moment from 'moment';
import { UnscheduledLocTskApiCall } from '../../../common/services/UnscheduledLocTskApiCall';
import { UnscheduledClientApiCall } from '../../../common/services/UnscheduledClientApiCall';
import { UnscheduledServiceApiCall } from '../../../common/services/UnscheduledServiceApiCall';
import { UnscheduledDataSaveApiCall } from '../../../common/services/UnscheduledDataSaveApiCall';
import { UnscheduledClockInOutApiCall } from '../../../common/services/UnscheduledClockInOutApiCall';
import { getLocation, locationPermasion } from '../../../common/Helpers/locationPermasion';
import { getDistance } from '../../../common/Helpers/helpersMethod';

const UnscheduledContainer = ({ route, navigation }) => {
    const [loding, setloding] = useState(false);
    const [isDownOpen, setisDownOpen] = useState(0);
    const [selectedLocation, setselectedLocation] = useState('');
    const [selectedClient, setselectedClient] = useState('');
    const [selectedService, setselectedService] = useState('');
    const [locationList, setlocationList] = useState([]);
    const [clientList, setclientList] = useState([]);
    const [serviceList, setserviceList] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const callBackMethod = route?.params?.callBackMethod;

    const locationServiceCall = async () => {
        try {
            setloding(true)
            let response = await UnscheduledLocTskApiCall()
            if (response.code === 200 && !response.error) {
                const locationResult = await getLocation();
                const filtersDataPromises = response.results.map(async (item) => {
                    let distance = await getDistance(
                        { lat: item?.latitude, lng: item?.longitude },
                        { lat: locationResult.coords.latitude, lng: locationResult.coords.longitude }
                    );
                    return distance <= 300 ? item : null;
                });

                const filtersData = (await Promise.all(filtersDataPromises)).filter(Boolean);
                setlocationList(filtersData);
            }
            setloding(false)
        } catch (error) {
            setloding(false);
            Alert.alert('Warning', error.message)
        }

    }

    const clientListServiceCall = async (payload) => {
        setloding(true)
        let response = await UnscheduledClientApiCall({
            locationCode: payload.loc_code //6363
        })
        setloding(false)
        if (response.code === 200 && !response.error) {
            setclientList(response.results);
        }
    }

    const serviceListServiceCall = async (payload) => {
        setloding(true)
        let response = await UnscheduledServiceApiCall({
            clientId: payload.qmrp_id    //989898
        })
        setloding(false)
        if (response.code === 200 && !response.error) {
            setserviceList(response.results);
        }
    }

    const locationCheckAndCallService = async () => {
        const result = await locationPermasion();
        if (!result) {
            Alert.alert('Warning', 'Location permission denied');
            return
        }
        await locationServiceCall();
    }

    useEffect(() => {
        locationCheckAndCallService()
    }, [])

    const onSelectDropDownList = (type, data) => {
        if (type === 'location') {
            setselectedLocation(data);
            setselectedClient('');
            setselectedService('');
            setclientList([]);
            setserviceList([]);
            clientListServiceCall(data)

        } else if (type === 'client') {
            setselectedClient(data);
            setselectedService('');
            setserviceList([]);
            serviceListServiceCall(data)

        } else if (type === 'service') {
            setselectedService(data);
        }
        setisDownOpen(0);
    }

    const onSelectDropDown = (type) => {
        if (type === 'location') {
            setisDownOpen(isDownOpen === 1 ? 0 : 1);
        } else if (type === 'client') {
            setisDownOpen(isDownOpen === 2 ? 0 : 2);
        } else if (type === 'service') {
            setisDownOpen(isDownOpen === 3 ? 0 : 3);
        }

    }

    const saveuncheduledData = async () => {
        if (selectedLocation === '') {
            Alert.alert('Warning', 'Location Service!');
            return;
        } else if (selectedClient === '') {
            Alert.alert('Warning', 'Select Client!');
            return;
        } else if (selectedService === '') {
            Alert.alert('Warning', 'Select Service!');
            return;
        }


        const formData = new FormData();
        formData.append('client_id', selectedClient.qmrp_id);
        formData.append('code_id', selectedService.code_id);
        formData.append('location_code', selectedLocation.loc_code);
        formData.append('is_evv', !isEnabled ? 0 : 1);

        setloding(true)
        let response = await UnscheduledDataSaveApiCall(formData);
        if (response.code === 200 && !response.error) {
            let result = await UnscheduledClockInOutApiCall({
                unschuledId: response?.results?.entry_no
            })
            if (result.code === 200 && !result.error) {
                navigation.navigate('SDLClockinOutDeleteContainer', { data: result.results, tytleType: 'clock-in', date: moment().format('YYYY-MM-DD'), callBackMethod: callBackMethod });
            } else {
                Alert.alert('Warning', response.message);
            }
        } else {
            Alert.alert('Warning', response.message);
        }
        setloding(false)

    }

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../../../assets/images/login_bg.jpg")}
                resizeMode="cover"
                style={styles.backgroundImage}
            />

            <View style={styles.overlay}>
                <View style={styles.headerContainer}>
                    <BackNavigationWithTitleBar navigation={navigation} title="Unscheduled" date={moment().format('YYYY-MMM-DD')} />
                </View>

                <View style={styles.listViewHeader}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ fontWeight: '300', fontSize: 12, color: 'grey', marginBottom: 40 }}>Unscheduled tasks are planned for a project but do not have definite schedule dates. Now, the Gantt control supports rendering the unscheduled tasks.</Text>

                        <View style={styles.searchContainer}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onSelectDropDown('location')}>
                                <Text style={styles.label}>Select Location: </Text>
                                <Text style={{ color: 'black', paddingTop: 10, paddingBottom: 10, textAlign: 'right', flex: 1 }}>{selectedLocation.loc_name}</Text>
                                <AntDesign name="down" size={15} color="grey" style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>

                        {isDownOpen === 1 && (
                            locationList?.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => onSelectDropDownList('location', item)}>
                                    <Text style={styles.itemText}>
                                        {item.loc_name}
                                    </Text>
                                    {/* <View style={styles.separator} /> */}
                                </TouchableOpacity>
                            ))
                        )}

                        <Text style={{ marginTop: 20, marginBottom: 20, display: selectedLocation !== '' ? 'flex' : 'none' }}> {'Location:- ' + selectedLocation.loc_name} </Text>

                        <View style={styles.searchContainer}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onSelectDropDown('client')}>
                                <Text style={styles.label}>Select Client: </Text>
                                <Text style={{ color: 'black', paddingTop: 10, paddingBottom: 10, textAlign: 'right', flex: 1 }}>{selectedClient.fname} {selectedClient.lname}</Text>
                                <AntDesign name="down" size={15} color="grey" style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>

                        {isDownOpen === 2 && (
                            clientList?.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => onSelectDropDownList('client', item)}>
                                    <Text style={styles.itemText}>
                                        {item.fname}  {item.lname}
                                    </Text>
                                    {/* <View style={styles.separator} /> */}
                                </TouchableOpacity>
                            ))
                        )}

                        <View style={styles.searchContainer}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onSelectDropDown('service')}>
                                <Text style={styles.label}>Select Service: </Text>
                                <Text style={{ color: 'black', paddingTop: 10, paddingBottom: 10, textAlign: 'right', flex: 1 }}>{selectedService.title}</Text>
                                <AntDesign name="down" size={15} color="grey" style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>

                        {isDownOpen === 3 && (
                            serviceList?.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => onSelectDropDownList('service', item)}>
                                    <Text style={styles.itemText}>
                                        {item.title}
                                    </Text>
                                    {/* <View style={styles.separator} /> */}
                                </TouchableOpacity>
                            ))
                        )}

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={{ flex: 1 }}>Enable EVV</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>


                        <TouchableOpacity style={{
                            backgroundColor: '#59B952', borderRadius: 20, marginBottom: 10, marginLeft: 16, marginRight: 16, marginTop: '40%', elevation: 10,
                            shadowColor: 'grey',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        }} onPress={() => saveuncheduledData()}>
                            <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>Schedule & Clock In</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <Loading lodingType={loding} message={MessageString.loading} />
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
    },
    headerContainer: {
        padding: 16,
    },
    listViewHeader: {
        flex: 1,
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: 20,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16

    },
    itemText: {
        color: 'black',
        padding: 15,
        textAlign: 'right',
    },
    separator: {
        backgroundColor: 'grey',
        height: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E2F6E3',
        borderRadius: 5,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        elevation: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    searchContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchImage: {
        width: 40,
        height: 40,
    },
    searchText: {
        color: '#0E1012',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 10,
    },

});



export default UnscheduledContainer;