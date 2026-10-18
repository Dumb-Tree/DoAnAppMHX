import React, { useState, useContext } from "react";
import { MyUserContext } from "../../utils/Contexts/MyContexts";
import { View, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Text,
    TextInput,
    Button,
    HelperText
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApis, endpoints } from "../../utils/Apis";
import MyStyles from "../../Styles/MyStyles";

const NewActivity = () => {
    const nav = useNavigation();
    const { user } = useContext(MyUserContext);
    const [activity, setActivity] = useState({
        name: "",
        description: "",
        location: "",
    });

    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Picker visibility states for separate Date and Time
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const updateActivity = (field, value) => {
        setActivity({
            ...activity,
            [field]: value
        });
    };

    const formatDate = (date) => {
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const createActivity = async () => {
        if (
            !activity.name ||
            !activity.description ||
            !activity.location
        ) {
            setErrMsg("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (endDate <= startDate) {
            setErrMsg(
                "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
            return;
        }

        try {
            setLoading(true);
            setErrMsg("");

            const token = await AsyncStorage.getItem("token");

            const data = {
                name: activity.name,
                description: activity.description,
                location: activity.location,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                division: user?.division,
            };

            const res = await authApis(token).post(
                endpoints.activities, data
            );

            nav.goBack();

        } catch (ex) {
            console.error(
                "CREATE ACTIVITY ERROR:",
                ex.response?.data || ex.message
            );

            if (ex.response?.status === 403) {
                setErrMsg("Bạn không có quyền tạo hoạt động.");
            } else if (ex.response?.data) {
                setErrMsg(
                    Object.values(ex.response.data)
                        .flat()
                        .join("\n")
                );
            } else {
                setErrMsg("Không thể tạo hoạt động.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={MyStyles.padding}>

            <Text style={MyStyles.title}>
                TẠO HOẠT ĐỘNG
            </Text>

            <TextInput
                label="Tên hoạt động"
                value={activity.name}
                onChangeText={value => updateActivity("name", value)}
                style={MyStyles.textInput}
            />

            <TextInput
                label="Mô tả"
                value={activity.description}
                onChangeText={value => updateActivity("description", value)}
                style={MyStyles.textInput}
                multiline
            />

            <TextInput
                label="Địa điểm"
                value={activity.location}
                onChangeText={value => updateActivity("location", value)}
                style={MyStyles.textInput}
            />

            {/* START TIME SECTION */}
            <Text style={{ marginTop: 15, marginBottom: 5 }}>
                Thời gian bắt đầu
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    mode="outlined"
                    style={{ flex: 1, marginRight: 5 }}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowStartDatePicker(true);
                    }}
                >
                    {startDate.toLocaleDateString("vi-VN")}
                </Button>

                <Button
                    mode="outlined"
                    style={{ flex: 1, marginLeft: 5 }}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowStartTimePicker(true);
                    }}
                >
                    {startDate.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                </Button>
            </View>

            {/* Start Date Picker */}
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (event.type === "set" && selectedDate) {
                            const newDate = new Date(startDate);
                            newDate.setFullYear(selectedDate.getFullYear());
                            newDate.setMonth(selectedDate.getMonth());
                            newDate.setDate(selectedDate.getDate());
                            setStartDate(newDate);
                            if (newDate >= endDate) {
                                setEndDate(new Date(newDate.getTime() + 60 * 60 * 1000));
                            }
                        }
                    }}
                />
            )}

            {/* Start Time Picker */}
            {showStartTimePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowStartTimePicker(false);
                        if (event.type === "set" && selectedTime) {
                            const newDate = new Date(startDate);
                            newDate.setHours(selectedTime.getHours());
                            newDate.setMinutes(selectedTime.getMinutes());
                            setStartDate(newDate);
                            if (newDate >= endDate) {
                                setEndDate(new Date(newDate.getTime() + 60 * 60 * 1000));
                            }
                        }
                    }}
                />
            )}

            {/* END TIME SECTION */}
            <Text style={{ marginTop: 15, marginBottom: 5 }}>
                Thời gian kết thúc
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    mode="outlined"
                    style={{ flex: 1, marginRight: 5 }}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowEndDatePicker(true);
                    }}
                >
                    {endDate.toLocaleDateString("vi-VN")}
                </Button>

                <Button
                    mode="outlined"
                    style={{ flex: 1, marginLeft: 5 }}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowEndTimePicker(true);
                    }}
                >
                    {endDate.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                </Button>
            </View>

            {/* End Date Picker */}
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    minimumDate={startDate}
                    onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (event.type === "set" && selectedDate) {
                            const newDate = new Date(endDate);
                            newDate.setFullYear(selectedDate.getFullYear());
                            newDate.setMonth(selectedDate.getMonth());
                            newDate.setDate(selectedDate.getDate());
                            setEndDate(newDate);
                        }
                    }}
                />
            )}

            {/* End Time Picker */}
            {showEndTimePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowEndTimePicker(false);
                        if (event.type === "set" && selectedTime) {
                            const newDate = new Date(endDate);
                            newDate.setHours(selectedTime.getHours());
                            newDate.setMinutes(selectedTime.getMinutes());
                            setEndDate(newDate);
                        }
                    }}
                />
            )}

            <HelperText type="error" visible={!!errMsg}>
                {errMsg}
            </HelperText>

            <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={createActivity}
                style={MyStyles.button}
            >
                TẠO HOẠT ĐỘNG
            </Button>

        </View>
    );
};

export default NewActivity;