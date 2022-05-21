import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Divider, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
// import { LinearGradient } from 'expo-linear-gradient';
import axios from "react-native-axios";

const AddPrescriptionTemplate = ({route, navigation}) => {
    let colors = ['#BFD9D990', '#fff'];
    // console.log(route.params.userDetails);
    // console.log(route.params.userDetails.branch.id);
    
    const [prescFormData, setPrescFormData] = useState({
        template_name: '',
        short_note: '',
        medicine: [],
        clinic_id: route.params.userDetails.clinic.id,
        branch_id: route.params.userDetails.branch.id,
    });

    // const [successMsg, setSuccessMsg] = useState(false);
    // const [errorMsg, setErrorMsg] = useState(false);

    const [requiredField, setRequiredField] = useState(false);
    const [ savedPresc, setSavedPresc ] = useState(false);

    const [ medIndex, setMedIndex ] = useState();

    const onHandleTemlplateName = (value) => {
        setPrescFormData({
            ...prescFormData,
            template_name: value
        });
    }

    const onHandleTemlplateShortNote = (value) => {
        setPrescFormData({
            ...prescFormData,
            short_note: value
        });
    }

    const prescTemplateData = (data) => {
        let medicine = prescFormData.medicine
        medicine.push(data);
        setPrescFormData({
            ...prescFormData,
            medicine
        });
        setSavedPresc(true);
        // let formData = prescFormData
        // setPFormData(prescFormData);
    }

    const updatingMedicineQueueToPrescription = (data) => {
        let medicineData = prescFormData.medicine;
        medicineData.splice(medIndex, 1, data)
        // medicineData.push(data);
        // console.log(medicineData);
        setPrescFormData({
            ...prescFormData,
            medicineData
        });
    }

    const onAddTemplate = () => {
        if(prescFormData.template_name == "") {
            console.log('empty field');
            setRequiredField(true);
        }else if(prescFormData.template_name !== "") {
            navigation.navigate('AddMedicineToPrescription', {prescTemplateData: prescTemplateData});
        }else {
            console.log('else')
        }
    }

    // console.log("Complete Prescription Template Form Data - ", prescFormData);
    const onSubmitTemplate = () => {
        let med = JSON.stringify(prescFormData.medicine);
        let data = prescFormData
        data.medicine = med;
        console.log("data", data);
        
        axios.post(`/prescription-template`, data).then(
            res => {
                console.log("res.data", res.data);
                if (res.status === 200) {
                    console.log(res.data);
                    console.log("Successfully added template");
                    // setSuccessMsg(true);
                    if(route.params.getPrescriptionTemplateData) {
                        route.params.getPrescriptionTemplateData(res.data);
                    }
                    navigation.goBack();
                } else if (res.status === 210) {
                    console.log("Record Name Already Exists");
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
                <View style={styles.container}>
                    <View style={styles.inputField}>
                        <Text style={styles.text}>Template Name :</Text>
                        {requiredField ? 
                            <>
                            <TextInput
                                style={styles.textInputReq}
                                placeholder='Short Note Here'
                                onChangeText={(value) => onHandleTemlplateName(value)}
                            />
                            <Text style={{color: 'red', fontSize: 12, marginTop: 5}}>* Enter a template name to add new template</Text>
                            </>
                        : <>
                            <TextInput 
                                style={styles.textInput}
                                placeholder='Enter a Template Name'
                                onChangeText={(value) => onHandleTemlplateName(value)}
                            />
                        </>}
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.text}>Short Note :</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Short Note Here'
                            onChangeText={(value) => onHandleTemlplateShortNote(value)}
                        />
                    </View>
                </View>
                
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onAddTemplate()}
                >
                    <Text style={styles.addText}>+ ADD</Text>
                </TouchableOpacity>
                
                {/* added medicine list */}
                {console.log("prescFormData.medicine", prescFormData.medicine)}

                {prescFormData.medicine.length !== 0 ? 
                    <>
                    {prescFormData.medicine.map((element, index) => (
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

export default AddPrescriptionTemplate;

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
        color: '#000',
        elevation: 5
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
    course_content_block_consumption_duration: {flexDirection: 'row',},
    course_content_useAsNeeded: {
        fontWeight: 'bold',
        backgroundColor: '#fff',
        width: 120,
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        color: '#006766',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9'
    },
});