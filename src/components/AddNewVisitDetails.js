import React, { useState, useEffect } from 'react'
import { TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button, Divider, Switch } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import axios from 'react-native-axios'
// import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import SubmitNewVisitForm from './SubmitNewVisitForm';
import { Dropdown } from "react-native-element-dropdown";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDropdown from './CustomDropdown/CustomDropdown';
import { MultiSelect } from 'react-native-element-dropdown';

const AddNewVisitDetails = ({ route, navigation }) => {

    let splitText2 = route.params.petData.pet_name;
    splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

    let splitText1 = route.params.petData.pet_owner_id.pet_owner_name;
    splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

    navigation.setOptions({ title: `${splitText1} / ${splitText2}` });

    // console.log("route.params.petData", route.params.petData);

    const [formData, setFormData] = useState({

        visit_purpose: "",
        diagnosis_note: "",
        doctor_note: "",
        client_access_disease: false,
        disease: "",
        client_access_symptom: false,
        symptoms_data: [],
        weight: "",
        prescription_id: "",
        visit_type: "",
        branch_id: "",
        vaccine: "",
        visited_date: "",
        client_access_injection_data: false,
        injections_data: [],
        is_submited: false,
        isPrescriptionEdited: false
    });

    const [ date, setDate ] = useState();
    const [ weight, setWeight ] = useState("");
    const [ weightUnit, setWeightUnit ] = useState("");

    // const [ selectedItems, setSelectedItems ] = useState([]);
    // const { petData } = route.params.petData;
    // console.log("Pet Data", route.params.petData);

    const [ clientAccess, setClientAccess ] = useState(isSwitchOnSymptoms);
    const [ clientAccessDisease, setClientAccessDisease ] = useState(isSwitchOnDisease);
    const [ clientAccessInjection ,setClientAccessInjection] = useState(isSwitchOnInjection);

    const units = [
        { label: 'Kilogram', value: 'kg' },
        { label: 'Gram(g)', value: 'g' },
    ];

    const [selectedItem, setSelectedItem] = useState(null)

    const [afterSubmit, setAfterSubmit] = useState(false)

    // form dropdown input handling
    const [files, setFiles] = useState([]);

    const [visitPurposeData, setVisitPurposeData] = useState([]);
    // const [selectedVisitPurposeItem, setSelectedVisitPurposeItem] = useState(null);

    const [diseaseData, setDiseaseData] = useState([]);
    // const [selectedDiseaseItem, setSelectedDiseaseItem] = useState(null);

    const [prescriptionData, setPrescriptionData] = useState([]);
    // const [selectedPrescriptionItem, setSelectedPrescriptionItem] = useState(null);

    const [visitTypeData, setVisitTypeData] = useState([]);
    // const [selectedVisitTypeItem, setSelectedVisitTypeItem] = useState(null);

    const [branchData, setBranchData] = useState([]);
    // const [selectedBranchItem, setSelectedBranchItem] = useState(null);

    const [vaccinationData, setVaccinationData] = useState(false);
    const [vaccineData, setVaccineData] = useState([]);

    const [ medicineData, setMedicineData ] = useState([]);

    const [symptomsData, setSymptomsData] = useState([]);

    const [isSwitchOnDisease, setIsSwitchOnDisease] = useState(false);
    const [isSwitchOnSymptoms, setIsSwitchOnSymptoms] = useState(false);
    const [isSwitchOnInjection, setIsSwitchOnInjection] = useState(false);

    useEffect(() => {
        // console.log(petData);
        getVisitPurposeData();
        getDiseaseData();
        getPrescriptionData();
        getVisitTypeData();
        getBranchData();
        getVaccineData();
        getSymptomsData();
        getMedicineData();
    }, [])

    const getVaccineData = () => {
        let vaccineData = vaccineData;
        vaccineData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/injection/clinic/${userClinicId}`).then(
            res => {
                // console.log("vaccinedata",res.data);
                res.data.map((element, index) => {
                    vaccineData.push({
                        id: element.id,
                        medicine_name: element.medicine_name,
                        label: element.medicine_name,
                        title: `${element.vaccine_name}`
                    });
                });
                setVaccineData(vaccineData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

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
                        // visit_purpose: element.visit_purpose,
                        visit_purpose: element.edited_name ? element.edited_name : element.actual_name,
                        label: element.edited_name ? element.edited_name : element.actual_name,
                        title: `${element.visit_purpose}`
                    });
                });
                setVisitPurposeData(visitPurposeData);
                // console.log(petOwnersData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getDiseaseData = () => {
        let diseaseData = diseaseData;
        diseaseData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/disease/clinic/${userClinicId}`).then(
            res => {
                // console.log("Disease", res.data);
                res.data.map((element, index) => {
                    diseaseData.push({
                        id: element.id,
                        // disease: element.edited_name ? element.edited_name : element.actual_name,
                        label: element.edited_name ? element.edited_name : element.actual_name,
                        title: `${element.disease}`
                    });
                });
                setDiseaseData(diseaseData);
                // console.log(petOwnersData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getMedicineData = () => {
        let medicineData = medicineData;
        medicineData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/medicine/clinic/${userClinicId}`).then(
            res => {
                // console.log("Medicine Data", res.data);
                res.data.map((element, index) => {
                    medicineData.push({
                        id: element.id,
                        // template_name: element.template_name,
                        label: element.medicine_name,
                        title: `${element.medicine_name}`
                    });
                });
                setMedicineData(medicineData);
                // console.log("test", prescriptionData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getPrescriptionData = () => {
        let prescriptionData = prescriptionData;
        prescriptionData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/prescription-template/clinic/${userClinicId}`).then(
            res => {
                // console.log("prescriptionData", res.data);
                res.data.map((element, index) => {
                    prescriptionData.push({
                        id: element.template_id,
                        // template_name: element.template_name,
                        label: element.template_name,
                        title: `${element.template_name}`
                    });
                });
                setPrescriptionData(prescriptionData);
                // console.log("test", prescriptionData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getVisitTypeData = () => {
        let visitTypeData = visitTypeData;
        visitTypeData = [];
        let userClinicId = route.params.userDetails.clinic.id;
        axios.get(`/visitType/clinic/${userClinicId}`).then(
            res => {
                // console.log("visitssssssssss", res.data);
                res.data.map((element, index) => {
                    visitTypeData.push({
                        id: element.id,
                        // visit_type: element.edited_name ? element.edited_name : element.actual_name,
                        label: element.edited_name ? element.edited_name : element.actual_name,
                        title: `${element.visit_type}`
                    });
                    // console.log("teteteteteteetetete", res.data);
                });
                setVisitTypeData(visitTypeData);
                // console.log("test", visitTypeData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getBranchData = () => {
        let branchData = branchData;
        branchData = [];
        axios.get(`/clinic/branch/${route.params.userDetails.clinic.id}`).then(
            res => {
                // console.log(res.data);
                res.data.map((element, index) => {
                    branchData.push({
                        id: element.id,
                        branch: element.branch,
                        title: `${element.branch}`
                    });
                });
                setBranchData(branchData);
                // console.log(petOwnersData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getSymptomsData = () => {
        let symptomsData = symptomsData;
        symptomsData = [];
        axios.get(`/symptom`).then(
            res => {
                // console.log("symptom", res.data);
                res.data.map((element, index) => {
                    symptomsData.push({
                        id: element.id,
                        // symptom_name: element.symptom_name,
                        label: element.symptom_name,
                        title: `${element.symptom_name}`
                    });
                });
                setSymptomsData(symptomsData);
                // console.log(petOwnersData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const handleVisitPurposeChange = (value) => {
        // console.log(value);

        if (value.visit_purpose == "Vaccination") {
            setVaccinationData(true);
        } else {
            setVaccinationData(false);
        }

        setFormData({
            ...formData,
            visit_purpose: value.id
        });

    }

    const handleDiseaseChange = (value) => {
        // console.log("On Change",value);
        setFormData({
            ...formData,
            disease: value.id
        });
    }

    const handleMedicineChange = (value) => {
        setFormData({
            ...formData,
            prescription_id: value.id
        });
    }

    const handlePrescriptionChange = (value) => {
        setFormData({
            ...formData,
            prescription_id: value.id
        });
    }

    const handleVisitTypeChange = (value) => {
        console.log(value);
        setFormData({
            ...formData,
            visit_type: value.id
        });
    }

    const handleBranchChange = (value) => {
        setFormData({
            ...formData,
            branch_id: value.id
        });
    }

    const handleDiagnosisNoteChange = (value) => {
        setFormData({
            ...formData,
            diagnosis_note: value
        });
    }

    const handleDoctorsNoteChange = (value) => {
        setFormData({
            ...formData,
            doctor_note: value
        });
    }

    const handlePetWeightChange = (value) => {
        setFormData({
            ...formData,
            weight: value
        });
    }

    const handleWeightChange = (value) => {
        setWeightUnit(value.value);
    }

    const handleVaccineChange = (value) => {
        setFormData({
            ...formData,
            vaccine: value.vaccine_name
        });
    }

    const handleSymptomsChange = (item) => {
        // let a = [];
        // console.log("iiiiiiii", item);
        setFormData({
            ...formData,
            symptoms_data : item
        });
    };

    // console.log(formData);

    const handleAddNewVisitPurpose = () => {
        navigation.navigate('AddVisitPurpose');
    }

    const handleAddNewVaccineChange = () => {
        navigation.navigate('AddVaccine');
    }

    const handleAddNewDisease = () => {
        navigation.navigate('AddDisease');
    }

    // const handleAddNewSymptoms = () => {
    //     navigation.navigate('AddSymptom');
    // }

    const handleAddNewMedicine = () => {
        navigation.navigate('AddMedicine');
    }

    const handleAddNewPrescription = () => {
        navigation.navigate('AddPrescription');
    }

    const handleAddNewVisitType = () => {
        navigation.navigate('AddVisitType');
    }

    

    const onToggleSwitch1 = () => {
        console.log(!isSwitchOnSymptoms);
        setClientAccess(!isSwitchOnSymptoms);
        setIsSwitchOnSymptoms(!isSwitchOnSymptoms)
        setFormData({
            ...formData,
            client_access_symptom: !isSwitchOnSymptoms
        })
    };


    const onToggleSwitchDisease = () => {
        console.log(!isSwitchOnDisease);
        setClientAccessDisease(!isSwitchOnDisease);
        setIsSwitchOnDisease(!isSwitchOnDisease);
        setFormData({
            ...formData,
            client_access_disease: !isSwitchOnDisease
        })
    };

    const onToggleSwitchInjectionData = () => {
        console.log(!isSwitchOnInjection);
        setClientAccessInjection(!isSwitchOnInjection);
        setIsSwitchOnInjection(!isSwitchOnInjection);
        setFormData({
            ...formData,
            client_access_injection_data: !isSwitchOnInjection
        })
    };

    const onHandleSubmit = () => {
        let data = formData;
        data.pet_id = route.params.petData.id;
        data.owner_name_id = route.params.petData.pet_owner_id.id;
        data.visited_clinic_id = 1;
        data.is_submited = true;
        data.weight = formData.weight + " " + weightUnit;
        // for (var i = 0; i < files.length; i++) {
        //     data.append("files[]", files[i])
        // };
        navigation.navigate('SubmitNewVisitForm', { formData: data, files: files })
        // setAfterSubmit(true)
    }

    const onSave = () => {
        let data = formData;
        data.pet_id = route.params.petData.id;
        data.owner_name_id = route.params.petData.pet_owner_id.id;
        data.visited_clinic_id = 1;
        data.is_submited = false;
        data.weight = formData.weight + " " + weightUnit;
        // for (var i = 0; i < files.length; i++) {
        //     data.append("files[]", files[i])
        // };
        navigation.navigate('SubmitNewVisitForm', { formData: data, files: files })
        // setAfterSubmit(true)
    }
    
    const updateFileQueue = (files) => {
        // console.log("In Visit Screen", files);
        setFiles(files);
    }

    // console.log(formData);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.topVisitDetail}>
                    <View style={styles.topLeft}>
                        <Text style={{color: '#000', fontWeight: 'bold'}}>{route.params.petData.edited_animal_type ? route.params.petData.edited_animal_type : route.params.petData.actual_animal_type} / {route.params.petData.edited_breed ? route.params.petData.edited_breed : route.params.petData.actual_breed}</Text>
                        <Text style={{color: '#000', fontWeight: 'bold'}}>Last Visited -<Text style={{fontWeight: 'normal'}}>{route.params.petData.last_visit}</Text></Text>
                    </View>

                    <View style={styles.datePicker}>
                        <MaterialCommunityIcons
                            name="calendar-edit"
                            color={'#006766'}
                            size={35}
                        />
                        <DatePicker
                            style={styles.datePickerStyle}
                            date={formData.visited_date} // Initial date from state
                            mode="date" // The enum of date, datetime and time
                            placeholder="select date"
                            placeholderStyle={{color: '#000'}}
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    display: 'none'
                                },
                                
                            }}
                            onDateChange={(value) => {
                                // console.log("value", value);
                                setFormData({
                                    ...formData,
                                    visited_date: value
                                });
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

                <Divider />

                <View style={styles.form}>
                    <View>
                        {/* Visit Purpose */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Visit Purpose:</Text>

                            {/* Custom Dropdown */}
                            <CustomDropdown
                                handleAddEvent={handleAddNewVisitPurpose}
                                onChange={handleVisitPurposeChange}
                                buttonLabel={"Add new visitpurpose"}
                                // defaultValue={5}
                                data={visitPurposeData}
                            />
        
                        </View>

                        {/* Weight */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Weight:</Text>
                            <View style={styles.weightComp}>
                                <TextInput placeholder='weight' style={styles.formTextInput} keyboardType='number-pad' onChangeText={(value) => handlePetWeightChange(value)}></TextInput>
                                <Dropdown
                                    style={styles.dropdownWeight}
                                    placeholder='Select...'
                                    maxHeight={120}
                                    data={units}
                                    labelField='label'
                                    valueField='value'
                                    value={weightUnit}
                                    // item={weightUnit}
                                    searchPlaceholder='search...'
                                    selectedTextStyle={{
                                        color: '#00000080'
                                    }}
                                    placeholderStyle={{
                                        color: '#bebebe',
                                        fontSize: 16
                                    }}
                                    onChange={(value) => { value && handleWeightChange(value) }}
                                />
                            </View>
                        </View>

                        {vaccinationData ?
                            <View style={styles.formItemVaccine}>
                                <Text style={styles.formLabel}>Vaccine:</Text>

                                {/* Custom Dropdown */}
                                <CustomDropdown
                                    handleAddEvent={handleAddNewVaccineChange}
                                    onChange={handleVaccineChange}
                                    buttonLabel={"Add new vaccine"}
                                    // defaultValue={5}
                                    data={vaccineData}
                                />
                            </View>
                            :<></>
                        }
                        

                        {/* Diagnosis Note */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Diagnosis Note:</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Diagnosis Notes here ..."
                                placeholderTextColor="grey"
                                numberOfLines={10}
                                multiline={true}
                                onChangeText={(value) => handleDiagnosisNoteChange(value)}
                            />
                        </View>

                        {/* Doctor's Note */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Doctor's Note:</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Doctor's Notes here ..."
                                placeholderTextColor="grey"
                                numberOfLines={10}
                                multiline={true}
                                onChangeText={(value) => handleDoctorsNoteChange(value)}
                            />
                        </View>

                        {/* Symptoms */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Symptoms:</Text>
                            <View style={{
                                alignItems: 'flex-end',
                                marginBottom: 15,
                            }}>
                                <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'flex-end', 
                                    backgroundColor: '#BFD9D9', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccess ? 
                                    <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={formData.client_access_symptom}
                                        onValueChange={onToggleSwitch1} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#00000080" }}
                                        thumbColor={'#0E9C9B'}
                                    />
                                </View>
                            </View>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                search
                                data={symptomsData}
                                labelField="label"
                                valueField="id"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={symptomsData.id}
                                onChange={(item) => handleSymptomsChange(item)}
                                selectedStyle={styles.selectedStyle}
                                // renderItem={renderItem}
                                renderSelectedItem={(item, unSelect) => (
                                    <View style={styles.selectedStyle}>
                                        <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                            <MaterialCommunityIcons
                                                name="delete"
                                                color={'#fff'}
                                                size={18}
                                                style={{marginLeft: 10}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Disease */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Confirmatory Diagnosis:</Text>

                            <View style={{
                                // justifyContent: 'flex-end',
                                // flex: 1,
                                alignItems: 'flex-end',
                                marginBottom: 15,
                            }}>
                                <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'flex-end', 
                                    backgroundColor: '#BFD9D9', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccessDisease ? 
                                    <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={formData.client_access_disease}
                                        onValueChange={onToggleSwitchDisease} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#00000080" }}
                                        thumbColor={'#0E9C9B'}
                                    />
                                </View>
                            </View>
                            
                            {/* Custom Dropdown */}
                            <CustomDropdown
                            handleAddEvent={handleAddNewDisease}
                            onChange={handleDiseaseChange}
                            buttonLabel={"Add new disease"}
                            // defaultValue={5}
                            data={diseaseData}
                            />

                        </View>

                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Medications:</Text>

                            <View style={{
                                alignItems: 'flex-end',
                                marginBottom: 15,
                            }}>
                                <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: 'flex-end', 
                                    backgroundColor: '#BFD9D9', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccessInjection ?
                                    <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#006766'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={formData.client_access_injection_data}
                                        onValueChange={onToggleSwitchInjectionData} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#00000080" }}
                                        thumbColor={'#0E9C9B'}
                                    />
                                </View>
                            </View>
                            
                            {/* Custom Dropdown */}
                            <CustomDropdown
                                handleAddEvent={handleAddNewMedicine}
                                onChange={handleMedicineChange}
                                buttonLabel={"Add new disease"}
                                // defaultValue={5}
                                data={medicineData}
                            />

                        </View>

                        {/* Prescription */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Prescription:</Text>

                            <CustomDropdown
                            handleAddEvent={handleAddNewPrescription}
                            onChange={handlePrescriptionChange}
                            buttonLabel={"Add new prescription"}
                            // defaultValue={5}
                            data={prescriptionData}
                            />
                        </View>

                        {/* Documents */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Documents:</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('DocumentUpload', { updateFileQueue: updateFileQueue, files: files })}>
                                <Text style={{ textAlign: 'center', padding: 14, backgroundColor: '#006766', color: '#fff', borderRadius: 12, }}>Upload a file/image</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Visit Type */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Visit Type:</Text>
                            {/* Custom Dropdown */}
                            <CustomDropdown
                                handleAddEvent={handleAddNewVisitType}
                                onChange={handleVisitTypeChange}
                                buttonLabel={"Add new visittype"}
                                // defaultValue={5}
                                data={visitTypeData}
                            />

                        </View>

                        {/* Branch */}
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Branch:</Text>

                            <Dropdown
                                style={{
                                    width: '100%',
                                    padding: 5,
                                    borderRadius: 5,
                                    backgroundColor: '#0E9C9B20',
                                    // elevation: 2,
                                }}
                                placeholder='Select or add a Branch'
                                maxHeight={170}
                                data={branchData}
                                labelField='branch'
                                valueField='id'
                                value={branchData}
                                onChange={(value) => { value && handleBranchChange(value) }}
                                search={true}
                                searchPlaceholder='search...'
                                selectedTextStyle={{
                                    color: '#00000080'
                                }}
                                placeholderStyle={{
                                    color: '#00000080',
                                    fontSize: 16
                                }}
                            />
                            <View>
                                {/* <Button title='+ Add' color='#6200ee' onPress={handleAddNewVisitPurpose} /> */}

                            </View>

                        </View>
                        
                    </View>
                    
                </View>
                {/* {afterSubmit?<SubmitNewVisitForm/>:<></>} */}
            </View>
            <View style={styles.formButtons}>
                <TouchableOpacity
                    onPress={onHandleSubmit}
                    style={{width: '50%'}}
                >
                    <Text style={{
                        backgroundColor: '#006766',
                        alignItems: 'center',
                        color: '#fff',
                        textAlign: 'center',
                        paddingVertical: 20,
                        fontWeight: 'bold'
                    }}>
                        Submit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{width: '25%'}}
                    onPress={onSave}
                >
                    <Text style={styles.submit}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{width: '25%', borderLeftWidth: 1, borderColor: '#fff'}}
                >
                    <Text style={styles.submit}>History</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default AddNewVisitDetails;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    topVisitDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0E9C9B20',
        padding: 10,
        height: 120
    },

    topLeft: {
        flexDirection: 'column',
        height: 95,
        justifyContent: 'space-between',
        // alignItems: 'center'
    },

    datePicker: {
        flexDirection: 'row',

    },

    datePickerStyle: {
        width: 120
    },

    submit: {
        backgroundColor: '#0E9C9B',
        alignItems: 'center',
        // width: 80,
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 20,
    },

    inputText: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    form: {
        // marginHorizontal: 14,
        margin: 12,
    },

    formItem: {
        marginVertical: 14,
    },

    formItemVaccine: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        height: 120,
        flex: 1,
        justifyContent: 'center',
    },

    formLabel: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 15,
    },

    textArea: {
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 100,
        padding: 5,
        backgroundColor: '#fff',
    },

    formButtons: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },

    formInsideWeight: {
        width: '60%'
    },

    dropdownContainer: {
        // flex: ,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dropdown: {
        width: '80%',
        padding: 5,
        // backgroundColor: '#0E9C9B20',
        borderRadius: 5
    },
    dropdownWeight:{
        width: '65%',
        padding: 5,
        backgroundColor: '#0E9C9B20',
        borderRadius: 5
    },
    weightComp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center'
    },
    formTextInput:{
        width: '30%',
        backgroundColor: '#fff',
        elevation: 2,
        textAlign: 'center',
        borderRadius: 10
    },



    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
  
        elevation: 2,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 14,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      icon: {
        marginRight: 5,
      },
      item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#006766',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      },
      textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        color: '#fff',
      },
})
