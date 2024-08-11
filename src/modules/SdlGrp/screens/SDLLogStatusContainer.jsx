import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import WelcomeNavigationBar from "../../../common/component/WelcomeNavigationBar";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useEffect, useState } from "react";
import Loading from "../../../common/component/Loading";
import { MessageString } from "../../../assets/Strings";
import { SessionOut } from "../../../common/Helpers/SessionOut";
import { requestSDLService } from "../../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import NetInfo from '@react-native-community/netinfo';
import ModelPopupView from "../component/ModelPopupView";
import moment from "moment";
import MenuListComp from "../../HomeGrp/component/MenuListComp";


const SDLLogStatusContainer = ({ navigation, setisbuttomTabDisplay }) => {
    const [upcomingTaskList, setUpcomingTaskList] = useState({});
    const [loding, setloding] = useState(false);
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [isDocEnable, setisDocEnable] = useState(false);// pending....
    const dispatch = useDispatch();
    const serviceResponse = useSelector((state) => state.SDLStatusRedu.data);
    const [isdisplaybuttomPopup, setisdisplaybuttomPopup] = useState(false);
   // console.log('------------------', serviceResponse.payload.results)


    const buttomModelPopupViewDisplay = () => {
        setisdisplaybuttomPopup(true);
        setisbuttomTabDisplay(false);
    }

    const buttomModelPopupViewDismiss = () => {
        setisdisplaybuttomPopup(false);
        setisbuttomTabDisplay(true);
    }

    const selectedButtomPopupAction = (type) => {
        if (type === "1") {
            navigation.navigate('SDLContainer', { callBackMethod: apiCallonViewLoad });
        } else {
            navigation.navigate('UnscheduledContainer', { callBackMethod: apiCallonViewLoad });
        }

        buttomModelPopupViewDismiss()
    }

    const actionForClockinOut = () => {
        if (upcomingTaskList?.clockout_time === "" || upcomingTaskList?.clockout_time === null) {
            navigation.navigate('SDLClockinOutDeleteContainer', { data: upcomingTaskList, tytleType: 'clock-out', date: moment(new Date()).format('YYYY-MM-DD'), callBackMethod: apiCallonViewLoad });
        } else {
            buttomModelPopupViewDisplay();
        }
    }

    const documentSDLAction = (data) =>{
        navigation.navigate('FillDocumentContainer', { data: {status: data}, tytleType: 'log', date: moment(new Date()).format('YYYY-MM-DD'), callBackMethod: apiCallonViewLoad });
    }

    const serviceResponseHandel = async (response) => {
        setloding(false)
        if (response?.code === 200 && response?.error === false) {
            setUpcomingTaskList(response.results);

        } else if (response?.code === 401 && response?.error === true) {
            SessionOut(dispatch)
        } else {
            setUpcomingTaskList([]);
            Alert.alert('Warning', response?.message);
        }
    }

    useEffect(() => {
        if (serviceResponse !== null)
            serviceResponseHandel(serviceResponse?.payload);
    }, [serviceResponse])

    const apiCallonViewLoad = async () => {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            setloding(true)
            await dispatch(requestSDLService());
        }
    }

    useEffect(() => {
        apiCallonViewLoad()
    }, [])


    const taskStatusCardView = (data) => (
        <View style={styles.taskStatusContainer}>
            <View style={styles.taskStatusCard}>
                <Text style={styles.statusCount}>Clocked in</Text>
                <Text style={styles.statusText}>{data?.clockin_time}</Text>
            </View>

            <View style={[styles.taskStatusCard, { backgroundColor: '#FFEEDB' }]}>
                <Text style={styles.statusCount}>Clocked Out</Text>
                <Text style={styles.statusText}>{data?.clockout_time === null || data?.clockout_time === '' ? 'Pending' : data?.clockout_time}</Text>
            </View>
        </View>
    );

    const listRowCell = (data) => (

        <View style={styles.listRowContainer}>
            <View style={styles.listRowHeader}>
                <View style={styles.listRowHeaderText}>
                    <Text>
                        <Text style={styles.taskTitle}>{data?.schedule?.service_delivery_code_title}: </Text>
                        <Text style={styles.taskSubtitle}>{data?.schedule?.service_delivery_code}</Text>
                    </Text>
                </View>
                <Text style={styles.taskDate}>{data?.schedule?.date} | {data?.schedule?.service_time}</Text>
            </View>

            <View style={styles.listRowContent}>
                <View style={styles.listRowDetails}>
                    <FontAwesome name="user-o" size={15} color="#14669A" style={[styles.icon, { marginRight: 7 }]} />
                    <Text style={styles.detailText}>{data?.schedule?.client_fname} {data?.schedule?.client_lname}</Text>
                    <Text style={styles.separator}> | </Text>
                    <Icon name="mail-outline" size={15} color="#14669A" style={styles.icon} />
                    <Text style={styles.detailText}>{data?.schedule?.client_id}</Text>
                </View>
                <View style={styles.listRowDetails}>
                    <Icon name="location-outline" size={15} color="#14669A" style={styles.icon} />
                    <Text style={styles.detailText}>{data?.schedule?.location?.location_address}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{
                    backgroundColor: data?.clockout_time === null || data?.clockout_time === '' ? '#FFEEDB' : '#E2F6E3',
                    width: 130,
                    padding: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#F59E3B',
                    borderRadius: 20,
                    flexDirection: 'row',
                    marginLeft: 10,
                    marginBottom: 16,
                    elevation: 10,
                    shadowColor: 'grey',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                }}>
                    <EvilIcons name="clock" size={15} color="#14669A" style={styles.icon} />
                    <Text style={{ fontWeight: '300', size: 12, color: '#0E1012' }}>{data?.clockout_time === null || data?.clockout_time === '' ? 'Incomplete' : 'Completed'}</Text>

                </View>

                {data?.clockout_time !== null && data?.clockout_time !== '' && isDocEnable && (
                    <TouchableOpacity style={{
                        backgroundColor: '#E2F6E3',
                        width: 150,
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                       // borderWidth: 1,
                       // borderColor: '#F59E3B',
                       // borderRadius: 20,
                        flexDirection: 'row',
                        marginRight: 10,
                        marginBottom: 16,
                        elevation: 10,
                        shadowColor: 'grey',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                    }}
                    onPress={() => documentSDLAction(data)}>
                        <Icon name="document" size={15} color="#14669A" style={styles.icon} />
                        <Text style={{ fontWeight: '300', size: 12, color: '#0E1012' }}>Document SDL</Text>

                    </TouchableOpacity>
                )}
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
                <View style={styles.headerContainer}>
                    <WelcomeNavigationBar setisMenuOpen={setisMenuOpen} isMenuOpen={isMenuOpen} />
                </View>

                <View style={styles.listViewHeader}>
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#0E1012' }}>Your Latest Service Delivery Log</Text>

                    {taskStatusCardView(upcomingTaskList)}
                    {listRowCell(upcomingTaskList)}

                    <TouchableOpacity style={{
                        backgroundColor: '#59B952',
                        borderRadius: 20,
                        marginBottom: 10,
                        marginLeft: 16,
                        marginRight: 16,
                        marginTop: '60%',
                        elevation: 10,
                        shadowColor: 'grey',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                    }} onPress={() => actionForClockinOut()}>
                        <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>Clock Time</Text>
                    </TouchableOpacity>
                </View>
                <Loading lodingType={loding} message={MessageString.loading} />
                {isdisplaybuttomPopup && (
                    <ModelPopupView buttomModelPopupViewDismiss={buttomModelPopupViewDismiss} selectedButtomPopupAction={selectedButtomPopupAction} />
                )}
            </View>
            <MenuListComp setisMenuOpen={setisMenuOpen} isMenuOpen={isMenuOpen} dispatch={dispatch} />
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
        elevation: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
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
        marginTop: 20,
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

export default SDLLogStatusContainer;