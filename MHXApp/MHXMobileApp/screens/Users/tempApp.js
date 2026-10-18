// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { MyUserContext } from './utils/Contexts/MyContexts';
// import Home from './screens/HomeScreen/Home';
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator} from "@react-navigation/native-stack";
// import MyUserReducer from './utils/Reducers/MyUserReducer';
// import { useReducer, useContext } from "react";
// const Stack = createNativeStackNavigator();
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Icon } from "react-native-paper";
// import Register from './screens/Users/Register';
// import Login from './screens/Users/Login';
// import Profile from './screens/Users/Profile';
// import DivisionDetails from './screens/Divisions/DivisionDetails';
// import DivisionRegister from './screens/Divisions/DivisionRegister';
// import DivisionRegisterList from './screens/Divisions/DivisionRegisterList';

// const StackNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Homescreen" component={Home} options={{ title: "Trang chủ" }}/>
//       <Stack.Screen name="Register" component={Register} options={{ title: "Đăng ký" }}/>
//       <Stack.Screen name="Login" component={Login} options={{ title: "Đăng nhập" }}/>
//       <Stack.Screen name="Profile" component={Profile} options={{ title: "Hồ sơ" }}/>
//       <Stack.Screen name="DivisionDetails" component={DivisionDetails} options={{ title: "Chi tiết đội hình" }}/>
//       <Stack.Screen name="DivisionRegister" component={DivisionRegister} options={{ title: "Đăng ký đội hình" }}/>
//       <Stack.Screen name="DivisionRegisterList" component={DivisionRegisterList} options={{ title: "Danh sách đội hình đăng ký"}}/>
//     </Stack.Navigator>
//   );
// };

// const Tab = createBottomTabNavigator();
// const TabNavigator = () => {
//     const { user }= useContext(MyUserContext); 
//     return(
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={StackNavigator} options={{title:"Trang chủ", tabBarIcon: () => <Icon color="black" source="home-circle" size={30} />}} />
//         {user ? null : <Tab.Screen name="Register" component={Register} options={{title:"Đăng ký", tabBarIcon: () => <Icon color="black" source="account-plus" size={30} />}} />}
//         {user ? null : <Tab.Screen name="Login" component={Login} options={{title:"Đăng nhập", tabBarIcon: () => <Icon color="black" source="login" size={30} />}} />}
//         {user && <Tab.Screen name="Profile" component={Profile} options={{title:"Hồ sơ", tabBarIcon: () => <Icon color="black" source="account" size={30} />}} />}
        
//       </Tab.Navigator>
//     );
// }


// const App = () => {
//   const [user, dispatch] = useReducer(MyUserReducer, null);
//   return (
//     <MyUserContext.Provider value={{user, dispatch}}>
//       <NavigationContainer>
//         <TabNavigator />
//       </NavigationContainer>
//     </MyUserContext.Provider>
//   );
// }


// //export default App;
