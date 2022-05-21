import React, { useState, useEffect } from 'react'
import { Text, View, ViewBase, StyleSheet,TouchableOpacity, TextInput } from 'react-native'
import { Divider, Dialog, Portal, Paragraph, Button } from 'react-native-paper'
import axios from 'react-native-axios';
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const EditMedicine = ({route, navigation}) => {
    // console.log(route.params.MedicineData);

    let splitText1 = route.params.MedicineData.medicine_name;
    splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

    let splitText2 = route.params.MedicineData.medicine_categories.medicine_type;
    splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

    navigation.setOptions({ title: `${splitText1} / ${splitText2}` });

    const [formData, setFormData] = useState(
        {
            medicine_name: '',
            medicine_categories: '',
            size: '',
        }
    );

    const[ successMsg,  setSuccessMsg ]= useState(false);
    const[ errorMsg,  setErrorMsg ]= useState(false);

    const [medicineCategoriesData, setMedicineCategoriesData] = useState([]);
    
    const [mg, setMg] = useState(false)
    const [ml, setMl] = useState(false)
    const [capsuleMl, setCapsuleMl] = useState(false)

    const [ weight, setWeight ] = useState('');
    // console.log("idysdhi", route.params.MedicineData.size.split(' ')[0]);
    
    useEffect(() => {
        setFormData({
            ...formData,
            medicine_name: route.params.MedicineData.medicine_name,
            medicine_categories: route.params.MedicineData.medicine_categories.id,
            size: route.params.MedicineData.size,
        })
        getMedicineCategoriesDataType();
    }, [])

    useEffect(() => {
      if(route.params.MedicineData) {
        if(route.params.MedicineData.medicine_categories.medicine_type === 'injection') {
            setMl(true);
            setMg(false);
            setCapsuleMl(false);
        } else if (route.params.MedicineData.medicine_categories.medicine_type === "tablet") {
            setMg(true);
            setCapsuleMl(false);
            setMl(false);
        } else if (route.params.MedicineData.medicine_categories.medicine_type === 'capsule') {
            setCapsuleMl(true);
            setMg(false);
            setMl(false);
        } else if (route.params.MedicineData.medicine_categories.medicine_type === 'tonic') {
            setMl(true);
            setMg(false);
            setCapsuleMl(false);
        } else {
            setMl(false);
            setMg(false);
            setCapsuleMl(false);
        }

        if(route.params.MedicineData.size !== null) {
            setWeight(route.params.MedicineData.size.split(' ')[0]);
        } else {
            setWeight("");
        }
      }

    }, [route.params.MedicineData])
    
    // console.log("formData", formData);

    const getMedicineCategoriesDataType = () => {

        let medicineCategoriesData = medicineCategoriesData;
        medicineCategoriesData = [];
        axios.get(`/medicineCategory`).then(
            res=>{
                // console.log(res.data);
                res.data.map((element, index) =>{
                    medicineCategoriesData.push({
                        id:element.id,
                        medicine_type: element.medicine_type,
                        title:`${element.medicine_type}`
                    });
                });
                setMedicineCategoriesData(medicineCategoriesData);
                // console.log("fsfsf", medicineCategoriesData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
        
    }

    const handleMedicineNameDataChange = (value) => {
       setFormData({
            ...formData,
            medicine_name: value
        });
    }

    const handleMedicineCategoriesDataChange = (value) => {
        // console.log("On Change",value.id);

        if(value.medicine_type == 'tablet' || value.medicine_type == 'tonic') {
            setMg(true);
            setMl(false);
            setCapsuleMl(false);
        } else if (value.medicine_type == 'injection') {
            setMl(true);
            setCapsuleMl(false);
            setMg(false);
        } else if (value.medicine_type == 'capsule') {
            setCapsuleMl(true);
            setMg(false);
            setMl(false);
        } else {
            setMg(false);
            setMl(false);
            setCapsuleMl(false);
        }
        
        setFormData({
            ...formData,
            medicine_categories: value.id
        });
    }

   
    const handleMedicineSizeDataChange = (value) => {
        setFormData({
            ...formData,
            size: value
        });
    }

    const handleSubmit = () => {
        let MedicineData = route.params.MedicineData.id    
        console.log(formData);
    
        axios.put(`medicine/update/${MedicineData}`, formData).then(
          res=>{
              // console.log(res.data);
              if (res.status === 200) {
                console.log(res.data);
                console.log("Medicine Updated Successfully");
                setSuccessMsg(true);
            }
          }
      ).catch(
          err => {
              console.log(err);
              setErrorMsg(true);
          }
      )
      };

    const handlegoback = () => {
        setSuccessMsg(false);
        navigation.goBack();
    }

    const handleCancel = () => {
        setErrorMsg(false);
        navigation.goBack();
    }

    return (
        <>
          <View>
                <View>
                    <View style={styles.formItem}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>Medicine :</Text>
                        <TextInput 
                            placeholder='e.g. paracetamol'
                            placeholderStyle={{color: '#00000070'}}
                            defaultValue={route.params.MedicineData.medicine_name}
                            style={{
                                backgroundColor: '#fff', 
                                marginVertical: 20, 
                                elevation: 5, 
                                height: 50,
                                elevation: 2,
                                padding: 10

                            }}
                            // onSelectItem={value =>{ value && handleMedicineNameDataChange(value)}}
                            onChangeText={(value) => {
                                value && handleMedicineNameDataChange(value);
                              }}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={{fontWeight: 'bold', marginBottom: 20, fontSize: 16}}>Type :</Text>

                        <CustomDropdown
                            // handleAddEvent={handleAddNewMedicine}
                            isButton={false}
                            autoFocusSearch={false}
                            onChange={(value) => handleMedicineCategoriesDataChange(value)}
                            // buttonLabel={"Add new medicine"}
                            labelField="medicine_type"
                            valueField="id"
                            defaultValue={route.params.MedicineData && route.params.MedicineData.medicine_categories.id}
                            data={medicineCategoriesData}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <>
                            {
                                mg ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>Size :</Text>
                                        <TextInput 
                                            defaultValue={weight && weight}
                                            style={{ backgroundColor: '#fff', marginVertical: 10, width: 150, marginLeft: 20, height: 50, padding: 10 }}
                                            keyboardType='number-pad'
                                            // onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                value && handleMedicineSizeDataChange(value);
                                              }}
                                        />
                                        <Text style={{marginLeft: 20}}>MG</Text>
                                    </View>
                                : <></>
                            }

                            {
                                ml ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>Size :</Text>
                                        <TextInput 
                                            defaultValue={weight && weight}
                                            style={{ backgroundColor: '#fff', marginVertical: 10, width: 150, marginLeft: 20, height: 50, padding: 10 }}
                                            keyboardType='number-pad'
                                            // onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                value && handleMedicineSizeDataChange(value);
                                              }}
                                        />
                                        <Text style={{marginLeft: 20}}>ML</Text>
                                    </View>
                                : <></>
                            }

                            {
                                capsuleMl ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>Size :</Text>
                                        <TextInput 
                                            defaultValue={weight && weight}
                                            style={{ backgroundColor: '#fff', marginVertical: 10, width: 150, marginLeft: 20, height: 50, padding: 10 }}
                                            keyboardType='number-pad'
                                            // onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                value && handleMedicineSizeDataChange(value);
                                              }}
                                        />
                                        <Text style={{marginLeft: 20}}>ML</Text>
                                    </View>
                                : <></>
                            }
                        </>
                    </View>
                </View>
            </View>
            
            <View>
                <>
                {successMsg ?
                    <Portal>
                    <Dialog visible={successMsg} onDismiss={handlegoback}>
                        <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Medicine has been updated Succesfully</Paragraph>
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
                            <Paragraph>Error while updating a existing Medicine</Paragraph>
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

            <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <TouchableOpacity 
                    style={{backgroundColor: '#006766', padding: 20}}
                    onPress={handleSubmit}
                >
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default EditMedicine

const styles = StyleSheet.create({

    formItem: {
        marginVertical: 14,
        marginHorizontal: 10
    },
    dropdown: {
        backgroundColor: '#fff', 
        padding: 10,
        elevation: 5
    }

})