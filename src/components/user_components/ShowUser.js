import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native'
import DatePicker from "react-native-datepicker";
import { Divider, Dialog, Portal, Paragraph } from 'react-native-paper';
import axios from 'react-native-axios';
import { Button } from "react-native-elements";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ShowUser = ({route, navigation}) => {

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone_number: "",
    email: "",
    gender: "",
    qualification: '',
    specification: "",
    license_no: "",
    dob: "",
    clinic: "",
    status: "",
    accessSubscription: "",
  });

  const user = route.params.userData;

  let splitText1 = user.name;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  let splitText2 = user.role;
  splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

  navigation.setOptions({ title: `${splitText1} / ${splitText2}` });

  const [ date, setDate ] = useState('');
  const [clinicData, setClinicData] = useState([]);
 
  const roles = [
    { label: "Doctor", value: "doctor", id: "1" },
    { label: "Admin Doctor", value: "admin_doctor", id: "2" },
    { label: "Assistant", value: "assistant", id: "3" },
  ];

  const gender = [
    { label: "Male", value: "male", id: "1" },
    { label: "Female", value: "female", id: "2" },
    { label: "Others", value: "others", id: "3" },
  ];
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [isBillingSwitchOn, setIsBillingSwitchOn] = useState(false);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  
  useEffect(() => {
    setFormData({
      ...formData,
      name: user && user.name,
      role: user && user.role,
      phone_number: user && user.phone_number,
      email: user && user.email,
      gender: user && user.gender,
      // address: user && user.,
      specification: user && user.specification,
      license_no: user && user.license_no,
      dob: user && user.dob,
      clinic: user && user.clinic.id,
      qualification:user && user.qualification,
      // branch: "",
      status: user && user.status,
      accessSubscription: user && user.accessSubscription,
    });
    getClinicData();
    // setIsBillingSwitchOn(formData && formData.status);
    // if()
  }, [])
  
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    if(!isSwitchOn === true) {
      setFormData({
        ...formData,
        status: '1'
      })
    }else{
      setFormData({
        ...formData,
        status: '0'
      })
    }
  };

  
  const onToggleBillingSwitch = () => {
    setIsBillingSwitchOn(!isBillingSwitchOn);
    if(!isBillingSwitchOn === true) {
      setFormData({
        ...formData,
        accessSubscription: '1'
      })
    }else{
      setFormData({
        ...formData,
        accessSubscription: '0'
      })
    }
  };

  console.log("formData", formData);
  console.log("form role",formData.role);

  const getClinicData = () => {
    let clinicData = clinicData;
    clinicData = [];
    axios
      .get(`/clinic`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          clinicData.push({
            id: element.id,
            clinic: element.clinic_name,
            title: `${element.clinic_name}`,
          });
        });
        setClinicData(clinicData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleName = (value) => {
    setFormData({
      ...formData,
      name: value,
    });
  };

  const handleRole = (value) => {
    console.log("value id ",value.id);
    setFormData({
      ...formData,
      role: value.value,
    });
  }

  const handlePhNO = (value) => {
    setFormData({
      ...formData,
      phone_number: value,
    });
  }

  const handleEmail = (value) => {
    setFormData({
      ...formData,
      email: value,
    });
  }

  const handleGender = (value) => {
    setFormData({
      ...formData,
      gender: value.value,
    });
  }

  const handleUserQualificationChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      qualification : value
    });
  }

  const handleUserSpecificationChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      specification : value
    });
  }

  const handleUserLicenseNoChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      license_no : value
    });
  }

  const handleClinic = (value) => {
    setFormData({
      ...formData,
      clinic: value.id,
    });
  }

  const onSubmit = () => {
    let userId = route.params.userData.id;
    console.log(formData);
    axios
      .put(`/user/update/${userId}`, formData)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setSuccessMsg(true);
          // setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(true);
      });
  };

  const handlegoback = () => {
    setSuccessMsg(false);
    // navigation.navigate('Users');
    navigation.goBack();
  }

  const handleCancel = () => {
    setErrorMsg(false);
  }

  const onEdit = () => {
    setShow(false);
  }

  const onCancel = () => {
    setShow(true);
  }

  return (
    <View style={styles.stack}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{marginBottom: 20, marginHorizontal: 10}}>
            <View style={styles.element}>
              <Text style={styles.label}>Name:</Text>
              <TextInput 
                placeholder={'Enter your name'}
                style={styles.textInput}
                defaultValue={formData && formData.name}
                onChangeText={(value) => handleName(value)}
              />
            </View>
            <View style={styles.element}>
              <Text style={styles.label}>Gender:</Text>
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => handleGender(value)}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={false}
                enableSearch={true}
                labelField="label"
                valueField="value"
                // defaultValue={formData.gender}
                data={gender}
              />
            </View>

            <View style={styles.element}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput 
                placeholder={'Enter your phone number'}
                style={styles.textInput}
                defaultValue={formData && formData.phone_number}
                onChangeText={(value) => handlePhNO(value)}
              />
            </View>

            <View style={styles.element}>
              <Text style={styles.label}>Email:</Text>
              <TextInput 
                placeholder={'Enter your phone number'}
                style={styles.textInput}
                defaultValue={formData && formData.email}
                onChangeText={(value) => handleEmail(value)}
              />
            </View>
           
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: '#fff', 
              elevation: 2, 
              padding: 10,
              marginVertical: 20
            }}>
              
              <Text style={{
                //  marginBottom: 10,
                  fontWeight: "bold",
                  color: '#000'
              }}>Date of Birth :</Text>
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
                  // defaultValue={formData && formData.last_visit}
                  placeholderStyle={{ color: '#000' }}
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
                    setFormData({
                      ...formData,
                      dob: date
                    })
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

            <View style={styles.element}>
              <Text style={styles.label}>Role:</Text>
              
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => handleRole(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={false}
                enableSearch={true}
                labelField="label"
                valueField="value"
                // defaultValue={formData && formData.gender}
                data={roles}
              />
            </View>

            <View style={{
              backgroundColor: '#fff', 
              paddingHorizontal: 20, 
              paddingVertical: 16, 
              borderRadius: 50, 
              marginTop: 20,
              elevation: 1
            }}>
              {(
                formData && formData.role === "doctor" || 
                formData && formData.role === "Doctor" || 
                formData && formData.role === "admin_doctor" ||
                formData && formData.role === "Admin Doctor" 
              ) ?
                <>
                  <View style={{marginBottom: 20}}> 
                    <Text style={styles.label}>* Qualification:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ex: BVSC, MVSC"
                      defaultValue={formData && formData.qualification}
                      onChangeText={(value) => handleUserQualificationChange(value)}
                    ></TextInput>
                  </View> 

                  <View style={{marginBottom: 20}}> 
                    <Text style={styles.label}>* Specifications:</Text>
                    <TextInput
                      style={styles.textInput}
                      defaultValue={formData && formData.specification}
                      onChangeText={(value) => handleUserSpecificationChange(value)}
                      placeholder="Ex: General Physician, Surgeon, Orthopaedics"
                    ></TextInput>
                  </View>  

                  <View style={{marginBottom: 20}}>
                    <Text style={styles.label}>* License No:</Text>
                    <TextInput
                      style={styles.textInput}
                      defaultValue={formData && formData.license_no}
                      placeholder="Enter your License No"
                      onChangeText={(value) => handleUserLicenseNoChange(value)}
                    ></TextInput>
                  </View>  
                </>
                :<></>
                }
            </View>

            <View style={styles.element}>
              <Text style={styles.label}>Clinic:</Text>
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => handleClinic(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={false}
                enableSearch={true}
                labelField="clinic"
                valueField="id"
                defaultValue={formData && formData.clinic}
                data={clinicData}
            />
            
          </View>

          <View style={styles.actElement}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{
                fontWeight: 'bold', 
                color: '#006766', 
                fontSize: 15
                }}>Access to Billing & Subscription:</Text>
              <Switch
                trackColor={{ false: "#BFD9D9", true: "#006766" }}
                thumbColor={isBillingSwitchOn ? "#0E9C9B" : "#0E9C9B"}
                onValueChange={onToggleBillingSwitch}
                value={isBillingSwitchOn}
                defaultValue={formData && formData.accessSubscription === "1" ? !isBillingSwitchOn : isBillingSwitchOn }
              />
            </View>
          </View>

          <View style={styles.actElement}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{
                fontWeight: 'bold', 
                color: '#006766', 
                fontSize: 15
                }}
              ><Text style={{color: 'red'}}>*</Text>Active:</Text>
              <Switch
                trackColor={{ false: "#BFD9D9", true: "#006766" }}
                thumbColor={isSwitchOn ? "#0E9C9B" : "#0E9C9B"}
                onValueChange={onToggleSwitch}
                value={isSwitchOn}
                // defaultValue={!isSwitchOn}
              />
            </View>
          </View>
          
        </View>
      </ScrollView>

    

      <View>
        <>
        {successMsg ?
            <Portal>
              <Dialog visible={successMsg} onDismiss={handlegoback}>
                  <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                  <Dialog.Content>
                      <Paragraph>User Registered Successfully</Paragraph>
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
                      <Paragraph>Error while registering new User</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                      <Button onPress={handleCancel} title="Done"/>
                  </Dialog.Actions>
              </Dialog>
            </Portal>
            : <></>
          }
        </>
      </View>
          
      <TouchableOpacity
        onPress={onSubmit}
        style={styles.submit}
      >
        <Text style={{color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16}}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ShowUser

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#BFD9D950',
    borderRadius: 5,
    height: 50,
    padding: 10,
    // elevation: 2,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: '#bebebe70'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12,
    color: '#006766',
    // textTransform: 'uppercase',
  },
  dropdown: {
    backgroundColor: '#BFD9D980',
    padding: 8,
  },
  submit: {
    backgroundColor: '#006766',
    padding: 20,
    position: 'relative',
    bottom: 0
  },
  element: {
    marginVertical: 16,
  },
  actElement: {
    // marginHorizontal: 10,
    marginTop: 16,
    backgroundColor: '#BFD9D950',
    paddingHorizontal: 10,
    // elevation: 1,
    borderRadius: 10
  },
  stack: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});