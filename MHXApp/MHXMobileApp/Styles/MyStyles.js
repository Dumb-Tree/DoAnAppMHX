import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        margin: 5
    },
    margin: {
        margin: 5
    }, avatar: {
        marginRight: 10,
        width:150,
        height:150,
        borderRadius:50
    },title:{
        fontSize:25,
        fontWeight:"bold",
        margin:10,
        textAlign:"center"
    },text:{
        fontSize:20,
        margin:10,
        textAlign:"center"    
    },button:{
        margin:10,
        padding:5,
        backgroundColor:"#4aa4ff",
    },textInput:{
        fontSize:18,
        padding:5,
        margin:5,
        borderRadius:10,
        backgroundColor:"#c6e3ff",
    },Chip:{
        backgroundColor: '#E0F7FA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00ACC1',
        paddingVertical: 2,
        margin: 5,
    }
})