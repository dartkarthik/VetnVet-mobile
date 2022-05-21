import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Pressable
} from "react-native";
import axios from "react-native-axios";
import { FAB, Searchbar, Divider, Badge } from "react-native-paper";
import { Icon } from "react-native-elements";
import { useIsFocused } from "@react-navigation/core";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Users = ({ route, navigation }) => {

    let colors = ['#006766', '#CADEDF'];
    let textColor = [ '#fff', '#000' ];

    const isFocused = useIsFocused();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      wait(1200).then(() => {
        getAllUserData();
        setRefreshing(false);
        setSelectedItems([]);
      });
    }, []);

    const [userData, setUserData] = useState([]);

    // const [ user, setUser ] = useState({});

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    const [ status, setStatus ] = useState(true);
   
    useEffect(() => {
      if(isFocused) {
        getAllUserData();
      }
    }, [isFocused])

    const getAllUserData = async() => {
      let userClinicId = route.params.userDetails.clinic.id;
      await axios.get(`user/clinic/${userClinicId}`).then(
        res=>{
            // console.log(res.data);
          if (res.status === 200) {
            setUserData(res.data);
            setFilteredDataSource(res.data);
              // setStatusText(ele.status);
            res.data.map((item, index) => {
              if(item.status === 0) {
                setStatus(true);
              } else if(item.status === 1) {
                setStatus(true);
              }
              console.log("res.data.status", item.status);
            })
          }
        }
      ).catch(
        err => {
            console.log(err)
        }
      )
    }

    const searchFilterFunction = (text) => {
        const newData = userData.filter(element => {      
        const itemData = `${element.name.toUpperCase()}   
        ${element.name.toLowerCase()} 

        ${element.email.toUpperCase()}
        ${element.email.toLowerCase()}
        
        `;
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
    };

    const handleOnPress = (element) => {
      if (selectedItems.length) {
          return selectItems(element);
      }
      // here you can add you code what do you want if user just do single tap
      console.log('selectItems', element);
      navigation.navigate('ShowUser', { userData: element });
    };
  
    const getSelected = userData => selectedItems.includes(userData.id);
  
    const deSelectItems = () => {
        setSelectedItems([]);
        console.log(setSelectedItems);
    };
  
    const selectItems = (element) => {
        if (selectedItems.includes(element.id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== element.id,
            );
            return setSelectedItems([...newListItems]);
  
        }
        setSelectedItems([...selectedItems, element.id]);
  
        console.log('selectedItems', selectedItems);
    };

    const onAddUser = () => {
      navigation.navigate("AddUser");
      // console.log("userdata",userData1);
    }

    const onDelete = async () => {
      let newListDel = selectedItems;
      console.log(newListDel);
      await axios.delete(`user/${newListDel}`).then(
          res=>{
              // console.log(res.data);
              if (res.status === 200) {
                  console.log('User deleted');
                  onRefresh();
                  // setSuccessMsg(true);
              }
              else if (res.status == "222" || res.status == "201") {
                  console.log('This record is in use. Cannot be deleted!');
                  // setErrorMsg(true);
              } 
              else if (res.status == "202") {
                  console.log('Default User data cannot be deleted!');
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
        <View style={{ marginBottom: 70 }}>
            <Searchbar
                placeholder="Search"
                placeholderTextColor={'#00000060'}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                color={'#00000080'}
                style={{backgroundColor: '#fff', borderRadius: 50, marginVertical: 20, marginHorizontal: 10}}
                iconColor={'#000'}
            />
          {filteredDataSource.map((element, index) => (
            <>
            
             <Pressable onPress={deSelectItems} key={index}>
              <View key={'user_'+index}>
                  { status ? 
                    <View style={styles.Badge}>
                       <Badge style={styles.badgeText}>Active</Badge>
                    </View>
                  : 
                    <View style={styles.Badge}>
                       <Badge style={{backgroundColor:"orange", color: '#fff'}}>InActive</Badge>
                    </View>
                  }
              </View>
              <TouchableOpacity
                onPress={() => handleOnPress(element)}
                key={index}
                // style={{ marginHorizontal: 10 }}
                selected={getSelected(element)}
                onLongPress={() => selectItems(element)}
              >
                 <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    elevation: 5,
                    zIndex: 0,
                    backgroundColor: "#fff",
                    marginVertical: 5,
                    padding: 15,
                    borderRadius: 14,
                    shadowColor: "#000",
                    elevation: 2,
                    backgroundColor: colors[index % colors.length],

                  }}
                >
                  <View>
                    <Text
                      style={{
                        marginBottom: 20,
                        color: textColor[index % colors.length],
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {element.name}
                    </Text>
                    <Text
                      style={{ 
                        marginTop: 20, 
                        color: textColor[index % colors.length], 
                      }}
                    >
                      {element.phone_number}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        marginBottom: 20,
                        textAlign: "right",
                        // color: "#ADEFD1FF",
                        fontSize: 14,
                        color: textColor[index % colors.length],
                      }}
                    >
                      {element.role}
                    </Text>
                    <Text
                      style={{ 
                        marginTop: 20, 
                        color: textColor[index % colors.length],
                      }}
                    >
                      {element.email}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              { selectedItems.includes(element.id) && 
                        <View style={styles.overlay} />
                  }
            </Pressable>
            </>
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
            // onPress={() => navigation.navigate("AddUser")}
            onPress={onAddUser}
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

        <View>
          <FAB
            style={styles.fab}
            medium
            icon="home"
            color="#fff"
            onPress={() => navigation.navigate("Dashboard")}
          />
        </View>
      </View>
    </>
  );
};

export default Users;

const styles = StyleSheet.create({
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#28AE7B90',
  },
  Badge: {
    position: "relative",
    top: 14,
    elevation: 5,
    marginRight: 6
  },
  badgeText: {
    backgroundColor:"#F2AA4CFF", 
    color: '#000', 
    fontSize: 12, 
    paddingHorizontal: 10,
    fontWeight: 'bold',
    height: 30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  badgeTextWarn: {
    backgroundColor:"orange", 
    color: '#fff', 
    fontSize: 12, 
    paddingHorizontal: 10,
    fontWeight: 'bold',
  }
});