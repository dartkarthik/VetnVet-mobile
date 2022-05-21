import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import axios from 'react-native-axios';
import DatePicker from 'react-native-datepicker';
import { Divider } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Dropdown } from "react-native-element-dropdown";
// import { useIsFocused } from "@react-navigation/core";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VisitHistoryDetails = ({ route, navigation }) => {

    const [formData, setFormData] = useState({
        visit_purpose: '',
        doctor_note: '',
    })
    // console.log(formData);

    const [visitHistoryDetail, setVisitHistoryDetail] = useState([]);
    const [date, setDate] = useState();

    const [visitPurposeData, setVisitPurposeData] = useState([]);

    const [extendPresc, setExtendPresc] = useState(false);

    const [ diseases, setDiseases ] = useState('');

    const [ branch, setBranch ] = useState('');

    useEffect(() => {
        getVisitPurposeData();
        getDisease();
        getBranch();
    }, [])

    // console.log("ihhigbi",route.params.visitData);

    const data = route.params.visitData;

    // visit purpose
    const getVisitPurposeData = () => {
        let visitPurposeData = visitPurposeData;
        visitPurposeData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/visitPurpose/clinic/${userClinicId}`).then(
            res => {
                // console.log(res.data);
                res.data.map((element, index) => {
                    visitPurposeData.push({
                        id: element.id,
                        visit_purpose: element.visit_purpose,
                        title: `${element.visit_purpose}`
                    });
                });
                setVisitPurposeData(visitPurposeData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getBranch = () => {
        let id = data.branch_id;
        console.log("id", id)
        axios.get(`/branch/${id}`).then(
            res => {
                // let branch_name = res.data.edited_name ? res.data.edited_name : res.data.actual_name;
                console.log(res.data[0].branch);
                setBranch(res.data[0].branch);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getDisease = () => {
        let diseaseId = data.disease;
        axios.get(`/disease/${diseaseId}`).then(
            res => {
                let disease_name = res.data.edited_name ? res.data.edited_name : res.data.actual_name;
                setDiseases(disease_name);
                // console.log(disease_name);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const onSubmitVisitDetails = () => {
        navigation.navigate('VisitHistory');
    }

    const onVisitPrescDetail = () => {
        if (extendPresc) {
            setExtendPresc(false);
        } else {
            setExtendPresc(true);
        }
    }

    const onHandleEdit = () => {
        if(!editComp){
            setEditComp(true);
            setEditButton(true);

        }else{
            setEditComp(false);
            setEditButton(false);
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <>
                <View>
                    <View style={{ backgroundColor: '#BFD9D980', padding: 10 }}>
                        <View style={{ flexDirection: 'row', marginVertical: 16 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', textTransform: 'capitalize' }}>{data.pet_id.pet_name} / {data.owner_name_id.pet_owner_name}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="calendar-edit"
                                    color={'#006766'}
                                    size={35}
                                />
                                <DatePicker
                                    style={styles.datePickerStyle}
                                    date={date} // Initial date from state
                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            display: 'none'
                                        },
                                    }}
                                    onDateChange={(date) => {
                                        setDate(date);
                                    }}
                                    dropDownContainerStyle={{
                                        borderWidth: 1,
                                        borderColor: '#eeee',
                                    }}
                                    searchContainerStyle={{
                                        borderBottomColor: "#eeee"
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                            <Text style={{ color: '#000' }}><Text style={{ fontWeight: 'bold' }}>Pet Age: </Text>{data.pet_id.pet_age}</Text>
                            <Text style={{ color: '#000' }}><Text style={{ fontWeight: 'bold' }}>Last Visit: </Text>{data.pet_id.last_visit}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.visitHistoryForm}>
                    <View>
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Visit Purpose: </Text>
                            <Text style={styles.histDetailTextView}>{data.visit_purpose.visit_purpose}</Text>
                            
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Doctor's Note: </Text>
                            <Text style={styles.histDetailTextView}>{data.diagnosis_note}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Diagnosis Note: </Text>
                            <Text style={styles.histDetailTextView}>{data.doctor_note}</Text>

                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Disease: </Text>
                            <Text style={styles.histDetailTextView}>{diseases}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Symptoms: </Text>

                            <Text style={styles.histDetailTextView}>{data.symptoms_data}</Text>
                            {/* <Text style={styles.histDetailTextView}>{data.symptoms_data.symptom_id}</Text> */}
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Weight: </Text>

                            <Text style={styles.histDetailTextView}>{data.weight}</Text>
                        </View>

                        <View style={styles.prescripBox}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: '700', color: '#006766', fontSize: 16 }}>Prescription: <Text style={{ color: '#000', fontSize: 14 }}>(General Skin Labrador Adult)</Text></Text>
                                <TouchableOpacity onPress={onVisitPrescDetail}>
                                    <Icon name="arrow-right" size={20} color="#6622ee" />
                                </TouchableOpacity>
                            </View>
                            {extendPresc ?
                                <View>
                                    <Text style={styles.visitPres}>Prednisolone 50mg | BM | 1 Morning, 2 Afternoon, 1 Evening | 10 days</Text>
                                    <Divider />
                                    <Text style={styles.visitPres}>Evil eyedrop | NA | every one hour | 3 drops | 10 days</Text>
                                    <Divider />
                                    <Text style={styles.visitPres}>Tbat | NA | Apply Twice a Day | 10 days</Text>
                                    <Divider />
                                    <Text style={styles.visitPres}>Pantoprazole 50mg | NA | Apply Twice a day| 10 days </Text>
                                </View>
                                : <></>}
                        </View>
                        
                        <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                            <Text style={styles.label}>Documents:</Text>
                            <TouchableOpacity
                                // onPress={() => navigation.navigate('DocumentUpload', { updateFileQueue: updateFileQueue, files: files })} 
                                style={{ marginTop: 15 }}
                            >
                                <Text style={{ textAlign: 'center', padding: 14, backgroundColor: '#0E9C9B', color: '#fff', borderRadius: 12, }}>file/image</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Visit Type: </Text>

                            <Text style={styles.histDetailTextView}>{data.visit_type.visit_type}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.histDetailView}>
                            <Text style={styles.label}>Branch: </Text>

                            <Text style={styles.histDetailTextView}>{branch}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Consulted By: </Text>

                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{data.doctor_name}</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={onSubmitVisitDetails}
                                style={{ backgroundColor: '#006766', padding: 20 }}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </>
        </ScrollView>
    )
}

export default VisitHistoryDetails

const styles = StyleSheet.create({

    histDetailView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
        alignItems: 'center',
        padding: 14,
    },
    histDetailTextView: {
        marginLeft: 14,
    },
    divider: {
        marginHorizontal: 20
    },
    datePickerStyle: {
        width: 120,
        backgroundColor: '#fff',
    },
    otherInfo: {
        marginHorizontal: 10,
        fontSize: 16,
        marginVertical: 16,
        color: '#000'
    },
    label: {
        color: '#000',
        fontWeight: 'bold'
    },
    visitPres: {
        marginVertical: 10,
        color: '#000',
    },
    prescripBox: {
        marginHorizontal: 10,
        marginVertical: 14,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 15,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#444A80'
    },
    dropdown: {
        width: '60%',
        padding: 5,
        backgroundColor: '#E5E5FF',
        borderRadius: 5
    },
    editTextInput: {
        backgroundColor: '#E5E5FF',
        borderRadius: 5,
        width: '60%',
        paddingLeft: 14,
    },
    editBtn: {
        backgroundColor: '#6622ee',
        width: 100,
        padding: 10
    },
})
