import React from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MyStyles from "../../Styles/MyStyles";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../utils/Apis";
import { authApis } from '../../utils/Apis';
import { useState, useEffect } from "react";
import { Image } from 'react-native';
import { useContext } from 'react';
import { MyUserContext } from '../../utils/Contexts/MyContexts'
import { ActivityIndicator, HelperText } from 'react-native-paper';
import  AsyncStorage from "@react-native-async-storage/async-storage"

const DivisionRegister = () => {
    const route = useRoute();
    const nav = useNavigation();
    const [errMsg, setErrMsg] = useState("");
    const {user} = useContext(MyUserContext)
    if (!user) {nav.navigate("Login")}
    const { divisionId } = route.params;
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const Register = async () => {
 if (reason.trim() === "") {
        setError("Vui lòng nhập lý do bạn muốn đăng ký đội hình");
        return;
    }

    try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        console.log("Division ID:", divisionId);
        const data = {
            division: divisionId,
            reason: reason
        };
        const res = await authApis(token).post(
            endpoints.registrations, data
        );
        console.log("Registration created:", res.data);
        nav.goBack();

    } catch (error) {
        console.error("Registration error:", error);
        console.error("Response:", error.response);
        console.error("Response data:", error.response?.data);
        console.error("Message:", error.message);
        setErrMsg(
            error.response?.data?.detail ||
            error.response?.data?.reason?.[0] ||
            error.message ||
            "Đăng ký thất bại."
        );

    } finally {
        setLoading(false);
    }
};
    return (
        <View>
             <Text style={MyStyles.title}> ĐĂNG KÝ VÀO ĐỘI HÌNH </Text>
             <TextInput label="Tại sao bạn lại chọn đội hình chúng mình?" placeholder='Mình muốn tham gia vì...' value={reason} onChangeText={setReason} style={MyStyles.registerReasonText}></TextInput>
                <HelperText type="error" visible={errMsg}>{errMsg}</HelperText>
             <Button style={MyStyles.button} loading={loading} disabled={loading} mode="contained" onPress={Register}>Đăng ký đội hình</Button>
        </View>
    )
}
export default DivisionRegister;
