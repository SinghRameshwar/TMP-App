import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useEffect, useRef, useState } from "react";
import BackNavigationWithTitleBar from "../../../common/component/BackNavigationWithTitleBar";
import { SDLClockinApi } from "../../../common/services/SDLClockinApi";
import { SDLClockoutApi } from "../../../common/services/SDLClockoutApi";
import { SDLClockOutDeleteApi } from "../../../common/services/SDLClockOutDeleteApi";
import { getLocation, locationPermasion } from "../../../common/Helpers/locationPermasion";
import { getCurrentDatetime, getDistance } from "../../../common/Helpers/helpersMethod";
import Loading from "../../../common/component/Loading";
import { MessageString } from "../../../assets/Strings";
import moment from "moment";

const SDLClockinOutDeleteContainer = ({ route, navigation }) => {
    const [dataObj, setdataObj] = useState({});
    const [titleType, settitleType] = useState('clock-in');
    const [clockOutObj, setclockOutObj] = useState({});
    const [date, setdate] = useState(route?.params?.date);
    const [isClockOutDone, setisClockOutDone] = useState(false);
    const allowedClockDistance = 300; // in meter
    const [loding, setloding] = useState(false);
    const callBackMethod = route?.params?.callBackMethod;
    const clockedOutData = useRef({});


    useEffect(() => {
        if (route?.params?.tytleType === 'clock-in') {
            setdataObj(route?.params?.data);
        } else {
            setdataObj(route?.params?.data.schedule);
            setclockOutObj(route?.params?.data);
        }
        settitleType(route?.params?.tytleType)
    }, [])


    const clockInOutButtonClickAction = async () => {

        const result = await locationPermasion()
        if (!result) {
            Alert.alert('Warning', 'Location permission denied');
            return
        }
        const locationResult = await getLocation();
        let distance = await getDistance({ lat: dataObj.location.location_lat, lng: dataObj.location.location_lon }, { lat: locationResult.coords.latitude, lng: locationResult.coords.longitude })
        if (distance > allowedClockDistance) {
            Alert.alert('Warning', 'Error. You are far from assigned location.');
            return
        }

        setloding(true)
        let current_time = await getCurrentDatetime()
        if (titleType === 'clock-in') {
            let result = await SDLClockinApi({
                latitude: locationResult.coords.latitude,
                longitude: locationResult.coords.longitude,
                accuracy: locationResult.coords.accuracy,
                altitude: locationResult.coords.altitude,
                sdl_entry_no: dataObj.entry_no,
                time_slot: Array.isArray(dataObj.service_time) ? dataObj.service_time[0] : dataObj.service_time,
                time: current_time,
            })
            //{"code": 200, "error": false, "message": "Success - Clocked In", "results": {"clock_id": 139}}
            if (result.code === 200 && result.error === false) {
                callBackMethod();
                navigation.pop(2);
            } else {
                Alert.alert('Warning', result.message);
            }
        } else {
            let result = await SDLClockoutApi({
                latitude: locationResult.coords.latitude,
                longitude: locationResult.coords.longitude,
                accuracy: locationResult.coords.accuracy,
                altitude: locationResult.coords.altitude,
                clock_id: clockOutObj.clock_id,
                time: current_time,
            })
            if (result.code === 200 && result.error === false) {
                clockedOutData.current = result.results;
                setisClockOutDone(true);
                callBackMethod();
            } else {
                Alert.alert('Warning', result.message);
            }
        }
        setloding(false)

    }

    const clockInDeleteButtonClickAction = async () => {
        setloding(true)
        let result = await SDLClockOutDeleteApi({
            clock_id: clockOutObj.clock_id,
        })
        setloding(false)
        if (result.code === 200 && result.error === false) {
            callBackMethod();
            navigation.pop(1);
        } else {
            Alert.alert('Warning', result.message);
        }
    }

    const goBackOrForSDLDocument = (type) => {
        if (type == 'back') {
            navigation.pop(1);
        } else {
            navigation.navigate('FillDocumentContainer', { data: clockedOutData.current, date: moment(date).format('YYYY-MM-DD'), callBackMethod: callBackMethod });
        }
    }


    const taskStatusCardView = (data) => (
        <View style={styles.taskStatusContainer}>
            <View style={styles.taskStatusCard}>
                <Text style={styles.statusCount}>Clocked in</Text>
                <Text style={styles.statusText}>{data?.clockin_time}</Text>
            </View>
        </View>
    );

    const listRowCell = (data) => (

        <View style={styles.listRowContainer}>
            <View style={styles.listRowHeader}>
                <View style={styles.listRowHeaderText}>
                    <Text>
                        <Text style={styles.taskTitle}>{data?.service_delivery_code_title}: </Text>
                        <Text style={styles.taskSubtitle}>{data?.service_delivery_code}</Text>
                    </Text>
                </View>
                <Text style={styles.taskDate}>{data?.date ? data?.date : data?.begin_date} | {data?.service_time}</Text>
            </View>

            <View style={styles.listRowContent}>
                <View style={styles.listRowDetails}>
                    <FontAwesome name="user-o" size={15} color="#14669A" style={[styles.icon, { marginRight: 7 }]} />
                    <Text style={styles.detailText}>{data?.client_fname} {data?.client_lname}</Text>
                    <Text style={styles.separator}> | </Text>
                    <Icon name="mail-outline" size={15} color="#14669A" style={styles.icon} />
                    <Text style={styles.detailText}>{data?.client_id}</Text>
                </View>
                <View style={styles.listRowDetails}>
                    <Icon name="location-outline" size={15} color="#14669A" style={styles.icon} />
                    <Text style={styles.detailText}>{data?.location?.location_address}</Text>
                </View>
            </View>

        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../../../assets/images/login_bg.jpg")}
                resizeMode="cover"
                style={styles.backgroundImage}
            />

            <View style={styles.overlay}>
                <BackNavigationWithTitleBar navigation={navigation} title={titleType === 'clock-in' ? 'SDL Clock-In' : 'SDL Clock-Out'} date={date} />

                <View style={styles.listViewHeader}>

                    {titleType !== 'clock-in' && taskStatusCardView(clockOutObj)}
                    {listRowCell(dataObj)}

                    {!isClockOutDone && (
                        <TouchableOpacity style={{
                            backgroundColor: '#59B952',
                            borderRadius: 20,
                            marginBottom: 10,
                            marginLeft: 16,
                            marginRight: 16,
                            marginTop: '70%',
                            elevation: 10,
                            shadowColor: 'grey',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        }} onPress={() => clockInOutButtonClickAction()}>
                            <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>{titleType === 'clock-in' ? 'Clock In' : 'Clock Out'}</Text>
                        </TouchableOpacity>
                    )}

                    {isClockOutDone && (
                        <View style={{ marginTop: '10%', alignItems: 'center' }}>
                            <Text style={{ color: 'green', marginBottom: 20 }}>You have successfully clocked out!</Text>
                            <View style={{ marginTop: '40%', flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginLeft: 16, marginRight: 16, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 10, }} onPress={() => goBackOrForSDLDocument('back')}>
                                    <Text style={{ color: 'black', fontWeight: '500', alignSelf: 'center', padding: 10 }}>    Back to SDL log     </Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ marginLeft: 16, marginRight: 16, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 10 }} onPress={() => goBackOrForSDLDocument('doc')}>
                                    <Text style={{ color: 'black', fontWeight: '500', alignSelf: 'center', padding: 10 }}>    Document SDL   </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {!isClockOutDone && titleType !== 'clock-in' && <TouchableOpacity style={{ marginLeft: 16, marginRight: 16, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }} onPress={() => clockInDeleteButtonClickAction()}>
                        <AntDesign name="delete" size={15} color="#14669A" style={styles.icon} />
                        <Text style={{ color: 'black', fontWeight: '500', alignSelf: 'center', padding: 10 }}>Delete Clock In</Text>
                    </TouchableOpacity>
                    }

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
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
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
    username: {
        fontWeight: '700',
        fontSize: 18,
        color: "#14669A",
    },
    currentDate: {
        fontWeight: '400',
        fontSize: 12,
        color: "#0E1012",
        alignSelf: 'flex-end',
        marginLeft: 5,
    },
    userImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    taskStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    taskStatusCard: {
        backgroundColor: '#E2F6E3',
        borderRadius: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 7,
        paddingBottom: 7,
        flex: 1,
        marginHorizontal: 5,
    },
    statusCount: {
        fontWeight: '700',
        fontSize: 14,
        color: "#0E1012",
    },
    statusText: {
        fontWeight: '300',
        fontSize: 12,
        color: "#3E4041",
    },
    listViewHeader: {
        flex: 1,
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: 30,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16

    },
    listViewHandle: {
        width: 40,
        height: 2,
        backgroundColor: 'black',
        alignSelf: 'center',
    },
    listViewHeaderText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upcomingTasksText: {
        fontWeight: '700',
        fontSize: 18,
        color: "black",
        flex: 1,
    },
    flatList: {
        flex: 1,
        backgroundColor: 'white'
    },
    flatListContent: {
        paddingBottom: 16,
        paddingRight: 16,
        paddingLeft: 16
    },
    listRowContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        shadowColor: 'grey',
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderRadius: 5,
        marginTop: 20
    },
    listRowHeader: {
        backgroundColor: '#F4FFFF',
        padding: 7,
    },
    listRowHeaderText: {
        flexDirection: 'row',
    },
    taskTitle: {
        fontWeight: '800',
        fontSize: 14,
        color: "black",
    },
    taskSubtitle: {
        fontWeight: '500',
        fontSize: 14,
        color: "black",
    },
    taskDate: {
        fontWeight: '300',
        fontSize: 12,
        color: "black",
    },
    listRowContent: {
        padding: 7,
        backgroundColor: 'white',
    },
    listRowDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 5,
    },
    detailText: {
        fontWeight: '300',
        fontSize: 14,
        color: "black",
    },
    separator: {
        fontWeight: '300',
        fontSize: 12,
        color: "black",
        marginHorizontal: 5,
    },
    navigationBarIcon: {
        backgroundColor: '#E2F6E3',
        padding: 8,
        borderRadius: 30,
        marginBottom: 10
    }
});

export default SDLClockinOutDeleteContainer;