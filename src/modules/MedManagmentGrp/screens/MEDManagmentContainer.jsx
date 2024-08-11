import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import NarationViewWithbutton from '../../../common/component/NarationViewWithbutton';
import Loading from '../../../common/component/Loading';
import { MessageString } from '../../../assets/Strings';
import { SessionOut } from '../../../common/Helpers/SessionOut';
import { requestMEDManagListService } from '../../../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { getAsyncMedManagmentListbyKey } from '../../../common/Helpers/AsyncLocalSave';

const MEDManagmentContainer = ({ route, navigation }) => {
    const [upcomingTaskList, setUpcomingTaskList] = useState([]);
    const [filteredTaskList, setFilteredTaskList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [loding, setloding] = useState(false);
    const dispatch = useDispatch();
    const serviceResponse = useSelector((state) => state.MEDManagListRedu.data);

    const serviceResponseHandel = (response) => {
        setloding(false)
        if (response.code === 200 && response.error === false) {
            setUpcomingTaskList(response.results);
            setFilteredTaskList(response.results);

        } else if (response.code === 401 && response.error === true) {
            SessionOut(dispatch)
        } else {
            setUpcomingTaskList([]);
            setFilteredTaskList([]);
            Alert.alert('Warning', response.message);
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
            await dispatch(requestMEDManagListService({
                date: moment(date).format('YYYY-MM-DD')
            }));
        } else {
            let response = await getAsyncMedManagmentListbyKey(moment(date).format('YYYY-MM-DD'))
            setUpcomingTaskList(response);
            setFilteredTaskList(response);
        }
    }

    useEffect(() => {
        apiCallonViewLoad()
    }, [date])

    useEffect(() => {
        filterTasks();
    }, [searchQuery]);

    const filterTasks = () => {
        const filteredTasks = upcomingTaskList.filter(item => {
            const fullName = `${item.service_delivery_code_title} ${item.service_delivery_code} ${item.service_time} ${item.client_fname} ${item.client_lname}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        });
        setFilteredTaskList(filteredTasks);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false); // On iOS, show the picker inline
        setDate(currentDate);
    };

    const calendarOpen = () => {
        setShow(!show);
    }

    const onRowClickAction = (item) => {
        navigation.navigate('MEDManagmentDetailsContainer', { data: item, date: moment(date).format('YYYY-MM-DD'), callBackMethod: apiCallonViewLoad });
    }

    const listRowCell = ({ item }) => (
        <View style={styles.listRowContainer}>
            <TouchableOpacity onPress={() => onRowClickAction(item)}>
                <View style={styles.listRowHeader}>
                    <View style={styles.listRowHeaderText}>
                        <Text>
                            <Text style={styles.taskTitle}>{item.type}: </Text>
                            <Text style={styles.taskSubtitle}>{item.client}</Text>
                        </Text>
                    </View>
                    <Text style={styles.taskDate}>{item.start}</Text>
                </View>

                <View style={styles.listRowContent}>
                    <View style={styles.listRowDetails}>
                        <FontAwesome name="user-o" size={15} color="#14669A" style={[styles.icon, { marginRight: 7 }]} />
                        <Text style={styles.detailText}>{item.client}</Text>
                    </View>
                    <View style={styles.listRowDetails}>
                        <AntDesign name="medicinebox" size={15} color="#14669A" style={styles.icon} />
                        <Text style={styles.detailText}>{item ? Object.values(item?.description)[0] : ""}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
                <NarationViewWithbutton title="EMAR" navigation='' calendarOpen={calendarOpen} date={date} />
                <View style={styles.listViewHeader}>
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder='Search by Client Name'
                            onChangeText={text => setSearchQuery(text)}
                            value={searchQuery}
                        />
                    </View>
                </View>

                {filteredTaskList.length > 0 && <FlatList
                    data={filteredTaskList}
                    renderItem={listRowCell}
                    keyExtractor={(item) => item.toString()}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />}

                {filteredTaskList.length <= 0 &&
                    <Text style={{ flex: 1, backgroundColor: 'white', textAlign: 'center' }}> Not Data Found...!</Text>
                }

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? "spinner" : "calendar"}
                        onChange={onChange}
                        style = {{backgroundColor:'grey', paddingBottom: Platform.OS === 'ios' ? 80 : 0}}
                    />
                )}

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
    },
    taskStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    taskStatusCard: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    statusImage: {
        height: 20,
        width: 20,
        borderRadius: 10,
    },
    statusCount: {
        fontWeight: '700',
        fontSize: 14,
        color: "#0E1012",
        marginHorizontal: 5,
    },
    statusText: {
        fontWeight: '300',
        fontSize: 14,
        color: "#3E4041",
    },
    listViewHeader: {
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E2F6E3',
        borderRadius: 5,
        paddingHorizontal: 16,
    },
    searchInput: {
        paddingVertical: 10,
        fontSize: 14,
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
    upcomingTasksImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    flatList: {
        flex: 1,
        backgroundColor: 'white',
    },
    flatListContent: {
        paddingBottom: 16,
        paddingHorizontal: 16,
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
        flex: 1,
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
        fontWeight: '400',
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
        borderRadius: 30
    }
});

export default MEDManagmentContainer;
