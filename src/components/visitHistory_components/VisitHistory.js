import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import axios from 'react-native-axios';
import { Divider, Badge } from 'react-native-paper';

const VisitHistory = ({route, navigation}) => {
    
    const [visitHistory, setVisitHistory] = useState([]);
    let colors = ['#CADEDF', '#16796F'];
    let textColor = ['#000', '#fff']
    // let textColor = ['#00000080', '#fff'];

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
                        {/* {console.log("element", element)} */}
                            {element.is_submited === '1' ? 

                                <View style={styles.saved_badge}>
                                    <Text style={styles.savedBadge}>Submitted</Text>
                                </View>

                                :<View style={styles.draft_badge}>
                                    <Text style={styles.draftBadge}>Draft</Text>
                                </View>
                            }
                            
                            <TouchableOpacity 
                                onPress={() => onHistoryClick(element)}
                                style={{
                                    backgroundColor: colors[index % colors.length],
                                    borderRadius: 5,
                                    marginVertical: 10,
                                    // elevation: 1,
                                    marginHorizontal: 10,
                                    zIndex: 0,
                                    borderWidth: 0.6,
                                    borderColor: '#00676640'
                                }}
                            >
                                <View style={styles.visitHistoryListHead}>
                                    <View style={styles.wrapper}>
                                        <View style={styles.wrapper_content_left}>
                                            <Text style={{
                                                textAlign: 'left',
                                                color: textColor[index % textColor.length],
                                                fontWeight: 'bold',
                                            }}>{element.pet_id.pet_name} / {element.owner_name_id.pet_owner_name}</Text>
                                            <Text style={{
                                                textAlign: 'left',
                                                color: textColor[index % textColor.length],
                                                fontWeight: 'bold',
                                            }}>{element.visit_purpose.visit_purpose}</Text>
                                        </View>

                                        <View style={styles.wrapper_content_right}>
                                            <Text style={{
                                                textAlign: 'right',
                                                color: textColor[index % textColor.length],
                                                fontWeight: 'bold',
                                            }}>{element.visit_type.visit_type}</Text>
                                            <Text style={{
                                                textAlign: 'right',
                                                color: textColor[index % textColor.length],
                                                fontWeight: 'bold',
                                            }}>{element.visited_clinic_id.clinic_name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    ))
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({

    visitHistoryListHead: {
        width: '100%',
    },
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    wrapper_content_left: {
        width: '48%',
        height: 70,
        marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    wrapper_content_right: {
        width: '48%',
        height: 70,
        marginLeft: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    saved_badge: {
        width: 80,
        backgroundColor: '#F2AA4CFF',
        paddingVertical: 8,
        marginLeft: 10,
        position: 'relative',
        top: 15,
        zIndex: 999999999,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderWidth: 0.5,
        borderColor: '#fff'
    },
    draft_badge: {
        width: 60,
        backgroundColor: 'red',
        paddingVertical: 8,
        marginLeft: 10,
        position: 'relative',
        top: 15,
        zIndex: 999999999,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10
    },
    savedBadge: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    draftBadge: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },

})

export default VisitHistory

