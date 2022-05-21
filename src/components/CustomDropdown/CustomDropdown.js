import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Dialog, Portal } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


const CustomDropdown = ({
    data,
    handleAddEvent,
    onChange,
    buttonLabel,
    defaultValue,
    isButton,
    dropdownType,
    autoFocusSearch,
    enableSearch,
    valueField,
    labelField
}) => {

    let FILTEREDOPTIONDATA = [];

    const [searchValue, setSearchValue] = useState("");
    const [buttonName, setButtonName] = useState("Add");
    const [_dropdownType, setDropdownType] = useState("single");
    const [_optionLabel, setOptionLabelField] = useState("label");
    const [_optionValue, setOptionReturnValue] = useState("id");

    const [selectedOption, setSelectedOption] = useState({});
    const [selectedMultiOption, setSelectedMultiOption] = useState([]);
    const [returnMultiOption, setReturnMultiOption] = useState([]);
    const [optionData, setOptionData] = useState([]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [displayButton, setDisplayButton] = useState(true);
    const [_enableSearch, setEnableSearch] = useState(true);
    const [_autoFocusSearch, setAutoFocusSearch] = useState(true);

    //  To display bottom button based on property
    useEffect(() => {
        if (isButton != undefined && isButton.toString() == "true") {
            setDisplayButton(true);
        } else if (isButton != undefined && isButton.toString() == "false") {
            setDisplayButton(false);
        }
    }, [isButton]);

    //  To display bottom button based on property
    useEffect(() => {
        if (enableSearch != undefined && enableSearch.toString() == "true") {
            setEnableSearch(true);
        } else if (enableSearch != undefined && enableSearch.toString() == "false") {
            setEnableSearch(false);
        }
    }, [enableSearch]);

    //  To enable auto focus
    useEffect(() => {
        if (autoFocusSearch != undefined && autoFocusSearch.toString() == "true") {
            setAutoFocusSearch(true);
        } else if (autoFocusSearch != undefined && autoFocusSearch.toString() == "false") {
            setAutoFocusSearch(false);
        }
    }, [autoFocusSearch]);

    // To set dropdown return value
    useEffect(() => {
        if (valueField) {
            setOptionReturnValue(valueField);
        }
    }, [valueField]);

    // To set dropdown label value
    useEffect(() => {
        if (labelField) {
            setOptionLabelField(labelField);
        }
    }, [labelField]);

    // To set dropdown type
    useEffect(() => {
        if (dropdownType) {
            setDropdownType(dropdownType);
        }
    }, [dropdownType]);

    // To set dropdown option data
    useEffect(() => {
        if (data && data.length !== 0) {
            setOptionData(data);
        }
    }, [data]);

    // To set button label
    useEffect(() => {
        if (buttonLabel) {
            setButtonName(buttonLabel);
        }
    }, [buttonLabel]);

    // To set default selected value
    useEffect(() => {
        if (defaultValue && optionData && optionData.length !== 0) {
            if (_dropdownType === "single") {
                let tempOption = optionData.find((element) => element.id === defaultValue);
                setSelectedOption(tempOption);
                console.log("test",tempOption);
            } else if (defaultValue.length > 0 && _dropdownType === "multiple") {
                let tempOption = optionData.filter((element) => defaultValue.includes(element.id));
                setSelectedMultiOption(tempOption);
                setReturnMultiOption(defaultValue);
            }
        }
    }, [defaultValue, optionData]);

    const optionSelectFunc = (value) => {
        if (_dropdownType === "single") {
            setSelectedOption(value);
            setDropdownOpen(false);
            returnValue(value);
        } else if (_dropdownType === "multiple") {
            let tempSelArray = [...selectedMultiOption];
            let tempRetArray = [...returnMultiOption];
            if (tempSelArray.includes(value)) {
                tempSelArray = tempSelArray.filter(element => element !== value);
                tempRetArray = tempSelArray.map(element => element[_optionValue]);
            } else {
                tempSelArray.push(value);
                tempRetArray.push(value[_optionValue]);
            }
            setSelectedMultiOption(tempSelArray);
            setReturnMultiOption(tempRetArray)
            returnValue(tempRetArray);
        }
    }

    const onFilterFunc = (filterValue) => {
        setSearchValue(filterValue);
    }

    const clearSelectedValues = () => {
        setSelectedOption({});
        setSelectedMultiOption([]);
        setReturnMultiOption([]);
        returnValue({});
    }

    const handleAddButton = () => {
        setDropdownOpen(false);
        handleAddEvent && handleAddEvent();
    }

    const unSelect = (value) => {
        let tempSelArray = [...selectedMultiOption];
        let tempRetArray = [...returnMultiOption];
        tempSelArray = tempSelArray.filter(element => element !== value);
        tempRetArray = tempSelArray.map(element => element[_optionValue]);
        setSelectedMultiOption(tempSelArray);
        setReturnMultiOption(tempRetArray)
        returnValue(tempRetArray);
    }

    const returnValue = (value) => {
        if ((typeof onChange === 'function')) {
            onChange(value);
        }
    }

    if (searchValue) {
        FILTEREDOPTIONDATA = optionData.filter(data => {
            return (
                // (data.id.toLowerCase().includes(searchValue.toLowerCase())) ||
                (data.label.toLowerCase().includes(searchValue.toLowerCase()))
            )
        });
    } else {
        FILTEREDOPTIONDATA = optionData;
    }

    return (
        <>
            <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() => setDropdownOpen(true)}
            >
                <Text
                    style={styles.dropdownTextInput}
                >
                    {selectedOption && !selectedOption[_optionLabel] ? "Select a item" : selectedOption[_optionLabel]}
                </Text>
                {Object.keys(selectedOption).length <= 0 && selectedMultiOption.length <= 0 ?
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        color={'#006766'}
                        size={20}
                    /> :
                    <MaterialCommunityIcons
                        name="close-circle-outline"
                        color={'#eb5542'}
                        size={20}
                        onPress={clearSelectedValues}
                    />}
            </TouchableOpacity>

            <View >
                <Portal>
                    <Dialog visible={dropdownOpen} style={styles.dialogContent} onDismiss={() => setDropdownOpen(false)}>
                        <Dialog.Content style={styles.dialogContent}>
                            {_enableSearch ?
                                <TextInput
                                    style={styles.dropdownSearchInput}
                                    placeholder='Search...'
                                    autoFocus={_autoFocusSearch}
                                    onChangeText={(value) => onFilterFunc(value)}
                                /> : <></>}
                            <ScrollView
                                style={styles.optionList}
                                showsVerticalScrollIndicator={true}
                            >
                                {
                                    FILTEREDOPTIONDATA.map((option, index) => (
                                        <TouchableOpacity
                                            style={styles.optionButton}
                                            key={option.id}
                                            onPress={() => optionSelectFunc(option)}
                                        >
                                            {
                                                _dropdownType === "single" ?
                                                    <Text key={option.id} style={selectedOption && selectedOption.id !== option.id ? styles.optionText : styles.selectedOptionText}>{option[_optionLabel]}</Text>
                                                    :
                                                    // <></>
                                                    <Text key={option.id} style={selectedMultiOption.length > 0 && selectedMultiOption.includes(option) ? styles.selectedMulOptionText : styles.optionText}>{option[_optionLabel]}</Text>
                                            }
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </Dialog.Content>
                        {displayButton ?
                            <View>
                                <TouchableOpacity
                                    onPress={() => handleAddButton()}
                                    style={styles.addBtn}
                                >
                                    <Text style={styles.addBtnText}>{`+ ${buttonName}`}</Text>
                                </TouchableOpacity>
                            </View>
                            : <></>}
                    </Dialog>
                </Portal>
            </View>
            {selectedMultiOption.length > 0 ?
                <>
                    <View style={styles.multiOptPotContainer}>
                        {
                            selectedMultiOption.map((option, index) => (
                                <View style={styles.multiOptPot}>
                                    <Text style={styles.eachSelectValText}>{option[_optionLabel]}</Text>
                                    <TouchableOpacity onPress={() => unSelect(option)}>
                                        <MaterialCommunityIcons
                                            name="delete"
                                            color={'#fff'}
                                            size={18}
                                            style={{ marginLeft: 10 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </View>
                </>
                : <></>}
        </>
    );
}

const styles = StyleSheet.create({
    dialogContent: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    dropdownTextInput: {
        borderRadius: 10,
        fontSize: 15,
        color: '#00000090',
        fontWeight: '600'
    },
    dropdownSearchInput: {
        borderBottomWidth: 2,
        borderBottomColor: '#28AE7B90',
        borderRadius: 10,
        fontSize: 20,
        padding: 10,
        marginHorizontal: 10
    },
    optionList: {
        height: 250
    },
    optionButton: {
        // margin: 1,
        textTransform: 'capitalize',
    },
    optionText: {
        color: "#161622",
        padding: 15,
        fontSize: 15,
    },
    selectedOptionText: {
        padding: 15,
        fontSize: 17,
        backgroundColor: '#bebebe30',
        fontWeight: 'bold',
        color: '#006766'
    },
    selectedMulOptionText: {
        padding: 15,
        fontSize: 17,
        backgroundColor: '#bebebe30',
        fontWeight: 'bold',
        color: '#006766'
    },
    ImageIconStyle: {
        width: 15,
        height: 15,
    },
    addBtn: {
        backgroundColor: '#006766',
        padding: 12,
    },
    addBtnText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    dropdownBox: {
        backgroundColor: '#fff',
        // elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        elevation: 1,
    },
    multiOptPotContainer: {
        borderColor: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // padding: 5
    },
    multiOptPot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "flex-start",
        borderRadius: 14,
        backgroundColor: '#006766',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    eachSelectValText: {
        marginRight: 5,
        fontSize: 16,
        color: '#fff',
    },
});

export default CustomDropdown;