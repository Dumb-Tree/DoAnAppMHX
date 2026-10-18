import React, { useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import {Text,Card,Button,ActivityIndicator, HelperText,} from "react-native-paper";
import { useContext } from 'react';
import { MyUserContext } from '../../utils/Contexts/MyContexts'
import { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../Styles/MyStyles";
import { useNavigation } from "@react-navigation/native";

const ActivityList = () => {
    const [ActivityList, setActivityList] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useContext(MyUserContext);
    const nav = useNavigation();
    const loadData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log("No token found");
                return;
            }
            const [ActivityListResponse, registrationsResponse] =
                await Promise.all([
                    authApis(token).get(endpoints.activities),
                    authApis(token).get(endpoints.activity_registrations),
                ]);
            setActivityList(ActivityListResponse.data);
            setRegistrations(registrationsResponse.data);
        } catch (error) {
            console.log(
                "Load ActivityList error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    const getRegistration = (activityId) => {
        return registrations.find(
            registration =>
                registration.activity === activityId &&
                (registration.register_status === "REGISTERED" || registration.register_status === "registered")
        );
    };
    const handleRegister = async (activityId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập để đăng ký.");
                return;
            }
            await authApis(token).post(
                endpoints.activity_registrations,{activity: activityId,}
            );
            Alert.alert( "Thành công","Bạn đã đăng ký hoạt động.");
            await loadData();
        } catch (error) {
            const detail = error.response?.data?.detail;
            const message = Array.isArray(detail)? detail.join("\n"): detail || "Không thể đăng ký hoạt động.";
            Alert.alert("Không thể đăng ký", message);
        }
    };
    const handleCancel = (registrationId) => {
        Alert.alert("Hủy đăng ký","Bạn có chắc muốn hủy đăng ký hoạt động này?",
            [
                {
                    text: "Không", style: "cancel",
                },
                {
                    text: "Hủy đăng ký", style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            if (!token) {
                                Alert.alert("Lỗi","Bạn cần đăng nhập.");
                                return;
                            }
                            await authApis(token).post(
                                `${endpoints.activity_registrations}${registrationId}/cancel/`
                            );
                            Alert.alert("Thành công","Bạn đã hủy đăng ký."
                            );
                            await loadData();
                        } catch (error) {
                            console.log("Cancel error:",error.response?.data || error.message
                            );
                            const message = error.response?.data?.detail || "Không thể hủy đăng ký.";
                            Alert.alert("Không thể hủy", message);
                        }
                    },
                },
            ]
        );
    };
const cancelActivity = async (activityId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const api = authApis(token);
        await api.post(`${endpoints.activities}${activityId}/cancel/`);
        Alert.alert("Thành công","Hoạt động đã được hủy.");
        loadData();
    } catch (error) {
        console.log("Cancel activity error:",error.response?.data || error.message);
    }
};

    const confirmCancelActivity = (activityId) => {
        Alert.alert("Hủy hoạt động", "Bạn có chắc chắn muốn hủy hoạt động này không?",
            [
                {
                    text: "Không",
                    style: "cancel",
                },
                {
                    text: "Hủy hoạt động",
                    style: "destructive",
                    onPress: () => cancelActivity(activityId),
                },
            ]
        );
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",});
    };

 const renderActivity = ({ item }) => {
        const registration = getRegistration(item.id);
        const isRegistered = !!registration;
        const now = new Date();
        const activityStarted = new Date(item.start_time) <= now;
        const activityEnded = new Date(item.end_time) <= now;
        const isCancelled = item.status === "cancelled";
        const proofSubmitted = item.proof_submitted === true;
        const isLeader =user?.role === "leader";
        return (
            <Card style={MyStyles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={MyStyles.activityName}>
                        {item.name}
                    </Text>
                    {item.description && (
                        <Text style={MyStyles.description}>
                            {item.description}
                        </Text>
                    )}
                    <Text style={MyStyles.info}>
                        Bắt đầu:{" "} {formatDate(item.start_time)}
                    </Text>
                    {item.end_time && (
                        <Text style={MyStyles.info}>
                            Kết thúc:{" "}{formatDate(item.end_time)}
                        </Text>
                    )}
                    <HelperText type="error" visible={errMsg}>
                        {errMsg}
                    </HelperText>
                    <View style={MyStyles.actionContainer}>
                        {isCancelled ? (
                            <Text style={MyStyles.startedText}> Hoạt động đã bị hủy</Text>) : (
                            <>
                                {!activityStarted && !isRegistered && (<Button style={MyStyles.button} mode="contained"onPress={() =>handleRegister(item.id)}>
                                    Đăng ký</Button>)}
                                {!activityStarted &&
                                    isRegistered && (
                                    <Button mode="outlined" textColor="#d32f2f" onPress={() => handleCancel(registration.id)}>
                                        Hủy đăng ký</Button>)}
                                {activityEnded && proofSubmitted && (
                                    <Text style={MyStyles.startedText}> Đã có minh chứng</Text>
                                )}
                                {activityEnded && !proofSubmitted && isRegistered && !isLeader && (
                                    <Button mode="contained" onPress={() => nav.navigate("ActivityProof",{activityId:item.id})}>Nộp minh chứng</Button>
                                )}
                                {activityEnded && !proofSubmitted && !isRegistered && (
                                    <Text style={MyStyles.startedText}>Hoạt động đã kết thúc</Text>
                                )}
                            </>
                        )}
                        {isLeader && item.status === "Upcoming" && !activityStarted && (
                            <Button mode="contained" buttonColor="red" onPress={() => confirmCancelActivity(item.id)}>Hủy hoạt động</Button>
                        )}
                        {isLeader && activityEnded && proofSubmitted && (
                            <Button mode="outlined" onPress={() => nav.navigate("ActivityProofReview",{activityId:item.id})}>Xem minh chứng</Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
        );
    };
    if (loading) {
        return (
            <View style={MyStyles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={MyStyles.loadingText}>
                    Đang tải hoạt động...
                </Text>
            </View>
        );
    }
    return (
        <View style={MyStyles.container}>
            <Text variant="headlineSmall" style={MyStyles.bannerText}> Hoạt động </Text>
            <FlatList
                data={ActivityList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderActivity}
                contentContainerStyle={ActivityList.length === 0 ? MyStyles.emptyList : MyStyles.list}
                ListEmptyComponent={
                    <Text style={MyStyles.text}>
                        Hiện tại không có hoạt động sắp tới.
                    </Text>
                }
                refreshing={loading}
                onRefresh={loadData}
            />
            {user?.role === 'leader' && (
                <Button style={MyStyles.button} onPress={() => nav.navigate("NewActivity")}>
                <Text style={MyStyles.buttonText}>THÊM HOẠT ĐỘNG</Text>
                </Button>
            )}
        </View>
    );
};



export default ActivityList;