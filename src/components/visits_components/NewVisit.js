import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
// import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import axios from 'react-native-axios'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useIsFocused } from "@react-navigation/core";

const NewVisit = ({ route, navigation }) => {

    const [overallPetData, setOverallPetData] = useState([]);
    const [petData, setPetData] = useState([]);
    const [selectedPetItem, setSelectedPetItem] = useState(null);

    const [petOwnerData, setPetOwnerData] = useState([]);
    const [selectedPetOwnerItem, setSelectedPetOwnerItem] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused) {
            getPetData();
            getPetOwnerData();
        }
    }, [isFocused])

    const getPetData = () => {
        let petData = petData;
        petData = [];
        axios.get(`/pet/clinic/${route.params.userDetails.clinic.id}`).then(
            res => {
                setOverallPetData(res.data);
                res.data.map((element, index) => {
                    console.log(element);
                    petData.push({
                        id: element.id,
                        pet_name: element.pet_name,
                        label: element.pet_name,
                        title: `${element.pet_name}`,
                        owner: {
                            id: element.pet_owner_id.id,
                            pet_owner_name: element.pet_owner_id.pet_owner_name,
                            title: `${element.pet_owner_id.pet_owner_name}`
                        }
                    });
                });
                setPetData(petData);
                console.log(petData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const getPetOwnerData = () => {
        let petOwnerData = petOwnerData;
        petOwnerData = [];
        axios.get(`/petOwner/clinic/${route.params.userDetails.clinic.id}`).then(
            res => {
                // console.log(res.data);
                res.data.map((element, index) => {
                    petOwnerData.push({
                        id: element.id,
                        pet_owner_name: element.pet_owner_name,
                        title: `${element.pet_owner_name}`,
                        label: element.pet_owner_name,
                    });
                });
                setPetOwnerData(petOwnerData);
                console.log(petOwnerData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const handlePetChange = (value) => {
        getPetData();
        setSelectedPetItem(value);
        setSelectedPetOwnerItem(value.owner);
        console.log(value);
    }

    const handleAddNewPet = () => {
        navigation.navigate('AddPet', {fromVisits: "from_visits"});
    }

    const handlePetOwnerChange = (value) => {
        setSelectedPetOwnerItem(value)
        console.log(value);
    }

    const handleAddNewPetOwner = () => {
        navigation.navigate('AddPetOwner', {fromVisits: "from_visits"});
    }

    const onPressDone = () => {
        let petData = overallPetData.find(element => element.id === selectedPetItem.id);
        console.log("petData", petData);
        navigation.navigate('AddNewVisitDetails', { petId: petData.id, navOptionsFromAddVisit: petData });
    }

    return (
        <SafeAreaView>
            <View style={{ marginHorizontal: 5, justifyContent: 'space-around', height: '100%' }}>
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold' }}>Select By ,</Text>
                    <View style={{ marginVertical: 14 }}>
                        <Text style={styles.formLabel}><Text style={{ color: '#FF5765' }}>*</Text> Pet Name:</Text>

                        <CustomDropdown
                            handleAddEvent={handleAddNewPet}
                            onChange={(value) => handlePetChange(value)}
                            buttonLabel={"Add New Pet"}
                            // defaultValue={5}
                            defaultValue={selectedPetItem && selectedPetItem.id}
                            data={petData}
                        />
                    </View>
                    <Text style={{ marginVertical: 10, textAlign: 'center' }}>OR</Text>
                    <View style={{ marginVertical: 14 }}>
                        <Text style={styles.formLabel}><Text style={{ color: '#FF5765' }}>*</Text> Pet Owner:</Text>
                        
                        <CustomDropdown
                            handleAddEvent={handleAddNewPetOwner}
                            onChange={(value) => handlePetOwnerChange(value)}
                            buttonLabel={"Add New Pet"}
                            // defaultValue={5}
                            defaultValue={selectedPetOwnerItem && selectedPetOwnerItem.id}
                            data={petOwnerData}
                        />

                    </View>
                </View>
                <Divider />
                <Text style={{ textAlign: 'center', marginHorizontal: 20, fontWeight: 'bold', textTransform: 'capitalize', lineHeight: 30, color: '#000', fontSize: 16 }}>Select either a "pet name" or "pet owner name" and then click Done</Text>
                <View>
                    <TouchableOpacity
                        style={{ backgroundColor: '#006766', padding: 24, marginVertical: 10 }}
                        onPress={onPressDone}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Done</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ backgroundColor: '#006766', padding: 24 }}
                        onPress={() => navigation.navigate('Visits')}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default NewVisit

const styles = StyleSheet.create({
    dropdown: {
        paddingHorizontal: 10,
        height: 60,
        borderRadius: 5,
        backgroundColor: '#BFD9D9',
    },
    formLabel: {
        marginBottom: 16
    },
})