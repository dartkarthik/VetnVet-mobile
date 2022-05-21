import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacityBase, TouchableOpacity, ScrollView } from 'react-native';
import { Divider, Switch, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import axios from 'react-native-axios';

const SubmitNewVisitForm = ({ navigation, route }) => {

    const [notificationData, setNotificationData] = useState({
        notificationPlatform: ['app-notification', 'whatsapp', 'email'],
        nextFollowupdate: '',
        followupReminderContent: "true",
        followupPlatform: ['app-notification', 'email'],
    });

    console.log("notificationData", notificationData);

    const [visible, setVisible] = useState(false);

    const [date, setDate] = useState();

    const [isSwitchOn, setIsSwitchOn] = useState(true);

    const [ data, setData ] = useState([]);

    // const [isAppNotificationSwitch, setIsAppNotificationSwitch] = useState(true);
    const [isDefaultWhatsappSwitch, setIsDefaultWhatsappSwitch] = useState(true);
    const [isEmailSwitch, setIsEmailSwitch] = useState(true);

    const [isFollowUpSwitch, setIsFollowUpSwitch] = useState(true);
    const [isFollowUpReminderSwitch, setIsFollowUpReminderSwitch] = useState(true);
    // const [isCustomAppNotificationSwitch, setIsCustomAppNotificationSwitch] = useState(true);
    const [isWhatsappSwitch, setIsWhatsappSwitch] = useState(false);
    const [isCustomEmailSwitch, setIsCustomEmailSwitch] = useState(true);

    const hideDialog = () => {
        setVisible(false);
        navigation.navigate('Pets')
    }

    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn)
        // console.log(!isSwitchOn);
    };

    // const onToggleAppNotificationSwitch = () => {
    //     let notificationPlatform = notificationData.notificationPlatform
    //     if(isAppNotificationSwitch){
    //         notificationPlatform = notificationPlatform.filter((element)=> element !== 'app-notification' );
    //         // console.log("Nww Array: "+notificationPlatform);
    //     }
    //     else{
    //         notificationPlatform.push("app-notification");
    //     }
    //     setIsAppNotificationSwitch(!isAppNotificationSwitch)
    //     setNotificationData({
    //         ...notificationData,
    //         notificationPlatform:notificationPlatform
    //     });
    // } 

    const onToggleDefaultWhatsappSwitch = (key) => {
        console.log(isDefaultWhatsappSwitch);
        let notificationPlatform = notificationData.notificationPlatform
        if (isDefaultWhatsappSwitch) {
            notificationPlatform = notificationPlatform.filter((element) => element !== 'whatsapp');
            // console.log("Nww Array: "+notificationPlatform);
        }
        else {
            notificationPlatform.push("whatsapp");
        }

        setIsDefaultWhatsappSwitch(!isDefaultWhatsappSwitch)
        setNotificationData({
            ...notificationData,
            notificationPlatform: notificationPlatform
        });
    };

    const onToggleEmailSwitch = () => {
        let notificationPlatform = notificationData.notificationPlatform
        if (isEmailSwitch) {
            notificationPlatform = notificationPlatform.filter((element) => element !== 'email');
            // console.log("Nww Array: "+notificationPlatform);
        }
        else {
            notificationPlatform.push("email");
        }
        setIsEmailSwitch(!isEmailSwitch)
        setNotificationData({
            ...notificationData,
            notificationPlatform: notificationPlatform
        });
    };

    const onToggleFollowUpSwitch = () => {
        setIsFollowUpSwitch(!isFollowUpSwitch)
    };

    const onToggleFollowUpReminderSwitch = () => {
        setIsFollowUpReminderSwitch(!isFollowUpReminderSwitch)
        setNotificationData({
            ...notificationData,
            followupReminderContent: !isSwitchOn
        });
    };

    // const onToggleCustomAppNotificationSwitch = () => {
    //     // setIsCustomAppNotificationSwitch(!isCustomAppNotificationSwitch)
    //     let followupPlatform = notificationData.followupPlatform
    //     if(isCustomAppNotificationSwitch){
    //         followupPlatform = followupPlatform.filter((element)=> element !== 'app-notification' );
    //         // console.log("Nww Array: "+notificationPlatform);
    //     }
    //     else{
    //         followupPlatform.push("app-notification");
    //     }
    //     setIsCustomAppNotificationSwitch(!isCustomAppNotificationSwitch)
    //     setNotificationData({
    //         ...notificationData,
    //         followupPlatform:followupPlatform
    //     });
    // }

    const onToggleWhatsappSwitch = () => {
        // setIsWhatsappSwitch(!isWhatsappSwitch)
        let followupPlatform = notificationData.followupPlatform
        if (isWhatsappSwitch) {
            followupPlatform = followupPlatform.filter((element) => element !== 'whatsapp');
            // console.log("Nww Array: "+notificationPlatform);
        }
        else {
            followupPlatform.push("whatsapp");
        }

        setIsWhatsappSwitch(!isWhatsappSwitch)
        setNotificationData({
            ...notificationData,
            followupPlatform: followupPlatform
        });
    };

    const onToggleCustomEmailSwitch = () => {
        let followupPlatform = notificationData.followupPlatform
        if (isCustomEmailSwitch) {
            followupPlatform = followupPlatform.filter((element) => element !== 'email');
            // console.log("Nww Array: "+followupPlatform);
        }
        else {
            followupPlatform.push("email");
        }
        setIsCustomEmailSwitch(!isCustomEmailSwitch)
        setNotificationData({
            ...notificationData,
            followupPlatform: followupPlatform
        });
    };

    const onSubmit = () => {
        // console.log("data", data);
        // let data = new FormData;
        let tempData = route.params.formData;
        // let filesData = route.params.files;
        // console.log(filesData);
        let notifData = notificationData
        // setData(tempData);
        // setNotificationData(tempData);
        tempData.notification = notifData;
        console.log("dataaaaaaaaaaa", tempData);
        // for (const key in tempData) {
        //     data.append(key, tempData[key]);
        // }
        // for (const key2 in notifData) {
        //     data.append(key2, notifData[key2]);
        // }
        // for (let i = 0; i < filesData.length; i++) {
        //     data.append("files[]", filesData[i]);
        // };
        
        // console.log("data", data);
        axios.post('/visitDetail', tempData).then(
            res => {
                console.log("data",res.data);
                if (res.status == '200') {
                    // navigation.navigate('petSubmitPage')
                    console.log('Visit Detail Registered Successfully');
                    // navigation.navigate('Pets');
                    setVisible(true)
                }
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
    }

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
                                onValueChange={onToggleSwitch}
                                trackColor={{ false: "#767577", true: "#00000050" }}
                                thumbColor={"#28AE7B"}
                            />
                        </View>

                    </View>
                </View>

            </View>
            <View style={{ alignItems: 'center', width: '100%' }}>
                <Text>
                    {isSwitchOn ?
                        <View>
                            {/* <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>App Notification</Text>
                                <Switch value={isAppNotificationSwitch} onValueChange={onToggleAppNotificationSwitch} />
                            </View> */}

                            <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>Whatsapp</Text>
                                <Switch 
                                    key="whatsapp" 
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
                                    onValueChange={onToggleEmailSwitch} 
                                    trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                    thumbColor={"#28AE7B"}
                                />
                            </View>

                            <Divider />

                            <View style={styles.trueSwitchContent}>
                                <View>
                                    <Text style={styles.leftText}>Next Follow Up</Text>
                                    <DatePicker
                                        style={styles.datePickerStyle}
                                        date={date} // Initial date from state
                                        mode="date" // The enum of date, datetime and time
                                        placeholder="select date"
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
                                <Switch 
                                    value={isFollowUpSwitch} 
                                    onValueChange={onToggleFollowUpSwitch} 
                                    trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                    thumbColor={"#28AE7B"}
                                />
                            </View>

                            <Divider />

                            <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>Followup Reminder Message ?</Text>
                                <Switch 
                                    value={isFollowUpReminderSwitch} 
                                    onValueChange={onToggleFollowUpReminderSwitch} 
                                    trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                    thumbColor={"#28AE7B"}   
                                />
                            </View>

                            {/* <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>App Notification</Text>
                                <Switch value={isCustomAppNotificationSwitch} onValueChange={onToggleCustomAppNotificationSwitch} />
                            </View> */}

                            <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>Whatsapp</Text>
                                <Switch 
                                    value={isWhatsappSwitch} 
                                    onValueChange={onToggleWhatsappSwitch} 
                                    trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                    thumbColor={"#28AE7B"}
                                />
                            </View>

                            <View style={styles.trueSwitchContent}>
                                <Text style={styles.leftText}>Email</Text>
                                <Switch 
                                    value={isCustomEmailSwitch} 
                                    onValueChange={onToggleCustomEmailSwitch} 
                                    trackColor={{ false: "#bebebe", true: "#28AE7B70" }}
                                    thumbColor={"#28AE7B"}
                                />
                            </View>

                            <Divider />

                        </View>
                        : ''}
                </Text>
            </View>
            <Text style={{ textAlign: 'center', opacity: 0.4, marginTop: 10,}}>App Message are sent by default. Only thing Send Message should be toggled on</Text>

            <TouchableOpacity onPress={() => onSubmit()}>
                <Text style={{
                    padding: 20,
                    textAlign: 'center',
                    backgroundColor: '#006766',
                    color: '#fff',
                    marginTop: 10,
                    // marginVertical: 20,
                    // width: 3600
                }}>
                    Done
                </Text>
            </TouchableOpacity>
            
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>New Visit Detail has been Succesfully added</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
        margin: 20,
    },

    trueSwitchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
    },

    leftText: {
        fontWeight: 'bold',
    },
})