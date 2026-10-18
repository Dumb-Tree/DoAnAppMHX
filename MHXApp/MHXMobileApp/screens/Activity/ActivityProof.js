import {useState} from "react";
import {View,ScrollView,Alert,Image} from "react-native";
import {Text,TextInput,Button,ActivityIndicator} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints} from "../../utils/Apis";
import {useRoute, useNavigation} from "@react-navigation/native";
import MyStyles from "../../Styles/MyStyles";

const ActivityProof = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {activityId} = route.params;
    const [description,setDescription] = useState("");
    const [images,setImages] = useState([]);
    const [loading,setLoading] = useState(false);

    const pickImages = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Quyền truy cập", "Bạn cần cho phép ứng dụng truy cập thư viện ảnh.");
            return;
        }
        const result =
            await ImagePicker.launchImageLibraryAsync({mediaTypes: ["images"], allowsMultipleSelection: true, quality: 0.8});
        if (!result.canceled) {
            setImages(
                result.assets
            );
        }
    };
    const submitProof = async () => {
        if (!description.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập mô tả hoạt động.");
            return;
        }
        if (images.length === 0) {
            Alert.alert("Thiếu hình ảnh", "Vui lòng chọn ít nhất một hình ảnh.");
            return;
        }
        try {
            setLoading(true);
            const token =
                await AsyncStorage.getItem(
                    "token"
                );
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập.");
                return;
            }
            const api =
                authApis(token);
            const proofResponse =
                await api.post(
                    endpoints.activity_proofs,
                    {
                        activity:activityId,
                        proofDescription:description,
                    }
                );
            const proofId =
                proofResponse.data.id;
            for (const image of images) {
                const formData =
                new FormData();
                formData.append("proof",proofId.toString());
                formData.append("image",{uri: image.uri,name: image.fileName || `proof_${Date.now()}.jpg`, type: image.mimeType ||"image/jpeg"});
                await api.post(
                    endpoints.activity_proof_images,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                            "multipart/form-data"
                        }
                    }
                );
            }
            Alert.alert("Thành công", "Minh chứng đã được gửi.",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.log( "Submit proof error:", error.response?.data || error.message);
            Alert.alert("Không thể gửi",error.response?.data?.detail || "Không thể gửi minh chứng."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView contentContainerStyle={{padding: 20}}>
            <Text variant="headlineSmall"style={MyStyles.margin}>Nộp minh chứng</Text>
            <TextInput label="Mô tả hoạt động" value={description}
            onChangeText={setDescription} mode="outlined" multiline numberOfLines={6} style={MyStyles.margin}/>
            <Button mode="outlined" onPress={pickImages}>+ Thêm ảnh </Button>
            <Text> Đã chọn {images.length} ảnh </Text>
            <View style={MyStyles.flex}>
                {images.map((image, index) => (<Image key={index} source={{uri:image.uri}}style={MyStyles.avatar}/>))}
            </View>
            <Button style={MyStyles.button} mode="contained" onPress={submitProof} disabled={loading}>
                {loading? "Đang gửi...": "GỬI MINH CHỨNG"}
            </Button>
        </ScrollView>
    );
};

export default ActivityProof;