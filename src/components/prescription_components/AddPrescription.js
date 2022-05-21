import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Divider, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import axios from "react-native-axios";

const AddPrescription = ({route, navigation}) => {

    let colors = ['#BFD9D990', '#fff'];

    const [formData, setFormData] = useState({
        template_name: '',
        short_note: '',
        medicine: [],
        clinic_id: route.params.userDetails.clinic.id,
        branch_id: route.params.userDetails.branch.id,
    });
    
    const [requiredField, setRequiredField] = useState(false);

    const [ medIndex, setMedIndex ] = useState('');

    useEffect(() => {
      if (route.params.data) {
        //  console.log(route.params.data);
         setFormData({
             ...formData,
             template_name: route.params.data.template_name,
             short_note: route.params.data.short_note,
             medicine: JSON.parse(route.params.data.medicine),
             clinic_id: route.params.data.clinic_id,
             branch_id: route.params.data.branch_id,
         })
         console.log("formData",formData);
      }
    }, [route.params.data])
    

    const onHandleTemlplateName = (value) => {
        setFormData({
            ...formData,
            template_name: value
        });
    }

    const onHandleTemlplateShortNote = (value) => {
        setFormData({
            ...formData,
            short_note: value
        });
    }

    const prescTemplateData = (data) => {
        // console.log("data", data);
        let medicine = formData.medicine
        medicine.push(data);
        // setCourseDetail(medicine);
        setFormData({
            ...formData,
            medicine
        });
    }

    const onAddTemplate = () => {
        navigation.navigate('AddMedicineToPrescription', {prescTemplateData : prescTemplateData});
    }

    const updatingMedicineQueueToPrescription = (data) => {
        let medicineData = formData.medicine;
        medicineData.splice(medIndex, 1, data)
        // medicineData.push(data);
        // console.log(medicineData);
        setFormData({
            ...formData,
            medicineData
        });
    }

    const onEditMedicine = (ele, index) => {
        setMedIndex(index);
        navigation.navigate('AddMedicineToPrescription', {editMedicineDetails : ele, updatingMedicineQueueToPrescription : updatingMedicineQueueToPrescription});
    }
    
    const onSubmitTemplate = () => {
        if(formData.template_name == "") {
            console.log('empty field');
            setRequiredField(true);
        }else {
            console.log('axios');
            formSubmit();
        }
    }

    const formSubmit = () => {
        let med = JSON.stringify(formData.medicine);
        let data = formData
        data.medicine = med;
        if(route.params.data) {
            let tempId = route.params.data.id;
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
        } else {
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
    }

    return (
      <>
        <View style={styles.container}>
            <View style={styles.inputField}>
                <Text style={styles.text}>Template Name :</Text>
                {requiredField ? 
                    <>
                    <TextInput
                        style={styles.textInputReq}
                        placeholder='Short Note Here'
                        onChangeText={(value) => onHandleTemlplateName(value)}
                        defaultValue={formData && formData.template_name}
                    />
                    <Text style={{color: 'red', fontSize: 12, marginTop: 5}}>* Enter a template name to add new template</Text>
                    </>
                : <>
                    <TextInput 
                        style={styles.textInput}
                        placeholder='Enter a Template Name'
                        onChangeText={(value) => onHandleTemlplateName(value)}
                        defaultValue={formData && formData.template_name}
                    />
                </>}
            </View>
            <View style={styles.inputField}>
                <Text style={styles.text}>Short Note :</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Short Note Here'
                    onChangeText={(value) => onHandleTemlplateShortNote(value)}
                    defaultValue={formData && formData.short_note}
                />
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddTemplate()}
            >
                <Text style={styles.addText}>+ ADD</Text>
            </TouchableOpacity>
        </View>
        {/* flatList */}
        <ScrollView>
            {formData.medicine.length != 0 ?
                <>
                    {formData.medicine.map((element, index) => (
                        <TouchableOpacity 
                            style={{backgroundColor: colors[index % colors.length], paddingBottom: 10}} 
                            key={index}
                            onPress={() => onEditMedicine(element, index)}
                        >
                            <View style={styles.medicine_block_content} key={'tp-1_'+index}>
                                <View style={styles.med_header} key={'tp-6_'+index}>
                                    <Text style={styles.medicine_name_block}>
                                        {element.medicine.medicine_name}&nbsp;
                                        {element.medicine.size && (<Text style={styles.medicine_size}>{element.medicine.size}&nbsp;</Text>)}
                                        {element.medicine.medicine_categories.medicine_type && (<Text style={styles.medicine_type}>{element.medicine.medicine_categories && element.medicine.medicine_categories.medicine_type}</Text>)}
                                    </Text>
                                    {/* <Divider style={{backgroundColor: '#00000040', marginBottom: 5, height: 1}}/> */}
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
                                        <View style={styles.medicine_course_block} key={'tp-1_'+index2}>
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

                                            <View style={styles.course_content_block} key={'tp-3_'+index2}>
                                                {data.useAsNeeded ?
                                                    <>
                                                        <Text style={styles.course_content_useAsNeeded}>Use as Needed</Text>
                                                    </>
                                                : <>
                                                    {
                                                        data.consumption_times.morning ||
                                                        data.consumption_times.afternoon ||
                                                        data.consumption_times.night
                                                        ? 
                                                            data.consumption_times.morning[0] == 0 && data.consumption_times.morning[1] == 0
                                                            && data.consumption_times.afternoon[0] == 0 && data.consumption_times.afternoon[1] == 0
                                                            && data.consumption_times.night[0] == 0 && data.consumption_times.night[1] == 0
                                                            ? <></> 
                                                            : 
                                                                data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] &&
                                                                data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] &&
                                                                data.consumption_times.night[0] != 0 || data.consumption_times.night[1]
                                                                ? 
                                                                    <View style={styles.course_content_block_sub_times}>
                                                                        {
                                                                            data.consumption_times.morning.length !== 0 && (
                                                                            data.consumption_times.morning[0] == 0 && data.consumption_times.morning[1] == 0 
                                                                            ? <></> 
                                                                            :
                                                                            data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] ?
                                                                                <Text style={styles.consumption_times_splitup}>
                                                                                    {data.consumption_times.morning[0] != 0 ?
                                                                                        <Text>{data.consumption_times.morning[0]}&nbsp;-&nbsp;</Text>
                                                                                        : <></>}
                                                                                    {data.consumption_times.morning[1] && (
                                                                                        data.consumption_times.morning[1] != 0 ?
                                                                                            <Text style={styles.timesTextArr}>{data.consumption_times.morning[1]}&nbsp;</Text>
                                                                                            : <></>
                                                                                    )}
                                                                                    {data.consumption_times.morning[0] != 0 || data.consumption_times.morning[1] ?
                                                                                        <Text style={styles.timesText}>Morn</Text>
                                                                                        : <></>}
                                                                                </Text>
                                                                            : <></>)
                                                                        }

                                                                        {
                                                                            data.consumption_times.afternoon.length !== 0 && (
                                                                            data.consumption_times.afternoon[0] == 0 && data.consumption_times.afternoon[1] == 0 ?
                                                                            <></> :
                                                                            data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] ?
                                                                                <Text style={styles.consumption_times_splitup}>
                                                                                    {data.consumption_times.afternoon[0] != 0 ?
                                                                                        <Text>{data.consumption_times.afternoon[0]}&nbsp;-&nbsp;</Text>
                                                                                        : <></>}
                                                                                    {data.consumption_times.afternoon[1] && (
                                                                                        data.consumption_times.afternoon[1] != 0 ?
                                                                                            <Text style={styles.timesTextArr}>{data.consumption_times.afternoon[1]}&nbsp;</Text>
                                                                                            : <></>
                                                                                    )}
                                                                                    {data.consumption_times.afternoon[0] != 0 || data.consumption_times.afternoon[1] ?
                                                                                        <Text style={styles.timesText}>AN&nbsp;</Text>
                                                                                        : <></>}
                                                                                </Text>
                                                                            : <></>
                                                                        )}

                                                                        {
                                                                            ((data.consumption_times.night.length !== 0)) && (
                                                                            data.consumption_times.night[0] == 0 && data.consumption_times.night[1] == 0 ?
                                                                            <></> :
                                                                            data.consumption_times.night[0] != 0 || data.consumption_times.night[1] ?
                                                                                <Text style={styles.consumption_times_splitup}>
                                                                                    {data.consumption_times.night[0] != 0 ?
                                                                                        <Text>{data.consumption_times.night[0]}&nbsp;-&nbsp;</Text>
                                                                                        : <></>}
                                                                                    {data.consumption_times.night[1] && (
                                                                                        data.consumption_times.night[1] != 0 ?
                                                                                            <Text style={styles.timesTextArr}>{data.consumption_times.night[1]}&nbsp;</Text>
                                                                                            : <></>
                                                                                    )}
                                                                                    {data.consumption_times.night[0] != 0 || data.consumption_times.night[1] ?
                                                                                        <Text style={styles.timesText}>Night&nbsp;</Text>
                                                                                        : <></>}
                                                                                </Text>
                                                                            : <></>
                                                                        )}
                                                                    </View>
                                                            : <></>
                                                    :<></>}
                                                    {(data.consumption_times.slots) && (
                                                        data.consumption_times.slots[0] != "NA" ?
                                                            <View style={styles.course_content_block_sub}>
                                                                {data.consumption_times.slots.map((slot, index) => (
                                                                    <Text style={styles.consumption_times_slot}>{slot}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                                                ))}
                                                            </View>
                                                            : <></>
                                                    )}

                                                    {data.consumption_type && (
                                                        data.consumption_type.interval != 0 ?
                                                            <View style={styles.course_content_block_sub}>
                                                                {(data.consumption_type.interval || data.consumption_type.unit) && (
                                                                    <Text style={styles.consumption_type_interval}>{data.consumption_type.interval}&nbsp;{data.consumption_type.unit}&nbsp;</Text>)}
                                                                {(data.consumption_type.diet_routine) && (
                                                                    <Text style={styles.consumption_type_interval_unit}>{data.consumption_type.diet_routine}</Text>)}
                                                            </View>
                                                            : <></>
                                                    )}

                                                    {data.consumption_times.duration && (
                                                        data.consumption_times.duration.interval != 0 ?
                                                            <View style={styles.course_content_block_sub}>
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
                                                                                            <Text>{data.consumption_times.medicine_split[1]}</Text>
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
                                                        <Text style={{fontWeight: 'bold'}}>Note:</Text> {data.note}
                                                    </Text>
                                                ) : <></>}
                                            </View>
                                        </View>
                                    : <></>
                                ))}
                            </View>
                        </TouchableOpacity> 
                    ))}
                </>
            :<>
                <Text style={styles.noMed}>No Medicines Added</Text>
            </>}
        </ScrollView>

        <TouchableOpacity
            style={styles.submitButton}
            onPress={onSubmitTemplate}
        >
            <Text style={{textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Submit</Text>
        </TouchableOpacity>
      </>
    )
}

export default AddPrescription

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
        padding: 16,
        height: 60
    },
    textInputReq: {
        backgroundColor: '#fff',
        elevation: 1,
        borderWidth: 1,
        borderColor: 'red',
        padding: 16,
    },
    addButton: {
        marginHorizontal: 10,
        alignItems: 'flex-end',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#006766',
        padding: 20,
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
    noMed: {
        backgroundColor: '#fff',
        color: '#000',
        padding: 10,
        marginHorizontal: 10,
        textAlign: 'center',
        elevation: 2,
        fontWeight: 'bold'
    },
    medicine_type: {
        color: '#000'
    },
    medicine_size: {
        color: '#000'
    },
    medicine_name_block: {
        fontWeight: 'bold',
        padding: 10,
    },
    medicine_duration_block: {
        paddingHorizontal: 10
    },
    course_content_block: {
        paddingHorizontal: 10
    },
    course_header: {
        paddingHorizontal: 10
    },
    course_name_block: {
        backgroundColor: '#006766',
        padding: 5,
        color: '#fff',
        marginVertical: 10,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center',
        borderRadius: 5
    },
    course_content_useAsNeeded: {
        fontWeight: 'bold',
        color: '#006766',
        textTransform: 'uppercase',
    },
    course_content_block_sub: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginVertical: 10
    },
    course_content_block_sub_times: {
        flexDirection: 'row',
    },
    consumption_times_slot: {
        fontWeight: 'bold',
        // paddingHorizontal:5,
    },
    timesText: {
        fontWeight: 'bold'
    },
    timesTextArr: {
        marginLeft: 10,
    },
    consumption_times_splitup: {
        marginRight: 12,
        backgroundColor: '#BFD9D9',
        padding:5,
        textAlign: 'center',
        // elevation: 2,
        borderRadius: 5
    },


});