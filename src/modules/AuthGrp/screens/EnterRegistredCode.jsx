
import { useState } from "react";
import NavigationBar from "../component/NavigationBar";
import { TouchableOpacity, View, TextInput, Text, Alert } from 'react-native'
import { qRRegistationApiCallandResponse } from "../data/apiCallandResult";


const EnterRegistredCode = ({ navigation }) => {
    const [registerCode, setregisterCode] = useState('');
    const [loginClick, setloginClick] = useState(false);

    const registerCodeButtonAction = () => {
        if (!loginClick) {
            if (registerCode === '' || registerCode.length < 5) {
                Alert.alert('Warning', 'Please enter 5 digit registration code!')
                return
            }
            setloginClick(true)
            qRRegistationApiCallandResponse({
                registerCode: registerCode,
                setloginClick: setloginClick,
                navigation: navigation
            });
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <NavigationBar navigation={navigation} title="Register Device" />
            <View style={{ padding: 16, flex: 1 }}>
                <TextInput
                    placeholder="Enter Registration Code"
                    onChangeText={(text) => setregisterCode(text)}
                    maxLength={5}
                    style={{ borderRadius: 40, backgroundColor: '#DCE3DC', paddingHorizontal: 20, paddingVertical:10 }}
                />

                <Text style={{ marginTop: 10, padding: 5 }}>
                    <Text style={{ fontWeight: '700', color: '#0E1012' }}>Enter 5 Character</Text>
                    <Text style={{ fontWeight: '300', color: '#0E1012' }}> Registration Code generated on TaskMaster Pro Web</Text>
                </Text>
            </View>

            <TouchableOpacity style={{ backgroundColor: '#59B952', borderRadius: 20, marginTop: 10, marginBottom: 10, marginLeft: 16, marginRight: 16, }} onPress={() => registerCodeButtonAction()}>
                <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>{loginClick ? 'Loading...' : 'Register'}</Text>
            </TouchableOpacity>
        </View>

    )
}

export default EnterRegistredCode;