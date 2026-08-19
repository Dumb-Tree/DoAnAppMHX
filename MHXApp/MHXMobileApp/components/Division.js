import { useEffect, useState } from "react";
import { FlatList, View, Image } from "react-native";
import { ActivityIndicator, Chip} from "react-native-paper";
import Apis, { endpoints } from "../utils/Apis";
import MyStyle from "../Styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";

const Division = () => {
    const [divisions, setDivisions] = useState([]);
    const nav = useNavigation();

    const [loading, setLoading] = useState(false);

        const loadDivisions = async () => {
        let res = await Apis.get(endpoints['divisions']);
        console.log("API DATA:", res.data);
        console.log("IS ARRAY:", Array.isArray(res.data));
        setDivisions(res.data);
    }
        useEffect(() => {
        loadDivisions();
    },[]);
    
return (
    <View>
        {divisions.map(c => (
            <TouchableOpacity
                key={c.id}
                onPress={() => {
                    console.log("Division ID:", c.id);
                }}
            >
                <Chip icon="star" style={MyStyle.Chip}> {c.divisionName} </Chip>
            </TouchableOpacity>
        ))}
    </View>
);
}
export default Division;