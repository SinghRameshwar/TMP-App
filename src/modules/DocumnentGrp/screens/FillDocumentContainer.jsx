

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, TouchableNativeFeedback, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import BackNavigationWithTitleBar from '../../../common/component/BackNavigationWithTitleBar';
import { DocumentSaveApi } from '../../../common/services/DocumentSaveApi';
import Loading from '../../../common/component/Loading';
import { MessageString } from '../../../assets/Strings';

const FillDocumentContainer = ({ route, navigation }) => {

    const [loding, setloding] = useState(false);
    const [selectedStep2Data, setselectedStep2Data] = useState({});
    const [selectedStep3Data, setselectedStep3Data] = useState({});
    const [naration, setnaration] = useState('');
    const [inTime, setinTime] = useState('');
    const [outTime, setoutTime] = useState('');
    const [prasentAbsentVal, setprasentAbsentVal] = useState(true);
    const [billingval, setbillingval] = useState({});
    const [totalCalculate, settotalCalculate] = useState(0);
    const callBackMethod = route?.params?.callBackMethod;
    const dataObj = route?.params?.data;

    const [rowDataStep1, setrowDataStep1] = useState([]);
    const [rowDataStep2, setrowDataStep2] = useState([
        { 'title': 'Fax', 'value': 'F' },
        { 'title': 'Face to Face', 'value': 'FF' },
        { 'title': 'Other', 'value': 'O' },
        { 'title': 'Telephone - On Call', 'value': 'OC' },
        { 'title': 'Telephone', 'value': 'T' },
        { 'title': 'Tele-Health Triage Face To Face', 'value': 'TF' },
        { 'title': 'Tele-Health Triage Telephone', 'value': 'TT' }]);

    const [rowDataStep3, setrowDataStep3] = useState([
        { 'title': 'School', 'value': '3' },
        { 'title': 'Office', 'value': '11' },
        { 'title': 'Home', 'value': '12' },
        { 'title': 'Outpatient', 'value': '22' },
        { 'title': 'Independent Clinic', 'value': '49' },
        { 'title': 'Other Place of Service', 'value': '99' }]);


    useEffect(() => {
        setrowDataStep1([{ 'title': dataObj?.status?.schedule?.service_delivery_code_title, 'value': dataObj?.status?.schedule?.service_delivery_code }])
        setinTime(dataObj?.status?.clockin_time?.split(' ')[1]);
        setoutTime(dataObj?.status?.clockout_time?.split(' ')[1]);
    }, []);

    const actionRadioBtn = (type, data) => {
        if (type === 'step1') {

        } else if (type === 'billing') {
            setbillingval(data)
        } else if (type === 'step2') {
            setselectedStep2Data(data)
        } else if (type === 'step3') {
            setselectedStep3Data(data)
        }

    }

    const stepHeadingView = (title1, title2) => (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Feather name="check" size={18} color="#FFFFFF" style={{ backgroundColor: "#59B852", borderRadius: 20, padding: 5 }} />
            <View style={{ marginLeft: 16 }}>
                <Text style={{ fontWeight: '400', fontSize: 12, color: 'black' }}>{title1}</Text>
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#14669A' }}>{title2}</Text>
            </View>
        </View>
    )

    const radioBtnWithTitle = (type, data, seletedData) => (
        <TouchableOpacity style={{ flexDirection: 'row', padding: 7 }} onPress={() => actionRadioBtn(type, data)}>
            <View style={{ borderColor: 'grey', backgroundColor: '#FFFFFF', borderWidth: 1, width: 20, height: 20, borderRadius: 30, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                <View style={{ width: 10, height: 10, backgroundColor: seletedData.value === data.value ? 'grey' : 'white', borderRadius: 20 }} />
            </View>
            <Text style={{ marginLeft: 7 }}>{data?.title}</Text>
        </TouchableOpacity>
    )

    const checkBoxWithTitle = (data) => (
        <TouchableOpacity style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }} onPress={() => setprasentAbsentVal(!prasentAbsentVal)}>
            <MaterialCommunityIcons name={!prasentAbsentVal ? "checkbox-marked" : "checkbox-blank-outline"} size={20} color="grey" style={{ padding: 5 }} />
            <Text style={{ marginLeft: 7 }}>{data?.title}</Text>
        </TouchableOpacity>
    )

    const compleateIncompleateAction = async (type) => {
        try {
            if (billingval?.value === undefined) {
                Alert.alert('Warning', 'Please Select Billing Status!')
                return;
            } else if (selectedStep2Data?.value === undefined) {
                Alert.alert('Warning', 'Please Select Types of Contact!')
                return;
            } else if (selectedStep3Data?.value === undefined) {
                Alert.alert('Warning', 'Please Select Location: Place of Service!')
                return;
            }
            setloding(true)
            const formData = new FormData();
            formData.append('schedule_id', '2598')//dataObj?.status?.schedule?.entry_no);//'2598'
            formData.append('billing_status', billingval?.value);
            formData.append('service_type', selectedStep2Data?.value);
            formData.append('is_absent', prasentAbsentVal ? 0 : 1);
            formData.append('time_in', inTime.split(':').slice(0, 2).join(':'));
            formData.append('time_out', outTime.split(':').slice(0, 2).join(':'));
            formData.append('place_of_service', selectedStep3Data?.value);
            formData.append('completion_status', type === 'Incomplete' ? 0 : 1);
            formData.append('summary', naration);
            formData.append('total_units', totalCalculate);

            let response = await DocumentSaveApi(formData);
            if (response?.code === 200 && response?.error === false) {
                callBackMethod();
                navigation.pop(2);
            } else {
                Alert.alert('Warning', response.message)
            }
            setloding(false)
        } catch (error) {
            setloding(false)
            Alert.alert('Warning', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../../../assets/images/login_bg.jpg")}
                resizeMode="cover"
                style={styles.backgroundImage}
            />

            <View style={styles.overlay}>
                <BackNavigationWithTitleBar navigation={navigation} title="Document" date={moment().format('YYYY-MMM-DD')} />

                <View style={styles.listViewHeader}>
                    <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* ---------- Step 1 ------------ */}
                        {stepHeadingView("Step 1", "Choose Service Code")}
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <View style={{ width: 1, backgroundColor: '#59B852', height: '100%', }} />
                            <View style={{ backgroundColor: '#F4FFFF', borderRadius: 5, flex: 1, marginLeft: 15, padding: 5 }}>
                                <Text style={{ marginLeft: 7, marginBottom: 7 }}>Service Delivery Code</Text>
                                {/* -------- repated Code working on ------- */}
                                {Array.isArray(rowDataStep1) && rowDataStep1.length > 0 &&
                                    rowDataStep1?.map((item) => (
                                        radioBtnWithTitle('step1', item, rowDataStep1[0])

                                    ))}
                            </View>
                        </View>

                        {/* ---------- Step 2 ------------ */}
                        {stepHeadingView("Step 2", "Type of Log")}
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <View style={{ width: 1, backgroundColor: '#59B852', height: '100%', }} />
                            <View style={{ backgroundColor: '#F4FFFF', borderRadius: 5, flex: 1, marginLeft: 15, padding: 5 }}>
                                <Text style={{ marginLeft: 7, marginBottom: 7 }}>Billing Status</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {radioBtnWithTitle('billing', { title: 'Billing', value: 'B' }, billingval)}
                                    {radioBtnWithTitle('billing', { title: 'Non Billing', value: 'NB' }, billingval)}

                                </View>
                                <Text style={{ marginLeft: 7, marginBottom: 7 }}>Type of Contact</Text>
                                {/* -------- repated Code working on ------- */}
                                {rowDataStep2.map((item) => (
                                    radioBtnWithTitle('step2', item, selectedStep2Data)

                                ))}
                            </View>
                        </View>

                        {/* ---------- Step 3 ------------ */}
                        {stepHeadingView("Step 3", "Date/Time/Identifier")}
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <View style={{ width: 1, backgroundColor: '#59B852', height: '100%', }} />
                            <View style={{ backgroundColor: '#F4FFFF', borderRadius: 5, flex: 1, marginLeft: 15, padding: 5 }}>
                                {checkBoxWithTitle({ title: 'Absent' })}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={{ marginLeft: 7, marginBottom: 7 }}>Exact Time In</Text>
                                        <TextInput
                                            placeholder='Time-in'
                                            value={inTime}
                                            onTextInput={(text) => setinTime(text)}
                                            editable={false}
                                            style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 20, paddingHorizontal: 16, padding: 5, marginBottom: 16, marginLeft: 7, marginRight: 7, color: 'black' }}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={{ marginLeft: 7, marginBottom: 7 }}>Exact Time Out</Text>
                                        <TextInput
                                            placeholder='Time-out'
                                            value={outTime}
                                            onTextInput={(text) => setoutTime(text)}
                                            editable={false}
                                            style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 20, paddingHorizontal: 16, padding: 5, marginBottom: 16, marginLeft: 7, marginRight: 7, color: 'black' }}
                                        />
                                    </View>

                                </View>

                                <Text style={{ marginLeft: 7, marginBottom: 7 }}>Location: Place of Service</Text>
                                {/* -------- repated Code working on ------- */}
                                {rowDataStep3.map((item) => (
                                    radioBtnWithTitle('step3', item, selectedStep3Data)

                                ))}
                            </View>
                        </View>

                        {/* ---------- Step 4 ------------ */}
                        {stepHeadingView("Step 4", "Summary")}
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <View style={{ width: 1, backgroundColor: '#59B852', height: '100%', }} />
                            <View style={{ backgroundColor: '#F4FFFF', borderRadius: 5, flex: 1, marginLeft: 15, padding: 5 }}>
                                <TextInput
                                    placeholder="Summary..."
                                    multiline={true}
                                    textAlignVertical="top"
                                    value={naration}
                                    onChangeText={(text) => setnaration(text)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'grey',
                                        borderRadius: 10,
                                        paddingHorizontal: 16,
                                        paddingVertical: 5,
                                        marginBottom: 16,
                                        marginLeft: 7,
                                        marginRight: 7,
                                        height: 150,
                                        marginTop: 5,
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'yellow', alignItems: 'center', padding: 10, borderRadius: 10, borderColor: 'grey', borderWidth: .5 }}
                                onPress={() => compleateIncompleateAction('Incomplete')}>
                                <Text>Incomplete</Text>
                            </TouchableOpacity>

                            <View style={{ width: 20 }} />

                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'green', alignItems: 'center', padding: 10, borderRadius: 10, borderColor: 'grey', borderWidth: .5 }}
                                onPress={() => compleateIncompleateAction('complete')}>
                                <Text>Complete</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 200 }} />
                    </ScrollView>
                    </TouchableNativeFeedback>
                </View>
            </View>
            <Loading lodingType={loding} message={MessageString.loading} />
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
        fontWeight: '700',
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
    userImage: {
        height: 104,
        width: 104,
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
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E2F6E3',
        borderRadius: 5,
        paddingHorizontal: 16,
        justifyContent: 'space-between'
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
        padding: 8,
    }
});

export default FillDocumentContainer;
