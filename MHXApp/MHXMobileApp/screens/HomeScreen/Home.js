import Division from "../../components/Division"
import { Text } from "react-native-paper"
import { ScrollView, View } from "react-native"
import MyStyle from "../../Styles/MyStyles"

const Home = () => {
    return(
        <View>
            <Text style={MyStyle.bannerText}>Bạn muốn tìm hiểu đội hình nào?</Text>
            <Division />

        </View>
    )
}
export default Home;