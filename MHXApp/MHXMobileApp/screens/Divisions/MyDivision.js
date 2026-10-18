import { ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { MyUserContext } from "../../utils/Contexts/MyContexts";
import Apis, { endpoints } from "../../utils/Apis";
import MyStyles from "../../Styles/MyStyles";
import { useState, useEffect, useContext } from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ActivityList from "../Activity/ActivityList";
const MyDivision = () => {
    const { user } = useContext(MyUserContext);
    const nav = useNavigation();
    const [division, setDivision] = useState(null);

    useEffect(() => {
        const loadDivision = async () => {
            try {
                const res = await Apis.get(
                    `${endpoints["divisions"]}${user.division}/`
                );

                console.log("DIVISION:", res.data);

                setDivision(res.data);
            } catch (error) {
                console.log("ERROR:", error);
            }
        };

        if (user?.division) {
            loadDivision();
        }
    }, [user]);

    return (
        <ScrollView>
            <Text style={MyStyles.title}>
                 {division?.divisionName || "Đang tải..."}
            </Text>
            <TouchableOpacity>
            <Button style={MyStyles.button}mode="contained-tonal" icon="calendar" onPress={() => nav.navigate("ActivityList")}><Text style={MyStyles.buttonText}>Danh sách hoạt động</Text></Button>
            </TouchableOpacity>
            <TouchableOpacity>
            {user.role === 'leader'? <Button style={MyStyles.button} mode="contained-tonal" icon="wrench"><Text style={MyStyles.buttonText}>Quản lý chiến sĩ</Text></Button> : null}
            </TouchableOpacity>
            <TouchableOpacity>
            { user.role === 'leader'? <Button style={MyStyles.button} mode="contained-tonal" icon="check" onPress={() => nav.navigate("Home",{screen: "DivisionWaitingList"})}><Text style={MyStyles.buttonText}>Duyệt chiến sĩ</Text></Button> : null }
            </TouchableOpacity>
        </ScrollView>
    );
};

export default MyDivision;