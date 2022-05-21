import React, { Component, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { Switch } from 'react-native-paper';

const petSubmitPage = ({ navigation, route }) => {

    const [isSwitchOn1, setIsSwitchOn1] = React.useState(true);
    const onToggleSwitch1 = () => setIsSwitchOn1(!isSwitchOn1);

    const [isSwitchOn2, setIsSwitchOn2] = React.useState(true);
    const onToggleSwitch2 = () => setIsSwitchOn2(!isSwitchOn2);

    const [isSwitchOn3, setIsSwitchOn3] = React.useState(true);
    const onToggleSwitch3 = () => setIsSwitchOn3(!isSwitchOn3);

    // console.log(route.params.formData);

    const onNavigateConsult = () => {
        navigation.navigate('AddNewVisitDetails',{petData:route.params.registeredPetData.id, navOptionsFromAddPet: route.params.registeredPetData})
    }

    const onNavigatePet = () => {
        navigation.navigate('Pets')
    }

    return (
         <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            
            <Text  style={{color: '#000', fontSize: 15, fontWeight: 'bold',textAlign:"center",marginVertical:30}}>The New Pet <Text style={{color:'#66ee'}}>{route.params.registeredPetData.pet_name}</Text> Has Been Registered Successfully!!</Text>
                   
            <View style={{width:'70%'}}>     
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:15}}>
                        <Text>Send Welcome Message?</Text>
                        <Switch 
                            value={isSwitchOn1} 
                            onValueChange={onToggleSwitch1} 
                            style={{marginTop:-12}}
                            trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                            thumbColor={"#28AE7B"}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:15}}>
                        <Text>Whatsapp</Text>
                        <Switch 
                            value={isSwitchOn2} 
                            onValueChange={onToggleSwitch2} 
                            style={{marginTop:-12}}
                            trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                            thumbColor={"#28AE7B"}
                            
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:15}}>
                        <Text>Email</Text>
                        <Switch 
                            value={isSwitchOn3} 
                            onValueChange={onToggleSwitch3} 
                            style={{marginTop:-12}}
                            trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                            thumbColor={"#28AE7B"}
                        />
                    </View>
           </View>
           

           <View style={{marginTop:10,width:"100%",alignItems:'center'}}>
                <Text style={{marginTop:10}}>What would you like to do Next?</Text>
                <TouchableOpacity 
                        style={{padding: 20, backgroundColor: '#006766', marginVertical: 10, width: '80%'}}
                        onPress={onNavigateConsult}
                    >
                        <Text style={{color: '#fff', textAlign: 'center'}}>Start Consultation</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                        style={{padding: 20, backgroundColor: '#006766', marginVertical: 10, width: '80%'}}
                        onPress={onNavigatePet}
                    >
                        <Text style={{color: '#fff', textAlign: 'center'}}>Not Now</Text>
                </TouchableOpacity>
            </View>
       
         </View>
        
    )
}

export default petSubmitPage
