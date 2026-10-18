import React from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MyStyles from "../../Styles/MyStyles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../utils/Apis";
import { useState, useEffect } from "react";
import { Image } from 'react-native';
import { useContext } from 'react';
import { MyUserContext } from '../../utils/Contexts/MyContexts'
import { ActivityIndicator, HelperText } from 'react-native-paper';
const DivisionDetails = () => {
  const route = useRoute();
  const divisionId = route.params.Division;
  console.log("Division ID from route params:", divisionId);
  const { dispatch } = useContext(MyUserContext);
  const { user } = useContext(MyUserContext);

console.log("USER:", user);
console.log("USER DIVISION:", user?.division);
console.log("USER REGISTRATIONS:", user?.registrations);
  const [divisionDetails, setDivisionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const nav = useNavigation();
  const loadDivisionDetails = async () => {
    try {
      setLoading(true);
    let res = await Apis.get(endpoints.division(divisionId));
      setDivisionDetails(res.data);
    } catch (error) {console.error("Error loading division details:", error);} 
    finally {
      setLoading(false);
    }
    };
  useEffect(() => {
    loadDivisionDetails();
  }, [divisionId]);

  if (loading) {
    return <ActivityIndicator animating={true} />;
  }
  return (
    <ScrollView>
         <Text style={MyStyles.divisionNameBanner}>
            {divisionDetails?.divisionName}
        </Text>
        <Text style={MyStyles.divisionDetails}>
            {divisionDetails?.divisionDescription}
        </Text>
            <HelperText type="error" visible={errMsg}>
                {errMsg}
            </HelperText>
        {user?.division === null && (
        <Button style={MyStyles.button} onPress={() => nav.navigate("DivisionRegister", { divisionId: divisionId })}>
            <Text style={MyStyles.buttonText}>Đăng ký đội hình</Text>
        </Button>)}
    </ScrollView>
  );
};

export default DivisionDetails;