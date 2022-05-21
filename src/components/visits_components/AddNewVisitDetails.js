import React, { useState, useEffect } from 'react'
import { Button, TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider, Switch, Dialog, Portal, Paragraph } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import axios from 'react-native-axios'
import { Dropdown } from "react-native-element-dropdown";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { MultiSelect } from 'react-native-element-dropdown';
import { useIsFocused } from "@react-navigation/core";

const AddNewVisitDetails = ({ route, navigation }) => {

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
        // vaccine: "",
        visited_date: "",
        client_access_injection_data: false,
        injections_data: [],
        is_submited: false,
        isPrescriptionEdited: false,
        pet_id: '',
        owner_name_id: '',
        visited_clinic_id: '',
    });

    const isFocused = useIsFocused();

    const [ weight, setWeight ] = useState("");
    const [ weightUnit, setWeightUnit ] = useState('kg');

    const [ clientAccess, setClientAccess ] = useState(isSwitchOnSymptoms);
    const [ clientAccessDisease, setClientAccessDisease ] = useState(isSwitchOnDisease);
    const [ clientAccessInjection ,setClientAccessInjection] = useState(isSwitchOnInjection);

    const units = [
        { label: 'Kilogram', value: 'kg', id: 1 },
        { label: 'Gram(g)', value: 'g', id: 2 },
    ];

    const [selectedItem, setSelectedItem] = useState(null)

    const [afterSubmit, setAfterSubmit] = useState(false)

    const [ individualPetData, setIndividualPetData ] = useState({});

    // form dropdown input handling
    const [files, setFiles] = useState([]);

    const [visitPurposeData, setVisitPurposeData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [visitTypeData, setVisitTypeData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [vaccinationData, setVaccinationData] = useState(false);
    const [vaccineData, setVaccineData] = useState([]);

    const [ medicineData, setMedicineData ] = useState([]);

    const [symptomsData, setSymptomsData] = useState([]);

    const [isSwitchOnDisease, setIsSwitchOnDisease] = useState(false);
    const [isSwitchOnSymptoms, setIsSwitchOnSymptoms] = useState(false);
    const [isSwitchOnInjection, setIsSwitchOnInjection] = useState(false);

    const [ newPrescMedicineData, setNewPrescMedicineData ] = useState([]);
    const [ newPrescData, setNewPrescData ] = useState([]);

    const [ savedSuccessMsg, setSavedSuccessMsg ] = useState(false);

    // const [ fileData ]

    useEffect(() => {
        if(isFocused) {
            getPetDetailsById();
            getVisitPurposeData();
            getDiseaseData();
            getPrescriptionData();
            getVisitTypeData();
            getBranchData();
            getVaccineData();
            getSymptomsData();
            getMedicineData();
        }
    }, [isFocused])
    
    useEffect(() => {
        let date = new Date();
        let newDate = date.toISOString().split('T')[0]
        if(route.params.petData) {
            setFormData({
               ...formData,
                pet_id: route.params.navOptionsFromAddPet.id,
                owner_name_id: route.params.navOptionsFromAddPet.pet_owner_id.id,
                visited_clinic_id: route.params.navOptionsFromAddPet.clinic,
                visited_date: newDate,
            })
            // setAnimalType(route.params.navOptionsFromAddPet.pet_type_id.animal_type);
            // setBreed(route.params.navOptionsFromAddPet.breed_id.breed);
        }
    }, [route.params.petData])

    useEffect(() => {
        let date = new Date();
        let newDate = date.toISOString().split('T')[0]
        if(route.params.petNotification) {
            setFormData({
                ...formData,
                pet_id: route.params.navOptionsFromPets.id,
                owner_name_id: route.params.navOptionsFromPets.pet_owner_id.id,
                visited_clinic_id: route.params.navOptionsFromPets.clinic,
                visited_date: newDate,
            })
            // setAnimalType(individualPetData && individualPetData.actual_animal_type);
            // setBreed(individualPetData && individualPetData.actual_breed);
        }
    }, [route.params.petNotification])

    useEffect(() => {
        let date = new Date();
        let newDate = date.toISOString().split('T')[0]
        if(route.params.navOptionsFromAddVisit) {
            setFormData({
                ...formData,
                pet_id: route.params.navOptionsFromAddVisit.id,
                owner_name_id: route.params.navOptionsFromAddVisit.pet_owner_id.id,
                visited_clinic_id: route.params.navOptionsFromAddVisit.clinic,
                visited_date: newDate,
            })
            // setAnimalType(individualPetData && individualPetData.actual_animal_type);
            // setBreed(individualPetData && individualPetData.actual_breed);
        }
    }, [route.params.navOptionsFromAddVisit])

    useEffect(() => {
      if(route.params.navOptionsFromPets) {
        let splitText2 = route.params.navOptionsFromPets.pet_name;
        splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

        let splitText1 = route.params.navOptionsFromPets.pet_owner_id.pet_owner_name;
        splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

        navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
      }
    }, [route.params.navOptionsFromPets])

    useEffect(() => {
        if(route.params.navOptionsFromAddPet) {
          let splitText2 = route.params.navOptionsFromAddPet.pet_name;
          splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);
  
          let splitText1 = route.params.navOptionsFromAddPet.pet_owner_id.pet_owner_name;
          splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);
  
          navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
        }
      }, [route.params.navOptionsFromAddPet])

      useEffect(() => {
        if(route.params.navOptionsFromAddVisit) {
          let splitText2 = route.params.navOptionsFromAddVisit.pet_name;
          splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);
  
          let splitText1 = route.params.navOptionsFromAddVisit.pet_owner_id.pet_owner_name;
          splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);
  
          navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
        }
      }, [route.params.navOptionsFromAddVisit])
    
    // console.log("formData", formData);

    const getPetDetailsById = () => {
        if(route.params.petNotification) {
            axios.get(`pet/${route.params.petNotification}`).then(
                res => {
                    // console.log("vaccinedata",res.data);
                    if(res.status === 200) {
                        // console.log(res.data);
                        setIndividualPetData(res.data);
                    }
                }
            ).catch(
                err => {
                    console.log(err)
                }
            )
        } else if (route.params.petData) {
            axios.get(`pet/${route.params.petData}`).then(
                res => {
                    // console.log("vaccinedata",res.data);
                    if(res.status === 200) {
                        // console.log(res.data);
                        setIndividualPetData(res.data);
                    }
                }
            ).catch(
                err => {
                    console.log(err)
                }
            )
        } else if (route.params.petId) {
            axios.get(`pet/${route.params.petId}`).then(
                res => {
                    // console.log("vaccinedata",res.data);
                    if(res.status === 200) {
                        // console.log(res.data);
                        setIndividualPetData(res.data);
                    }
                }
            ).catch(
                err => {
                    console.log(err)
                }
            )
        }
    }

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
                        id: element.id,
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
        getPrescriptionData();
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
            injections_data: value
        });
    }

    const handleSymptomsChange = (item) => {
        setFormData({
            ...formData,
            symptoms_data : item
        });
    };
    
    const getPrescriptionTemplateData = (data, index) => {
        // console.log("getPrescriptionTemplateData", data);
        setNewPrescData(data);
        let addPrescData = JSON.parse(data.prescriptionTemplate.medicine);
        // console.log("getPrescriptionTemplateData", addPrescData);
        setNewPrescMedicineData(addPrescData);
    }

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

    const handleAddNewMedicine = () => {
        navigation.navigate('AddMedicine');
    }

    const handleAddNewPrescription = () => {
        navigation.navigate('AddPrescriptionTemplate', {getPrescriptionTemplateData: getPrescriptionTemplateData});
    }

    const handleAddNewVisitType = () => {
        navigation.navigate('AddVisitType');
    }

    const onToggleSwitch1 = (value) => {
        // console.log(!isSwitchOnSymptoms);
        setClientAccess(value);
        setIsSwitchOnSymptoms(value);
        setFormData({
            ...formData,
            client_access_symptom: value
        })
    };

    const onToggleSwitchDisease = (value) => {
        // console.log(!isSwitchOnDisease);
        setClientAccessDisease(value);
        setIsSwitchOnDisease(value);
        setFormData({
            ...formData,
            client_access_disease: value
        })
    };

    const onToggleSwitchInjectionData = (value) => {
        // console.log(!isSwitchOnInjection);
        setClientAccessInjection(value);
        setIsSwitchOnInjection(value);
        setFormData({
            ...formData,
            client_access_injection_data: value
        })
    };

    const onHandleSubmit = () => {
        let data = formData;
        data.is_submited = true;
        data.weight = formData.weight + " " + weightUnit;
        data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
        data.injections_data = formData.injections_data && formData.injections_data.toString();
        axios.post(`/visitDetail`, data)
            .then((res) => {
                // console.log(res.data);
                if (res.status == "200") {
                    console.log("Successfully added new visit");
                    // navigation.navigate('SubmitNewVisitForm', {visitId: res.data.visit_id});
                    submitRoute(res.data.visit_id);
                }
            }
        )
        .catch((err) => {
            console.log(err);
            // setErrorMsg(true);
        });
    }

    const onSave = () => {
        let data = formData;
        data.is_submited = false;
        data.weight = formData.weight + " " + weightUnit;
        data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
        data.injections_data = formData.injections_data && formData.injections_data.toString();
        axios.post(`/visitDetail`, data)
        .then((res) => {
            // console.log(res.data);
            if (res.status == "200") {
                submitMethod(res.data.visit_id);
                // setSuccessMsg(true);
                console.log("Successfully saved");
                navigation.goBack();
            }
        })
        .catch((err) => {
            console.log(err);
            setErrorMsg(true);
        });
    }
    
    const submitRoute = (value) => {
        if(route.params.petData) {
            submitMethod(value);
            navigation.navigate('SubmitNewVisitForm', {visitId: value});
        } else if (route.params.petNotification) {
            submitMethod(value);
            navigation.navigate('SubmitNewVisitForm', {visitIdFromPet: value});
        } else if (route.params.petId) {
            submitMethod(value);
            navigation.navigate('SubmitNewVisitForm', {visitIdFromVisits: value});
        }
    }

    const submitMethod = async(value) => {
        // console.log("value", value);
        let fileData = new FormData();
        fileData.append("visit_id", value);
        fileData.append("clinic_id", formData.visited_clinic_id);
        for (var i = 0; i < files.length; i++) {
            fileData.append("files[]", files[i])
        }
        console.log("fileData", fileData);
        await axios.post(`/visitDetail/uploadFilesMobile`, fileData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            console.log("error", res);
        })
        // navigation.goBack();
    }
    
    const handlegoback = () => {
        setSavedSuccessMsg(false);
        navigation.navigate('Visits');
    }
    
    const updateFileQueue = (value) => {
        console.log("In Visit Screen", value);
        setFiles(value);
    }

    // console.log(formData);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.topVisitDetail}>
                
                    <View style={styles.topLeft}>
                        <Text style={{color: '#000', fontWeight: 'bold', textTransform: 'capitalize'}}>{individualPetData.actual_animal_type} / {individualPetData.actual_breed}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: '#000', fontWeight: 'bold'}}>Visited Date:</Text>
                            {route.params.navOptionsFromPets ? 
                                <Text style={{color: '#000', marginLeft: 5}}>{route.params.navOptionsFromPets.last_visit}</Text>
                            : <></>}
                            {route.params.navOptionsFromAddPet ? 
                                <Text style={{color: '#000', marginLeft: 5}}>{route.params.navOptionsFromAddPet.last_visit}</Text>
                            : <></>}
                            {route.params.navOptionsFromAddVisit ? 
                                <Text style={{color: '#000', marginLeft: 5}}>{route.params.navOptionsFromAddVisit.last_visit}</Text>
                            : <></>}
                        </View>
                    </View>

                    <View style={styles.datePicker}>
                        <MaterialCommunityIcons
                            name="calendar-edit"
                            color={'#006766'}
                            size={35}
                        />
                        <DatePicker
                            style={styles.datePickerStyle}
                            date={new Date()} // Initial date from state
                            mode="date" // The enum of date, datetime and time
                            placeholder="select date"
                            minDate={new Date()}
                            placeholderStyle={{color: '#000'}}
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    display: 'none'
                                },
                                
                            }}
                            onDateChange={(date) => {
                                // console.log("value", value);
                                setFormData({
                                    ...formData,
                                    visited_date: date
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
                                buttonLabel={"Add new visit purpose"}
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
                                    // placeholder='Select...'
                                    maxHeight={120}
                                    data={units}
                                    labelField='label'
                                    valueField='value'
                                    value={'kg'}
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

                        {/* {vaccinationData ?
                            <View style={styles.formItemVaccine}>
                                <Text style={styles.formLabel}>Medications:</Text>

                                <CustomDropdown
                                    handleAddEvent={handleAddNewVaccineChange}
                                    onChange={(value) => handleVaccineChange(value)}
                                    buttonLabel={"Add new vaccine"}
                                    data={vaccineData}
                                />
                            </View>
                            :<></>
                        } */}

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
                                    backgroundColor: '#BFD9D970', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccess ? 
                                    <>
                                        <Text style={{color: '#006766', fontWeight: 'bold'}}>Client Access <Text style={{color: '#006766', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#00000080', fontWeight: 'bold'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={isSwitchOnSymptoms}
                                        onValueChange={(value) => onToggleSwitch1(value)} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#0E9C9B70" }}
                                        thumbColor={'#0E9C9B'}
                                    />
                                </View>
                            </View>

                            <CustomDropdown
                                // handleAddEvent={handleSymptomsChange}
                                onChange={handleSymptomsChange}
                                buttonLabel={"Add new symptoms"}
                                defaultValue={formData.symptoms_data}
                                enableSearch={false}
                                dropdownType={"multiple"}
                                data={symptomsData}
                                labelField="label"
                                valueField="id"
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
                                    backgroundColor: '#BFD9D970', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccessDisease ? 
                                    <>
                                        <Text style={{color: '#006766', fontWeight: 'bold'}}>Client Access <Text style={{color: '#006766', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#00000080', fontWeight: 'bold'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={isSwitchOnDisease}
                                        onValueChange={(value) => onToggleSwitchDisease(value)} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#0E9C9B70" }}
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
                                    backgroundColor: '#BFD9D970', 
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 30,
                                    height: 30,
                                    paddingHorizontal: 4,
                                }}>
                                    {clientAccessInjection ?
                                    <>
                                        <Text style={{color: '#006766', fontWeight: 'bold'}}>Client Access <Text style={{color: '#006766', fontWeight: 'bold'}}>ON</Text></Text>
                                    </>
                                    : <>
                                        <Text style={{color: '#00000080', fontWeight: 'bold'}}>Client Access <Text style={{color: '#000', fontWeight: 'bold'}}>OFF</Text></Text>
                                    </>}
                                    <Switch 
                                        value={isSwitchOnInjection}
                                        onValueChange={(value) => onToggleSwitchInjectionData(value)} 
                                        // style={{marginTop:-12}}
                                        trackColor={{ false: "#00000080", true: "#0E9C9B70" }}
                                        thumbColor={'#0E9C9B'}
                                    />
                                </View>
                            </View>
                            <CustomDropdown
                                // handleAddEvent={handleAddNewVaccine}
                                onChange={handleVaccineChange}
                                buttonLabel={"Add new vaccine"}
                                defaultValue={formData && formData.injections_data}
                                enableSearch={false}
                                dropdownType={"multiple"}
                                data={vaccineData}
                                labelField="label"
                                valueField="id"
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
                            {/* {newPrescData.map((ele, index) => { */}
                            {newPrescData && newPrescData.prescriptionTemplate ?
                                <>
                                    <TouchableOpacity 
                                        style={styles.editPrescOnVisits}
                                        onPress={() => navigation.navigate('EditPrescriptionTemplate', {dataTemp: newPrescData.prescriptionTemplate, updateMedicineToVisits: updateMedicineToVisits})}
                                    >
                                        <Text style={{color: '#000', textAlign: 'center', fontWeight: 'bold'}}>{newPrescData.prescriptionTemplate && newPrescData.prescriptionTemplate.template_name}</Text>
                                    </TouchableOpacity>
                                </>
                            : <></>}
                                
                            {/* })} */}
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
            {savedSuccessMsg ?
                <Portal>
                  <Dialog visible={savedSuccessMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>visit details submitted successfully</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback} title="Done" />
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
            }
            {/* {savedErrorMsg ?
                <Portal>
                    <Dialog visible={savedErrorMsg} onDismiss={handleCancel}>
                        <Dialog.Title style={{ color: '#66ee' }}>Oops!</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>visit details updates saved as `Drafts`</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleCancel} title="Done"/>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            : <></>
            } */}
        </ScrollView>
    );
}

export default AddNewVisitDetails;

const styles = StyleSheet.create({

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
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datePickerStyle: {
        width: 120
    },
    submit: {
        backgroundColor: '#0E9C9B',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 20,
    },
    form: {
        margin: 12,
    },
    formItem: {
        marginVertical: 14,
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
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
      editPrescOnVisits: {
        backgroundColor: '#F2AA4CFF',
        width: 120,
        overflow: 'hidden',
        elevation: 2,
        paddingVertical: 10,
        marginTop: 10,
      }
})
