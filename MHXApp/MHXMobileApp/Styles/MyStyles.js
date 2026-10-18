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
    },text:{
        fontSize:20,
        margin:10,
        textAlign:"center",
    },button:{
        margin:10,
        padding:5,
        backgroundColor:"#1cca79",
    },rejectButton:{
        margin:10,
        padding:5,
        backgroundColor:"#ff4d4d",
        color:"#ffffff",
    },
    textInput:{
        fontSize:18,
        padding:5,
        margin:5,
        borderRadius:10,
        backgroundColor:"#8ad2ff",
    },CardStyle:{
        backgroundColor: '#c5fee3',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#96beff',
        margin: 10,
        marginHorizontal: 20,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 20,
        overflow: "hidden",
    },buttonText:{
        color:'#ffffff',
        fontSize:20,
        margin:10,
        fontWeight:'bold',
    },registerList:{
        backgroundColor: '#c6e3ff',
        margin: 10,
        padding: 5,
        borderRadius: 10,
    },registerListText:{
        fontSize:18
    },registerReasonText:{
        margin:30,
        padding:20,
        paddingBottom:30,
        backgroundColor:"#defff9",
        color:"#040404",
        fontSize: 20,
    },cardImage:{
        width:"100%",
        height: 220,
    },
     container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
        fontWeight: "bold",
        fontSize:25,
        margin:10,
        textAlign:"center"
    },card: {
        marginBottom: 16,
    },activityName: {
        fontWeight: "bold",
        marginBottom: 8,
    },description: {
        marginBottom: 12,
    },info: {
        marginBottom: 5,
    },actionContainer: {
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
    },startedText: {
        fontSize: 14,
        color: 'gray',
    },loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },loadingText: {
        marginTop: 10,
    },list: {
        paddingBottom: 20,
    },emptyList: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },emptyText: {
        fontSize: 20,
        textAlign: "center",
        paddingBottom:10,
    },bannerText: {
        backgroundColor: "#00b75b",
        color: "#f6f7fb",
        fontWeight: "bold",
        textAlign: "center",
        alignItems: "center",
        fontSize:20,
        flexWrap: "wrap"
    },divisionNameBanner:{
        backgroundColor: "#00b75b",
        color: "#f6f7fb",
        fontWeight: "bold",
        textAlign: "center",
        alignItems: "center",
        fontSize:30,
    },divisionDetails:{
        textAlign: "justify",
        fontSize:20,
        margin:20,
    }
})