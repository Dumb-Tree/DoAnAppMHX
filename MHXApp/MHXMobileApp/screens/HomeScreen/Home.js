import Division from "../../components/Division"
import { Text } from "react-native-paper"
import { View } from "react-native"
import MyStyle from "../../Styles/MyStyles"

const Home = () => {
    return(
        <View>
            <Text style={MyStyle.text}>Bạn muốn tìm hiểu đội hình nào?</Text>
            <Division />
        </View>
    )
}
export default Home;