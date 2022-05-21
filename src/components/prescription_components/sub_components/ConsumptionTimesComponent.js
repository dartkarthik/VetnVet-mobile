import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Checkbox, Divider } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";

const ConsumptionTimesComponent = ({ componentIndex, medicineType, consumptionDisable, courseInformation, editMedicineDetails }) => {

    const [consumptionTimesData, setConsumptionTimesData] = useState({
        morning: [0, 0],
        afternoon: [0, 0],
        night: [0, 0],
        slots: [],
    });

    // injection times state val
    const [NAchecked, setNAChecked] = useState(false);
    const [morningChecked, setMorningChecked] = useState(false);
    const [ANchecked, setANChecked] = useState(false);
    const [nightChecked, setNightChecked] = useState(false);

    // tablet/capsule/drops times state val
    const [morningCount, setMorningCount] = useState([
        { "value": '0', 'index': 0 },
        { "value": '1', 'index': 0 },
        { "value": '2', 'index': 0 },
        { "value": '3', 'index': 0 },
        { "value": '4', 'index': 0 },
        { "value": '5', 'index': 0 },
        { "value": '6', 'index': 0 },
        { "value": '7', 'index': 0 },
        { "value": '8', 'index': 0 },
        { "value": '9', 'index': 0 },
        { "value": '10', 'index': 0 },
    ]);
    const [afternoonCount, setAfternoonCount] = useState([
        { "value": '0', 'index': 0 },
        { "value": '1', 'index': 0 },
        { "value": '2', 'index': 0 },
        { "value": '3', 'index': 0 },
        { "value": '4', 'index': 0 },
        { "value": '5', 'index': 0 },
        { "value": '6', 'index': 0 },
        { "value": '7', 'index': 0 },
        { "value": '8', 'index': 0 },
        { "value": '9', 'index': 0 },
        { "value": '10', 'index': 0 },
    ]);
    const [nightCount, setNightCount] = useState([
        { "value": '0', 'index': 0 },
        { "value": '1', 'index': 0 },
        { "value": '2', 'index': 0 },
        { "value": '3', 'index': 0 },
        { "value": '4', 'index': 0 },
        { "value": '5', 'index': 0 },
        { "value": '6', 'index': 0 },
        { "value": '7', 'index': 0 },
        { "value": '8', 'index': 0 },
        { "value": '9', 'index': 0 },
        { "value": '10', 'index': 0 },
    ]);

    const [morningPartCount, setMorningPartCount] = useState([
        { "value": '0', 'index': 1 },
        { "value": '1/4', 'index': 1 },
        { "value": '1/2', 'index': 1 },
        { "value": '3/4', 'index': 1 },
    ]);
    const [afternoonPartCount, setAfternoonPartCount] = useState([
        { "value": '0', 'index': 1 },
        { "value": '1/4', 'index': 1 },
        { "value": '1/2', 'index': 1 },
        { "value": '3/4', 'index': 1 },
    ]);
    const [nightPartCount, setNightPartCount] = useState([
        { "value": '0', 'index': 1 },
        { "value": '1/4', 'index': 1 },
        { "value": '1/2', 'index': 1 },
        { "value": '3/4', 'index': 1 },
    ]);

    useEffect(() => {
        // console.log("test 1", editMedicineDetails);
        if (editMedicineDetails) {
            setConsumptionTimesData(editMedicineDetails.consumption_times);
            if (editMedicineDetails.consumption_times && editMedicineDetails.consumption_times.slots) {
                // console.log("test 2");
                editMedicineDetails.consumption_times.slots.forEach(element => {
                    // console.log("test 3");
                    switch (element) {
                        case "NA":
                            setNAChecked(true);
                            break;
                        case "Morning":
                            setMorningChecked(true);
                            break;
                        case "Afternoon":
                            setANChecked(true);
                            break;
                        case "Night":
                            setNightChecked(true);
                            break;
                        default:
                            break;
                    }
                });
            }
            // console.log("consumptionTimesData",consumptionTimesData);
            courseInformation(consumptionTimesData);
        }
    }, [editMedicineDetails])
    
    useEffect(() => {
        // const cons = consumptionTimesData;
        if(consumptionTimesData){
            // console.log("consumptionTimesData",consumptionTimesData);
            courseInformation(consumptionTimesData);
        }
    }, [consumptionTimesData]);

    // console.log("editMedicineDetails", editMedicineDetails);

    const handleTabletMorningCount = (value) => {
        console.log("On Change", value);
        let morningData = consumptionTimesData.morning;
        morningData[value.index] = value.value;
        setConsumptionTimesData({
            ...consumptionTimesData,
            morning: morningData
        })
        // courseInformation(morningData);
        // console.log(consumptionTimesData)
    }

    const handleTabletAfternoonCount = (value) => {
        // console.log("On Change", value);
        let eveningData = consumptionTimesData.afternoon;
        eveningData[value.index] = value.value;
        setConsumptionTimesData({
            ...consumptionTimesData,
            afternoon: eveningData
        })
        // courseInformation(eveningData);
        // console.log(consumptionTimesData)
    }

    const handleTabletNightCount = (value) => {
        // console.log("On Change", value);
        let nightData = consumptionTimesData.night;
        nightData[value.index] = value.value;
        setConsumptionTimesData({
            ...consumptionTimesData,
            night: nightData
        })
        // courseInformation(consumptionTimesData);
        // console.log(consumptionTimesData)
    }

    // switch times handle

    const handleNASwitch = (value) => {

        let tempSlots = consumptionTimesData.slots;

        if (tempSlots.includes(value)) {
            tempSlots = tempSlots.filter(ele => ele !== value);
        } else {
            tempSlots.push(value);
        }

        setConsumptionTimesData({
            ...consumptionTimesData,

            slots: tempSlots

        });
    }

    // console.log("consumption_times", consumption_times);

    return (
        <>
            <View style={{ marginBottom: 20 }}>
                {
                    (
                        medicineType === "tonic" ||
                        medicineType === "injection" ||
                        medicineType === "oinment"
                    ) ?

                        <>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 10 }}>Times :</Text>
                            <View style={styles.checkBoxComp}>

                                <Checkbox
                                    status={NAchecked ? 'checked' : 'unchecked'}
                                    onPress={() => { setNAChecked(!NAchecked); handleNASwitch("NA"); }}
                                    color='#006766'

                                    uncheckedColor='#006766'
                                />
                                <Text style={styles.textCheck}>NA</Text>

                                <Checkbox
                                    status={morningChecked ? 'checked' : 'unchecked'}
                                    onPress={() => { setMorningChecked(!morningChecked); handleNASwitch("Morning"); }}
                                    color='#006766'
                                    uncheckedColor='#006766'
                                />
                                <Text style={styles.textCheck}>Morning</Text>

                                <Checkbox
                                    status={ANchecked ? 'checked' : 'unchecked'}
                                    onPress={() => { setANChecked(!ANchecked); handleNASwitch("Afternoon"); }}
                                    color='#006766'
                                    uncheckedColor='#006766'
                                />
                                <Text style={styles.textCheck}>Afternoon</Text>

                                <Checkbox
                                    status={nightChecked ? 'checked' : 'unchecked'}
                                    onPress={() => { setNightChecked(!nightChecked); handleNASwitch("Night"); }}
                                    color='#006766'
                                    uncheckedColor='#006766'
                                />
                                <Text style={styles.textCheck}>Night</Text>

                            </View>
                        </>
                        : <></>
                }
                {/* Times CheckBox */}

                {/* Tablet Block */}

                {
                    (
                        medicineType === 'tablet' ||
                        medicineType === 'capsule'
                    ) ?
                        <>
                            {/* Morning */}
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 10 }}>Times :</Text>
                            <View style={styles.timesTablet}>
                                <View style={styles.tabletCountSec}>
                                    <Text style={styles.headText}>Morning</Text>
                                    <View style={styles.dropDownCount}>                                        
                                        <Dropdown
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={morningCount}
                                            value={consumptionTimesData && consumptionTimesData.morning[0]}
                                            labelField="value"
                                            valueField="value"
                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                            onChange={(value) => value && handleTabletMorningCount(value)}
                                            selectedTextStyle={{ color: '#424651' }}
                                            containerStyle={styles.dropContainer}
                                        // iconStyle={{display: 'none'}}
                                        />
                                        <Dropdown
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={morningPartCount}
                                            value={consumptionTimesData && consumptionTimesData.morning[1]}
                                            labelField="value"
                                            valueField="value"
                                            onChange={(value) =>
                                                value && handleTabletMorningCount(value)
                                            }
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            containerStyle={styles.dropContainer}
                                        />
                                    </View>
                                </View>
                                <Divider style={{ backgroundColor: '#bebebe', width: 0.5, height: '80%' }} />

                                {/* Afternoon */}
                                <View style={styles.tabletCountSec}>
                                    <Text style={styles.headText}>Afternoon</Text>
                                    <View style={styles.dropDownCount}>
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={afternoonCount}
                                            value={consumptionTimesData && consumptionTimesData.afternoon[0]}
                                            labelField="value"
                                            valueField="value"
                                            onChange={(value) => {
                                                value && handleTabletAfternoonCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            containerStyle={styles.dropContainer}
                                        />
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={afternoonPartCount}
                                            value={consumptionTimesData && consumptionTimesData.afternoon[1]}
                                            // value={COUNT[0]}
                                            labelField="value"
                                            valueField="value"
                                            onChange={(value) => {
                                                value && handleTabletAfternoonCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            containerStyle={styles.dropContainer}
                                        />
                                    </View>
                                </View>

                                <Divider style={{ backgroundColor: '#bebebe', width: 0.5, height: '80%' }} />

                                {/* Night */}
                                <View style={styles.tabletCountSec}>
                                    <Text style={styles.headText}>Night</Text>
                                    <View style={styles.dropDownCount}>
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={nightCount}
                                            value={consumptionTimesData && consumptionTimesData.night[0]}
                                            labelField="value"
                                            valueField="value"
                                            // onSelectItem={(value) => {
                                            //     console.log(value);
                                            // }}
                                            onChange={(value) => {
                                                value && handleTabletNightCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            containerStyle={styles.dropContainer}
                                        />
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={250}
                                            data={nightPartCount}
                                            value={consumptionTimesData && consumptionTimesData.night[1]}
                                            labelField="value"
                                            valueField="value"
                                            onChange={(value) => {
                                                value && handleTabletNightCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            containerStyle={styles.dropContainer}
                                        />
                                    </View>
                                </View>
                            </View>
                        </>

                        : <></>
                }

                {/* Drops Block  */}
                {
                    (
                        medicineType === "drops"
                    ) ?
                        <>
                            {/* Morning */}
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 10 }}>Times :</Text>
                            <View style={styles.timesDrops}>
                                <View style={styles.dropCountSec}>
                                    <Text style={styles.headText}>Morning</Text>
                                    <View style={styles.dropDownCount}>
                                    {console.log("sdsadh",consumptionTimesData)}
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='1'
                                            style={styles.dropdownDrops}
                                            maxHeight={250}
                                            data={morningCount}
                                            value={consumptionTimesData && consumptionTimesData.morning && consumptionTimesData.morning[0]}
                                            labelField="value"
                                            valueField="value"
                                            onChange={(value) => handleTabletMorningCount(value)}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                        // containerStyle={styles.dropContainer}
                                        />

                                    </View>
                                </View>
                                {/* Afternoon */}
                                <View style={styles.dropCountSec}>
                                    <Text style={styles.headText}>Afternoon</Text>
                                    <View style={styles.dropDownCount}>
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='1'
                                            style={styles.dropdownDrops}
                                            maxHeight={250}
                                            data={afternoonCount}
                                            value={consumptionTimesData && consumptionTimesData.afternoon && consumptionTimesData.afternoon[0]}
                                            labelField="value"
                                            valueField="value"
                                            // onSelectItem={(value) => {
                                            //     console.log(value);
                                            // }}
                                            onChange={(value) => {
                                                value && handleTabletAfternoonCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                        // containerStyle={styles.dropContainer}
                                        />

                                    </View>
                                </View>
                                {/* Night */}
                                <View style={styles.dropCountSec}>
                                    <Text style={styles.headText}>Night</Text>
                                    <View style={styles.dropDownCount}>
                                        <Dropdown
                                            // placeholder="select a pet owner"
                                            // placeholderStyle={{color: '#668'}}
                                            placeholderStyle={{ color: '#00000040' }}
                                            placeholder='1'
                                            style={styles.dropdownDrops}
                                            maxHeight={250}
                                            data={nightCount}
                                            value={consumptionTimesData && consumptionTimesData.night && consumptionTimesData.night[0]}
                                            labelField="value"
                                            valueField="value"
                                            // onSelectItem={(value) => {
                                            //     console.log(value);
                                            // }}
                                            onChange={(value) => {
                                                value && handleTabletNightCount(value);
                                            }}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                        // containerStyle={styles.dropContainer}
                                        />

                                    </View>
                                </View>
                            </View>
                        </>
                        : <></>
                }
            </View>
        </>
    )
}

export default ConsumptionTimesComponent

const styles = StyleSheet.create({
    timeCheckBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    checkBoxComp: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#bebebe20'
    },

    textCheck: {
        color: '#000',
        fontWeight: 'bold',
        padding: 8
    },

    dropdown: {
        marginVertical: 10,
        paddingLeft: 5,
        paddingVertical: 5,
        backgroundColor: '#BFD9D980',
        width: 48,
    },

    dropdownDrops: {
        backgroundColor: '#BFD9D980',
        width: 100,
        padding: 10
    },

    dropDownCount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    tabletCountSec: {
        width: '30%',
        marginHorizontal: 5,
    },

    timesTablet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#BFD9D980'
    },

    headText: {
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: '700',
        color: '#006766',
    },

    dropContainer: {
        width: 60
    },

    timesDrops: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginHorizontal: 10
    }

});