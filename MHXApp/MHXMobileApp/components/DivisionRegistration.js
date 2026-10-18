import React, { useEffect, useState } from "react";
import {View,Text,FlatList,ActivityIndicator,ScrollView,TouchableOpacity, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../utils/Apis"
import MyStyles from "../Styles/MyStyles";
import { Button } from "react-native-paper";
const DivisionRegistrations = () => {
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
                endpoints.registrations
            );
            const pendingRegistrations = response.data.filter(
                registration => registration.Status === "pending"
            );

            setRegistrations(pendingRegistrations);

        } catch (error) {
            console.log(
                "Registration error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }


    const cancelRegistration = async (registrationId) => {
        Alert.alert("Xác nhận hủy đăng ký", "Bạn có chắc chắn muốn hủy đăng ký không? Bạn sẽ không được đăng ký lại nếu hủy.", [
            {
                text: "Hủy",style: "cancel",
            },
            {
                text: "Đồng ý",
                onPress: () => {
                    try {
                        const token = AsyncStorage.getItem("token");
                        if (!token) {return;}
                        authApis(token).post(`${endpoints.registrations}${registrationId}/cancel/`);
                        setRegistrations(prev => prev.filter(registration => registration.id !== registrationId));
                        console.log("Registration cancelled:", registrationId);
                    } catch (error) {
                        console.log("Cancel registration error:",error.response?.data || error.message);
                    }
                },
            }
        ]);
    // try {
    //     const token = await AsyncStorage.getItem("token");
    //     if (!token) {return;}
    //     await authApis(token).post(`${endpoints.registrations}${registrationId}/cancel/`);
    //     setRegistrations(prev => prev.filter(registration => registration.id !== registrationId));
    //     console.log("Registration cancelled:", registrationId);
    // } catch (error) {
    //     console.log("Cancel registration error:",error.response?.data || error.message);
    // }
};
    return (
        <View>
            <Text style={MyStyles.text}>ĐĂNG KÝ ĐANG CHỜ DUYỆT</Text>
            <FlatList
                data={registrations}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={MyStyles.text}>Bạn không có đội hình nào đang chờ duyệt.</Text>
                }
                renderItem={({ item }) => (
                    <ScrollView style={MyStyles.registerList}>
                        <Text style={MyStyles.registerListText}> {item.divisionName}</Text>
                        <Text style={MyStyles.registerListText}> Lý do: {item.reason}</Text>
                        <Text style={MyStyles.registerListText}> Trạng thái: {item.Status} </Text>
                        <TouchableOpacity>
                        <Button style={MyStyles.button} mode="contained" onPress={() => cancelRegistration(item.id)}><Text> Hủy đăng ký</Text></Button>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            />
        </View>
    );
};

export default DivisionRegistrations;