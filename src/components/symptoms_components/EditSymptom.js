import React, { Component, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button, Dialog, Portal, Paragraph} from "react-native-paper";
import axios from "react-native-axios";

const AddSymptoms = ({ route , navigation }) => {

  let splitText1 = route.params.SymptomData.symptom_name;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1}` });
    
  const [formData, setFormData] = useState({
    symptom_name: "",
    clinic_id: route.params.userDetails.clinic.id,
    branch_id: route.params.userDetails.branch.id,
  });

  const[ successMsg,  setSuccessMsg ]= useState(false);
  const[ warningMsg, setWarningMsg ] = useState(false);
  const[ errorMsg,  setErrorMsg ]= useState(false);
  
  useEffect(() => {
    getEditSymptomsDetail();
  }, [])

  console.log(formData);

  const getEditSymptomsDetail = () => {
    let symptomData = route.params.SymptomData;
    // console.log("symptomData", symptomData);
    setFormData({
      symptom_name: symptomData.symptom_name,
    })
  }

  const handleSymptomNameChange = (value) => {
    console.log(value);
    setFormData({
      ...formData,
      symptom_name: value,
    });
  };

  const handleSubmit = async () => {
      
    let SymptomDataId = route.params.SymptomData.id
    // console.log(SymptomDataId)
    console.log(formData);
    await axios
      .put(`symptom/update/${SymptomDataId}`, formData)
      
      .then((res) => {
        console.log("dgfdgd", res.data);
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("Symptom Updated Successfully");
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
        setErrorMsg(true);
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
            <Text style={styles.formLabel}>Symptom Name:</Text>
            <TextInput
              defaultValue={route.params.SymptomData.symptom_name}
              placeholder="e.g. Rashes"
              style={styles.formTextInput}
              onChangeText={(value) => {
                value && handleSymptomNameChange(value);
              }}
            ></TextInput>
          </View>
        </View>

        <View>
              <>
              {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Symptom has been updated Successfully</Paragraph>
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
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default AddSymptoms;

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
    // marginHorizontal: 16,
    marginVertical: 10
  },
  formTextInput: {
    height: 50,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    color: '#000'
  },
});
