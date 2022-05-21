import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView , TouchableOpacity,} from 'react-native';
import { TextInput, Dialog, Portal, Paragraph } from "react-native-paper";
import { Button } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import axios from "react-native-axios";
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PetDetails = ({route, navigation}) => {

    const params = route.params;
    // console.log("params", params);
    const [formData, setFormData] = useState({
        pet_name : '',
        pet_type_id : '',
        breed_id : '',
        pet_color : '',
        pet_age : '',
        weight : '',
        height : '',
        pet_owner_id: '',
    });


    const [breedData, setBreedData] = useState([]);
    const [petTypeData, setPetTypeData] = useState([]);
    const [petColorData, setPetColorData] = useState([]);
    const [petOwnerData, setPetOwnerData] = useState([]);

    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const [show, setShow] = useState(true);

    useEffect(() => {
      setFormData({
          ...formData,
          pet_name : params.pet_name,
          pet_type_id : params.pet_type_id.id,
          breed_id : params.breed_id.id,
          pet_color : params.pet_color,
          pet_age : params.pet_age,
          weight : params.weight,
          height : params.height,
          pet_owner_id: params.pet_owner_id.id
      });
      getPetTypeData();
      getBreedData();
      getPetColorData();
      getOwnerData();
    }, [])
    
    const getPetTypeData = () => {
      let userClinicId = route.params.userDetails.clinic.id
      let petTypeData = petTypeData;
      petTypeData = [];
      axios
        .get(`animal/clinic/${userClinicId}`)
        .then((res) => {
          console.log("petTypeData",res.data);
          res.data.map((element, index) => {
            petTypeData.push({
              id: element.id,
              animal_type: element.edited_name ? element.edited_name : element.actual_name,
              // title: `${element.animal_type}`,
            });
            
          });
          setPetTypeData(petTypeData);
          // console.log(petOwnersData);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getBreedData = () => {
      let userClinicId = route.params.userDetails.clinic.id
      // console.log(userClinicId);
      let breedData = breedData;
      breedData = [];
      axios.get(`breed/clinic/${userClinicId}`).then((res) => {
        console.log('breedData',res.data);
        res.data.map((element, index) => {
          breedData.push({
            id: element.id,
            breed: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.breed}`,
          });
          
        });
        setBreedData(breedData);
        // console.log(breedData);
      })
      .catch((err) => {
        console.log(err);
      });
    };
    
    const getPetColorData = () => {
      let userClinicId = route.params.userDetails.clinic.id
      let petColorData = petColorData;
      petColorData = [];
      axios
        .get(`color/clinic/${userClinicId}`)
        .then((res) => {
          // console.log(res.data);
          res.data.map((element, index) => {
            petColorData.push({
              id: element.id,
              // color: element.color,
              color: element.edited_name ? element.edited_name : element.actual_name,
              title: `${element.color}`,
            });
          });
          setPetColorData(petColorData);
          // console.log(petColorData);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getOwnerData = async() => {
      let userClinicId = route.params.userDetails.clinic.id;
      let petOwnerData = petOwnerData;
      petOwnerData = [];
      await axios.get(`petOwner/clinic/${userClinicId}`)
      .then(res => {
        console.log("petOwnerData",res.data);
        res.data.map((element, index) => {
          petOwnerData.push({
            id: element.id,
            pet_owner_name: element.pet_owner_name,
          });
          
        });
        setPetOwnerData(petOwnerData);
        // console.log(petOwnersData);
          }
      ).catch(
          err => {
              console.log(err)
          }
      )
    }

    const handlePetName = (value) => {
        setFormData({
          ...formData,
          pet_name: value,
        }); 
    };
    
    const handlePetType = (value) => {
        setFormData({
          ...formData,
          pet_type_id: value.id,
        }); 
    };

    const handleBreed = (value) => {
        setFormData({
          ...formData,
          breed_id: value.id,
        }); 
    };

    
    const handleColor = (value) => {
        setFormData({
          ...formData,
          pet_color: value.id,
        }); 
    };

    
    const handleDob = (value) => {
        setFormData({
          ...formData,
          pet_age: value,
         
        }); 
    };

    
    const handleWeight = (value) => {
        setFormData({
          ...formData,
          weight: value,
        }); 
    };

    
    const handleHeight = (value) => {
        setFormData({
          ...formData,
          height: value,
        }); 
    };

    
    const handleOwnerName = (value) => {
        setFormData({
          ...formData,
           pet_owner_id:value.id,
        }); 
    };

    // const handleEmail = (value) => {
    //     setFormData({
    //       ...formData,
        
    // };

    
    // const handlePhone = (value) => {
    //     setFormData({
    //       ...formData,
       
    //     }); 
    // };

    const onSubmit = () => {
        
      console.log(formData);
      let petId = route.params.id;
      console.log("paramsss", petId);
      axios
        .put(`pet/update/${petId}`, formData)
        .then((res) => {
          // console.log(res.data);
          if (res.status === 200) {
            // console.log(res.data);
              //  navigation.navigate('');
              setSuccessMsg(true);
          }
        })
        .catch((err) => {
          console.log(err);
          
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

    return (
        <>
            <ScrollView>
                <View style={styles.display}>  

                        <View style={{ marginHorizontal: 10, alignItems: 'flex-end' }}>
                            {show ? (
                            <Button
                                title="Edit"
                                buttonStyle={styles.editBtn}
                                onPress={() => setShow(false)}
                                titleStyle={{ color: '#fff' }}
                            ></Button>
                            ) : (
                            <Button
                                title="Cancel"
                                buttonStyle={styles.cancelBtn}
                                // onPress={() => setShow(true)}
                                onPress={() => setShow(true)}
                            ></Button>
                            )}
                        </View>

                        <View>
                            <Text style={{fontSize:18,margin:20}}>Pet Profile</Text>    
                        </View>
                     
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Name :</Text>
                            {show ? (
                            <Text style={styles.text}>{params.pet_name}</Text>
                            ) : (
                            <TextInput
                                style={styles.textbox}
                                defaultValue={params.pet_name}
                                onChangeText={(value) => {
                                    handlePetName(value);
                                }}
                            />
                            )}
                        </View>
                              
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Associated Animal :</Text>
                            {show ? (
                            <Text style={styles.text}>{params.pet_type_id.animal_type}</Text>
                            ) : (
                            <Dropdown
                              // defaultValue={params.pet_type_id.animal_type}
                              value={formData && formData.pet_type_id}
                              style={styles.dropdown}
                              search
                              searchPlaceholder="Search..."
                              placeholder='Select Animal Type'
                              placeholderStyle={{color: '#00000070', fontSize: 12}}
                              data={petTypeData}
                              labelField="animal_type"
                              valueField="id"
                              onChange={(value) => {
                                value && handlePetType(value);
                              }}
                              selectedTextStyle={{color: '#000', textTransform: 'capitalize'}}
                            />
                            )}
                        </View>

                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Breed :</Text>
                            {show ? (
                            <Text style={styles.text}>{params.breed_id.breed}</Text>
                            ) : (
                              <Dropdown
                                value={formData && formData.breed_id}
                                style={styles.dropdown}
                                search
                                searchPlaceholder="Search..."
                                placeholder='Select Breed'
                                placeholderStyle={{color: '#00000070', fontSize: 12}}
                                data={breedData}
                                maxHeight={300}
                                labelField='breed'
                                valueField='id'
                                onChange={(value) => {
                                  value && handleBreed(value);
                                }}
                                selectedTextStyle={{color: '#000', textTransform: 'capitalize'}}
                              />
                            )}
                        </View>
                        
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Color/Coat :</Text>
                            {show ? (
                              <Text style={styles.text}>{params.pet_color}</Text>
                              ) : (
                              <Dropdown
                                style={styles.dropdown}
                                placeholder='Select Color'
                                search
                                searchPlaceholder="Search..."
                                data={petColorData}
                                maxHeight={300}
                                labelField='color'
                                placeholderStyle={{color: '#00000070', fontSize: 12}}
                                valueField='id'
                                value={formData && formData.pet_color}
                                onChange={(value) => {
                                  value && handleColor(value);
                                }}
                                selectedTextStyle={{color: '#000', textTransform: 'capitalize'}}
                              />
                            )}
                        </View>
                       
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Date of Birth:</Text>
                            {show ? (
                            <Text style={styles.text}>{params.pet_age}</Text>
                            ) : (
                              <View style={styles.datePicker}>
                                <MaterialCommunityIcons
                                    name="calendar-edit"
                                    color={'#006766'}
                                    size={35}
                                />
                                <DatePicker
                                    style={styles.datePickerStyle}
                                    date={formData && formData.pet_age} // Initial date from state
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
                                    onDateChange={(value) => handleDob(value)}
                                    dropDownContainerStyle={{
                                        borderWidth: 1,
                                        borderColor: '#eeee',

                                    }}
                                    searchContainerStyle={{
                                        borderBottomColor: "#eeee"
                                    }}
                                />
                              </View>
                            )}
                        </View>
                       
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Weight:</Text>
                            {show ? (
                            <Text style={styles.text}>{params.weight}</Text>
                            ) : (
                            <TextInput
                            style={styles.textbox}
                            defaultValue={params.weight}
                            onChangeText={(value) => {
                            handleWeight(value);
                            }}
                            />
                            )}
                        </View>
                       
                        <View style={styles.parallel}>
                            <Text style={styles.heading}>Height:</Text>
                            {show ? (
                            <Text style={styles.text}>{params.height}</Text>
                            ) : (
                            <TextInput
                            style={styles.textbox}
                            defaultValue={params.height}
                            onChangeText={(value) => {
                            handleHeight(value);
                            }}
                            />
                            )}
                        </View>
                       
                </View>

                <View> 
                    <View> 
                        <Text style={{fontSize:18,margin:20}}>Owner Profile</Text>    
                    </View> 

                    <View style={styles.parallel}>
                        <Text style={styles.heading}>Owner Name :</Text>
                        {show ? (
                        <Text style={styles.text}>{params.pet_owner_id.pet_owner_name}</Text>
                        ) : (
                        <Dropdown
                          search
                          searchPlaceholder="Search..."
                          placeholder='Select OwnerName'
                          style={styles.dropdown}
                          data={petOwnerData}
                          labelField="pet_owner_name"
                          valueField="id"
                          placeholderStyle={{color: '#00000070', fontSize: 12}}
                          // value={params.pet_owner_id.pet_owner_name}
                          // defaultValue={params.pet_owner_id.pet_owner_name}
                          value={formData && formData.pet_owner_id}
                          onChange={(value) => {
                            value && handleOwnerName(value);
                          }}
                          selectedTextStyle={{color: '#000', textTransform: 'capitalize'}}
                        />
                        )}
                    </View>
                    
                    <View style={styles.parallel}>
                        <Text style={styles.heading}>Email :</Text>
                        {show ? (
                        <Text style={styles.text}>{params.pet_owner_id.email}</Text>
                        ) : (
                        <TextInput
                        style={styles.textbox}
                        defaultValue={params.pet_owner_id.email}
                        // onChangeText={(value) => {
                        //   handleEmail(value);
                        // }}
                        />
                        )}
                    </View>
                    
                    <View style={styles.parallel}>
                        <Text style={styles.heading}>Phone :</Text>
                        {show ? (
                        <Text style={styles.text}>{params.pet_owner_id.contact_number}</Text>
                        ) : (
                        <TextInput
                          style={styles.textbox}
                          defaultValue={params.pet_owner_id.contact_number}
                          // onChangeText={(value) => {
                          //    handlePhone(value);
                          // }}
                        />
                        )}
                    </View>
                </View>

                <View style={styles.row}>
                    {show ? (
                    <Button
                        title="Done"
                        buttonStyle={styles.btn}
                        // onPress={onSubmit}
                        // onPress={onDone}
                    ></Button>
                    ) : (
                    <Button
                        title="Submit"
                        buttonStyle={styles.btn}
                        // onPress={() => setShow(true)}
                        onPress={onSubmit}
                    ></Button>
                    )}

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
        </>
    )
}

export default PetDetails

const styles = StyleSheet.create({
  formItem: {
      marginHorizontal: 10,
      marginVertical: 14
  },
  datePickerStyle: {
      width: '80%'
  },
  parallel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 15,
    elevation: 3,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 5,
  },
  heading: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    color: "#000",
    fontSize: 14,
  },
  display: {
    marginVertical: 20,
  },
  editBtn: {
    width: 80,
    backgroundColor: '#0E9C9B',
    borderRadius: 20,
  },
  cancelBtn: {
    width: 80,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  textbox: {
    height: 35,
    width: 180,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 1
  },
  btn: {
    width: '100%',
    backgroundColor: "#006766",
    // marginHorizontal: 10,
    paddingVertical: 20,
  },
  dropdown: {
    height: 35,
    padding: 10,
    width: '50%',
    backgroundColor: '#fff',
    elevation: 1
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  datePickerStyle: {
    width: 120
  },
})