import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Pressable } from "react-native";
import { Searchbar, FAB, Dialog, Portal, Paragraph, Button } from "react-native-paper";
import axios from "react-native-axios";
import { useIsFocused } from "@react-navigation/native";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Templates = ({ route, navigation }) => {

  const [refreshing, setRefreshing] = useState(false);

  const [prescriptionTemplate, setPrescriptionTemplate] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const [ selectedItems, setSelectedItems ] = useState([]);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  // const [infoMsg, setinfoMsg] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) {
      getPrescriptionTemplates();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      getPrescriptionTemplates();
      setRefreshing(false);
    });
  }, []);

  const getPrescriptionTemplates = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    // console.log(userClinicId);
    let prescriptionTemplate = prescriptionTemplate
    prescriptionTemplate = [];
    await axios.get(`prescription-template/clinic/${userClinicId}`).then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setPrescriptionTemplate(res.data);
          setFilteredDataSource(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchFilterFunction = (text) => {
    const newData = prescriptionTemplate.filter(item => {      
      const itemData = `
      ${item.template_id.toUpperCase()}   
      ${item.template_id.toLowerCase()} 
      ${item.template_name.toUpperCase()}
      ${item.template_name.toLowerCase()}
      `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  };

  const selectItems = (elements) => {
    // selectedItems.includes(elements.id);
    // setSelectedItems(elements.id);
    if (selectedItems.includes(elements.id)) {
        const newListItems = selectedItems.filter(
            listItem => listItem !== elements.id,
        );
        return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, elements.id]);
    // setSelected(true);
    console.log('selectedItems', selectedItems);
  };

  const deSelectItems = () => {
    setSelectedItems([]);
    // setSelected(false);
    console.log(setSelectedItems);
    
  };

  const handleOnPress = (elements) => {
    if (selectedItems.length) {
        return selectItems(elements);
    }
    navigation.navigate('AddPrescription', {data: elements, EditPrescription: "EditPrescription"});
  }

  const onDelete = async () => {
    console.log(selectedItems);
    let SelectedItems = selectedItems;
    await axios.delete(`/prescription-template/${SelectedItems}`).then(
      res=>{
          // console.log(res.data);
          if (res.status === 200) {
              console.log('Template deleted');
              setSuccessMsg(true);
          }
          // else if (res.status == "222" || res.status == "201") {
          //     console.log('This record is in use. Cannot be deleted!');
          //     setErrorMsg(true);
          // } 
          // else if (res.status == "202") {
          //     console.log('Default master data cannot be deleted!');
          //     setinfoMsg(true);
          // }
      }
    ).catch(
        err => {
            console.log(err)
            setErrorMsg(true);
        }
    )

  }
  
  const handlegoback = () => {
    onRefresh();
    setSuccessMsg(false);
  }

  const handleCancel = () => {
      setErrorMsg(false);
  }

  return (
    <>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={{marginBottom: 70}}>
          <View>
            <Searchbar
              placeholder="Search by template name or Id"
              placeholderTextColor={'#00000040'}
              onChangeText={(text) => searchFilterFunction(text)}
              value={search}
              color={'#2f2f7e'}
              style={{ backgroundColor: '#fff', borderRadius: 50, marginVertical: 20, fontSize: 12, marginHorizontal: 10}}
              iconColor={'#006766'}
              textAlign={'center'}
            />
          </View>
          <View>
            {filteredDataSource.map((elements, index) => (
              <Pressable onPress={deSelectItems} key={index}>
                <TouchableOpacity
                  onPress={() => handleOnPress(elements)}
                  key={index}
                  onLongPress={() => selectItems(elements)}

                >
                  <View style={{marginVertical: 10, elevation: 5}}>
                      <Text style={{
                        marginHorizontal: 10, 
                        backgroundColor: '#fff', 
                        paddingVertical: 5, 
                        color: '#006766', 
                        fontSize: 12, 
                        textAlign: 'right', 
                        paddingHorizontal: 10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#bebebe',
                        elevation: 2,
                      }}>
                          Template Id - <Text style={{fontWeight: 'bold', fontSize: 15}}>{elements.template_id}</Text>
                      </Text>
                      <View style={styles.display}>
                          <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>Template Name :</Text> {elements.template_name}</Text>
                          <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>Short Note :</Text> {elements.short_note}</Text>
                          {/* <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>Short Note :</Text> {elements.medicine[{}]}</Text> */}
                      </View>
                  </View>
                </TouchableOpacity>
                { selectedItems.includes(elements.id) && 
                      <View style={styles.overlay} />
                }
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      {successMsg ?
        <Portal>
          <Dialog visible={successMsg} onDismiss={handlegoback}>
              <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
              <Dialog.Content>
                  <Paragraph>Template has been deleted!</Paragraph>
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
      {/* {infoMsg ?
        <Portal>
          <Dialog visible={infoMsg} onDismiss={handleWarning}>
              <Dialog.Title style={{ color: 'red' }}>Info</Dialog.Title>
              <Dialog.Content>
                  <Paragraph>Default Template cannot be deleted!</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                  <Button onPress={handleWarning}>Done</Button>
              </Dialog.Actions>
          </Dialog>
        </Portal>
        : <></>
      } */}
      <View style={styles.floatButtons}>
            <View>
              <FAB
              style={styles.fab}
              medium
              icon="plus"
              color='#fff'
              onPress={() => navigation.navigate('AddPrescription')}
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

const styles = StyleSheet.create({
  display: {
    justifyContent: "center",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    elevation: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  text: {
    fontSize: 14,
    color: '#000',
    width: '100%',
    marginVertical: 10
  },
  floatButtons: {
    position: 'absolute',
    marginVertical: 20,
    right: 0,
    bottom: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  fab: {
    backgroundColor: "#006766",
  },
  role: {
    fontSize: 14,
    color: "white",
    marginVertical: 5,
    fontWeight: "bold",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#66CDAA70',
  },
});

export default Templates;
