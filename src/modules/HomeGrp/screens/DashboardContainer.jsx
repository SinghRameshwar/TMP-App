import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import WelcomeNavigationBar from '../../../common/component/WelcomeNavigationBar';
import { MessageString } from '../../../assets/Strings';
import Loading from '../../../common/component/Loading';
import MenuListComp from '../component/MenuListComp';
import { useDispatch } from 'react-redux';

const DashboardContainer = ({ navigation }) => {
    const [upcomingTaskList, setUpcomingTaskList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [loding, setloding] = useState(false);
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const dispatch = useDispatch();


    const filterUpconingTaskList = () => {

    }

    const taskStatusCardView = (status, count, text, status2, count2, text2) => (
        <View style={styles.taskStatusContainer}>
            <View style={styles.taskStatusCard}>
                <Image
                    source={require("../../../assets/images/app_logo.png")}
                    resizeMode="contain"
                    style={styles.statusImage}
                />
                <Text style={styles.statusCount}>{count}</Text>
                <Text style={styles.statusText}>{text}</Text>
            </View>

            <View style={styles.taskStatusCard}>
                <Image
                    source={require("../../../assets/images/app_logo.png")}
                    resizeMode="contain"
                    style={styles.statusImage}
                />
                <Text style={styles.statusCount}>{count2}</Text>
                <Text style={styles.statusText}>{text2}</Text>
            </View>
        </View>
    );

    const listRowCell = ({ item }) => (
        <View style={styles.listRowContainer}>
            <TouchableOpacity>
                <View style={styles.listRowHeader}>
                    <View style={styles.listRowHeaderText}>
                        <Text>
                            <Text style={styles.taskTitle}>T2025-U5UA-CLS Basic:</Text>
                            <Text style={styles.taskSubtitle}>Co Employer</Text>
                        </Text>
                    </View>
                    <Text style={styles.taskDate}>June 6,2024 | 03:30AM</Text>
                </View>

                <View style={styles.listRowContent}>
                    <View style={styles.listRowDetails}>
                        <Icon name="mail-outline" size={15} color="#14669A" style={styles.icon} />
                        <Text style={styles.detailText}>Core Morrison</Text>
                        <Text style={styles.separator}> | </Text>
                        <Icon name="mail-outline" size={15} color="#14669A" style={styles.icon} />
                        <Text style={styles.detailText}>JUM123</Text>
                    </View>
                    <View style={styles.listRowDetails}>
                        <Icon name="location-outline" size={15} color="#14669A" style={styles.icon} />
                        <Text style={styles.detailText}>June 6,2024 | 03:30AM</Text>
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
                <View style={styles.headerContainer}>
                    <WelcomeNavigationBar setisMenuOpen={setisMenuOpen} isMenuOpen={isMenuOpen} />

                    {/* {taskStatusCardView('green', '20', 'Completed', "green", '10', 'Pending')}
                    {taskStatusCardView('green', '05', 'Missed', "green", '08', 'Documented')} */}
                </View>

                <View style={styles.listViewHeader}>
                    <View style={styles.listViewHandle} />
                    <View style={styles.listViewHeaderText}>
                        <Text style={styles.upcomingTasksText}>Upcoming Tasks</Text>
                        {/* <TouchableOpacity onPress={() => filterUpconingTaskList()}>
                            <View style={styles.navigationBarIcon}>
                                <MaterialCommunityIcon name="tune" size={25} color="#14669A" />
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>

                <FlatList
                    data={upcomingTaskList}
                    renderItem={listRowCell}
                    keyExtractor={(item) => item.toString()}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />
                <Loading lodingType={loding} message={MessageString.loading} />
            </View>
            <MenuListComp setisMenuOpen={setisMenuOpen} isMenuOpen={isMenuOpen} dispatch = {dispatch}/>
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
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        shadowColor: 'grey',
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
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
        paddingBottom:20
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
        marginBottom: 10,
        shadowColor: 'grey',
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        
    }
});

export default DashboardContainer;
