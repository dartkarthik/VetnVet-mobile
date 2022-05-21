import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "react-native-axios";
import { useIsFocused } from "@react-navigation/core";
import { Button } from "react-native-elements";
import { Switch, Dialog, Portal, Paragraph } from "react-native-paper";
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditPet = ({route, navigation}) => {

    const scrollRef = useRef();

    const [formData, setFormData] = useState({
        pet_name: "",
        pet_owner_id: "",
        branch_id: "",
        pet_type_id: "",
        breed_id: "",
        pet_age: "",
        pet_color: "",
        weight: "",
        height: "",
        status: true,
        dead_date: "",
        comment: "",
        special_note: "",
        is_dead: '0',
        dead_date: '',
        clinic: route.params.userDetails.clinic.id,
    });

    let splitText2 = route.params.petDetails.pet_name;
    splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

    let splitText1 = route.params.petDetails.pet_owner_id.pet_owner_name;
    splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

    navigation.setOptions({ title: `${splitText2} / ${splitText1}` });

    const [ requiredField, setRequiredField ] = useState(false);

    const [petOwnersData, setPetOwnersData] = useState([]);
    const [petTypeData, setPetTypeData] = useState([]);
    const [breedData, setBreedData] = useState([]);
    const [petColorData, setPetColorData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [selectedBranchItem, setSelectedBranchItem] = useState(null);

    const [weightUnit, setWeightUnit] = useState("");
    const [heightUnit, setHeightUnit] = useState("");

    const [isActive, setIsActive] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [date, setDate] = useState('');

    const data = route.params.petDetails

    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    
    const isFocused = useIsFocused();

    useEffect(() => {
        setFormData({
            ...formData,
            pet_name: data.pet_name,
            pet_owner_id: data.pet_owner_id.id,
            branch_id: data.branch_id,
            pet_type_id: data.pet_type_id.id,
            breed_id: data.breed_id.id,
            pet_age: data.pet_age,
            pet_color: data.pet_color,
            weight: data.weight,
            height: data.height,
            status: data.status,
            dead_date: data.dead_date,
            comment: data.comment,
            special_note: data.special_note,
            dead_date: data.dead_date,
            is_dead: data.is_dead,
        })
        if (isFocused) {
        getPetOwnersData();
        getPetTypeData();
        getBreedData();
        getPetColorData();
        getBranchData();
      }
    }, [isFocused])

    console.log("dnhsiuhdishd", formData);

    // pet Owner
    const getPetOwnersData = () => {
        let petOwnersData = petOwnersData;
        petOwnersData = [];
        let userClinicId = route.params.userDetails.clinic.id
        // console.log(userClinicId);
        axios
          .get(`petOwner/clinic/${userClinicId}`)
          .then((res) => {
            console.log("petowner",res.data);
            res.data.map((element, index) => {
              petOwnersData.push({
                id: element.id,
                pet_owner_name:element.pet_owner_name,
                label:element.pet_owner_name,
                title: `${element.pet_owner_name} (${element.contact_number})`,
                
              });
            });
            setPetOwnersData(petOwnersData);
            // console.log(petOwnersData);
        })
        .catch((err) => {
        console.log(err);
        });
    };

    const getPetTypeData = () => {
        let petTypeData = petTypeData;
        petTypeData = [];
        let userClinicId = route.params.userDetails.clinic.id
        axios
          .get(`animal/clinic/${userClinicId}`)
          .then((res) => {
            // console.log(res.data);
            res.data.map((element, index) => {
              petTypeData.push({
                id: element.id,
                // animal_type: element.animal_type,
                animal_type: element.edited_name ? element.edited_name : element.actual_name,
                label: element.edited_name ? element.edited_name : element.actual_name,
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
        let breedData = breedData;
        breedData = [];
        let userClinicId = route.params.userDetails.clinic.id
        axios
          .get(`breed/clinic/${userClinicId}`)
          .then((res) => {
            // console.log(res.data);
            res.data.map((element, index) => {
              breedData.push({
                id: element.id,
                // breed: element.breed,
                breed: element.edited_name ? element.edited_name : element.actual_name,
                label: element.edited_name ? element.edited_name : element.actual_name,
                // title: `${element.breed}`,
              });
            });
            setBreedData(breedData);
        // console.log(petOwnersData);
        })
        .catch((err) => {
        console.log(err);
        });
    };

    const getPetColorData = () => {
        let petColorData = petColorData;
        petColorData = [];
        let userClinicId = route.params.userDetails.clinic.id
        axios
          .get(`color/clinic/${userClinicId}`)
          .then((res) => {
            console.log("colordata",res.data);
            res.data.map((element, index) => {
              petColorData.push({
                id: element.id,
                // pet_color: element.pet_color,
                pet_color: element.edited_name ? element.edited_name : element.actual_name,
                label: element.edited_name ? element.edited_name : element.actual_name,
                // title: `${element.pet_color}`,
              });
            });
            setPetColorData(petColorData);
            // console.log(petOwnersData);
          })
          .catch((err) => {
            console.log(err);
          });
      };
    
    const getBranchData = () => {
    
        let userClinicId = route. params.userDetails.clinic.id
        console.log(userClinicId);
        let branchData = branchData;
        branchData = [];
        axios.get(`/clinic/branch/${userClinicId}`)
        .then((res) => {
            console.log("branch", res.data);
            res.data.map((element, index) => {
                branchData.push({
                id: element.id,
                branch: element.branch,
                title: `${element.branch}`,
                });
            });
            setBranchData(res.data);
            // console.log(petOwnersData);
        })
        .catch((err) => {
        console.log(err);
        });
    };

    const handlePetNameChange = (value) => {
        setFormData({
          ...formData,
          pet_name: value,
        });
    };
    
    const handlePetOwnerChange = (value) => {
        console.log("On Change", value);
        setFormData({
          ...formData,
          pet_owner_id: value.id,
        });
    };
    const handleAddNewPetOwner = () => {
        // console.log("handleAddNewPetOwner");
        navigation.navigate('AddPetOwner');
    }

    // animal type
    const handlePetTypeChange = (value) => {
        setFormData({
          ...formData,
          pet_type_id: value.id,
        });
    };
    const handleAddNewAnimalType = () => {
        // console.log("handleAddNewAnimalType");
        navigation.navigate('AddAnimal');
    }

    // breed
    const handleBreedChange = (value) => {
        setFormData({
          ...formData,
          breed_id: value.id,
        });
    };
    const handleAddNewBreed = () => {
        // console.log("handleAddNewBreed");
        navigation.navigate('AddBreed');
    }

    // color
    const handlePetColorChange = (value) => {
        setFormData({
          ...formData,
          pet_color: value.id,
        });
    };
    const handleAddNewColor = () => {
        // console.log("handleAddNewColor");
        navigation.navigate('AddColor');
    }

    // dob

    // const handleBirthDateChange = (value) => {
    //     console.log(value);
    //     setFormData({
    //       ...formData,
    //       pet_age: value,
    //     });
    // };

    // weight
    const handleWeightChange = (value) => {
        setWeightUnit(value.value);
    }
    const handlePetWeightChange = (value) => {
        setFormData({
          ...formData,
          weight: value,
        });
    };

    // special note
    const handleSpecialNoteChange = (value) => {
        setFormData({
          ...formData,
          special_note: value,
        });
    };

    // active switch
    const onToggleActive = (value) => {
        setIsActive(value);
        if( value === true ) {
            setFormData({
                ...formData,
                status: '1'
            })
        } else {
            setFormData({
                ...formData,
                status: '0'
            })
        }
    };

    // dead switch
    const onToggleDead = (value) => {
        setIsDead(value);
        if( value === true ) {
            setFormData({
                ...formData,
                is_dead: '1'
            })
        } else {
            setFormData({
                ...formData,
                is_dead: '0'
            })
        }
        
    };

    // dead date
    // const handleDeathDateChange = (value) => {
    //     setFormData({
    //       ...formData,
    //       dead_date: value,
    //     });
    // };

    // comments
    const handleCommentChange = (value) => {
        setFormData({
          ...formData,
          comment: value,
        });
    };

    // branch
    const handleRegisteringBranchChange = (value) => {
        setFormData({
          ...formData,
          branch_id: value.id,
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

    const handleSubmit = () => {
        // let data = formData;
        formData.weight = formData.weight + " " + weightUnit;
        formData.height = formData.height + " " + heightUnit;
        console.log(formData);
        let pet_id = route.params.petDetails.id
        if( formData.pet_name == '' ) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
            setRequiredField(true);
        } else if (formData.pet_owner_id == '') {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
            setRequiredField(true);
        } else if (formData.pet_type_id == '') {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
            setRequiredField(true);
        } else if (formData.breed_id == '') {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
            setRequiredField(true);
        } else {
            axios
            .put(`/pet/update/${pet_id}`, formData)
            .then((res) => {
                // console.log("Registered Data", res.data);
                if (res.status == "200") {
                //   navigation.navigate("petSubmitPage", {registeredPetData: res.data});
                console.log("Successfully Updated Data", res.data);
                setSuccessMsg(true);
                }
            })
            .catch((err) => {
                console.log(err);
                setErrorMsg(true);
            });
        }
    }

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
        >
            <View style={styles.container}>
                <View style={styles.formItem}>
                    {requiredField ? 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.formLabel}>Pet Name:</Text>
                            <Text style={styles.required}>* Required</Text>
                        </View>
                    : <>
                        <Text style={styles.formLabel}>Pet Name:</Text>
                    </>}
                    <TextInput
                        placeholder="e.g. Jimmy"
                        style={styles.formTextInput}
                        // defaultValue={}
                        defaultValue={formData && formData.pet_name}
                        onChangeText={(value) => handlePetNameChange(value)}
                    ></TextInput>
                </View>
                <View style={styles.formItem}>
                    {requiredField ? 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.formLabel}>Pet Owner:</Text>
                            <Text style={styles.required}>* Required</Text>
                        </View>
                    : <>
                        <>
                            <Text style={styles.formLabel}>Pet Owner:</Text>
                        </>
                    </>}

                    {/* Custom Dropdown */}
                    <CustomDropdown
                        handleAddEvent={handleAddNewPetOwner}
                        onChange={handlePetOwnerChange}
                        buttonLabel={"Add New Pet Owner"}
                        // defaultValue={5}
                        defaultValue={formData && formData.pet_owner_id}
                        data={petOwnersData}
                    />
                </View>

                <View style={styles.formItem}>
                    {requiredField ? 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.formLabel}>Animal Type:</Text>
                            <Text style={styles.required}>* Required</Text>
                        </View>
                    : <>
                        <Text style={styles.formLabel}>Animal Type:</Text>
                    </>}

                    {/* Custom Dropdown */}
                    <CustomDropdown
                        handleAddEvent={handleAddNewAnimalType}
                        onChange={handlePetTypeChange}
                        buttonLabel={"Add New Animal Type"}
                        defaultValue={formData && formData.pet_type_id}
                        data={petTypeData}
                    />

                </View>
                <View style={styles.formItem}>
                    {requiredField ? 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.formLabel}>Breed:</Text>
                            <Text style={styles.required}>* Required</Text>
                        </View>
                    : <>
                        <Text style={styles.formLabel}>Breed:</Text>
                    </>}
                    
                    {/* Custom Dropdown */}
                    <CustomDropdown
                        handleAddEvent={handleAddNewBreed}
                        onChange={handleBreedChange}
                        buttonLabel={"Add New Breed"}
                        defaultValue={formData && formData.breed_id}
                        data={breedData}
                    />
                </View>

                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Color/Coat:</Text>

                    {/* Custom Dropdown */}
                    <CustomDropdown
                        handleAddEvent={handleAddNewColor}
                        onChange={handlePetColorChange}
                        buttonLabel={"Add New Color"}
                        defaultValue={formData && formData.pet_color}
                        data={petColorData}
                    />
                </View>

                <View style={{
                    marginVertical: 14,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 10,
                    elevation: 2
                }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 15,
                    }}>Date Of Birth:</Text>
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
                            onDateChange={(value) => {
                                // console.log("value", value);
                                setFormData({
                                    ...formData,
                                    pet_age: value
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

                <View style={styles.formItem}>
                    <View
                        style={{
                        justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text style={styles.formLabel}>Weight:</Text>
                        </View>

                        <View style={styles.formInsideWeight}>
                            <TextInput
                                placeholder="weight"
                                style={{
                                    backgroundColor: "#fff",
                                    padding: 10,
                                    borderRadius: 20,
                                    elevation: 2,
                                    borderWidth: 1,
                                    borderColor: '#BFD9D9',
                                    width: 100,
                                }}
                                keyboardType="number-pad"
                                onChangeText={(value) => handlePetWeightChange(value)}
                                ></TextInput>
                            <Dropdown
                                placeholder="kg / g"
                                placeholderStyle={{color: '#00000070'}}
                                style={styles.miniDropdown}
                                value={{ id: "2" }}
                                data={[
                                    { id: "1", title: "kg (KiloGram)", value: "kg" },
                                    { id: "2", title: "g (Grams)", value: "g" },
                                ]}
                                labelField="title"
                                valueField="value"
                                maxHeight={110}
                                onChange={(value) => handleWeightChange(value)}
                                selectedTextStyle={{color: '#424651', fontSize: 14}}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Special Note:</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Diagnosis Notes here ..."
                        placeholderTextColor="grey"
                        numberOfLines={7}
                        multiline={true}
                        defaultValue={formData && formData.special_note}
                        onChangeText={(value) => handleSpecialNoteChange(value)}
                    />
                </View>

                <View style={styles.formItem}>
                    <View style={styles.formInsideSwitchHead}>
                        <View style={styles.formInsideSwitch}>
                            <Text style={styles.formLabel}>Active:</Text>
                            <Switch 
                                value={isActive} 
                                onValueChange={onToggleActive} 
                            />
                        </View>

                        <View style={styles.formInsideSwitch}>
                            <Text style={styles.formLabel}>Is Dead:</Text>
                            <Switch value={isDead} onValueChange={onToggleDead} />
                        </View>
                    </View>
                        {isDead ? (
                            <View style={{
                                marginVertical: 14,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                padding: 10,
                                borderRadius: 10,
                                elevation: 2
                            }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 15,
                                }}>Dead Date:</Text>
                                <View style={styles.datePicker}>
                                    <MaterialCommunityIcons
                                        name="calendar-edit"
                                        color={'#006766'}
                                        size={35}
                                    />
                                    <DatePicker
                                        style={styles.datePickerStyle}
                                        date={formData && formData.dead_date} // Initial date from state
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
                                                dead_date: value
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
                        ) : (
                        <></>
                    )}
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Comment:</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Diagnosis Notes here ..."
                        placeholderTextColor="grey"
                        numberOfLines={7}
                        multiline={true}
                        defaultValue={formData && formData.comment}
                        onChangeText={(value) => handleCommentChange(value)}
                    />
                </View>

                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Registering Branch:</Text>

                    <Dropdown
                        placeholder="select a branch"
                        placeholderStyle={{color: '#00000070'}}
                        data={branchData}
                        maxHeight={130}
                        style={styles.megaDropdown}
                        labelField="branch"
                        valueField="id"
                        value={formData && formData.branch_id}
                        // onSelectItem={(value) => {
                        //     value && handleRegisteringBranchChange(value);
                        // }}
                        onChange={(value) => {
                            setSelectedBranchItem && handleRegisteringBranchChange(value);
                        }}
                        selectedTextStyle={{color: '#424651'}}
                        
                    />
                </View>
            </View>
            <View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    // onPress={() => navigation.navigate('SubmitNewVisitForm')}
                >
                    <Text
                    style={{
                        backgroundColor: "#006766",
                        alignItems: "center",
                        width: "100%",
                        color: "#fff",
                        textAlign: "center",
                        paddingVertical: 20,
                    }}
                    >
                    Submit
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <>
                {successMsg ?
                    <Portal>
                    <Dialog visible={successMsg} onDismiss={handlegoback}>
                        <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Pet Updated Successfully</Paragraph>
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
                            <Paragraph>Error while Updating Pets</Paragraph>
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
        </ScrollView>
    );
};

export default EditPet;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10
    },
    formTextInput: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9',
    },
    formLabel: {
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 15,
    },
    required: {
        color: 'red',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    formInsideHeadDate: {
        marginHorizontal: 10,
    },
    pickedDate: {
        backgroundColor: "#fff",
        padding: 14,
        textAlign: "center",
        borderRadius: 10,
    },
    formTextInput: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9'
    },
    formInsideWeight: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    miniDropdown: {
        marginRight: 16,
        marginVertical: 7,
        height: 35,
        width:140,
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9'
    },
    formInsideSwitchHead: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    pickedDeadDate: {
        backgroundColor: "#fff",
        padding: 14,
        textAlign: "center",
        borderRadius: 10,
    },
    megaDropdown: {
        marginRight: 16,
        marginVertical: 7,
        height: 35,
        width: "100%",
        padding: 20,
        backgroundColor: '#BFD9D9',
        borderRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9'
    },
    formItem: {
        marginVertical: 14,
        // marginHorizontal: 10,
    },
    textArea: {
        backgroundColor: "#fff",
        borderRadius: 15,
        height: 100,
        padding: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BFD9D9'
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    // datePickerStyle: {
    //     // width: '100%'
    // }
});