import React, { Component , useState , useEffect} from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';


const AddVaccine = (navigation) => {

    const [formData, setFormData] = useState(
        {
            vaccine_name: '',
            
        }
    );
   

    
    const handleVaccineNameChange = (value) => {
        setFormData({
            ...formData,
            vaccine_name: value
        });
    }

    
    
    const handleSubmit = () => {
        //     console.log(formData);
     }

    return (
        <>
  
           
          <View style={{height: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
                <View>
                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Vaccine Name:</Text>
                        <TextInput
                            placeholder='e.g.Test'
                            style={styles.formTextInput}
                            onChangeText={(value) => {value && handleVaccineNameChange(value)}}
                        ></TextInput>
                    </View>
                    
                    
                </View>

                <View>
                    <TouchableOpacity
                       onPress={handleSubmit}
                    // onPress={() => navigation.navigate('SubmitNewVisitForm')}
                    >
                        <Text style={{
                            backgroundColor: '#6600CC',
                            alignItems: 'center',
                            width: '100%',
                            color: '#fff',
                            textAlign: 'center',
                            paddingVertical: 20,
                        }}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </View>
          </View> 
        </>   
    )
}


export default AddVaccine;


const styles = StyleSheet.create({

    // container: {
    //     flex: 1,
    //     height: '100%'
    // },

    inputText: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    form: {
        // marginHorizontal: 14,
        margin: 20,
    },

    formItem: {
        marginVertical: 14,
        marginHorizontal: 10
    },

    formLabel: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 15,

    },

    textArea: {
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 100,
        padding: 5,
    },

    formTextInput: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
        // marginHorizontal: '5%',
        borderRadius: 20,
    },

    formTextInputInside: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 10,
        // marginHorizontal: '5%',
        borderRadius: 20,
    },

    })
