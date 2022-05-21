import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, LogBox } from "react-native";
import { AuthContext } from "../components/Context";
import { SectionGrid } from 'react-native-super-grid';
import axios from 'react-native-axios';

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Dashboard({ route, navigation }) {

    const [ count, setCount ] = useState();

    const [ petCount, setPetCount ] = useState("");
    const [ visitsCount, setVisitsCount ] = useState("");
    const [ usersCount, setUsersCount ] = useState("");
    
    const [items, setItems] = useState([
        { name: 'PETS', value1: '10', route: () =>navigation.navigate('Pets') },
        { name: 'OWNERS', value1: '14', route: () => navigation.navigate('Owners') },
        { name: 'Appointments', value1: 'Today - 10', value2: 'Today - 10', route: () => navigation.navigate('Appointments')  },
        { name: 'Visits', value1: 'Today - 10', value2: 'Today - 10', route: () => navigation.navigate('Visits') },
        { name: 'Masters', value1: 'Manage Breeds, Colors, Visit types, etc', route: () => navigation.navigate('Masters') },
        { name: 'Templates', value1: 'Manage Prescription & Message Templates', route: () => navigation.navigate('Templates') },
        { name: 'Users', value1: 'Total Users: 12', route: () => navigation.navigate('Users') },
        { name: 'Settings', route: () => navigation.navigate('Settings') },
        { name: 'Subscription & Billing', value1: 'Total Users: 12', route: () => navigation.navigate('SubscriptionAndBilling') },
        { name: 'Whatsapp and Storage Credits', route: () => navigation.navigate('LeftCredits') },
    ]);

    useEffect(() => {
        getPetCount();
        // getAppointmentCount();
        getVisitsCount();
        getUsersCount();
    }, [])
    

    const getPetCount = async () => {
        let userClinicId = route.params.userDetails.clinic.id
        await axios.get(`/pet/clinic/${userClinicId}`).then(
            res => {
              // console.log(res.data);
              if (res.status === 200) {
                setPetCount(res.data.length);
                console.log("setPetCount", res.data.length);
              }
            }
        ).catch(
            err => {
                console.log("Error");
            }
        );
    }

    // const getAppointmentCount = () => {
        
    // }

    const getVisitsCount = async () => {
        let userClinicId = route.params.userDetails.clinic.id
        await axios.get(`/visitDetail/clinic/${userClinicId}`).then(
            res => {
              // console.log(res.data);
              if (res.status === 200) {
                setVisitsCount(res.data.length);
                console.log("setVisitsCount", res.data.length);
              }
            }
        ).catch(
            err => {
                console.log("Error");
            }
        );
    }

    const getUsersCount = async () => {
        let userClinicId = route.params.userDetails.clinic.id
        await axios.get(`/user/clinic/${userClinicId}`).then(
            res => {
              // console.log(res.data);
              if (res.status === 200) {
                setUsersCount(res.data.length);
                console.log("setUsersCount", res.data.length);
              }
            }
        ).catch(
            err => {
                console.log("Error");
            }
        );
    }


    // console.log(count);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SectionGrid
                    staticDimension={350}
                    spacing={10}
                    sections={[
                        {
                            data: items.slice(0, 11),
                        },
                    ]}
                    style={styles.gridView}
                    renderItem={({ item, section, index }) => (
                        <TouchableOpacity onPress={item.route} key={'grid_'+ index}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemCode}>{item.value1}{"\n"}{item.value2}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },

    gridView: {
        flex: 1,
    },

    itemContainer: {
        backgroundColor: '#006766',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 150,
        marginVertical: 8,
        // shadowColor: '#000',
        elevation: 5,

    },

    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginHorizontal: 5,
        textAlign: 'center',
    },

    itemCode: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#ffffff80',
        paddingHorizontal: 15,
        paddingVertical: 5,
        textAlign: 'center',
    },
});