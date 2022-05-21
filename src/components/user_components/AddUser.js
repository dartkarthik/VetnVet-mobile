import React, { useState ,useEffect, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Linking,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { Dialog, Portal, Paragraph, Divider } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import axios from 'react-native-axios';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddUser = ({route, navigation}) => {

  const scrollRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    gender: '',
    email: '',
    address: '',
    specification: '',
    qualification: '',
    license_no: '',
    dob: '',
    phone_number: '',
    clinic:'',
    branch: '',
    status: '',
    accessSubscription: "",
  });

  // const data = [
  //   { label: "Doctor", value: "1" },
  //   { label: "Admin Doctor", value: "2" },
  //   { label: "Assistant", value: "3" },
  // ];
  const data = [
    { label: "Doctor", value: "doctor",id:"1" },
    { label: "Admin Doctor", value: "admin_doctor",id:"2" },
    { label: "Assistant", value: "assistant",id:"3"},
  ];

  const data1 = [
    { label: "Male", value: "male",id:"1" },
    { label: "Female", value: "female",id:"2" },
    { label: "Others", value: "others",id:"3" },
  ];

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [comp, setComp] = useState(false);
  const [checked, setChecked] = useState(false);
  const [address, setAddress] = useState(false);
  const [address1, setAddress1] = useState(false);
  
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [date, setDate] = useState();
  const [isEnabled, setIsEnabled] = useState(false);

  const [branchData, setBranchData] = useState([]);
  const [clinicData, setClinicData] = useState([]);

  const [ requiredField, setRequiredField ] = useState(false);

  const userData = route.params.userDetails;
  console.log("userData",userData);

  useEffect(() => {
      getClinicData();
      getBranchData();
     
  }, []);

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

  const getBranchData = () => {
    let userClinicId = route.params.userDetails.clinic.id
    console.log(userClinicId);
    let branchData = branchData;
    branchData = [];
    axios
      .get(`clinic/branch/${userClinicId}`)
      .then((res) => {
        console.log(res.data);
        res.data.map((element, index) => {
          branchData.push({
            id: element.id,
            branch: element.branch,
            title: `${element.branch}`,
          });
        });
        setBranchData(branchData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [isSwitchOn, setIsSwitchOn] = useState(false);

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

  const [isBillingSwitchOn, setIsBillingSwitchOn] = useState(false);

  const onToggleBillingSwitch = () => {
    setIsBillingSwitchOn(!isBillingSwitchOn);
    // console.log("aaa",!isBillingSwitchOn);
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

  const onHandleRole = (item) => {
    setValue(item.value);
    console.log("a",item.value);
    if (item.id == "1") {
      setComp(true);
    } else if (item.id === "2") {
      setComp(true);
    } else {
      setComp(false);
    }
    value
    setFormData({
      ...formData,
      // role: item.label
      role: item.value,
    });
  };

  const handleGender = (item) => {
    setValue1(item.value);
    console.log("gender",item.value);
    setFormData({
      ...formData,
      gender: item.value
    });
  }

  const handleUserNameChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      name: value
    });
  }

  const handleUserEmailChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      email: value
    });
  }
  
  const handleUserAddressChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      address: value
    });
  }

  const handleUserSpecificationChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      specification : value
    });
  }

  const handleUserQualificationChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      qualification : value
    });
  }
 
  const handleUserLicenseNoChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      license_no : value
    });
  }

  const handleUserPhoneNumberChange = (value) => {
    // console.log("On Change",value);
    setFormData({
      ...formData,
      phone_number: value
    });
  }

  const handleClinic = (value) => {
    setFormData({
      ...formData,
      clinic: value.id,
    });
  };

  const handleBranch = (value) => {
    setFormData({
      ...formData,
      branch: value.id,
    });
  };

  const onSubmit = async () => {
    // console.log(formData);
    // if( formData.name == '' ) {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.role == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.gender == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.email == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.dob == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.phone_number == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.clinic == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.branch == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.status == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.specification == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else if (formData.license_no == '') {
    //   setRequiredField(true);
    //   scrollRef.current?.scrollTo({
    //     y: 0,
    //     animated: true,
    //   });
    // } else {
    // await axios
    //   .post(`/auth/register`, formData)
    //   .then((res) => {
    //     if (res.status == "200") {
    //       // navigation.navigate('petSubmitPage')
    //       console.log("User Registered Successfully");
    //       setSuccessMsg(true);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setErrorMsg(true);
    //   });
    // }  
    await axios
      .post(`/auth/register`, formData)
      .then((res) => {
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("User Registered Successfully");
          setSuccessMsg(true);
        }
      })
    .catch((err) => {
      console.log(err);
      setErrorMsg(true);
    });
  }

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  }

  const handleCancel = () => {
    setErrorMsg(false);
  }


  return (
    <>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View>
            {requiredField ? 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.required}>*</Text>
                <Text style={styles.text}>Name</Text>
              </View>
            : <>
              <Text style={styles.text}>Name :</Text>
              </>
            }   

            <TextInput
              style={styles.textInput}
              placeholder="Enter Name: "
              onChangeText={(value) => handleUserNameChange(value)}
            ></TextInput>
          </View>

          <Divider style={styles.divider}/>

          <View style={styles.row}>
            <View>
              {requiredField ? 

                <View style={{flexDirection: 'row'}}>
                      <Text style={styles.required}>*</Text>
                      <Text style={styles.text}>Role</Text>
                </View>
              : <>
                <Text style={styles.text}>Role :</Text>
              </>
              }   
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => onHandleRole(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={false}
                enableSearch={true}
                labelField="label"
                valueField="value"
                // defaultValue={formData && formData.visit_purpose}
                data={data}
              />
            </View>

            <View>
              {requiredField ? 

                <View style={{flexDirection: 'row'}}>
                      <Text style={styles.required}>*</Text>
                      <Text style={styles.text}>Gender</Text>
                </View>
              : <>
                <Text style={styles.text}>Gender :</Text>
              </>
              }   
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => handleGender(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={false}
                enableSearch={true}
                labelField="label"
                valueField="value"
                // defaultValue={formData && formData.visit_purpose}
                data={data1}
              />
            </View>
          </View>

          <Divider style={styles.divider}/>

          <View>
            {comp ? (
              <View style={styles.compElement}>
                {requiredField ? 
                      <View style={{flexDirection: 'row'}}>
                          <Text style={styles.required}>*</Text>
                          <Text style={styles.text}>Qualification</Text>
                      </View>
                  : <>
                      <Text style={styles.text}>Qualification :</Text>
                  </>
                }   
                <TextInput
                  style={styles.textInputComp}
                  placeholder="Ex: BVSC, MVSC"
                  onChangeText={(value) => handleUserQualificationChange(value)}
                ></TextInput>
                <Divider style={styles.divider}/>
                <Text style={styles.text}> Specifications:</Text>
                <TextInput
                  style={styles.textInputComp}
                  onChangeText={(value) => handleUserSpecificationChange(value)}
                  placeholder="Ex: General Physician, Surgeon, Orthopaedics"
                ></TextInput>
                <Divider style={styles.divider}/>
                {requiredField ? 

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.required}>*</Text>
                      <Text style={styles.text}>License No</Text>
                    </View>
                    : <>
                      <Text style={styles.text}>License No :</Text>
                    </>
                }   
                <TextInput
                  style={styles.textInputComp}
                  placeholder="Enter your License No"
                  onChangeText={(value) => handleUserLicenseNoChange(value)}

                ></TextInput>
              </View>
            ) : (
              <></>
            )}
          </View>

          {/* <Divider style={styles.divider}/> */}

          <View>
             {requiredField ? 

               <View style={{flexDirection: 'row'}}>
                   <Text style={styles.required}>*</Text>
                   <Text style={styles.text}>Email</Text>
               </View>
              : <>
                   <Text style={styles.text}>Email :</Text>
              </>
              }   
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => handleUserEmailChange(value)}
              placeholder="Enter a Email"
            />
          </View>

          <Divider style={styles.divider}/>

          <View>
            <Text style={styles.text}>Address: </Text>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={4}
              placeholder="Enter Address"
              onChangeText={(value) => handleUserAddressChange(value)}
            />
          </View>

          <Divider style={styles.divider}/>

          <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            elevation: 2, 
            padding: 10,
            marginVertical: 14
          }}>
            {requiredField ? 
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.required}>*</Text>
                <Text style={{
                  //  marginBottom: 10,
                    fontWeight: "bold",
                    color: '#000'
                }}>Date of Birth</Text>
              </View>
              : <>
                <Text style={{
                  //  marginBottom: 10,
                    fontWeight: "bold",
                    color: '#000'
                }}>Date of Birth :</Text>
              </>
            }   
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
                onDateChange={(value) => {
                  // console.log("value", value);
                  setDate(value);
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

          <Divider style={styles.divider}/>

          <View> 
            {requiredField ? 

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.required}>*</Text>
                  <Text style={styles.text}>Phone</Text>
                </View>
                : <>
                  <Text style={styles.text}>Phone :</Text>
                </>
            }   
              <TextInput
                style={styles.textInput}
                onChangeText={(value) => handleUserPhoneNumberChange(value)}
                keyboardType='number-pad'
                placeholder="Your phone number here .."
              />
          </View> 

          <Divider style={styles.divider}/>

          <View>
              <Text style={styles.text}>Clinic :</Text>
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => value && handleClinic(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                // autoFocusSearch={true}
                enableSearch={true}
                labelField="clinic"
                valueField="id"
                // defaultValue={formData && formData.visit_purpose}
                data={clinicData}
              />
          </View>

          <Divider style={styles.divider}/>

          <View>
            <Text style={styles.text}>Branches :</Text>
            <CheckBox
              title="Check all"
              checked={checked}
              checkedColor="#006766"
              onPress={() => {
                setChecked(!checked),
                  setAddress(!checked),
                  setAddress1(!checked)
                  // setAddress2(!checked);
              }}
            />
            <CheckBox
              title="Test"
              checked={address}
              checkedColor="#006766"
              onPress={() => {
                setAddress(!address);
              }}
            />
            <CheckBox
              title="Chennai"
              checked={address1}
              checkedColor="#006766"
              onPress={() => {
                setAddress1(!address1);
              }}
            />
          </View>

          <Divider style={styles.divider}/>

          <View>
            {requiredField ? 

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.required}>*</Text>
                  <Text style={styles.text}>Branch</Text>
                </View>
                : <>
                  <Text style={styles.text}>Branch :</Text>
                </>
            }
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => value && handleBranch(value)}
                // buttonLabel={"Add new visit purpose"}
                isButton={false}
                dropdownType={"single"}
                // autoFocusSearch={true}
                enableSearch={true}
                labelField="branch"
                valueField="id"
                defaultValue={userData.branch.id}
                data={branchData}
              />
          </View>

          <Divider style={styles.divider}/>

          <View style={styles.element}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{
                fontWeight: 'bold', 
                color: '#006766', 
                fontSize: 15
                }}>Access to Billing & Subscription :</Text>
              <Switch
                trackColor={{ false: "#BFD9D9", true: "#006766" }}
                thumbColor={isBillingSwitchOn ? "#0E9C9B" : "#0E9C9B"}
                onValueChange={onToggleBillingSwitch}
                value={isBillingSwitchOn}
                // defaultValue={formData && formData.status}
                defaultValue={!isBillingSwitchOn}
              />
            </View>
          </View>

          <Divider style={styles.divider}/>
          
          <View style={styles.element}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              
              {requiredField ? 

                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.required}>*</Text>
                    <Text style={{fontWeight: "bold", color: '#006766'}}>Active</Text>
                  </View>
                  : <>
                      <Text style={{fontWeight: "bold", color: '#006766'}}>* Active</Text>
                    </>
              }
              <Switch
                trackColor={{ false: "#BFD9D9", true: "#006766" }}
                thumbColor={isSwitchOn ? "#0E9C9B" : "#0E9C9B"}
                onValueChange={onToggleSwitch}
                value={isSwitchOn}
                defaultValue={!isSwitchOn}
              />
            </View>
          </View>

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
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          style={{ backgroundColor: '#006766', padding: 20, marginTop: 20 }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    // marginVertical: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 20
  },
  text: {
    marginBottom: 10,
    fontWeight: "bold",
    color: '#006766'
  },
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
  textInputComp: {
    backgroundColor: '#BFD9D950',
    borderRadius: 5,
    height: 50,
    padding: 10,
    // elevation: 2,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: '#bebebe70',
  },
  textArea: {
    // marginVertical: 5,
    backgroundColor: '#BFD9D950',
    borderRadius: 5,
    height: 80,
    padding: 10,
    // elevation: 2,
    borderWidth: 0.7,
    borderColor: '#bebebe70',
  },
  dropdown: {
    width: 150,
    height: 35,
    padding: 10,
    backgroundColor: "#BFD9D9",
  },
  dropdown1: {
    marginHorizontal: 8,
    height: 60,
    backgroundColor: "#BFD9D9",
    borderRadius: 5,
    elevation: 2,
    paddingHorizontal:10,
  },
  dob: {
    width: 115,
    height: 35,
    padding: 10,
    borderWidth: 1,
    borderColor: "#006766",
  },
  placement: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  switch: {
    marginVertical: 5,
  },
  datePicker: {
    width: "100%",
    alignItems: "center",
  },
  element: {
    backgroundColor: '#BFD9D950',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  compElement: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 50,
    // elevation: 2,
    marginBottom: 20
  },
  required: {
    color: 'red',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 14
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    marginVertical: 10,
    marginHorizontal: 70,
    backgroundColor: 'transparent',
    height: 0.4,
  },
});

export default AddUser;