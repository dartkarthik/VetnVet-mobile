import React, { Component, useState ,useEffect} from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button ,Dialog, Portal, Paragraph} from "react-native-paper";
import axios from "react-native-axios";

const AddVisitType = ({ route , navigation }) => {

  let splitText1 = route.params.VisitTypeData.visit_type;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText1}` });
  
  const [formData, setFormData] = useState({
    visit_type: "",
  });

  const[ successMsg,  setSuccessMsg ]= useState(false);
  const[ warningMsg, setWarningMsg ] = useState(false);
  const[ errorMsg,  setErrorMsg ]= useState(false);

  useEffect(() => {
    getEditVisitTypeDetail();
  }, [])

  const getEditVisitTypeDetail = () => {
    let visitTypeData = route.params.VisitTypeData;
    // console.log("animalData", animalData);
    setFormData({
      visit_type: visitTypeData.visit_type,
    })
  }

  const handleVisitTypeChange = (value) => {
    setFormData({
      ...formData,
      visit_type: value,
    });
  };

  const handleSubmit = () => {

    let visitTypeDataId = route.params.VisitTypeData.id
    console.log(visitTypeDataId);

    console.log(formData);

    axios.put(`visitType/update/${visitTypeDataId}`, formData)
      .then((res) => {
        console.log(res.status)
        if (res.status == "200") {
          // navigation.navigate('petSubmitPage')
          console.log("Visit Type Updated Successfully");
          setSuccessMsg(true);
        }
        else if(res.status =='210'){
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
            <Text style={styles.formLabel}>Visit Type:</Text>
            <TextInput
              defaultValue={route.params.VisitTypeData.visit_type}
              placeholder="e.g. Clinic"
              style={styles.formTextInput}
              onChangeText={(value) => {
                value && handleVisitTypeChange(value);
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
                          <Paragraph>VisitType has been updated Successfully</Paragraph>
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

export default AddVisitType;

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
