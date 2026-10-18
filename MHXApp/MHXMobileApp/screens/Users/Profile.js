import { useContext } from "react";
import { Button } from "react-native-paper";
import { MyUserContext } from "../../utils/Contexts/MyContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Text, View } from "react-native";
import MyStyles from "../../Styles/MyStyles"
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const nav = useNavigation();
    const {user ,dispatch} = useContext(MyUserContext);
    console.log(user.role);
    const logout = async () => {
        AsyncStorage.removeItem("token");
        dispatch({
            "type": "logout"
        });
    }

    return (
        <View style={MyStyles.padding}>
            <Text style={MyStyles.title}>Hello, {user.username}!</Text>
            <View style={{justifyContent: "center", alignItems: "center", padding: 30}}>
                <Image source={{uri: user.avatar}} style={MyStyles.avatar} />
            </View>
            <Button style={MyStyles.button} mode="contained-tonal" icon="account" onPress={logout}>Đăng xuất</Button>
            <Button style={MyStyles.button} mode="contained-tonal" icon="wrench" onPress={logout}>Chỉnh sửa thông tin</Button>
            { user.division ? null : <Button style={MyStyles.button} mode="contained-tonal" icon="group" onPress={() => nav.navigate("Home", {screen: 'DivisionRegisterList'})}>Tình trạng đăng ký đội hình</Button>}
         </View>
         
    );
}

export default Profile;