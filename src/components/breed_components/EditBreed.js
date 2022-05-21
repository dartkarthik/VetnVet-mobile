import React, { Component, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "react-native-axios";
import { Button, Dialog, Portal, Paragraph} from "react-native-paper";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useIsFocused } from "@react-navigation/native";

const EditBreed = ({ route , navigation }) => {
  
  let splitText1 = route.params.breedData.breed
  let splitText2 = route.params.breedData.animal_type
  navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
  
  const [formData, setFormData] = useState({
    breed: "",
    animal_type: "",
  });

  //dropdown
  const [petTypeData, setPetTypeData] = useState([]);

  const [successMsg, setSuccessMsg] = useState(false);
  const[ warningMsg, setWarningMsg ] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) {
      getPetTypeData();
      getEditBreedData();
    }
  }, [isFocused]);

  const getEditBreedData = () => {
    let breedId = route.params.breedData.id;
    let breedData = breedData;
    axios
      .get(`breed/${breedId}`)
      .then((res) => {
        console.log("breedData",res.data);
        setFormData({
          ...formData,
          breed: res.data.edited_name ? res.data.edited_name : res.data.actual_name,
          animal_type: res.data.edited_animal_id ? res.data.edited_animal_id : res.data.actual_animal_id,
        })
    })
    .catch((err) => {
      console.log(err);
    });
  } 

  console.log("formData", formData);

  const getPetTypeData = () => {
    let userClinicId = route.params.userDetails.clinic.id
    let petTypeData = petTypeData;
    petTypeData = [];
    axios
      .get(`animal/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("breedData",res.data);
        res.data.map((element, index) => {
          petTypeData.push({
            id: element.id,
            animal_type: element.edited_name ? element.edited_name : element.actual_name,
            title: `${element.animal_type}`,
            
          });
          
        });
        setPetTypeData(petTypeData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePetNameChange = (value) => {
    setFormData({
      ...formData,
      breed: value,
    });
  };

  const handlePetTypeChange = (value) => {
    setFormData({
      ...formData,
      animal_type: value.id,
    });
  };

  const handleSubmit = async () => {
    let breedDataId=route.params.breedData.id
    await axios
      .put(`breed/update/${breedDataId}`, formData)
      .then((res) => {
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("Breed Updated Successfully");
          setSuccessMsg(true);
        }
        else if(res.status == '210'){
          console.log("Record already exists.")
          setWarningMsg(true);
        }
        else if (res.status == '201') {
          console.log("This record is in use. Cannot be edited"); 
          setErrorMsg(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // setErrorMsg(true);
      });
  };

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
  return (
    <>
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Breed Name:</Text>
            <TextInput
              defaultValue={formData && formData.breed}
              placeholder="Ex: Labrador Retriever"
              style={styles.formTextInput}
              onChangeText={(value) => {handlePetNameChange(value);}}
            ></TextInput>
          </View>

           <View style={styles.formItem}>
            <Text style={styles.formLabel}>Associated Animal:</Text>
            <CustomDropdown
              onChange={(value) => {handlePetTypeChange(value)}}
              buttonLabel={"Add new animal"}
              defaultValue={formData && formData.animal_type && formData.animal_type}
              data={petTypeData}
              labelField="animal_type"
              valueField="id"
              isButton={false}
              autoFocusSearch={false}
            />
          </View> 

          <View>
              <>
              {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>New Breed has been Succesfully added</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback}>Done</Button>
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
              {errorMsg ?
                <Portal>
                  <Dialog visible={errorMsg} onDismiss={handleCancel}>
                      <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>This record is in use. Cannot be edited.</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleCancel}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              </>
          </View>


        </View>
        <View>
          <TouchableOpacity
            onPress={handleSubmit}
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
        </View>
      </View>
    </>
  );
};

export default EditBreed;

const styles = StyleSheet.create({

  form: {
    margin: 20,
  },
  formItem: {
    marginVertical: 14,
    marginHorizontal: 10,
  },
  formLabel: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,
  },
  formTextInput: {
    height: 45,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 2
  },
  dropdown: {
    backgroundColor: '#BFD9D9',
    padding: 10,
  },
});
