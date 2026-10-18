import { View, Text, StyleSheet } from "react-native";
import MyStyles from "../../Styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/Contexts/MyContexts";
import { OAUTH_CLIENT_ID , OAUTH_CLIENT_SECRET } from "@env"
const Login = ({ route }) => {
    const [user, setUser] = useState({ username: '', password: '' });
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(true);
    const nav = useNavigation();
    const { dispatch } = useContext(MyUserContext);
    const updateState = (field, value) => {
        setUser({ ...user, [field]: value });
    }

    const login = async () => {
        if (!user.username || !user.password) {
            setErrMsg("Xin hãy nhập đầy đủ thông tin");
            return;
        }

        try {
            setLoading(true);
            setErrMsg("");
            console.log("Username:" + user.username);
            console.log("Password:" + user.password);
            const formData = new FormData();
            formData.append('client_id', OAUTH_CLIENT_ID);
            formData.append('client_secret', OAUTH_CLIENT_SECRET);
            formData.append('grant_type', 'password');
            formData.append('username', user.username);
            formData.append('password', user.password);
            let res = await Apis.post(endpoints['login'], formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const accessToken = res.data.access_token;
            await AsyncStorage.setItem("token", accessToken);

            let userRes = await authApis(accessToken).get(endpoints['current_user']);
            dispatch({
                "type": "login",
                "payload": userRes.data
            });

            const next = route.params?.next;
            if (next) {
                nav.navigate(next);
            } else {
                nav.navigate("Home"); 
            }
                
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                setErrMsg("Sai tên đăng nhập hoặc mật khẩu!");
            } else {
                setErrMsg("Lỗi hệ thống! Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[MyStyles.padding, { flex: 1, justifyContent: 'center' }]}>
            <Text style={[MyStyles.title, { textAlign: 'center', marginBottom: 20 }]}>ĐĂNG NHẬP</Text>
            <TextInput
                label="Tên đăng nhập"
                value={user.username}
                onChangeText={t => updateState('username', t)}
                style={MyStyles.textInput}
                left={<TextInput.Icon icon="account" />}
                autoCapitalize="none"
            />

            <TextInput
                label="Mật khẩu"
                value={user.password}
                onChangeText={t => updateState('password', t)}
                secureTextEntry={seePassword}
                style={MyStyles.textInput}
                left={<TextInput.Icon icon="lock" />}
                right={<TextInput.Icon icon={seePassword ? "eye" : "eye-off"} onPress={() => setSeePassword(!seePassword)} />}
                autoCapitalize="none"
            />

            <HelperText type="error" visible={errMsg ? true : false}>
                {errMsg}
            </HelperText>
            <Button style={MyStyles.button} loading={loading} disabled={loading} mode="contained" onPress={login}>
                Đăng nhập
            </Button>
            
            <Button mode="text" onPress={() => nav.navigate("Register")}>
                Chưa có tài khoản? Đăng ký ngay
            </Button>
        </View>
    );
}

export default Login;