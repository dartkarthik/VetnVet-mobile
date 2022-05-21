import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { SectionGrid } from 'react-native-super-grid';

const Masters = ({navigation}) => {

    const [items, setItems] = useState([
        { name: 'Animal', value1: 'Manage Types of Animals. Ex: Dog, Cat, Dove etc', route: () =>navigation.navigate('Animal') },
        { name: 'Breed', value1: 'Manage Breeds and Associated Animals. Ex: Labrador, retriever', route: () =>navigation.navigate('Breed') },
        { name: 'Colors', value1: 'Manage Possible Colors and Coats for Animals ', route: () =>navigation.navigate('Colors')  },
        { name: 'Medicine', value1: 'Manage All Possible Medicines', route: () =>navigation.navigate('Medicine') },
        { name: 'Vaccines', route: () =>navigation.navigate('Vaccines') },
        { name: 'Disease', route: () =>navigation.navigate('Disease') },
        { name: 'Symptoms', route: () =>navigation.navigate('Symptoms') },
        { name: 'Visit Type', route: () =>navigation.navigate('VisitType') },
        { name: 'Visit Purpose', route: () =>navigation.navigate('VisitPurpose') },
      ]);


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView style={styles.container}>
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
                        <TouchableOpacity onPress={item.route}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemCode}>{item.value1}{"\n"}{item.value2}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </ScrollView>
    )
}

export default Masters

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridView: {
        flex: 1,
    },
    itemContainer: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 150,
        marginVertical: 8,
        shadowColor: '#000',
        elevation: 5,
    },
    itemName: {
        fontSize: 16,
        color: '#006766',
        fontWeight: 'bold',
        marginHorizontal: 5,
        textAlign: 'center',
    },
    itemCode: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#00000070',
        paddingHorizontal: 15,
        paddingVertical: 5,
        textAlign: 'center',
    },
});