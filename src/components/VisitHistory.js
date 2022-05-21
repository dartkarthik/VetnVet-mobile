import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import axios from 'react-native-axios';
import { Divider, Badge } from 'react-native-paper';

const VisitHistory = ({route, navigation}) => {
    
    const [visitHistory, setVisitHistory] = useState([]);
    let colors = ['#fff', '#BFD9D9'];
    // let textColor = ['#000', '#fff'];

    useEffect(() => {
        getVisitHistoryById();
    }, [])

    const getVisitHistoryById = () => {
        let pet_id = route.params.petData
        // console.log(pet_id)
        axios.get(`visitDetail/pet/${pet_id}`).then(
            res=> {
                console.log(res.data);
                if (res.status === 200) {
                    // console.log(res.data);
                    // VisitHistory = res.data;
                    setVisitHistory(res.data)
                }
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const onHistoryClick = (id) => {
        navigation.navigate('VisitHistoryDetails', {visitData:id})
        console.log(id);
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    visitHistory.map((element, index) => (
                        <>
                        {console.log("element", element)}
                        {element.is_submited === '0' ? 
                            <>
                                <Badge
                                    style={{
                                    backgroundColor: 'red', 
                                    fontSize: 15, 
                                    borderRadius: 5, 
                                    width: 50, 
                                    position: 'relative', 
                                    elevation: 5, 
                                    height: 30, 
                                    marginHorizontal: 5, 
                                    top: 20,
                                    fontWeight: 'bold'
                                }}>Draft</Badge>
                            </>
                        : <></>}
                        
                        <TouchableOpacity 
                            onPress={() => onHistoryClick(element)}
                            style={{
                                backgroundColor: colors[index % colors.length],
                                marginHorizontal: 10,
                                marginTop: 10,
                                borderRadius: 14
                            }}
                        >
                            <View style={styles.visitHistoryListHead}>
                                <View style={styles.visitHistoryList}>
                                    <Text style={{color: '#006766', fontSize: 16, fontWeight: 'bold', textAlign: 'left', textTransform: 'capitalize'}}>{element.pet_id.pet_name} / {element.owner_name_id.pet_owner_name}</Text>
                                    <Text style={{color: '#00000080', fontSize: 16, fontWeight: 'bold', textAlign: 'right', textTransform: 'capitalize'}}>purpose : <Text style={{color: '#006766', fontSize: 16, fontWeight: 'bold'}}>{element.visit_purpose.visit_purpose}</Text></Text>
                                </View>
                                <View style={styles.visitHistoryList}>
                                    <Text style={{color: '#006766', fontSize: 16, fontWeight: 'bold', textAlign: 'left', textTransform: 'capitalize'}}>{element.visit_type.visit_type}</Text>
                                    {/* <Text style={{color: '#006766'}}>{diseases}</Text> */}
                                    <Text style={{color: '#006766', fontSize: 16, fontWeight: 'bold', textAlign: 'right', textTransform: 'uppercase'}}>{element.visited_clinic_id.clinic_name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {/* <Divider style={{padding: 0.4, marginHorizontal: 50, marginVertical: 10, backgroundColor: '#fff', elevation: 2, borderWidth: 0}}/> */}
                        </>
                    ))
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
   
    visitHistoryList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 12,
        alignItems: 'center',
    },
})

export default VisitHistory

