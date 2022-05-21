import React, { useState, useEffect } from 'react'
import { Text, View, ViewBase, StyleSheet,TouchableOpacity, TextInput, } from 'react-native'
import { Divider, Dialog, Portal, Paragraph, Button } from 'react-native-paper'
import axios from 'react-native-axios';
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const AddMedicine = ({route, navigation}) => {

    const [formData, setFormData] = useState(
        {
            medicine_name: '',
            medicine_categories: '',
            size: '',
            clinic_id: route.params.userDetails.clinic.id,
        }
    );

    const[ successMsg,  setSuccessMsg ]= useState(false);
    const[ errorMsg,  setErrorMsg ]= useState(false);

    const [medicineCategoriesData, setMedicineCategoriesData] = useState([]);
    const [ClinicIdData, setClinicIdData] = useState([]);

    const [mg, setMg] = useState(false)
    const [ml, setMl] = useState(false)
    const [capsuleMl, setCapsuleMl] = useState(false)

    const [ size, setSize ] = useState('');

    useEffect(() => {
        getMedicineCategoriesDataType();
        getClinicIdDataType();
    }, [])

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
                console.log(medicineCategoriesData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
        
    }

    const getClinicIdDataType = () => {

        let ClinicIdData = ClinicIdData;
        ClinicIdData = [];
        axios.get(`/clinic`).then(
            res=>{
                // console.log(res.data);
                res.data.map((element, index) =>{
                    ClinicIdData.push({
                        id:element.id,
                        clinic_id: element.clinic_id,
                        clinic_name: element.clinic_name,
                    });
                });
                setClinicIdData(res.data);
                console.log(ClinicIdData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
        
    }

    const handleMedicineNameDataChange = (value) => {
        console.log('test');
        setFormData({
            ...formData,
            medicine_name: value
        });
    }

    const handleMedicineCategoriesDataChange = (value) => {
        // console.log("On Change",value.id);
        if(value.medicine_type == 'tablet') {
            setMg(true)
        }else{
            setMg(false)
        }

        if(value.medicine_type == 'injection') {
            setMl(true)
        }else{
            setMl(false)
        }

        if(value.medicine_type == 'capsule') {
            setCapsuleMl(true)
        }else{
            setCapsuleMl(false)
        }

        setFormData({
            ...formData,
            medicine_categories: value.id
        });
    }

    const handleMedicineSizeDataChange = (value) => {
        setSize(value);
        setFormData({
            ...formData,
            size: value
        });
    }
    
    const handleMedicineSizeDataChangeMg = (value) => {
        if (value == "") {
            setFormData({
                ...formData,
                size: ""
            });
        } else if (value !== "") {
            setFormData({
                ...formData,
                size: value + " mg"
            });
        }
    }
    
    const handleMedicineSizeDataChangeMl = (value) => {
        if (value == "") {
            setFormData({
                ...formData,
                size: ""
            });
        } else if (value !== "") {
            setFormData({
                ...formData,
                size: value + " ml"
            });
        }
    }

    const handleMedicineSizeDataChangeCapsuleMl = (value) => {
        if (value === "") {
            setFormData({
                ...formData,
                size: ""
            });
        } else if (value !== "") {
            setFormData({
                ...formData,
                size: value + " ml"
            });
        }
    }

    const handleSubmit = async () => {
        console.log(formData);
        await axios
          .post(`medicine`, formData)
          .then((res) => {
            if (res.status == "200") {
              // navigation.navigate('petSubmitPage')
              console.log("Medicine Registered Successfully");
              setSuccessMsg(true);
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
      

    return (
        <>
            {/* <View style={{padding: 10, marginVertical: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>New Medicine :</Text>
            </View>
            <Divider style={{backgroundColor: '#006766', height: 2, marginHorizontal: 5}}/> */}
            <View>
                <View>
                    <View style={styles.formItem}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>Medicine :</Text>
                        <TextInput 
                            placeholder='e.g. paracetamol'
                            style={{backgroundColor: '#fff', marginVertical: 20, padding: 10, height: 50, elevation: 2}}
                            onChangeText={(value) => {handleMedicineNameDataChange(value);}}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={{fontWeight: 'bold', marginBottom: 20, fontSize: 16}}>Type :</Text>
                        <CustomDropdown
                            // handleAddEvent={handleAddNewMedicine}
                            isButton={false}
                            autoFocusSearch={false}
                            onChange={(value) => handleMedicineCategoriesDataChange(value)}
                            buttonLabel={"Add new medicine"}
                            labelField="medicine_type"
                            valueField="id"
                            // defaultValue={5}
                            data={medicineCategoriesData}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <>
                            {
                                mg ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>Size :</Text>
                                        <TextInput 
                                            style={{ backgroundColor: '#fff', marginVertical: 20, padding: 10, height: 50, elevation: 2, width: 150, marginLeft: 10 }}
                                            keyboardType='number-pad'
                                            //onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                handleMedicineSizeDataChangeMg(value);
                                            }}

                                        />
                                        <Text style={{marginLeft: 20}}>MG</Text>
                                    </View>
                                : <></>
                            }

                            {
                                ml ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>Size :</Text>
                                        <TextInput 
                                            style={{ backgroundColor: '#fff', marginVertical: 20, padding: 10, height: 50, elevation: 2, width: 150, marginLeft: 10 }}
                                            keyboardType='number-pad'
                                            // onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                handleMedicineSizeDataChangeMl(value);
                                              }}
                                        />
                                        <Text style={{marginLeft: 20}}>ML</Text>
                                    </View>
                                : <></>
                            }

                            {
                                capsuleMl ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>Size :</Text>
                                        <TextInput 
                                            style={{ backgroundColor: '#fff', marginVertical: 20, padding: 10, height: 50, elevation: 2, width: 150, marginLeft: 10 }}
                                            keyboardType='number-pad'
                                            //onSelectItem={(value) =>{ value && handleMedicineSizeDataChange(value)}}
                                            onChangeText={(value) => {
                                                handleMedicineSizeDataChangeCapsuleMl(value);
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
                            <Paragraph>New Medicine has been Succesfully added</Paragraph>
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
                            <Paragraph>Error while adding a new Medicine</Paragraph>
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

export default AddMedicine

const styles = StyleSheet.create({

    formItem: {
        marginVertical: 14,
        marginHorizontal: 10
    },

    dropdown: {
        backgroundColor: '#BFD9D9', 
        padding: 10
    }

})