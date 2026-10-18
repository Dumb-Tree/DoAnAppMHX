import { StyleSheet, Text, View } from 'react-native';
import { MyUserContext } from './utils/Contexts/MyContexts';
import Home from './screens/HomeScreen/Home';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import MyUserReducer from './utils/Reducers/MyUserReducer';
import { useReducer, useContext } from "react";
const Stack = createNativeStackNavigator();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Register from './screens/Users/Register';
import Login from './screens/Users/Login';
import Profile from './screens/Users/Profile';
import DivisionDetails from './screens/Divisions/DivisionDetails';
import DivisionRegister from './screens/Divisions/DivisionRegister';
import DivisionRegisterList from './screens/Divisions/DivisionRegisterList';
import MyDivision from './screens/Divisions/MyDivision';
import DivisionWaitingList from './screens/Divisions/DivisionWaitingList';
import ActivityList from './screens/Activity/ActivityList';
import NewActivity from './screens/Activity/NewActivity';
import ActivityProof from "./screens/Activity/ActivityProof";
import ActivityProofReview from "./screens/Activity/ActivityProofReview";
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homescreen" component={Home} options={{ title: "OUMHX-2026" }}/>
      <Stack.Screen name="Register" component={Register} options={{ title: "Đăng ký" }}/>
      <Stack.Screen name="Login" component={Login} options={{ title: "Đăng nhập" }}/>
      <Stack.Screen name="Profile" component={Profile} options={{ title: "Hồ sơ" }}/>
      <Stack.Screen name="DivisionDetails" component={DivisionDetails} options={{ title: "Chi tiết đội hình" }}/>
      <Stack.Screen name="DivisionRegister" component={DivisionRegister} options={{ title: "Đăng ký đội hình" }}/>
      <Stack.Screen name="DivisionRegisterList" component={DivisionRegisterList} options={{ title: "Danh sách đội hình đăng ký"}}/>
      <Stack.Screen name="DivisionWaitingList" component={DivisionWaitingList} options={{ title: "Danh sách chiến sĩ chờ duyệt"}}/>
    </Stack.Navigator>
  );
};
const MyDivisionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyDivision" component={MyDivision} options={{ headerShown: false }}/>
      <Stack.Screen name="ActivityList" component={ActivityList} options={{ title: "Danh sách hoạt động" }}/>
      <Stack.Screen name="NewActivity" component={NewActivity} options={{ title:"Thêm hoạt động mới"}}/>
      <Stack.Screen name="ActivityProof" component={ActivityProof} options={{ title:"Minh chứng hoạt động"}}/>
      <Stack.Screen name="ActivityProofReview" component={ActivityProofReview} options={{title:"Duyệt hoạt động"}}/>
    </Stack.Navigator>
  );
};
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
    const { user }= useContext(MyUserContext); 
    return(
      <Tab.Navigator>
        <Tab.Screen name="Home" component={StackNavigator} options={{title:"Trang chủ", headerShown: false, tabBarIcon: () => <Icon color="black" source="home-circle" size={30} />}} />
        {user ? null : <Tab.Screen name="Register" component={Register} options={{title:"Đăng ký", tabBarIcon: () => <Icon color="black" source="account-plus" size={30} />}} />}
        {user ? null : <Tab.Screen name="Login" component={Login} options={{title:"Đăng nhập", tabBarIcon: () => <Icon color="black" source="login" size={30} />}} />}
        {user && <Tab.Screen name="Profile" component={Profile} options={{title:"Hồ sơ", tabBarIcon: () => <Icon color="black" source="account" size={30} />}} />}
        {user && user.division ? <Tab.Screen name="MyDivisionTab" component={MyDivisionStack} options={{title:"Đội hình tôi", tabBarIcon: () => <Icon color="black" source="account-multiple" size={30} />}} /> : null}
      </Tab.Navigator>
    );
}


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyUserContext.Provider value={{user, dispatch}}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
}


export default App;
