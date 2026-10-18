import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";

import { authApis, endpoints } from "../../utils/Apis";
import MyStyles from "../../Styles/MyStyles";


const DivisionWaitingList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                return;
            }
            const response = await authApis(token).get(
                endpoints.registrationWaitingList
            );
            setRegistrations(response.data);
        } catch (error) {
            console.log(
                "Waiting list error:",
                error.response?.data || error.message
            );
            if (error.response?.status === 403) {
                Alert.alert(
                    "Không có quyền",
                    "Chỉ trưởng đội mới có thể xem danh sách này."
                );
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadRegistrations();
    }, []);

    const acceptRegistration = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(`${endpoints.registrations}${id}/accept/`);
            setRegistrations(prev => prev.filter(item => item.id !== id));
            Alert.alert("Thành công","Đã chấp nhận chiến sĩ vào đội.");
        } catch (error) {
            console.log("Accept error:",error.response?.data || error.message);
        }
    };
    const denyRegistration = async (id) => {
    console.log("DENY REGISTRATION ID:", id);
    try {
        const token = await AsyncStorage.getItem("token");
        await authApis(token).post(`${endpoints.registrations}${id}/deny/`);
        setRegistrations(prev => prev.filter(item => item.id !== id));
    } catch (error) {
        console.log("Deny error:", error.response?.data || error.message
        );
    }
};
    return (
        <View style={{ flex: 1 }}>
            <FlatList data={registrations} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{ padding: 10, paddingBottom: 100, }}
                ListEmptyComponent={
                    <Text style={MyStyles.title}>Không có đăng ký nào đang chờ duyệt.</Text>
                }
                renderItem={({ item }) => (
                    <View style={MyStyles.registerList}>
                        <Text style={MyStyles.registerListText}>
                            MSSV: {item.MSSV}
                        </Text>
                        <Text style={MyStyles.registerListText}>
                            Người đăng ký: {item.username}
                        </Text>
                        <Text style={MyStyles.registerListText}>
                            Lý do: {item.reason}
                        </Text>
                        <Text style={MyStyles.registerListText}>
                            Trạng thái: {item.Status}
                        </Text>
                        <View style={{flexDirection: "row",justifyContent: "space-between",}}>
                            <Button mode="contained" style={MyStyles.button} onPress={() => acceptRegistration(item.id)}>Chấp nhận</Button>
                            <Button mode="contained" style={MyStyles.rejectButton} onPress={() => denyRegistration(item.id)}>Từ chối</Button>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default DivisionWaitingList;