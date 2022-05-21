import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacityBase, TouchableOpacity, ScrollView } from 'react-native';
import { Divider, Switch, Dialog, Portal, Paragraph } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import axios from 'react-native-axios';
import { Dropdown } from "react-native-element-dropdown";

const SubmitNewVisitForm = ({ navigation, route }) => {

    const [notificationData, setNotificationData] = useState({
        notificationPlatform: ['app-notification', 'whatsapp', 'email'],
        nextFollowupdate: '',
        followupReminderContent: false,
        followupPlatform: ['app-notification', 'email'],
        purpose: '',
    });

    const [ isVisitId, setIsVisitId ] = useState('');

    const purpose = [
        {id: 1, value: 'Treatment'},
        {id: 2, value: 'Vaccine'},
        {id: 3, value: 'Other Visit'},
    ]

    const [visible, setVisible] = useState(false);

    const [date, setDate] = useState();

    const [isSwitchOn, setIsSwitchOn] = useState(true);

    const [ data, setData ] = useState([]);

    // const [isAppNotificationSwitch, setIsAppNotificationSwitch] = useState(true);
    const [isDefaultWhatsappSwitch, setIsDefaultWhatsappSwitch] = useState(false);
    const [isEmailSwitch, setIsEmailSwitch] = useState(true);

    const [isFollowUpSwitch, setIsFollowUpSwitch] = useState(true);
    const [isFollowUpReminderSwitch, setIsFollowUpReminderSwitch] = useState(false);
    // const [isCustomAppNotificationSwitch, setIsCustomAppNotificationSwitch] = useState(true);
    const [isWhatsappSwitch, setIsWhatsappSwitch] = useState(false);
    const [isCustomEmailSwitch, setIsCustomEmailSwitch] = useState(true);

    const [ followUpVisible, setFollowUpVisible ] = useState(isDefaultWhatsappSwitch);

    const [ followupReminderVisible, setFollowUpReminderVisible ] = useState(false);
    const [ reminderDisabled, setReminderDisabled ] = useState(false);

    useEffect(() => {
        if(route.params.visitId) {
            console.log("visitId");
            setIsVisitId(route.params.visitId);
        } else if(route.params.visitIdFromPet) {
            console.log("visitIdFromPet");
            setIsVisitId(route.params.visitIdFromPet);
        } else if (route.params.visitIdFromVisits) {
            console.log("visitIdFromVisits");
            setIsVisitId(route.params.visitIdFromVisits);
        }
    }, [route.params.visitId, route.params.visitIdFromPet, route.params.visitIdFromVisits])
    

    const handlegoback = () => {
        setVisible(false);
        if(route.params.visitId) {
            navigation.navigate('Visits');
        }else if(route.params.visitIdFromPet) {
            navigation.navigate('Pets');
        }else if(route.params.visitIdFromVisits) {
            navigation.navigate('Visits');
        }
    }

    const onToggleSwitch = (key) => {
        setIsSwitchOn(key);
        if(key === true) {
            setNotificationData({
                ...notificationData,
                notificationPlatform: ['app-notification', 'whatsapp', 'email'],
                nextFollowupdate: '',
                followupReminderContent: true,
                followupPlatform: ['app-notification', 'email'],
            })
        } else if (key === false) {
            setNotificationData({
                ...notificationData,
                notificationPlatform: ['app-notification'],
                followupPlatform: ['app-notification'],
                nextFollowupdate: '',
                followupReminderContent: true,
            })
        }
    };

    const onToggleDefaultWhatsappSwitch = (key) => {
        setIsDefaultWhatsappSwitch(key);
        console.log(key);
        let notificationPlatform = notificationData.notificationPlatform
        if (key === true) {
            notificationPlatform.push("whatsapp");
        }else if (key === false) {
            notificationPlatform = notificationPlatform.filter((element) => element !== 'whatsapp');
        }
        setNotificationData({
            ...notificationData,
            notificationPlatform: notificationPlatform
        });
    };

    const onToggleEmailSwitch = (key) => {
        setIsEmailSwitch(key)
        let notificationPlatform = notificationData.notificationPlatform
        if (key === true) {
            notificationPlatform.push("email");
        }
        else if (key === false) {
            notificationPlatform = notificationPlatform.filter((element) => element !== 'email');
        }
        setNotificationData({
            ...notificationData,
            notificationPlatform: notificationPlatform
        });
    };

    const onToggleFollowUpSwitch = (key) => {
        setIsFollowUpSwitch(key);
        setFollowUpVisible(key);
        setReminderDisabled(key);
    };

    const onToggleFollowUpReminderSwitch = (key) => {
        setIsFollowUpReminderSwitch(key);
        setFollowUpReminderVisible(key);
        setNotificationData({
            ...notificationData,
            followupReminderContent: key
        });
    };

    const onToggleWhatsappSwitch = (key) => {
        setIsWhatsappSwitch(key)
        let followupPlatform = notificationData.followupPlatform
        if (key === true) {
            followupPlatform.push("whatsapp");
        }else if(key === false) {
            followupPlatform = followupPlatform.filter((element) => element !== 'whatsapp');
        }
        setNotificationData({
            ...notificationData,
            followupPlatform: followupPlatform
        });
    };

    const onToggleCustomEmailSwitch = (key) => {
        setIsCustomEmailSwitch(key)
        let followupPlatform = notificationData.followupPlatform
        if (key === true) {
            followupPlatform.push("email");
        }
        else if(key === false) {
            followupPlatform = followupPlatform.filter((element) => element !== 'email');
        }
        setNotificationData({
            ...notificationData,
            followupPlatform: followupPlatform
        });
    };

    const handlePurposeChange = (value) => {
        setNotificationData({
            ...notificationData,
            purpose: value.value
        })
    }

    const onSubmit = () => {
        let visitId = isVisitId;
        console.log(visitId);
        let data = notificationData
        data.notificationPlatform = JSON.stringify(notificationData && notificationData.notificationPlatform);
        data.followupPlatform = JSON.stringify(notificationData && notificationData.followupPlatform);
        console.log("data", data);
        axios.put(`/visitDetail/storeNotificationDetails/${visitId}`, data).then(
            res => {
                console.table("After Notification", res.data);
                // if(route.params.visitId) {
                //     sendMessageFromVisits(res.data.visit_id);
                //     console.log("In send Message From Visits");
                // }else if(route.params.visitIdFromPet) {
                //     sendMessageFromPets(res.data.visit_id);
                //     console.log("In send Message From Pets");
                // }else if(route.params.visitIdFromVisits) {
                //     sendMessageFromVisits(res.data.visit_id);
                //     console.log("In send Message From Visits");
                // }
                sendMessageFromVisits(res.data.visit_id);
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
    }

    const sendMessageFromVisits = (value) => {
        // console.log("Send Visit Message!!");
        let data = {
            visitId: value,
            "template": "visit_template"
        }
        axios.post('/send-notification', data).then(
            res => {
                console.log("After Message send", res.data);
                setVisible(true);
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
    }

    // const sendMessageFromPets = (value) => {
    //     // console.log("Send Visit Message!!");
    //     let data = {
    //         visitId: value,
    //         "template": "welcome_template"
    //     }
    //     axios.post('/send-notification', data).then(
    //         res => {
    //             console.table("After Message send", res.data);
    //             // props.onClose();
    //             setVisible(true);
    //             // navigation.navigate('Pets');
    //         }
    //     ).catch(
    //         err => {
    //             console.log(err);
    //         }
    //     );
    // }
    // console.log("data", notificationData);
    
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.topText}>The Visit Record Has Been Saved Succesfully</Text>
                    </View>

                    <Divider />

                    <View>
                        <View style={styles.switchContent}>
                            <Text style={styles.leftText}>Send Message ?</Text>
                            <Switch
                                value={isSwitchOn}
                                onValueChange={(key) => onToggleSwitch(key)}
                                trackColor={{ false: "#767577", true: "#F2AA4C80" }}
                                thumbColor={"#F2AA4CFF"}
                            />
                        </View>

                    </View>
                </View>

            </View>
            <View style={{ alignItems: 'center', width: '100%' }}>
                    <View style={{ width: '100%' }}>
                        {isSwitchOn ?
                            <View style={{ marginHorizontal: 50 }}>
                                <View style={styles.trueSwitchContent}>
                                    <Text style={styles.leftText}>Whatsapp</Text>
                                    <Switch 
                                        value={isDefaultWhatsappSwitch} 
                                        onValueChange={(key) => onToggleDefaultWhatsappSwitch(key)} 
                                        trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                        thumbColor={"#28AE7B"}
                                    />
                                </View>

                                <View style={styles.trueSwitchContent}>
                                    <Text style={styles.leftText}>Email</Text>
                                    <Switch 
                                        value={isEmailSwitch} 
                                        onValueChange={(key) => onToggleEmailSwitch(key)} 
                                        trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                        thumbColor={"#28AE7B"}
                                    />
                                </View>
                            </View>
                        : <></>}

                        <Divider />

                        <View style={styles.trueSwitchContent}>
                            <Text style={styles.leftText}>Next Follow Up</Text>
                            <Switch 
                                value={isFollowUpSwitch} 
                                onValueChange={(key) => onToggleFollowUpSwitch(key)} 
                                trackColor={{ false: "#767577", true: "#F2AA4C80" }}
                                thumbColor={"#F2AA4CFF"}
                            />
                        </View>
                        {isFollowUpSwitch ? 
                            <View style={{ marginHorizontal: 50, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, elevation: 2, borderRadius: 10, marginBottom: 20 }}>
                                <View style={{width:'100%', marginBottom: 20}}>
                                    <Text style={{fontWeight: 'bold', color: '#006766', marginBottom: 10}}>Next Follow Up date:</Text>
                                    <DatePicker
                                        style={styles.datePickerStyle}
                                        date={date} // Initial date from state
                                        mode="date" // The enum of date, datetime and time
                                        placeholder="select date"
                                        minDate={new Date()}
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                backgroundColor: '#fff',
                                                elevation: 2,
                                                borderWidth: 0,
                                            },
                                        }}
                                        onDateChange={(date) => {
                                            setDate(date);
                                            setNotificationData({
                                                ...notificationData,
                                                nextFollowupdate: date
                                            });
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{fontWeight: 'bold', color: '#006766', marginBottom: 10}}>Purpose:</Text>
                                    <Dropdown
                                        style={styles.purpose}
                                        placeholder='Select...'
                                        maxHeight={170}
                                        data={purpose}
                                        labelField='value'
                                        valueField='value'
                                        value={notificationData && notificationData.purpose}
                                        // item={weightUnit}
                                        searchPlaceholder='search...'
                                        placeholderStyle={{
                                            color: '#bebebe',
                                            fontSize: 16
                                        }}
                                        selectedTextStyle={{color: '#000'}}
                                        onChange={(value) => handlePurposeChange(value)}
                                    />
                                </View>
                            </View>
                        : <>
                            <View style={{ marginHorizontal: 50, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, elevation: 2, borderRadius: 10, marginBottom: 20 }}>
                                <View style={{width:'100%', marginBottom: 20}}>
                                    <Text style={{fontWeight: 'bold', color: '#bebebe', marginBottom: 10}}>Next Follow Up date:</Text>
                                    <DatePicker
                                        disabled
                                        style={styles.datePickerStyle}
                                        date={date} // Initial date from state
                                        mode="date" // The enum of date, datetime and time
                                        placeholder="select date"
                                        minDate={new Date()}
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                                // display: 'none'
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                backgroundColor: '#fff',
                                                elevation: 2,
                                                borderWidth: 0,
                                            },
                                        }}
                                        onDateChange={(date) => {
                                            setDate(date);
                                            setNotificationData({
                                                ...notificationData,
                                                nextFollowupdate: date
                                            });
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{fontWeight: 'bold', color: '#bebebe', marginBottom: 10}}>Purpose:</Text>
                                    <Dropdown
                                        disable
                                        style={{
                                            backgroundColor: '#bebebe60',
                                            padding: 5
                                        }}
                                        placeholder='Select...'
                                        maxHeight={170}
                                        data={purpose}
                                        labelField='value'
                                        valueField='value'
                                        value={notificationData && notificationData.purpose}
                                        // item={weightUnit}
                                        searchPlaceholder='search...'
                                        placeholderStyle={{
                                            color: '#00000070',
                                            fontSize: 16
                                        }}
                                        selectedTextStyle={{color: '#000'}}
                                        onChange={(value) => handlePurposeChange(value)}
                                    />
                                </View>
                            </View>
                        </>}

                        <Divider />

                        <View style={styles.trueSwitchContent}>
                            
                            {reminderDisabled ? 
                            <>
                                <Text style={styles.leftText}>Followup Reminder Message ?</Text>
                                <Switch 
                                    value={isFollowUpReminderSwitch} 
                                    onValueChange={(key) => onToggleFollowUpReminderSwitch(key)} 
                                    trackColor={{ false: "#767577", true: "#F2AA4C80" }}
                                    thumbColor={"#F2AA4CFF"}   
                                />
                            </>
                            : <>
                                <Text style={styles.leftText2}>Followup Reminder Message ?</Text>
                                <Switch 
                                    value={isFollowUpReminderSwitch} 
                                    onValueChange={(key) => onToggleFollowUpReminderSwitch(key)} 
                                    trackColor={{ false: "#767577", true: "#F2AA4C80" }}
                                    thumbColor={"#bebebe"}  
                                    disabled 
                                />
                            </>}
                        </View>

                        {/* <View style={styles.trueSwitchContent}>
                            <Text style={styles.leftText}>App Notification</Text>
                            <Switch value={isCustomAppNotificationSwitch} onValueChange={onToggleCustomAppNotificationSwitch} />
                        </View> */}
                        {followupReminderVisible ? 
                            <View style={{marginHorizontal: 50}}>
                                <View style={styles.trueSwitchContent}>
                                    <Text style={styles.leftText}>Whatsapp</Text>
                                    <Switch 
                                        value={isWhatsappSwitch} 
                                        onValueChange={(key) => onToggleWhatsappSwitch(key)} 
                                        trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                        thumbColor={"#28AE7B"}
                                    />
                                </View>

                                <View style={styles.trueSwitchContent}>
                                    <Text style={styles.leftText}>Email</Text>
                                    <Switch 
                                        value={isCustomEmailSwitch} 
                                        onValueChange={(key) => onToggleCustomEmailSwitch(key)} 
                                        trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                        thumbColor={"#28AE7B"}
                                    />
                                </View>
                            </View>
                        : <></>}
                        <Divider />
                    </View>
            </View>
            <Text style={{ textAlign: 'center', opacity: 0.4, marginTop: 10,}}>App Message are sent by default. Only thing Send Message should be toggled on</Text>

            <TouchableOpacity onPress={() => onSubmit()}>
                <Text style={{
                    padding: 20,
                    textAlign: 'center',
                    backgroundColor: '#006766',
                    color: '#fff',
                    marginTop: 10,
                }}>
                    Done
                </Text>
            </TouchableOpacity>

            {visible ?
                <Portal>
                    <Dialog visible={visible} onDismiss={handlegoback}>
                        <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                        
                        <Dialog.Content>
                            <Paragraph>Sent successfully</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handlegoback} title="Done" />
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                : <></>
            }

        </ScrollView>
    )
}

export default SubmitNewVisitForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topText: {
        fontSize: 14,
        marginVertical: 30,
        color: '#006766',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    switchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },

    trueSwitchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },

    leftText: {
        fontWeight: 'bold',
        color: '#000'
    },

    leftText2: {
        color: '#bebebe',
        fontWeight: 'bold'
    },

    purpose: {
        backgroundColor: '#BFD9D970',
        padding: 5
    },

    datePickerStyle: {
        width: '100%',
    }
})