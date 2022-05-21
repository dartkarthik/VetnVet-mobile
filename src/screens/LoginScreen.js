import React, { useState, useContext, useEffect } from "react";
import { Dimensions, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from 'react-native-paper';

import { AuthContext } from "../components/Context";

export default function LoginScreen() {

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        emailInputCheck: false,
        emailInputCheckIconColor: '#808080',
        secureTextEntry: true,
        rememberme: false,
    })

    const { signIn } = useContext(AuthContext);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      setLoginData({
          ...loginData,
          rememberme: !checked
      })
    }, [])
    
    
    const handleInputChange = (value) => {
        if (value.length !== 0) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            // console.log(reg.test());
            if (reg.test(value)) {
                setLoginData({
                    ...loginData,
                    email: value,
                    emailInputCheck: true,
                    emailInputCheckIconColor: 'green'
                });
            } else {
                setLoginData({
                    ...loginData,
                    email: value,
                    emailInputCheck: false,
                    emailInputCheckIconColor: '#808080'
                });
            }

        } else {
            setLoginData({
                ...loginData,
                email: value,
                emailInputCheck: false
            });
        }
    }

    const handlePasswordChange = (value) => {
        setLoginData({
            ...loginData,
            password: value
        });
    }

    const handleSecureTextEntry = () => {
        setLoginData({
            ...loginData,
            secureTextEntry: !loginData.secureTextEntry
        })
    }

    const handleForgetPassword = () => {
        console.log("forget password");
    }

    const handleSubmit = () => {
        if (loginData.email && loginData.emailInputCheck && loginData.password) {
            console.log("Login Successful");
            const data = {
                email: loginData.email,
                password: loginData.password
            }
            signIn(data);
        }
    }

    const handleSwitch = (value) => {
        // console.log(value);
        setLoginData({
            ...loginData,
            rememberme: value
        })
    }

    console.log(loginData)

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {/* <Text style={{fontSize: 34, lineHeight: 30, color: '#fff'}}>vetNvet</Text>
                <Text style={{fontSize: 12, lineHeight: 14, height: 40, color: '#fff'}}>TM</Text> */}
                <Image
                    style={styles.tinyLogo}
                    source={require('../../assets/logov.png')}
                />
            </View>
            <View style={styles.footer}>
                <Text
                    style={[
                        styles.text_footer, {
                            marginTop: 35,
                            marginBottom: 10
                        },
                    ]}
                >
                    Email
                </Text>
                <View style={styles.action}>
                    <MaterialIcons
                        name="email" 
                        size={30} 
                        color="#00000090"
                    />
                    <TextInput
                        placeholder="Enter your email"
                        style={styles.textInput}
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        onChangeText={(value) => handleInputChange(value)}
                    />
                    {/* {loginData.emailInputCheck ? */}
                    <Feather name="check-circle" size={20} color={loginData.emailInputCheckIconColor} />
                    {/* : null} */}
                </View>
                <Text
                    style={[
                        styles.text_footer, {
                            marginTop: 35,
                            marginBottom: 10
                        }
                    ]}
                >
                    Password
                </Text>
                <View style={styles.action}>
                    <MaterialIcons
                        name="lock" size={30} color="#00000090"
                    />
                    <TextInput
                        placeholder="Password"
                        style={styles.textInput}
                        secureTextEntry={loginData.secureTextEntry}
                        autoCapitalize="none"
                        textContentType="password"
                        onChangeText={(value) => handlePasswordChange(value)}
                    />
                    <TouchableOpacity
                        onPress={handleSecureTextEntry}
                    >
                        <Feather name="eye-off" size={20} color="#808080" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.button}>
                        <Text style={styles.signButton}>Sign In</Text>
                    </View>

                </TouchableOpacity>
                <View style={styles.footLogin}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {setChecked(!checked);handleSwitch(!checked);}}
                            uncheckedColor= {'#000'}
                            color={'#0E9C9B'}
                        />
                        <Text style={styles.label}>Remember Me</Text>
                    </View>
                    
                    <TouchableOpacity onPress={handleForgetPassword}>
                        <Text style={[styles.action, { color: "#000" }]}>Forget Password?</Text>
                    </TouchableOpacity>
                </View>
                
            </View >
            <StatusBar style="auto" />
        </SafeAreaView >
    );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        elevation: 10,
        borderTopWidth: 2,
        borderTopColor: '#006766',
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#006766',
        padding: 20,
        borderRadius: 10,
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    signButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fefefe',
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: 'center'
    },
    checkbox: {
        alignSelf: "center",
    },
    footLogin: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    logo: {
        width: 66,
        height: 58,
    },
});