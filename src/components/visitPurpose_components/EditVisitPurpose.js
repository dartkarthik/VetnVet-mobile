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
import { TabRouter } from "@react-navigation/native";

const AddVisitPurpose = ({ route , navigation }) => {

  let splitText1 = route.params.VisitPurposeData.visit_purpose;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1}` });

  const [formData, setFormData] = useState({
    visit_purpose: "",
  });

  const[ successMsg,  setSuccessMsg ]= useState(false);
  const [warningMsg, setWarningMsg] = useState(false);
  const[ errorMsg,  setErrorMsg ]= useState(false);

  // let visitId = route.params.VisitPurposeData.id
  // console.log(visitId)

  useEffect(() => {
    getEditVisitPurpose();
  }, [])

  const getEditVisitPurpose = () => {
    let visitPurposeData = route.params.VisitPurposeData;
    // console.log("animalData", animalData);
    setFormData({
      visit_purpose: visitPurposeData.visit_purpose,
    })
  }

  const handleVisitPurposeChange = (value) => {
    setFormData({
      ...formData,
      visit_purpose: value,
    });
  };

  const handleSubmit = () => {

    let visitPurposeId = route.params.VisitPurposeData.id
    console.log(visitPurposeId);

    console.log(formData);

    axios.put(`/visitPurpose/update/${visitPurposeId}`, formData).then(
      res=>{
          console.log(res.status);
          if (res.status == '200') {
            console.log(res.data);
            console.log("VisitPurpose Updated Successfully");
            setSuccessMsg(true);
            // setVisitPurposeData(res.data);
            // setFilteredDataSource(res.data);
            
          }
          else if (res.status =='210') {
            console.log("Record already exists.")
            setWarningMsg(true);
          }
          else if (res.status == '201') {
            console.log("This record is in use. Cannot be edited")
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
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Visit Purpose:</Text>
            <TextInput
              defaultValue={route.params.VisitPurposeData.visit_purpose}
              placeholder="e.g. Sick, Vaccination"
              style={styles.formTextInput}
              onChangeText={(value) => {
                value && handleVisitPurposeChange(value);
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
                          <Paragraph>VisitPurpose has been updated Successfully</Paragraph>
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

export default AddVisitPurpose;

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
    marginVertical: 10,
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
