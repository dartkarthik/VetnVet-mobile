import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";


export default function Accordion({ 
    renderListContent, 
    renderAccordianList,
    onLongPress,
    data,
    valueField,
 }) {

    const [expanded, setExpanded] = useState(false);
    const [_valueField, setValueField] = useState("id");

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, [])

    useEffect(() => {
        if (valueField) {
            setValueField(valueField);
        }
    }, [valueField]);

    const _onLongPress = (data) =>{
        onLongPress && onLongPress(data[_valueField]);
    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded)
    }

    return (
        <View key={makeid(5)}>
            <TouchableOpacity key={makeid(5)} onLongPress={() => _onLongPress(data)} onPress={() => toggleExpand()}>
                {renderAccordianList}
            </TouchableOpacity>
            {
                expanded && renderListContent ?
                    <View key={makeid(5)} style={styles.child}>
                        {renderListContent}
                    </View>
                    : <></>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#A9A9A9",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        // backgroundColor: "#BEBEBE",
    },
    parentHr: {
        height: 1,
        color: "#FFFFFF",
        width: '100%'
    },
    // child: {
    //     backgroundColor: "#D3D3D3",
    //     padding: 16,
    // }

});