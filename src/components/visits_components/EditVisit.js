import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Image } from "react-native";
import { Switch, Dialog, Portal, Paragraph } from "react-native-paper";
import axios from "react-native-axios";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from "react-native-element-dropdown";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useIsFocused } from "@react-navigation/core";

const EditVisit = ({ route, navigation }) => {

  const visitDetailData = route.params.visitsInfo;
  // console.log("visitDetailData", route.params.attachments);

  const visitDetailId = route.params.visitsInfo.id;

  const weight = visitDetailData.weight.split("kg");

  let splitText2 = route.params.visitsInfo.pet_id.pet_name;
  splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

  let splitText1 = route.params.visitsInfo.owner_name_id.pet_owner_name;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1} / ${splitText2}` });

  const [formData, setFormData] = useState({
    pet_id: "",
    owner_name_id: "",
    visited_date: "",
    visit_purpose: "",
    visited_clinic_id: "",
    doctor_name: "",
    symptoms_data: [],
    injections_data: [],
    client_access_disease: "",
    client_access_injection_data: "",
    client_access_symptom: "",
    disease: "",
    weight: "",
    branch_id: "",
    diagnosis_note: "",
    doctor_note: "",
    prescription_id: "",
    visit_type: "",
    is_submited: "",
    // vaccine_data: "",
  });

  const isFocused = useIsFocused();

  const [date, setDate] = useState();

  const currentDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    // console.log(year + '-' + month + '-' + date);
    setDate(year + '-' + month + '-' + date);
  }

  useEffect(() => {
    currentDate();
  }, [])

  const [breedData, setBreedData] = useState("");

  const [visitData, setVisitData] = useState([]);
  const [visitPurposeData, setVisitPurposeData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [visitTypeData, setVisitTypeData] = useState([]);
  const [branchData, setBranchData] = useState([]);

  const [vaccinationData, setVaccinationData] = useState(false);
  const [vaccineData, setVaccineData] = useState([]);

  const [medicineData, setMedicineData] = useState([]);
  const [symptomsData, setSymptomsData] = useState([]);

  const [clientAccess, setClientAccess] = useState(false);
  const [clientAccessDisease, setClientAccessDisease] = useState(false);
  const [clientAccessInjection, setClientAccessInjection] = useState(false);

  const [isSwitchOnDisease, setIsSwitchOnDisease] = useState(false);
  const [isSwitchOnSymptoms, setIsSwitchOnSymptoms] = useState(false);
  const [isSwitchOnInjection, setIsSwitchOnInjection] = useState(false);

  // const [ defaultAttachments, setDefaultAttachments ] = useState([]);
  // const [successMsg, setSuccessMsg] = useState(false);
  // const [errorMsg, setErrorMsg] = useState(false);

  // const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);
  // const [savedErrorMsg, setSavedErrorMsg] = useState(false);
  const path = "http://192.168.1.58:8000";

  const [weightUnit, setWeightUnit] = useState("kg");
  const units = [
    { label: 'Kilogram', value: 'kg' },
    { label: 'Gram(g)', value: 'g' },
  ];

  const [files, setFiles] = useState([]);

  useEffect(() => {
    //formData
    setFormData({
      ...formData,
      pet_id: visitDetailData.pet_id.id,
      owner_name_id: visitDetailData.owner_name_id.id,
      visited_date: date,
      visit_purpose: visitDetailData.visit_purpose.id,
      visited_clinic_id: visitDetailData.visited_clinic_id.id,
      doctor_name: visitDetailData.doctor_name,
      client_access_disease: visitDetailData.client_access_disease === '1' ? true : false,
      client_access_injection_data: visitDetailData.client_access_injection_data === '1' ? true : false,
      client_access_symptom: visitDetailData.client_access_symptom === '1' ? true : false,
      disease: visitDetailData.disease,
      weight: visitDetailData.weight,
      branch_id: visitDetailData.branch_id,
      diagnosis_note: visitDetailData.diagnosis_note,
      doctor_note: visitDetailData.doctor_note,
      prescription_id: visitDetailData.prescription_id,
      is_submited: visitDetailData.is_submited === '1' ? true : false,
      injections_data: JSON.parse(visitDetailData.injections_data),
      visit_type: visitDetailData.visit_type.id,
      symptoms_data: JSON.parse(visitDetailData.symptoms_data),
      // attachments: visitDetailData.attachments
    })
    setClientAccess(visitDetailData.client_access_symptom === '1' ? true : false);
    setClientAccessDisease(visitDetailData.client_access_disease === '1' ? true : false);
    setClientAccessInjection(visitDetailData.client_access_injection_data === '1' ? true : false);

  }, [visitDetailData]);

  // console.log("formData", formData);
  useEffect(() => {
    if (isFocused) {
      getVisitPurposeData();
      getDiseaseData();
      getPrescriptionData();
      getVisitTypeData();
      getBranchData();
      getVaccineData();
      getSymptomsData();
      getMedicineData();
      getBreedName();
      getIndividualVisitData();
    }
  }, [isFocused])

  const getIndividualVisitData = async() => {
    await axios.get(`visitDetail/${visitDetailId}`)
      .then((res) => {
        if (res.status == 200) {
          let attachmentData = res.data
          attachmentData.attachments = oganizeFiles(attachmentData);
          setVisitData(attachmentData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // console.log("visitData", visitData);

  const oganizeFiles = (attachmentData) => {
    let files = [];
    attachmentData.attachments.forEach(element => {
        let tempUrl = path + '/storage/' + element.file_path;
        files.push({
            id: element.id,
            uid: element.file_id,
            name: element.file_name,
            custom_name: element.custom_name,
            client_access: element.client_access == "1" ? true : false,
            size: element.size,
            type: element.file_type,
            lastModified: "",
            status: 'done',
            url: tempUrl,
        });
    });
    return files;
  }

  const getBreedName = () => {
    let breedId = visitDetailData.pet_id.breed_id
    axios
      .get(`/breed/${breedId}`)
      .then((res) => {
        // console.log("breedData",res.data);
        setBreedData(res.data.edited_animal_name ? res.data.edited_animal_name : res.data.actual_animal_name)
      })
      .catch((err) => {
        console.log(err);
      });
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

  // handling changes in form
  // visit purpose
  const handleVisitPurposeChange = (value) => {
    console.log(value['label']);
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
  const handleAddNewVisitPurpose = () => {
    navigation.navigate('AddVisitPurpose');
  }

  // weight
  const handlePetWeightChange = (value) => {
    setFormData({
      ...formData,
      weight: value
    });
  }
  const handleWeightChange = (value) => {
    setWeightUnit(value.value);
  }

  // vaccine change
  const handleAddNewVaccineChange = () => {
    navigation.navigate('AddVaccine');
  }
  const handleVaccineChange = (value) => {
    setFormData({
      ...formData,
      vaccine: value.vaccine_name
    });
  }

  // diagnosis note
  const handleDiagnosisNoteChange = (value) => {
    setFormData({
      ...formData,
      diagnosis_note: value
    });
  }

  // doctor note
  const handleDoctorsNoteChange = (value) => {
    setFormData({
      ...formData,
      doctor_note: value
    });
  }

  // symptoms data
  const onToggleSwitch1 = (value) => {
    setClientAccess(value);
    setIsSwitchOnSymptoms(value);
    setFormData({
      ...formData,
      client_access_symptom: value
    })
  };

  const handleSymptomsChange = (item) => {
    // console.log("Symptom", item);
    setFormData({
      ...formData,
      symptoms_data: item
    });
  };

  // disease data
  const onToggleSwitchDisease = (value) => {
    // console.log(!isSwitchOnDisease);
    setClientAccessDisease(value);
    setIsSwitchOnDisease(value);
    setFormData({
      ...formData,
      client_access_disease: value
    })
  };
  const handleAddNewDisease = () => {
    navigation.navigate('AddDisease');
  }
  const handleDiseaseChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      disease: value.id
    });
  }

  // injection data
  const onToggleSwitchInjectionData = (value) => {
    // console.log(!isSwitchOnInjection);
    setClientAccessInjection(value);
    setIsSwitchOnInjection(value);
    setFormData({
      ...formData,
      client_access_injection_data: value
    })
  };
  const handleAddNewMedicine = () => {
    navigation.navigate('AddMedicine');
  }
  const handleMedicineChange = (value) => {
    setFormData({
      ...formData,
      injection_data: value.id
    });
  }

  // prescription
  const handleAddNewPrescription = () => {
    navigation.navigate('AddPrescriptionTemplate', { getPrescriptionTemplateData: getPrescriptionTemplateData });
  }
  const handlePrescriptionChange = (value) => {
    getPrescriptionData();
    setFormData({
      ...formData,
      prescription_id: value.id
    });
  }

  // files
  const updateFileQueue = (data) => {
    console.log("In Edit Visit Screen", data);
    setFiles(data);
  }

  // visit type
  const handleAddNewVisitType = () => {
    navigation.navigate('AddVisitType');
  }
  const handleVisitTypeChange = (value) => {
    // console.log(value);
    setFormData({
      ...formData,
      visit_type: value.id
    });
  }

  // branch
  const handleBranchChange = (value) => {
    setFormData({
      ...formData,
      branch_id: value.id
    });
  }

  // portal

  const onHandleSubmit = () => {
    // let visitId = visitDetailData.id
    let data = formData;
    data.id = visitDetailData.id;
    data.is_submited = true;
    data.weight = formData.weight + " " + weightUnit;
    data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
    data.injections_data = formData.symptoms_data && formData.injections_data.toString();

    console.log("gfh", data);
    axios.post(`/visitDetail/update`, data)
      .then((res) => {
        if (res.status == "200") {
          console.log("Successfully updated");
          submitRoute(res.data.visit_id);
          // console.log("zzzzzzzz", res.data);
          navigation.navigate('SubmitNewVisitForm', { visitId: visitDetailData.id });
        }
      })
      .catch((err) => {
        console.log(err);
        // setErrorMsg(true);
      });
  }

  const onSave = () => {
    // let visitId = visitDetailData.id
    let data = formData;
    data.id = visitDetailData.id;
    data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
    data.injections_data = formData.injections_data && formData.injections_data.toString();
    // console.log("gfh", formData.symptoms_data);
    data.is_submited = false;
    data.weight = formData.weight + " " + weightUnit;

    console.log("gfh", data);

    axios.post(`/visitDetail/update`, data)
      .then((res) => {
        console.log(res.data);
        if (res.status == "200") {
          ;
          console.log("res.data", res.data);
          submitMethod(res.data.visit_id);
          navigation.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        // setSavedErrorMsg(true);
      });
  }

  const submitRoute = async(value) => {
    // submitMethod(value);
    let fileData = new FormData();
    fileData.append("visit_id", value);
    fileData.append("clinic_id", formData.visited_clinic_id);
    for (var i = 0; i < files.length; i++) {
        fileData.append("files[]", files[i])
    }
    // console.log("fileData", fileData);
    await axios.post(`/visitDetail/uploadFilesMobile`, fileData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then((res) => {
        console.log("error", res);
    })
    navigation.navigate('SubmitNewVisitForm', {visitId: value});
  }

  const submitMethod = async(value) => {
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
  }

  return (
    <ScrollView>
      <View style={styles.container} key={'edit_v'}>
        <View style={styles.topVisitDetail} key={'edit_v_1'}>
          <View style={styles.topLeft} key={'edit_v_1_0'}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>{visitDetailData && visitDetailData.pet_id.pet_name} / {breedData && breedData}</Text>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Last Visited -<Text style={{ fontWeight: 'normal' }}>{route.params.visitsInfo.visited_date}</Text></Text>
          </View>

          <View style={styles.datePicker} key={'edit_v_1_1'}>
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
              minDate={new Date()}
              placeholderStyle={{ color: '#000' }}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  display: 'none'
                },
              }}
              onDateChange={(value) => {
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

        {/*  */}
        <View style={styles.editVisitForm} key={'edit_v_2'}>

          {/* Visit Purpose */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Visit Purpose:</Text>

            {/* Custom Dropdown */}
            <CustomDropdown
              handleAddEvent={handleAddNewVisitPurpose}
              onChange={handleVisitPurposeChange}
              buttonLabel={"Add new visit purpose"}
              isButton={true}
              dropdownType={"single"}
              autoFocusSearch={false}
              enableSearch={false}
              defaultValue={formData && formData.visit_purpose}
              data={visitPurposeData}
            />
          </View>

          {/* Weight */}
          <View style={styles.formItem} key={'edit_v_3'}>
            <Text style={styles.formLabel}>Weight:</Text>
            <View style={styles.weightComp}>
              <TextInput
                placeholder='weight'
                style={styles.formTextInput}
                defaultValue={weight && weight[0]}
                keyboardType='number-pad'
                onChangeText={(value) => handlePetWeightChange(value)}>
              </TextInput>
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

          {/* Vaccination Change */}
          {vaccinationData ?
            <View style={styles.formItemVaccine} key={'edit_v_4'}>
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
            : <></>
          }

          {/* Diagnosis Note */}
          <View style={styles.formItem} key={'edit_v_5'}>
            <Text style={styles.formLabel}>Diagnosis Note:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Diagnosis Notes here ..."
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              defaultValue={formData && formData.diagnosis_note}
              onChangeText={(value) => handleDiagnosisNoteChange(value)}
            />
          </View>

          {/* Doctor's Note */}
          <View style={styles.formItem} key={'edit_v_6'}>
            <Text style={styles.formLabel}>Doctor's Note:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Doctor's Notes here ..."
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              defaultValue={formData && formData.doctor_note}
              onChangeText={(value) => handleDoctorsNoteChange(value)}
            />
          </View>

          {/* Symptoms */}
          <View style={styles.formItem} key={'edit_v_7'}>
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
                    <Text style={{ color: '#006766', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#006766', fontWeight: 'bold' }}>ON</Text></Text>
                  </>
                  : <>
                    <Text style={{ color: '#00000080', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#000', fontWeight: 'bold' }}>OFF</Text></Text>
                  </>
                }
                <Switch
                  value={formData && formData.client_access_symptom}
                  onValueChange={(value) => onToggleSwitch1(value)}
                  // style={{marginTop:-12}}
                  trackColor={{ false: "#00000080", true: "#0E9C9B70" }}
                  thumbColor={'#0E9C9B'}
                // defaultValue={formData && formData.client_access_symptom}
                />
              </View>
            </View>
            <CustomDropdown
              // handleAddEvent={handleSymptomsChange}
              onChange={handleSymptomsChange}
              buttonLabel={"Add new symptoms"}
              defaultValue={formData && formData.symptoms_data}
              enableSearch={false}
              dropdownType={"multiple"}
              data={symptomsData}
            />
            
          </View>

          {/* Disease */}
          <View style={styles.formItem} key={'edit_v_8'}>
            <Text style={styles.formLabel}>Confirmatory Diagnosis:</Text>

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
                {clientAccessDisease ?
                  <>
                    <Text style={{ color: '#006766', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#006766', fontWeight: 'bold' }}>ON</Text></Text>
                  </>
                  : <>
                    <Text style={{ color: '#00000080', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#000', fontWeight: 'bold' }}>OFF</Text></Text>
                  </>}
                <Switch
                  value={formData && formData.client_access_disease}
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

          {/* Medications */}
          <View style={styles.formItem} key={'edit_v_9'}>
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
                    <Text style={{ color: '#006766', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#006766', fontWeight: 'bold' }}>ON</Text></Text>
                  </>
                  : <>
                    <Text style={{ color: '#00000080', fontWeight: 'bold' }}>Client Access <Text style={{ color: '#000', fontWeight: 'bold' }}>OFF</Text></Text>
                  </>}
                <Switch
                  value={formData && formData.client_access_injection_data}
                  onValueChange={(value) => onToggleSwitchInjectionData(value)}
                  // style={{marginTop:-12}}
                  trackColor={{ false: "#00000080", true: "#0E9C9B70" }}
                  thumbColor={'#0E9C9B'}
                />
              </View>
            </View>

            {/* Custom Dropdown */}
            <CustomDropdown
              handleAddEvent={handleAddNewMedicine}
              onChange={handleMedicineChange}
              buttonLabel={"Add new Injection"}
              // defaultValue={5}
              data={medicineData}
            />
          </View>

          {/* Prescription */}
          <View style={styles.formItem} key={'edit_v_10'}>
            <Text style={styles.formLabel}>Prescription:</Text>
            <CustomDropdown
              handleAddEvent={handleAddNewPrescription}
              onChange={handlePrescriptionChange}
              buttonLabel={"Add new prescription"}
              // defaultValue={5}
              data={prescriptionData}
              defaultValue={formData && formData.prescription_id}
            />
          </View>

          {/* Documents */}
          <View style={styles.formItem} key={'edit_v_11'}>
            <Text style={styles.formLabel}>Documents:</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DocumentUpload', { updateFileQueue: updateFileQueue, files: files, existingFiles: visitData.attachments })}>
              <Text style={{ textAlign: 'center', padding: 14, backgroundColor: '#006766', color: '#fff', borderRadius: 12, }}>Upload a file/image</Text>
            </TouchableOpacity>
            
            {/* <UploadView visitData={visitData && visitData}/> */}
          </View>

          {/* Visit Type */}
          <View style={styles.formItem} key={'edit_v_12'}>
            <Text style={styles.formLabel}>Visit Type:</Text>
            {/* Custom Dropdown */}
            <CustomDropdown
              handleAddEvent={handleAddNewVisitType}
              onChange={handleVisitTypeChange}
              buttonLabel={"Add new visit type"}
              // defaultValue={5}
              defaultValue={formData && formData.visit_type}
              data={visitTypeData}
            />
          </View>

          {/* Branch */}
          <View style={styles.formItem} key={'edit_v_13'}>
            <Text style={styles.formLabel}>Branch:</Text>

            <Dropdown
              style={{
                width: '100%',
                padding: 5,
                borderRadius: 5,
                backgroundColor: '#0E9C9B20',
              }}
              placeholder='Select or add a Branch'
              maxHeight={170}
              data={branchData}
              labelField='branch'
              valueField='id'
              value={formData && formData.branch_id}
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
      {
        formData && formData.is_submited === true ?
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#7BCC70',
              padding: 20,
              elevation: 5
            }}
          >
            <Text style={{
              color: '#000',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>Record submitted already, Click to go back !</Text>
          </TouchableOpacity>
          : <View style={styles.formButtons}>
            <TouchableOpacity
              onPress={() => onHandleSubmit()}
              style={{ width: '50%' }}
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
              style={{ width: '60%' }}
              onPress={onSave}
            >
              <Text style={styles.submit}>Save</Text>
            </TouchableOpacity>
          </View>}
      {/* ))} */}
      {/* <View>
            <>
            {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>visit details updates submitted successfully</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback} title="Done" />
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {errorMsg ?
                <Portal>
                  <Dialog visible={errorMsg} onDismiss={handleCancel}>
                      <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>visit details not found</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleCancel} title="Done"/>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {savedSuccessMsg ?
                <Portal>
                  <Dialog visible={savedSuccessMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>visit details updates saved successfully</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback} title="Done" />
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {savedErrorMsg ?
                <Portal>
                  <Dialog visible={savedErrorMsg} onDismiss={handleCancel}>
                      <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>visit details not found</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleCancel} title="Done"/>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
            </>
          </View> */}
    </ScrollView>
  );
};

export default EditVisit;

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
    // alignItems: 'center'
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  datePickerStyle: {
    width: 120
  },
  formTextInput: {
    width: '30%',
    backgroundColor: '#fff',
    elevation: 2,
    textAlign: 'center',
    borderRadius: 10
  },
  dropdownWeight: {
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
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
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
  editVisitForm: {
    marginHorizontal: 10
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 100,
    padding: 5,
    backgroundColor: '#fff',
  },
  // dropdown: {
  //   width: '80%',
  //   padding: 5,
  //   // backgroundColor: '#0E9C9B20',
  //   borderRadius: 5
  // },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedTextStyle: {
    fontSize: 14,
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
  formButtons: {
    flexDirection: 'row',
    width: '100%',
    // alignItems: 'center'
  },
  submit: {
    backgroundColor: '#0E9C9B',
    alignItems: 'center',
    // width: 80,
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 20,
  },

});
