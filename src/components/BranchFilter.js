import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Dialog, Portal, Checkbox } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'react-native-axios';

const BranchFilter = (props) => {

    // console.log("ferferereretetetetget", props.userData.clinic_branches);

    const [initialRender, setInitialRender] = useState(false);
    const [optionData, setOptionData] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState(false);
    const [treeData, setTreeData] = useState([
        {
            title: 'All',
            key: 'branch',
            children: [],
        },
    ]);

    
    useEffect(() => {
        setInitialRender(true);
        populateUserBranches();
    }, [initialRender])

    const onCheckAll = () => {
        setCheckedKeys(!checkedKeys);
    }

    const populateUserBranches = () => {
        let branchData = [...treeData];
        branchData[0].children = [];
        let checkedKeys = [];
        props.userData.clinic_branches.map((element, index) => {
            branchData[0].children.push({
                title: element.branch,
                key: element.id
            });
            checkedKeys.push(element.id);
        });
        setCheckedKeys(checkedKeys);
        setTreeData(branchData);
        // processCheckedValues();
    }

    // console.log("treeData", treeData);
  
    return (
         <View>
            <TouchableOpacity
                style={styles.filterBox}
                onPress={() => setDropdownOpen(true)}
            >
                <MaterialIcons
                    name="settings"
                    color={'#000'}
                    size={40}
                />
            </TouchableOpacity>

            <View>
                <Portal>
                    <Dialog visible={dropdownOpen} style={styles.dialogContent} onDismiss={() => setDropdownOpen(false)}>
                        <Dialog.Content style={styles.dialogContent}>
                            <Text style={{color: '#fff', backgroundColor: '#000', padding: 8}}>Branch Filter</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Checkbox
                                    status={checkedKeys ? 'checked' : 'unchecked'}
                                    onPress={() => onCheckAll()}
                                    color='#70DC70'
                                    uncheckedColor='#000'
                                />
                                <Text>All</Text>
                            </View>
                            <ScrollView>
                                    
                            </ScrollView>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    dropdownTextInput: {
        borderRadius: 10,
        fontSize: 15,
        color: '#00000080',
    },
    dialogContent: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    // filterBox: {
    //     flexDirection: 'row',
    // },
    // btnText: {
    //     marginRight: 10,
    // },
});

export default BranchFilter