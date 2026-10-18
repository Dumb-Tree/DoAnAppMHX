import React, { useEffect, useState } from "react";
import MyStyles from "../../Styles/MyStyles"
import {View,ScrollView,Image,Alert,} from "react-native";
import {Text,Button,ActivityIndicator,Card,} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authApis,endpoints,} from "../../utils/Apis";
import {useRoute,useNavigation,} from "@react-navigation/native";
const ActivityProofReview = () => {
    const route = useRoute();
    const {activityId} = route.params;
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const loadProof = async () => {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            Alert.alert("Lỗi","Bạn cần đăng nhập.");
            return;
        }
        const api = authApis(token);
        const response = await api.get(`${endpoints.activity_proofs}?activity=${activityId}`);
        if (Array.isArray(response.data)) {
            setProof(response.data.length > 0? response.data[0]: null);
        } else if (response.data.results) {
            setProof(response.data.results.length > 0? response.data.results[0]: null
            );
        } else {
            setProof(response.data);
        }
    } catch (error) {
        console.log("Load proof error:",error.response?.data || error.message);
        Alert.alert( "Lỗi", "Không thể tải minh chứng.");
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        loadProof();
    }, []);
    const approveProof = async () => {
        try {
            setProcessing(true);
            const token = await AsyncStorage.getItem("token");
            const api = authApis(token);
            await api.post(
                `${endpoints.activity_proofs}${proof.id}/approve/`
            );
            Alert.alert("Thành công","Đã duyệt minh chứng.");
            await loadProof();
        } catch (error) {
            console.log("Approve proof error:", error.response?.data || error.message
            );
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể duyệt minh chứng.");
        } finally {
            setProcessing(false);
        }
    };
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large"/>
                <Text> Đang tải minh chứng... </Text>
            </View>
        );
    }
    if (!proof) {
        return (
            <View style={MyStyles.flex}>
                <Text> Chưa có minh chứng cho hoạt động này.</Text>
            </View>
        );
    }
const rejectProof = async () => {
    if (!rejectReason.trim()) {
        Alert.alert("Thiếu lý do","Vui lòng nhập lý do từ chối minh chứng.");
        return;
    }
    try {
        setProcessing(true);
        const token = await AsyncStorage.getItem("token");
        const api = authApis(token);
        await api.post(
            `${endpoints.activity_proofs}${proof.id}/reject/`,
            {
                reason: rejectReason.trim(),
            }
        );
        setRejectDialogVisible(false);
        setRejectReason("");
        Alert.alert("Thành công","Đã từ chối minh chứng.");
        await loadProof();
    } catch (error) {
        console.log("Reject proof error:",error.response?.data || error.message);
        Alert.alert("Lỗi", error.response?.data?.detail);
    } finally {
        setProcessing(false);
    }
};

    return (

        <ScrollView contentContainerStyle={{padding: 20,}}>
            <Text variant="headlineSmall" style={MyStyles.margin}>Xem minh chứng</Text>
            <Text variant="titleMedium" style={MyStyles.margin}>Người gửi</Text>
            <Text style={MyStyles.margin}>{proof.submitted_by_name}</Text>
            <Text variant="titleMedium" style={MyStyles.margin}>Mô tả hoạt động</Text>
            <Card style={MyStyles.margin}>
                <Card.Content>
                    <Text>{proof.proofDescription}</Text>
                </Card.Content>
            </Card>
            <Text variant="titleMedium" style={MyStyles.margin}>Hình ảnh minh chứng</Text>
            <View style={MyStyles.flex}>
                {proof.images?.map(
                    (image) => (<Image key={image.id}source={{uri: image.image}} style={MyStyles.avatar} resizeMode="cover"/>))}
            </View>
            <Text style={MyStyles.margin}>Trạng thái: {proof.status}</Text>
            {proof.status === "pending" && (
                <Button mode="contained" onPress={approveProof} disabled={processing}>
                    {processing ? "Đang xử lý..." : "DUYỆT MINH CHỨNG"}
                </Button>

            )}
        </ScrollView>
    );
};

export default ActivityProofReview;