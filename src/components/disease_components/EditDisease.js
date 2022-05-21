import React, { Component, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";
import axios from "react-native-axios";

const AddDisease = ({ route , navigation }) => {

  let splitText1 = route.params.DiseaseData.disease;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1}` });
  
  const [formData, setFormData] = useState({
    disease: "",
  });

  const[ successMsg,  setSuccessMsg ]= useState(false);
  const[ warningMsg, setWarningMsg ] = useState(false);
  const[ errorMsg,  setErrorMsg ]= useState(false);

  const [diseaseData, setDiseaseData] = useState([]);

  useEffect(() => {
    getEditDiseaseData();
  }, [])

  const getEditDiseaseData = () => {
    let diseaseData = route.params.DiseaseData;
    console.log("diseaseData", diseaseData);
    setFormData({
      disease: diseaseData.disease,
    })
    // setDiseaseData(formData);
  }

  const handleDiseaseNameChange = (value) => {
    setFormData({
      ...formData,
      disease: value,
    });
  };

  const handleSubmit = async () => {
       
    let DiseaseId=route.params.DiseaseData.id
    console.log(DiseaseId);

    console.log(formData);
    await axios
      .put(`disease/update/${DiseaseId}`, formData)
      .then((res) => {
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("Disease Updated Successfully");
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
            <Text style={styles.formLabel}>Disease Name:</Text>
            <TextInput
              defaultValue={route.params.DiseaseData && route.params.DiseaseData.disease}
              placeholder="E.g.Canine distemper"
              style={styles.formTextInput}
              onChangeText={(value) => {
                value && handleDiseaseNameChange(value);
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
                          <Paragraph>Disease has been updated Successfully</Paragraph>
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

export default AddDisease;

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
    marginVertical: 10
  },
  formTextInput: {
    height: 50,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2
  },
});
