import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Card, ActivityIndicator } from 'react-native-paper';
import Apis, { endpoints } from "../utils/Apis";
import MyStyle from "../Styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";

const Division = () => {
    const [divisions, setDivisions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const nav = useNavigation();

    const loadDivisions = async () => {
        if (loading || !hasMore) return; 
        setLoading(true);
        try {
            let res = await Apis.get(`${endpoints['divisions']}?page=${page}`);
            
            const newDivisions = res.data.results || res.data; 

            setDivisions(prev => [...prev, ...newDivisions]);
            if (!res.data.next) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading divisions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDivisions();
    }, [page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1); 
        }
    };

    return (
        <FlatList
            data={divisions}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => {
                        console.log("Division ID:", item.id);
                        nav.navigate("DivisionDetails", { Division: item.id });
                    }}
                >
                    <Card style={MyStyle.CardStyle}>
                        <Card.Cover source={{ uri: item.picture }} style={MyStyle.cardImage} resizeMode="cover" />
                        <Card.Content>
                            <Text style={MyStyle.title}>{item.divisionName}</Text>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loading ? <ActivityIndicator animating={true} size="small" style={{ margin: 20 }} /> : null
            }
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );
};

export default Division;