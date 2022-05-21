import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ScrollView,
} from 'react-native';
import axios from 'react-native-axios';
import { Divider, FAB, Searchbar ,Button,Dialog, Portal, Paragraph} from 'react-native-paper';
import
MaterialCommunityIcons
    from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ListItem = ({ item, selected, onPress, onLongPress }) => (
    <>
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
                marginBottom: 10,
                borderRadius: 5,
                overflow: 'hidden',
                marginHorizontal: 10,
                marginVertical: 5,
            }}
        >
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 50, padding: 10, elevation: 2 }}>
                    <MaterialCommunityIcons
                        name="cat"
                        color={'#006766'}
                        size={30}
                    />
                </View>

                <View style={{ backgroundColor: '#fff', marginVertical: 5, padding: 15, borderRadius: 14, elevation: 2, width: '80%' }}>
                    <Text style={{ fontWeight: 'bold', color: '#31352E' }}>{item.breed} | <Text style={{ color: '#00000070' }}>{item.animal_type}</Text></Text>
                </View>
                {selected && <View style={styles.overlay} />}
            </View>
        </TouchableOpacity>
    </>
);

const Breed = ({ route, navigation }) => {

    const [refreshing, setRefreshing] = useState(false);

    //searchbar
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    const [breedData, setBreedData] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [infoMsg, setinfoMsg] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            getBreedData();
        }
    }, [isFocused])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getBreedData();
        setSelectedItems([]);
    }, []);

    const getBreedData = async () => {
        let userClinicId = route.params.userDetails.clinic.id
        let breedData = breedData;
        breedData = [];
        await axios.get(`/breed/clinic/${userClinicId}`).then(
            res => {
                // console.log("breedData",res.data);
                res.data.map((element, index) => {
                    // console.log(element.animal_type);
                    breedData.push({
                        id: element.id,
                        breed: element.edited_name ? element.edited_name : element.actual_name,
                        animal_type: element.edited_animal_name ? element.edited_animal_name : element.actual_animal_name,
                    });
                });
                setBreedData(breedData);
                // console.log(res.data);
                setFilteredDataSource(breedData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const handleOnPress = (item) => {
        if (selectedItems.length) {
            return selectItems(item);
        }
        // here you can add you code what do you want if user just do single tap
        // console.log('selectItems', item);
        navigation.navigate('EditBreed', { breedData: item });
    };

    const getSelected = breedData => selectedItems.includes(breedData.id);

    const deSelectItems = () => {
        setSelectedItems([]);
        console.log(setSelectedItems);
    };

    const selectItems = (item) => {
        if (selectedItems.includes(item.id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== item.id,
            );
            return setSelectedItems([...newListItems]);

        }
        setSelectedItems([...selectedItems, item.id]);

        console.log('selectedItems', selectedItems);
    };

    const onDelete = async () => {
        let newListDel = selectedItems;
        console.log(newListDel);
        await axios.delete(`/breed/${newListDel}`).then(
            res=>{
                // console.log(res.data);
                if (res.status === 200) {
                    console.log('Breed deleted');
                    // setVaccineData(res.data)
                    // getBreedData();
                    onRefresh();
                    setSuccessMsg(true);

                }
                else if (res.status == "222" || res.status == "201") {
                    console.log('This record is in use. Cannot be deleted!');
                    setErrorMsg(true);
                } 
                else if (res.status == "202") {
                    console.log('Default master data cannot be deleted!');
                    setinfoMsg(true);
                }
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const searchFilterFunction = (text) => {
        // console.log("ttt", breedData);
        const newData = breedData.filter(item => {
            const itemData = `
            ${item.breed}   
            
            
            ${item.animal_type}`;

            const textData = text.toLowerCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
    };

    const handlegoback = () => {
        setSuccessMsg(false);
    }
    
    const handleCancel = () => {
        setErrorMsg(false);
    }
    
    const handleWarning = () => {
    setinfoMsg(false);
    }

    return (
        <>
            <View style={{ marginTop: 10 }}>
                <Searchbar
                    placeholder="Search breed or animal name"
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    style={{ borderRadius: 40, margin: 10, backgroundColor: '#fff'}}
                    autoCorrect={false}
                    iconColor='#000'
                    placeholderTextColor={'#00000070'}
                    color={'#000'}
                />
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Pressable onPress={deSelectItems} style={{ flex: 1, marginBottom: 70 }}>
                    <FlatList
                        data={filteredDataSource}
                        renderItem={({ item }) => (
                            <>
                                <ListItem
                                    onPress={() => handleOnPress(item)}
                                    onLongPress={() => selectItems(item)}
                                    selected={getSelected(item)}
                                    item={item}
                                />
                            </>
                        )}
                    // keyExtractor={item => item.id}
                    />
                </Pressable>
            </ScrollView>

            <View>
          <>
          {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Breed has been deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {errorMsg ?
                <Portal>
                  <Dialog visible={errorMsg} onDismiss={handleCancel}>
                      <Dialog.Title style={{ color: 'red' }}>Error</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>This record is in use. Cannot be deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleCancel}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {infoMsg ?
                <Portal>
                  <Dialog visible={infoMsg} onDismiss={handleWarning}>
                      <Dialog.Title style={{ color: 'red' }}>Info</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Default master data cannot be deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleWarning}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
          </>
        </View>

            <View style={styles.container}>
                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="plus"
                        color='#fff'
                        onPress={() => navigation.navigate('AddBreed')}
                    />
                </View>
                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="home"
                        color='#fff'
                        onPress={() => navigation.navigate('Dashboard')}
                    />
                </View>
                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="delete"
                        color='#fff'
                        onPress={onDelete}
                    />
                </View>
            </View>
        </>
    );
};

export default Breed;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#28AE7B90',
    },
    container: {
        position: 'absolute',
        marginVertical: 20,
        right: 0,
        bottom: 0,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10
    },
    fab: {
        backgroundColor: '#006766',
    },
});

