import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import axios from "react-native-axios";
import { useIsFocused } from "@react-navigation/core";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const AddAnimal = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    animal_type: "",
    default_breed: null,
    default_color: null
  });

  // const [visible, setSuccessMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [warningMsg, setWarningMsg] = useState(false);

  const isFocused = useIsFocused();

  // const [breedData, setBreedData]

  // const [isAdd, setIsAdd] = useState(false);
  const [breedData, setBreedData] = useState([]);
  const [ColorData, setColorData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getBreedData();
      getColorData();
    }
  }, [isFocused]);

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
            breed: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name
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

  const getColorData = () => {
    let ColorData = ColorData;
    ColorData = [];
    let userClinicId = route.params.userDetails.clinic.id
    axios
      .get(`color/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          ColorData.push({
            id: element.id,
            // color: element.color,
            color: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.color}`,
          });
        });
        setColorData(ColorData);
        //console.log(petColorData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAnimalNameChange = (value) => {
    setFormData({
      ...formData,
      animal_type: value,
    });
  };

  // const handleBreedChange = (value) => {
  //   setFormData({
  //     ...formData,
  //     default_breed: value,
  //   });
  // };

  const handleBreedChange = (value) => {
    setFormData({
      ...formData,
      default_breed: value.id,
    });
  };

  // const handlePetColorChange = (value) => {
  //   setFormData({
  //     ...formData,
  //     default_color: value.id,
  //   });
  // };

  const handlePetColorChange = (value) => {
    setFormData({
      ...formData,
      default_color: value.id,
    });
  };

  const handleSubmit = async () => {
    console.log(formData);
    await axios
      .post(`/animal`, formData)
      .then((res) => {
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("Animal Registered Successfully");
          setSuccessMsg(true);
        }
        else if (res.status == "210") {
          console.log("Record already exists.");
          setWarningMsg(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(true);
      });
  };

  const instantBreedChange = (value) => {
    console.log("in animal page", value);
    let tempBreed = breedData;
    tempBreed.push({
      "id":value.id,
      "label":value.breed
    });
  }

  // const handleAddNewBreed = () => {
  //   console.log("handleAddNewBreed");
  //   navigation.navigate('AddBreed', {instantBreedChange: instantBreedChange});
  // }
  // const handleAddNewColour = () => {
  //   console.log("handleAddNewBreed");
  //   navigation.navigate('AddColor');
  // }

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  }

  const handleCancel = () => {
    setErrorMsg(false);
  }
  const handleWarning = () => {
    setWarningMsg(false);
  }
  const handleAddNewBreed = () => {
    // console.log("handleAddNewBreed");
    navigation.navigate('AddBreed');
  }
  const handleAddNewColor = () => {
    // console.log("handleAddNewColor");
    navigation.navigate('AddColor');
  }

  return (
    <>
      <View>
        <Text style={styles.heading}>* Animal Name: </Text>
        <TextInput
          placeholder='Enter Name'
          style={styles.textbox}
          onChangeText={(value) => {
            value && handleAnimalNameChange(value);
          }}
        />
      <View>

        <Text style={styles.heading}>Set a Default Breed: </Text>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            handleAddEvent={handleAddNewBreed}
            onChange={handleBreedChange}
            buttonLabel={"Add new breed"}
            // defaultValue={5}
            data={breedData}
          />
        </View>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={styles.heading}>Set a Default Color:</Text>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            handleAddEvent={handleAddNewColor}
            onChange={handlePetColorChange}
            buttonLabel={"Add new color"}
            // defaultValue={5}
            data={ColorData}
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
                        <Paragraph>New Animal has been Succesfully added</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handlegoback}>Done</Button>
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
                        <Paragraph>Error while registering new animal</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancel}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
              </Portal>
              : <></>
            }
            {warningMsg ?
                <Portal>
                  <Dialog visible={warningMsg} onDismiss={handleWarning}>
                    <Dialog.Title style={{ color: 'red' }}>Warning!</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>Record already exists</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={handleWarning}>Done</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
          </>
        </View>
      </View>
      <View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        // onPress={() => navigation.navigate('SubmitNewVisitForm')}
        style={{ position: 'absolute', bottom: 0, width: '100%', elevation: 5 }}
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
          Done
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
  dropdownContainer: {
    marginHorizontal: 10,
    marginTop: 12,
  },
  dropdown: {
    width: '70%',
    marginHorizontal: 16,
    marginVertical: 10,
    height: 40,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2
  },
  notify: {
    fontSize: 11,
    marginLeft: 16,
    marginBottom: 5,
  },
  heading: {
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
  },
  textbox: {
    height: 45,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  submit: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 40,
  },
});

export default AddAnimal;