import React, {  useState, useEffect, useCallback } from 'react'
import {
    Text, 
    View,
    StyleSheet, 
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from 'react-native'
import { Divider, FAB, Searchbar } from 'react-native-paper';
import axios from 'react-native-axios';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Vaccines = ({navigation}) => {

    const [refreshing, setRefreshing] = useState(false);
    
    const[VaccineData, setVaccineData] = useState([]);

    //searchbar 
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (VaccineData) => {
        setSearchQuery(VaccineData);
    }

    useEffect(() => {
        getVaccineData();
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getVaccineData();
    }, []);

  const getVaccineData = async() => {
      await axios.get(`/vaccine`).then(
          res=>{
              // console.log(res.data);
              if (res.status === 200) {

                  console.log("test Vaccine",res.data);
                  // VisitHistory = res.data;
                  setVaccineData(res.data)

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
            <View style={{marginTop: 10}}>
                <Searchbar
                    placeholder="Search By Vaccine"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={{borderRadius: 40, margin: 10, backgroundColor: '#fff'}}
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
                <View style={{marginBottom: 70}}>
                    {
                        VaccineData.map((items, index) => (
                            <TouchableOpacity 
                                //onLongPress={() => console.log(items.id)}
                                // onPress={() => handleOnPress(items.id)}
                                // selected={getSelected(items)}
                                key={items.id}
                            >
                                <View style={{elevation: 5, zIndex: 0 ,backgroundColor: '#fff', marginVertical: 5, padding: 15, borderRadius: 14, shadowColor: '#000', elevation: 2}}>
                                    <Text style={{fontWeight: 'bold'}}>{items.vaccine_name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    } 
                </View>
            </ScrollView>
            <View style={styles.container}>
                <View>
                    <FAB
                    style={styles.fab}
                    medium
                    icon="plus"
                    color='#fff'
                    onPress={() => navigation.navigate('AddVaccine')}
                    />
                </View>
                <View>
                    <FAB
                    style={styles.fab}
                    medium
                    icon="delete"
                    color='#fff'
                    //onPress={() => console.log('Pressed')}
                    />
                </View>
                <View>
                    <FAB
                    style={styles.fab}
                    medium
                    icon="home"
                    color='#fff'
                    //onPress={() => navigation.navigate('Dashboard')}
                    />
                </View>
            </View>
        </>
    );
}


export default Vaccines;



const styles = StyleSheet.create({
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
  
  })





