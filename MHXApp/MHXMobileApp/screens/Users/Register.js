import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import MyStyles from "../../Styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Apis, { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const info = [{
        "label": "Tên",
        "field": "first_name",
        "icon": "text"
    }, {
        "label": "Họ và tên lót",
        "field": "last_name",
        "icon": "text"
    }, {
        "label": "Email",
        "field": "email",
        "icon": "email"
    }, {
        "label": "Mã số sinh viên",
        "field": "MSSV",
        "icon": "card-account-details"
    }, {
        "label": "Tên đăng nhập",
        "field": "username",
        "icon": "account"
    }, {
        "label": "Mật khẩu",
        "field": "password",
        "icon": "lock",
        "secureTextEntry": true
    }, {
        "label": "Xác nhận mật khẩu",
        "field": "confirm",
        "icon": "check",
        "secureTextEntry": true
    }];

    const [user, setUser] = useState({});
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const picker = async () => {
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setUser({...user, "avatar": res.assets[0]});
        } else
            Alert.alert("Permission denied!");
    }

    const validatePassword = (password) => {
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.*[a-z])(?=.*\d).{8,12}$/;

    return passwordRegex.test(password);
};
    const validate = () => {
        if (!user.password || !user.confirm || user.password !== user.confirm) {
            setErrMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }
        if (!validatePassword(user.password)) {
        setErrMsg(
            "Mật khẩu phải có 8-12 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!"
        );
        return false;
        }
        if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            setErrMsg("Email không hợp lệ!");
            return false;
        }

        setErrMsg(null);
        return true;
    }

    const register = async () => {
        if (validate()) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: "image/jpeg"
                            });
                        } else
                            form.append(key, user[key]);
                    }
                }
                console.info(form);
                console.log("Register URL:", endpoints["register"]);
                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.status === 201) {
                    console.info("Register successfully!");
                    nav.navigate('Login');
                }
                else
                    setErrMsg("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
            } catch (ex) {
    console.log("STATUS:", ex.response?.status);
    console.log("DATA:", ex.response?.data);
    console.log("URL:", ex.config?.url);
    console.log("METHOD:", ex.config?.method);

    setErrMsg(
        ex.response?.data
            ? JSON.stringify(ex.response.data) : "Đã có lỗi xảy ra. Vui lòng thử lại sau!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={MyStyles.padding}>
            <Text style={MyStyles.bannerText}>ĐĂNG KÝ NGƯỜI DÙNG</Text>

            {info.map(i => <TextInput style={MyStyles.textInput} key={i.field}
                            label={i.label}
                            secureTextEntry={i.secureTextEntry}
                            right={<TextInput.Icon icon={i.icon} />}
                            value={user[i.field]}
                            onChangeText={t => {
                                if (i.field === 'MSSV'){
                                     t = t.replace(/[^0-9]/g, '').slice(0, 10);
                            }
                             setUser({...user, [i.field]: t})}} 
                            keyboardType={i.field === "MSSV" ? "numeric" : "default"}
                            maxLength={i.field === "MSSV" ? 10 : undefined}
                            />)}


            <TouchableOpacity style={MyStyles.margin} onPress={picker}>
            <Text style={MyStyles.text}>Chọn ảnh đại diện...</Text>
            </TouchableOpacity>    

            {user.avatar && <Image  source={{uri: user.avatar.uri}} width={250} style={[MyStyles.avatar, MyStyles.margin]} />}
            <HelperText type="error" visible={errMsg}>
                {errMsg}
            </HelperText>
            <Button style={MyStyles.button} loading={loading} disabled={loading} mode="contained" icon="account" onPress={register}>Đăng ký</Button>

        </ScrollView>
    );
}

export default Register;