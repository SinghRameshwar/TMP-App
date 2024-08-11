import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import BackNavigationWithTitleBar from '../../../common/component/BackNavigationWithTitleBar';
import moment from 'moment';
import Loading from '../../../common/component/Loading';
import { MessageString } from '../../../assets/Strings';
import { SessionOut } from '../../../common/Helpers/SessionOut';
import { TextInput } from 'react-native-gesture-handler';
import { MEDMagSchedulesApi } from '../../../common/services/MEDMagSchedulesApi';
import NetInfo from '@react-native-community/netinfo';
import { retrySavedData } from '../data/retrySavedData';
import { requestMEDDetilService } from '../../../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { filterListForRemoveData, getMedManagmentDetailsbyKey, medManagmentDetailsoffLineSave } from '../../../common/Helpers/AsyncLocalSave';


const MEDManagmentDetailsContainer = ({ route, navigation }) => {
    const [loding, setloding] = useState(false);
    const [dataList, setdataList] = useState({});
    const [rowData, setRowData] = useState([]);
    const [rxnumber, setrxnumber] = useState('');
    const [selectrdwhatHappen, setselectrdwhatHappen] = useState('Select Option');
    const [selectrdwhatHappenkey, setselectrdwhatHappenkey] = useState('');
    const [whatHappendList, setwhatHappendList] = useState([]);
    const [whatHappendListkey, setwhatHappendListkey] = useState([]);
    const [isDownOpen, setisDownOpen] = useState(false)
    const [date, setdate] = useState(route.params?.date);
    const callBackMethod = route?.params?.callBackMethod;
    const dispatch = useDispatch();
    const serviceResponse = useSelector((state) => state.MEDDetailsRedu.data);

    const whatHappendAction = () => {
        setisDownOpen(!isDownOpen);
    }

    const onSelectDropDownList = (item, index) => {
        setselectrdwhatHappen(item)
        setselectrdwhatHappenkey(whatHappendListkey[index])
        setisDownOpen(false);
    }

    const saveMEDManagenentDetails = async () => {
        if (selectrdwhatHappen === 'Select Option') {
            Alert.alert('Warning', 'Please select what happened field!');
            return
        }
        setloding(true);
        try {
            const data1 = route.params.data;
            let json_obj = {
                selected_med_key: data1.key,
                dr_order_id: dataList?.dr_orders[0].id,
                client_id: data1.client_id,
                date: dataList.date,
                time: dataList.time,
                scan_input: rxnumber + "",
                what_happened: selectrdwhatHappen === 'Select Option' ? '' : selectrdwhatHappenkey,
                type: "1",
                medication: dataList?.dr_orders[0].med,
                submitted_at: moment().format('YYYY-MM-DD HH:mm'),
                autoScannedTime: "",
                manualScannedTime: dataList.date,
            };

            // Check network status
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                // Network is available, call the API
                const response = await MEDMagSchedulesApi(json_obj);
                setloding(false);
                if (response.code === 200 && response.error === false) {
                    callBackMethod();
                    navigation.goBack();
                } else if (response.code === 401 && response.error === true) {
                    SessionOut(dispatch);
                } else {
                    Alert.alert('Warning', response.message);
                }
            } else {
                // Network is not available, save json_obj to local storage
                let result = await medManagmentDetailsoffLineSave(json_obj);
                let result1 = await filterListForRemoveData(date, data1.key);
                if (result && result1) {
                    Alert.alert('Success!',
                        'Network not available. Data saved locally.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    callBackMethod();
                                    navigation.goBack();
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
                setloding(false);
            }
        } catch (error) {
            setloding(false);
            Alert.alert('Warning!', error.message);
        }
    };

    // Call retrySavedData on app start or when network status changes
    NetInfo.addEventListener(retrySavedData);

    const strucherdDataForShow = (response) => {
        setdataList(response);
        const dr_orders = response?.dr_orders[0];
        setRowData([
            { name: 'Rx', value: dr_orders?.prev_rx }, { name: 'Start Date', value: dr_orders?.start_date }, { name: 'End Date', value: dr_orders?.end_date },
            { name: 'Order', value: dr_orders?.order }, { name: 'Route', value: dr_orders?.route }, { name: 'Additional Info', value: dr_orders?.additional_info },
            { name: 'Special Instructions', value: dr_orders?.special_instructions }, { name: 'Side Effect', value: dr_orders?.side_effects }
        ])
        setwhatHappendList(Object.values(response?.what_happened));
        setwhatHappendListkey(Object.keys(response?.what_happened))
    }

    const serviceResponseHandel = (response) => {
        setloding(false)
        if (response.code === 200 && response.error === false) {
            strucherdDataForShow(response.results)

        } else if (response.code === 401 && response.error === true) {
            SessionOut(dispatch)
        } else {
            setdataList([]);
            Alert.alert('Warning', response.message);
        }
    }

    useEffect(() => {
        if (serviceResponse !== null)
            serviceResponseHandel(serviceResponse?.payload);
    }, [serviceResponse])

    const apiCallonViewLoad = async (data1) => {
        const client_id = data1.client_id
        const emar_sel_date = moment(data1.start).format('YYYY-MM-DD');
        const emar_sel_time = moment(data1.start).format('HH:mm');
        const order_ids_array = Object.keys(data1.description);
        const order_ids = order_ids_array.join(',');
        const key = data1.key

        const state = await NetInfo.fetch();
        if (state.isConnected) {
            setloding(true)
            await dispatch(requestMEDDetilService({
                order_ids: order_ids,
                client_id: client_id,
                date: emar_sel_date,
                time: emar_sel_time,
                key: key
            }));
        } else {
            let response = await getMedManagmentDetailsbyKey(key)
            strucherdDataForShow(response)
        }
    }

    const scannedQrCodeAcrtion = () => {
        navigation.navigate('QRCodeScanCamera', { callBack: callBackMethodQRScanned })
    }

    const callBackMethodQRScanned = (data) => {
        setrxnumber(data)
    }


    useEffect(() => {
        const data1 = route.params.data;
        apiCallonViewLoad(data1);
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../../../assets/images/login_bg.jpg")}
                resizeMode="cover"
                style={styles.backgroundImage}
            />

            <View style={styles.overlay}>
                <BackNavigationWithTitleBar navigation={navigation} title="EMAR" date={date} />

                <View style={styles.listViewHeader}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require("../../../assets/images/app_logo.png")}
                            resizeMode="contain"
                            style={styles.userImage}
                        />

                        <View style={{ flexDirection: 'column', padding: 16 }}>
                            <Text style={styles.userName}>{dataList?.client?.name}</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>DOB: </Text>
                                <Text style={styles.value}>{dataList?.client?.dob}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Local Case#: </Text>
                                <Text style={styles.value}>{dataList?.client?.case_no}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Program Type: </Text>
                                <Text style={styles.value}>{dataList?.client?.program}</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchContent}>
                                <AntDesign name="medicinebox" size={25} color="#14669A" style={styles.navigationBarIcon} />
                                <Text style={styles.searchText}>{dataList.dr_orders ? dataList?.dr_orders[0]?.med : ''}</Text>
                            </View>

                            <TouchableOpacity onPress={""} style={{ display: dataList.hasEdit === true ? "flex" : 'none' }}>
                                <Entypo name="pencil" size={25} color="#14669A" style={styles.navigationBarIcon} />
                            </TouchableOpacity>
                        </View>

                        {rowData.map((item, index) => (
                            <View key={index} style={styles.rowContainer}>
                                <Text style={styles.label}>{item.name}: </Text>
                                <Text style={styles.value}>{item.value}</Text>
                            </View>
                        ))}

                        {/* ------- Rx Number Input Box ----- */}
                        <View style={[styles.rowContainer, { alignItems: 'center' }]}>
                            <Text style={styles.label}>Rx Number: </Text>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 10, width: "50%", height: 41, fontSize: 12, paddingHorizontal: 10, textAlign: 'right', alignItems: 'center' }}
                                placeholder='Rx number'
                                defaultValue={rxnumber}
                                onChangeText={(text) => setrxnumber(text)}
                            />
                            <Icon name="barcode" size={25} color="#14669A" style={{ marginLeft: -50 }} onPress={scannedQrCodeAcrtion} />
                        </View>

                        {/* ------- Date Field ----- */}
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Date: </Text>
                            <Text style={styles.value}>{dataList?.date}</Text>
                        </View>

                        {/* ------- Time Field ----- */}
                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Time: </Text>
                            <Text style={styles.value}>{dataList?.time}</Text>
                        </View>

                        {/* ------- Spinner ----- */}
                        <View style={styles.searchContainer}>
                            <Text style={styles.label}>What Happened: </Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => whatHappendAction()}>
                                <Text style={{ color: 'black', paddingTop: 10, paddingBottom: 10, textAlign: 'right' }}>{selectrdwhatHappen}</Text>
                                <AntDesign name="down" size={15} color="grey" style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'flex-end', paddingRight: 24 }}>
                            {isDownOpen && (
                                whatHappendList?.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => onSelectDropDownList(item, index)}>
                                        <Text style={styles.itemText}>
                                            {item}
                                        </Text>
                                        {/* <View style={styles.separator} /> */}
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>

                        <TouchableOpacity style={{
                            backgroundColor: '#59B952',
                            borderRadius: 20,
                            marginBottom: 10,
                            marginLeft: 16,
                            marginRight: 16,
                            marginTop: 50,
                            elevation: 10,
                            shadowColor: 'grey',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        }} onPress={() => saveMEDManagenentDetails()}>
                            <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>Save</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <Loading lodingType={loding} message={MessageString.loading} />
            </View>
        </SafeAreaView>
    );
};

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
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
        alignItems: 'center'
    },
    welcomeText: {
        fontWeight: '500',
        fontSize: 16,
        color: "#0E1012",
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentDate: {
        fontWeight: '400',
        fontSize: 12,
        color: "#0E1012",
    },
    userImage: {
        height: 104,
        width: 104,
        borderRadius: 30,
    },
    userName: {
        color: '#14669A',
        fontWeight: '700',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        color: '#0E1012',
        fontWeight: '700',
        fontSize: 12,
    },
    value: {
        color: '#0E1012',
        fontWeight: '400',
        fontSize: 12,
    },
    listViewHeader: {
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        flex: 1
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 5,
        paddingBottom: 5,
    },
    navigationBarIcon: {
        padding: 8,
    },
    itemContainer: {
        flex: 1,
        width: '100%',
    },
    itemText: {
        color: 'black',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'right',
    },
    separator: {
        backgroundColor: 'grey',
        height: 1,
    },
});

export default MEDManagmentDetailsContainer;
