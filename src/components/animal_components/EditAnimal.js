import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet,TouchableOpacity, TextInput} from "react-native";
import { Button, Dialog, Portal, Paragraph} from "react-native-paper";
import axios from "react-native-axios";
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const AddAnimal = ({ route, navigation }) => {

  let splitText1 = route.params.animalData.animal_type;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1}` });

  const [formData, setFormData] = useState({
    animal_type: "",
    default_breed: "",
    default_color: "",
  });
  // console.log("animalData", animalData);

  const[ successMsg,  setSuccessMsg ]= useState(false);
  const[ warningMsg, setWarningMsg ] = useState(false);
  const[ errorMsg,  setErrorMsg ]= useState(false);

  const [breedData, setBreedData] = useState([]);
  const [petColorData, setPetColorData] = useState([]);

  useEffect(() => {
    getBreedData();
    getPetColorData();
    getEditAnimalData();
  }, []);

  const getEditAnimalData = () => {
    setFormData({
      animal_type: route.params.animalData.animal_type,
      default_breed: route.params.animalData.default_breed,
      default_color: route.params.animalData.default_color,
    })
  }

  const getBreedData = () => {
    let userClinicId = route.params.userDetails.clinic.id
    // console.log(userClinicId);
    let breedData = breedData;
    breedData = [];
    axios.get(`breed/clinic/${userClinicId}`).then((res) => {
      // console.log(res.data);
      res.data.map((element, index) => {
        breedData.push({
          id: element.id,
          breed: element.edited_name ? element.edited_name : element.actual_name,
          title: `${element.breed}`,
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
  const handleAnimalNameChange = (value) => {
    setFormData({
      ...formData,
      animal_type: value,
    });
  };
  const handleBreedChange = (value) => {
    setFormData({
      ...formData,
      default_breed: value.id,
    });
  };

  const handlePetColorChange = (value) => {
    setFormData({
      ...formData,
      default_color: value.id,
    });
  };

  const handleSubmit = async() => {
    console.log(formData);
    let animalId = route.params.animalData.id
    // console.log(animalId);
    await axios.put(`/animal/update/${animalId}`, formData).then(
      res=>{
          // console.log(res.data);
          if (res.status == '200') {
            console.log(res.data);
            console.log("Animal Updated Successfully");
            setSuccessMsg(true);
          }
          else if(res.status == '210'){
            console.log("Record already exists.")
            setWarningMsg(true);
          }
          else if (res.status == '201') {
            console.log("This record is in use. Cannot be edited.");
            setErrorMsg(true);
          }
      }
      ).catch(
          err => {
              console.log(err);
              // setErrorMsg(true);
          }
      )
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
      <View>
        <Text style={styles.heading}>* Animal Name: </Text>
        <TextInput
          placeholder='Enter Name' 
          style={styles.textbox} 
          defaultValue={route.params.animalData.animal_type}
          onChangeText={(value) => {
            value && handleAnimalNameChange(value);
          }}
        />
        <Text style={styles.heading}>Set a Default Breed: </Text>
        <View style={{marginHorizontal: 10, marginVertical: 10}}>
          <CustomDropdown
            // handleAddEvent={handleAddNewColor}
            isButton={false}
            onChange={(value) => handleBreedChange(value)}
            dropdownType={'single'}
            labelField='breed'
            valueField='id'
            autoFocusSearch={false}
            // buttonLabel={"Add new color"}
            defaultValue={route.params.animalData && route.params.animalData.default_breed_id}
            data={breedData}
          />
        </View>
        {/* <Text style={styles.notify}>
          This will appear as default when you select this animal during
          registration
        </Text> */}
        <Text style={styles.heading}>Set a Default Color:</Text>
        <View style={{marginHorizontal: 10, marginVertical: 10}}>
          <CustomDropdown
            // handleAddEvent={handleAddNewColor}
            isButton={false}
            onChange={(value) => handlePetColorChange(value)}
            dropdownType={'single'}
            labelField='color'
            valueField='id'
            autoFocusSearch={false}
            // buttonLabel={"Add new color"}
            defaultValue={route.params.animalData && route.params.animalData.default_color_id}
            data={petColorData}
          />
        </View>
           <View>
              <>
              {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Animal has been Updated Successfully</Paragraph>
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
      </View>
      <TouchableOpacity
            onPress={handleSubmit}
            // onPress={() => navigation.navigate('SubmitNewVisitForm')}
            style={{position: 'absolute', bottom: 0, width: '100%', elevation: 5}}
          >
            <Text
              style={{
                backgroundColor: "#006766",
                alignItems: "center",
                width: "100%",
                color: "#fff",
                textAlign: "center",
                paddingVertical: 24,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 35,
    padding: 22,
    // borderWidth: 1,
    // borderColor: "#6200ee",
    backgroundColor: '#BFD9D9',
  },
  notify: {
    fontSize: 11,
    marginLeft: 16,
    marginBottom: 5,
  },
  heading: {
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 10,
  },
  textbox: {
    height: 45,
    padding: 10,
    // borderWidth: 1,
    // borderColor: "#bebebe",
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 2
  },
});

export default AddAnimal;
