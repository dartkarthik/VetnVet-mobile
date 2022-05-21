import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Divider, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
// import { LinearGradient } from 'expo-linear-gradient';
import axios from "react-native-axios";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditPrescriptionTemplate = ({route, navigation}) => {
    let colors = ['#BFD9D9', '#fff'];
    // console.log("dataTemp", route.params.dataTemp);

    const [editPrescFormData, setEditPrescFormData] = useState({
        template_name: '',
        short_note: '',
        medicine: [],
        clinic_id: route.params.userDetails.clinic.id,
        branch_id: route.params.userDetails.branch.id,
    });
    
    const [requiredField, setRequiredField] = useState(false);
    const [ savedPresc, setSavedPresc ] = useState(false);

    const [ medIndex, setMedIndex ] = useState();

    const [ medData, setMedData ] = useState([]);

    useEffect(() => {
        getIndividualTemplateById();
        // updatingMedicineQueueToPrescription();
    }, []);

    // useEffect(() => {
    //     if(route.params.editMedicineDetailsFromVisits) {
    //         setEditPrescFormData({
    //             template_name: route.params.editMedicineDetailsFromVisits.prescriptionTemplate.template_name,
    //             short_note: route.params.editMedicineDetailsFromVisits.prescriptionTemplate.short_note,
    //             medicine: [],
    //             clinic_id: route.params.userDetails.clinic.id,
    //             branch_id: route.params.userDetails.branch.id,
    //         })

    //         console.log("route.params.editMedicineDetailsFromVisits", route.params.editMedicineDetailsFromVisits);
    //     }
    // }, [route.params.editMedicineDetailsFromVisits])

    const getIndividualTemplateById = async() => {
        let prescId = route.params.dataTemp.id;
        await axios.get(`prescription-template/${prescId}`)
        .then((res) => {
            // console.log(res.data);
            let tempData = res.data[0];
            let meds = JSON.parse(tempData.medicine);
            // setPrescData(res.data);
            // console.log("meds", meds);
            setMedData(meds);
            setEditPrescFormData({
                ...editPrescFormData,
                template_name: tempData.template_name,
                short_note: tempData.short_note,
                medicine: meds
            });
            
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    // console.log("medData", medData);
    // console.log("tempData", editPrescFormData);

    const onHandleTemlplateName = (value) => {
        setEditPrescFormData({
            ...editPrescFormData,
            template_name: value
        });
    }

    const onHandleTemlplateShortNote = (value) => {
        setEditPrescFormData({
            ...editPrescFormData,
            short_note: value
        });
    }

    const prescTemplateData = (data) => {
        let medicine = editPrescFormData.medicine;
        // console.log("Medicine Update",medicine);
        medicine.push(data);
        setEditPrescFormData({
            ...editPrescFormData,
            medicine
        });
        setSavedPresc(true);
    }

    const updatingMedicineQueueToPrescription = (data) => {
        // console.log("index", index);
        let medicineData = editPrescFormData.medicine;
        medicineData.splice(medIndex, 1, data)
        // medicineData.push(data);
        // console.log(medicineData);
        setEditPrescFormData({
            ...editPrescFormData,
            medicineData
        });
    }

    const onAddTemplate = () => {
        if(editPrescFormData.template_name == "") {
            setRequiredField(true);
        }else if(editPrescFormData.template_name !== "") {
            navigation.navigate('AddMedicineToPrescription', {prescTemplateData: prescTemplateData});
        }else {
            console.log('err');
        }
    }

    // console.log("Complete Prescription Template Form Data - ", editPrescFormData);
    const onSubmitTemplate = () => {
        let med = JSON.stringify(editPrescFormData.medicine);
        let data = editPrescFormData
        data.medicine = med;
        // console.log("data", data);
        let tempId = route.params.dataTemp.id;
        axios.put(`prescription-template/update/${tempId}`, data).then(
            res => {
                if (res.status === 200) {
                    // console.log(res.data);
                    console.log("Successfully Updated template");
                    navigation.goBack();
                }
            }
        ).catch(
            err => {
                console.log("error");
                // setErrorMsg(true);
            }
        )
    }

    return (
        <>
            <ScrollView>
                {/* {prescData.map((element, i) => ( */}
                    <>
                    <View style={styles.container}>
                        <View style={styles.inputField}>
                            <Text style={styles.text}>Template Name :</Text>
                            {requiredField ?
                                <>
                                    <TextInput
                                        style={styles.textInputReq}
                                        placeholder='Enter a Template Name'
                                        onChangeText={(value) => onHandleTemlplateName(value)}
                                        defaultValue={route.params.dataTemp.template_name}
                                    />
                                    <Text style={{color: 'red', fontSize: 12, marginTop: 5}}>* Enter a template name to add new template</Text>
                                </>
                            : <>
                                <TextInput 
                                    style={styles.textInput}
                                    placeholder='Enter a Template Name'
                                    onChangeText={(value) => onHandleTemlplateName(value)}
                                    defaultValue={route.params.dataTemp.template_name}
                                />
                            </>}
                        </View>
                    
                        <View style={styles.inputField}>
                            <Text style={styles.text}>Short Note :</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Short Note Here'
                                onChangeText={(value) => onHandleTemlplateShortNote(value)}
                                defaultValue={route.params.dataTemp.short_note}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => onAddTemplate()}
                    >
                        <Text style={styles.addText}>+ ADD</Text>
                    </TouchableOpacity>
                    </>
                {/* ))} */}
                <View>
                {editPrescFormData.medicine.length !== 0 ? 
                    <>
                    {editPrescFormData.medicine.map((element, index) => (
                        <>
                            <TouchableOpacity 
                                style={{
                                    padding: 10,
                                    backgroundColor: colors[index % colors.length],
                                    marginHorizontal: 5,
                                }}
                                key={index}
                                onPress={() => {
                                    setMedIndex(index);
                                    navigation.navigate('EditMedicineToPrescription', {editMedicineDetails: element, updatingMedicineQueueToPrescription: updatingMedicineQueueToPrescription} 
                                )}}
                            >
                                <View style={styles.medicine_block_content}>
                                    <View style={styles.medicine_header}>
                                        <Text style={styles.medicine_name_block}>
                                            {element.medicine.medicine_name}&nbsp;
                                            (
                                                {element.medicine.size && (
                                                    <Text style={styles.medicine_size}>{element.medicine.size}&nbsp;</Text>
                                                )}
                                                {element.medicine.medicine_categories.medicine_type && (
                                                    <Text style={styles.medicine_type}>{element.medicine.medicine_categories.medicine_type}</Text>
                                                )}
                                            )
                                        </Text>
                                        {element.course_data.length === 1 ?
                                            !element.course_data[0].useAsNeeded || element.course_data[0].useAsNeeded == "false" ?
                                                element.course_data[0].duration.interval != 0 ?
                                                    <Text style={styles.medicine_duration_block}>{element.course_data[0].duration.interval}&nbsp;{element.course_data[0].duration.interval_unit}</Text>
                                                    : <></>
                                                : <></>
                                            : <></>}
                                    </View>
                                    {element.course_data.map((data, index2) => (
                                        data ? 
                                            <View style={styles.medicine_course_block}>
                                                {element.course_data.length !== 1 ?
                                                    <View style={styles.course_header}>
                                                        <Text style={styles.course_name_block}>
                                                            Course {index2 + 1}:
                                                        </Text>
                                                        {data.useAsNeeded ?
                                                            <></> :
                                                            <Text style={styles.course_duration_block}>{data.duration.interval} {data.duration.interval_unit}</Text>
                                                        }
                                                    </View>
                                                : <></>}

                                                <View style={styles.course_content_block}>
                                                    {data.useAsNeeded ? 
                                                        <Text style={styles.course_content_useAsNeeded}>Use as Needed</Text>
                                                    : <>
                                                        {(
                                                            data.consumption_times.morning ||
                                                            data.consumption_times.afternoon ||
                                                            data.consumption_times.night
                                                        ) ?
                                                            data.consumption_times.morning[0] == 0 && data.consumption_times.morning[1] == 0
                                                            && data.consumption_times.afternoon[0] == 0 && data.consumption_times.afternoon[1] == 0
                                                            && data.consumption_times.night[0] == 0 && data.consumption_times.night[1] == 0 ?
                                                            <></> :
                                                                data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] &&
                                                                data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] &&
                                                                data.consumption_times.night[0] != 0 || data.consumption_times.night[1] ?
                                                                    <View style={styles.consumption_times_content}>
                                                                        {data.consumption_times.morning.length !== 0 && (
                                                                            data.consumption_times.morning[0] == 0 && data.consumption_times.morning[1] == 0 ?
                                                                                <></> :
                                                                                data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] ?
                                                                                    <View style={styles.consumption_times_morn_divider}>
                                                                                        <Text style={styles.consumption_times_splitup}>
                                                                                            {data.consumption_times.morning[0] != 0 ?
                                                                                                <Text>{data.consumption_times.morning[0]}&nbsp;</Text>
                                                                                                : <></>}
                                                                                            {data.consumption_times.morning[1] && (
                                                                                                data.consumption_times.morning[1] != 0 ?
                                                                                                    <Text>{data.consumption_times.morning[1]}&nbsp;</Text>
                                                                                                    : <></>
                                                                                            )}
                                                                                            {data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] ?
                                                                                                <Text style={styles.morning}>Morn&nbsp;</Text>
                                                                                                : <></>}
                                                                                        </Text>
                                                                                        <Text style={styles.consumption_divider}>|</Text>
                                                                                    </View>
                                                                                    : <></>
                                                                        )}
                                                                        {data.consumption_times.afternoon.length !== 0 && (
                                                                            data.consumption_times.afternoon[0] == 0 && data.consumption_times.afternoon[1] == 0 ?
                                                                                <></> :
                                                                                data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] ?
                                                                                    <View style={styles.consumption_times_morn_divider}>
                                                                                        <Text style={styles.consumption_times_splitup}>
                                                                                            {data.consumption_times.afternoon[0] != 0 ?
                                                                                                <Text>{data.consumption_times.afternoon[0]}&nbsp;</Text>
                                                                                                : <></>}
                                                                                            {data.consumption_times.afternoon[1] && (
                                                                                                data.consumption_times.afternoon[1] != 0 ?
                                                                                                <Text>{data.consumption_times.afternoon[1]}&nbsp;</Text>
                                                                                                    : <></>
                                                                                            )}
                                                                                            {data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] ?
                                                                                                <Text style={styles.morning}>AN&nbsp;</Text>
                                                                                                : <></>}
                                                                                        </Text>
                                                                                        <Text style={styles.consumption_divider}>|</Text>
                                                                                    </View>
                                                                                    : <></>
                                                                        )}
                                                                        {((data.consumption_times.night.length !== 0)) && (
                                                                            data.consumption_times.night[0] == 0 && data.consumption_times.night[1] == 0 ?
                                                                                <></> :
                                                                                data.consumption_times.night[0] != 0 || data.consumption_times.night[1] ?
                                                                                    <Text style={styles.consumption_times_splitup}>
                                                                                        {data.consumption_times.night[0] != 0 ?
                                                                                            <Text>{data.consumption_times.night[0]}&nbsp;</Text>
                                                                                            : <></>}
                                                                                        {data.consumption_times.night[1] && (
                                                                                            data.consumption_times.night[1] != 0 ?
                                                                                                <Text>{data.consumption_times.night[1]}&nbsp;</Text>
                                                                                                : <></>
                                                                                        )}
                                                                                        {data.consumption_times.night[0] != 0 || data.consumption_times.night[1] ?
                                                                                            <Text style={styles.morning}>Night&nbsp;</Text>
                                                                                            : <></>}
                                                                                    </Text>
                                                                                    : <></>
                                                                        )}
                                                                    </View>
                                                                :<></>
                                                        :<></>}
                                                        {(data.consumption_times.slots) && (
                                                            data.consumption_times.slots[0] != "NA" ?
                                                                <View style={styles.course_content_block_consumption_times}>
                                                                    {/* <Text>Apply&nbsp;</Text> */}
                                                                    {data.consumption_times.slots.map((slot, index) => (
                                                                        <Text style={styles.consumption_times_slot}>Apply - {slot}</Text>
                                                                    ))}
                                                                </View>
                                                                : <></>
                                                        )}

                                                        {data.consumption_type && (
                                                            data.consumption_type.interval != 0 ?
                                                                <View style={styles.course_content_block_consumption_type}>
                                                                    {(data.consumption_type.interval || data.consumption_type.unit) && (
                                                                        <Text style={styles.consumption_type_interval}>{data.consumption_type.interval}&nbsp;{data.consumption_type.unit}&nbsp;</Text>)}
                                                                    {(data.consumption_type.diet_routine) && (
                                                                        <Text style={styles.consumption_type_interval_unit}>{data.consumption_type.diet_routine}</Text>)}
                                                                </View>
                                                                : <></>
                                                        )}
                                                        {data.consumption_times.duration && (
                                                            data.consumption_times.duration.interval != 0 ?
                                                                <View style={styles.course_content_block_consumption_duration}>
                                                                    {data.consumption_times.duration.interval_unit == "hours" ?
                                                                        data.consumption_times.medicine_split.length !== 0 && (
                                                                            data.consumption_times.medicine_split[0] == 0 && data.consumption_times.medicine_split[1] == 0 ?
                                                                                <></> :
                                                                                data.consumption_times.medicine_split[0] != 0 || data.consumption_times.medicine_split[1] ?
                                                                                    <Text style={styles.consumption_times_medicine_splitup}>
                                                                                        {data.consumption_times.medicine_split[0] != 0 ?
                                                                                            <Text>{data.consumption_times.medicine_split[0]}&nbsp;</Text>
                                                                                            : <></>}
                                                                                        {data.consumption_times.medicine_split[1] && (
                                                                                            data.consumption_times.medicine_split[1] != 0 ?
                                                                                            <Text>{data.consumption_times.medicine_split[1]}&nbsp;</Text>
                                                                                                : <></>
                                                                                        )}
                                                                                        {data.consumption_times.medicine_split[0] != 0 || data.consumption_times.medicine_split[1] ?
                                                                                            <Text>For&nbsp;</Text>
                                                                                            : <></>}
                                                                                    </Text>
                                                                                    : <></>
                                                                        ) : <></>
                                                                    }
                                                                    <Text>Every&nbsp;</Text><Text>{data.consumption_times.duration.interval}&nbsp;{data.consumption_times.duration.interval_unit}</Text>
                                                                </View>
                                                                : <></>
                                                        )}
                                                    </>}
                                                    {data.note ? (
                                                        <Text style={styles.course_content_block_consumption_note}>
                                                            {data.note}
                                                        </Text>
                                                    ) : <></>}
                                                </View>
                                            </View>
                                        : <></>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        </>
                    ))}
                </>: (
                    <>
                        <View style={styles.addedMedTemplate}>
                            <Text>No Medicine Added</Text>
                        </View>
                    </>
                )}
                    
                </View>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={onSubmitTemplate}
                >
                    <Text style={{textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Submit</Text>
                </TouchableOpacity>
                
            </ScrollView>
        </>
    )
}

export default EditPrescriptionTemplate;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 20,
    },
    inputField: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    text: {
        marginBottom:10,
        fontWeight: 'bold',
        color: '#000',
    },
    textInput: {
        backgroundColor: '#fff',
        elevation: 1,
    },
    textInputReq: {
        backgroundColor: '#fff',
        elevation: 1,
        borderWidth: 1,
        borderColor: 'red',
    },
    addButton: {
        marginHorizontal: 10,
        alignItems: 'flex-end',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#006766',
        padding: 20,
        marginTop: 20,
    },
    addedMedTemplate: {
        backgroundColor: '#BFD9D9',
        padding: 20
    },
    slots: {
        flexDirection: 'column',
    },
    addText: {
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700', 
        padding: 10, 
        backgroundColor: '#006766',
        width: 100,
        borderRadius: 20
    },
    medicine_name_block: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 15,
        color: '#000'
    },
    consumption_times_content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    consumption_divider: {
        color: '#bebebe',
        fontSize: 18,
        marginHorizontal: 10
    },
    consumption_times_morn_divider: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    consumption_times_splitup: {
        color: '#00000090',
        fontWeight: 'bold',
    },
    morning: {
        color: '#006766',
        fontWeight: 'bold',
    },
    course_content_block_consumption_type: {
        flexDirection: 'row',
    },
    course_content_block_consumption_duration: {
        flexDirection: 'row',
    },
    course_name_block: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: '#006766',
        width: 80,
        textAlign: 'center',
        borderRadius: 10,
        padding: 5
    },
});