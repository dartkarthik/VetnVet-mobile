import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Pressable
} from "react-native";
import { Divider, FAB, Searchbar } from "react-native-paper";
import axios from "react-native-axios";
import DatePicker from "react-native-datepicker";
import { useIsFocused } from "@react-navigation/core";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Visits = ({ route, navigation, selected }) => {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      getVisitData();
      setRefreshing(false)});
  }, []);

  const isFocused = useIsFocused();

  const [visitData, setVisitData] = useState([]);
  
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if(isFocused) {
      getVisitData();
    }
  }, [isFocused]);

  const getVisitData = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    await axios
      .get(`visitDetail/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          // console.log(res.data);
          // VisitHistory = res.data;
          setVisitData(res.data);
          setFilteredDataSource(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

 
  const searchFilterFunction = (text) => {
    const newData = visitData.filter(items => {
      const itemData = `${items.pet_id.pet_name.toUpperCase()}   
      ${items.pet_id.pet_name.toLowerCase()} 
      ${items.owner_name_id.pet_owner_name.toUpperCase()}
      ${items.owner_name_id.pet_owner_name.toLowerCase()}
      ${items.pet_id.last_visit.toLowerCase()}
      ${items.pet_id.last_visit.toUpperCase()}
      `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  };

  // const getSelected = visitData => selectedItems.includes(visitData.id);

  const selectItems = (element) => {
    if (selectedItems.includes(element.id)) {
        const newListItems = selectedItems.filter(
            listItem => listItem !== element.id,
        );
        return setSelectedItems([...newListItems]);

    }
    setSelectedItems([...selectedItems, element.id]);
    // console.log('selectedItems', selectedItems);
  };
 
  const deSelectItems = () => {
    setSelectedItems([]);
    // console.log(setSelectedItems);
  };


  const handleOnPress = (element) => {
    if (selectedItems.length) {
        return selectItems(element);
    }
    // here you can add you code what do you want if user just do single tap
    // console.log('selectItems', element);
    navigation.navigate('ShowVisit', { visitData: element });
  };
  
  const onDelete = async () => {
    let newListDel = selectedItems;
    // console.log(newListDel);
    await axios.delete(`/visitDetail/${newListDel}`).then(
        res=>{
            // console.log(res.data);
            if (res.status === 200) {
                console.log('Visit deleted');
                onRefresh();
            }
            else if (res.status == "222" || res.status == "201") {
                console.log('This record is in use. Cannot be deleted!');
                // setErrorMsg(true);
            } 
            else if (res.status == "202") {
                console.log('Default Visit data cannot be deleted!');
                // setinfoMsg(true);
            }
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
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
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>From:</Text>
            <DatePicker
              style={styles.datePickerStyle}
              date={fromDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={(date) => {
                setFromDate(date);
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: "#eeee",
              }}
              searchContainerStyle={{
                borderBottomColor: "#eeee",
              }}
            />
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>To:</Text>
            <DatePicker
              style={styles.datePickerStyle}
              date={toDate} // Initial date from state
              mode="date" // The enum of date, datetime and time
              placeholder="select date"
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={(date) => {
                setToDate(date);
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: "#eeee",
              }}
              searchContainerStyle={{
                borderBottomColor: "#eeee",
              }}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Searchbar
            placeholder="Search"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            style={{ elevation: 4, backgroundColor: '#fff', borderRadius: 50, marginVertical: 10, marginHorizontal: 10, fontSize: 12 }}
            textAlign={'center'}
          />
        </View>
        <View style={{ marginBottom: 80 }}>
          {filteredDataSource.map((element, index) => (
            <Pressable onPress={deSelectItems} key={index}>
              <TouchableOpacity
                onPress={() => handleOnPress(element)}
                onLongPress={() => selectItems(element)}
                key={index}
                style={{ marginHorizontal: 10 }}
              >
                <View
                  style={styles.main}
                >
                  <Text style={{ color: "#000", textAlign: "center", fontWeight: 'bold' }}>
                    {element.visit_id}
                  </Text>
                </View>
                <View
                  style={{
                    elevation: 5,
                    zIndex: 0,
                    backgroundColor: "#fff",
                    marginVertical: 5,
                    padding: 15,
                    borderRadius: 14,
                    shadowColor: "#000",
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 9,
                    }}
                  >
                    <Text>
                      Pet Name:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {element.pet_id.pet_name}
                      </Text>
                    </Text>
                    <Text>
                      Owner Name:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {element.owner_name_id.pet_owner_name}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 9,
                    }}
                  >
                    <Text>
                      Last Visit:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {element.pet_id.last_visit}
                      </Text>
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {element.visit_purpose.visit_purpose}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 9,
                    }}
                  >
                    <Text>
                      Clinic:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {element.visited_clinic_id.clinic_name}
                      </Text>
                    </Text>
                    <Text>
                      Doctor Name:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {element.doctor_name}
                      </Text>
                    </Text>
                  </View>
                  
                </View>
                
              </TouchableOpacity>
              { selectedItems.includes(element.id) && 
                <View style={styles.overlay} />
              }
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={styles.floatButtons}>
        <View>
          <FAB
            style={styles.fab}
            medium
            icon="plus"
            color="#fff"
            onPress={() => navigation.navigate("NewVisit")}
          />
        </View>
        <View>
          <FAB
            style={styles.fab}
            medium
            icon="home"
            color="#fff"
            onPress={() => navigation.navigate("Dashboard")}
          />
        </View>
        <View>
          <FAB
            style={styles.fab}
            medium
            icon="delete"
            color="#fff"
            onPress={onDelete}
          />
        </View>
      </View>
    </>
  );
};

export default Visits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatButtons: {
    position: "absolute",
    marginVertical: 20,
    right: 0,
    bottom: 0,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  fab: {
    backgroundColor: "#006766",
  },
  searchBarVisit: {
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#28AE7B90',
  },
  main: {
    backgroundColor: "#F2AA4CFF",
    width: 100,
    padding: 5,
    position: "relative",
    top: 15,
    zIndex: 9999999,
    elevation: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
});
