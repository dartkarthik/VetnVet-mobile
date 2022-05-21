import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Pressable
} from 'react-native';
import axios from 'react-native-axios';
import { Divider, FAB, TextInput, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BranchFilter from '../components/BranchFilter';
import Accordion from '../components/Accordion';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/core";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Pets = ({ route, navigation }) => {

  const isFocused = useIsFocused();

  const [petData, setPetData] = useState([]);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  // const [ selectedList, setSelectedList ] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [ deleteItems, setDeleteItems ] = useState('');
  const [ del, setDel ] = useState(false);
 
  useEffect(() => {
    if(isFocused) {
      petDetail();
    }
  }, [isFocused])
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      petDetail();
      setRefreshing(false);
    });
  }, []);

  const petDetail = async () => {
    let userClinicId = route.params.userDetails.clinic.id
    // console.log(userClinicId);
    await axios.get(`/pet/clinic/${userClinicId}`).then(
      res => {
        // console.log(res.data);
        if (res.status === 200) {
          let petData = res.data;;
          setPetData(petData);
          setFilteredDataSource(res.data);
        }
      }
    ).catch(
      err => {
        console.log("Error");
      }
    );
  }

  const searchFilterFunction = (text) => {
    const newData = petData.filter(section => {
      const itemData = `
        ${section.pet_name.toUpperCase()}
        ${section.pet_name.toLowerCase()}
        ${section.pet_owner_id.pet_owner_name.toUpperCase()}
        ${section.pet_owner_id.pet_owner_name.toLowerCase()}
        ${section.pet_owner_id.contact_number.toUpperCase()}
        ${section.pet_owner_id.contact_number.toLowerCase()}
        ${section.pet_type_id.animal_type.toLowerCase()}
        ${section.pet_type_id.animal_type.toUpperCase()}
      `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  };

  const onDelete = (value, _) => {
    setDeleteItems(value);
    setDel(true);
  }

  return (
    <>
      <View style={styles.container} key="pet_1">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5 }}>
          <Searchbar
            placeholder="Search by pet, type, owner, contact no..."
            placeholderTextColor={'#00000040'}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            color={'#2f2f7e'}
            style={{ backgroundColor: '#fff', borderRadius: 50, marginVertical: 20, fontSize: 12, width: '85%' }}
            iconColor={'#2f2f7e'}
            textAlign={'center'}
          />
          
          <BranchFilter 
            userData = {route.params.userDetails}
          />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{marginBottom: 80}}>
              {filteredDataSource.map((item, index) => (
                <>
                  <Accordion
                    renderListContent={renderContent(item, index)}
                    renderAccordianList={renderHeader(item, index)}
                    key={index}
                    data={item}
                    onLongPress={(value)=> onDelete(value, index)}
                  />
                </>
              ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.floatButtons}>
        <View>
          <FAB
            style={styles.fab}
            medium
            icon="plus"
            color='#fff'
            onPress={() => navigation.navigate('AddPet')}
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
            onPress={() => console.log('Pressed')}
          />
        </View>
      </View>
    </>
  );
};

const renderContent = (item, _) => {

  const navigation = useNavigation();

  const getIndividualPetDetails = (item) => {
    navigation.navigate('AddNewVisitDetails', { petNotification: item.id, navOptionsFromPets: item });
  }
  
  const getIndividualVisitHistoryDetails = (item) => {
    navigation.navigate('VisitHistory', { petData: item.id })
  }

  const onEdit = (item) => {
    navigation.navigate('EditPet', { petDetails: item })
  }

  //Accordion Content view
  return (

      <View key={_}>
        <TouchableOpacity
          style={styles.editPetButton}
          onPress={() => onEdit(item)}
        >
          <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Edit Pet</Text>
        </TouchableOpacity>
        <View style={styles.accBut}>
          <TouchableOpacity style={styles.petListButton} onPress={() => getIndividualPetDetails(item)}>
            <Text style={styles.accordionButton}>Start Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.petListButton} onPress={() => navigation.navigate('PetDetails', item)}>
            <Text style={styles.accordionButton}>Pet Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.petListButton} onPress={() => navigation.navigate('Message')}>
            <Text style={styles.accordionButton}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.petListButton} onPress={() => getIndividualVisitHistoryDetails(item)}>
            <Text style={styles.accordionButton}>Visit History</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const renderHeader = (item, _) => {

  let colors = ['#fff', '#006766'];
  let textColor = ['#000', '#fff'];

  //Accordion Header view
  return (
      <View style={styles.header} key={_}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{backgroundColor: '#fff', padding: 5, elevation: 2, borderRadius: 20}}>
              <MaterialCommunityIcons
                  name="dog"
                  color={'#F2AA4CFF'}
                  size={40}
              />
          </View>
          <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            backgroundColor: colors[_ % colors.length], 
            padding: 10, 
            borderRadius: 10, 
            borderWidth: 0.5, 
            borderColor: '#fff',
            width: '82%',
          }}>
            <View>
              <Text style={{
                color: textColor[_ % textColor.length],
                fontWeight: 'bold',
                textAlign: 'left',
                textTransform: 'capitalize',
              }}>{item.pet_name} / {item.pet_owner_id.pet_owner_name}</Text>
              <Text style={{
                marginTop: 30, 
                color: textColor[_ % textColor.length],
                textAlign: 'left',
                textTransform: 'capitalize'
              }}>
                {item.pet_type_id.animal_type} / {item.breed_id.breed}
              </Text>
            </View>

            <View>
              <Text style={{
                color: textColor[_ % textColor.length],
                fontWeight: 'bold',
                textAlign: 'right',
                textTransform: 'capitalize'
              }}>
                {item.pet_owner_id.contact_number}
              </Text>
              <Text style={{
                marginTop: 30, 
                color: textColor[_ % textColor.length],
                textAlign: 'right', 
                textTransform: 'capitalize'
              }}>
                Last Visited - {'\n'}{item.last_visit}
              </Text>
            </View>
          </View>
        </View>
      </View>
  );
};

export default Pets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    // backgroundColor: '#F5FCFF',
    padding: 10,

  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    // paddingTop: 0,
    backgroundColor: '#fff',
    height: 120,
    width: '100%'
  },
  active: {
    backgroundColor: '#BFD9D9',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    // backgroundColor: '#E5E5FF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  accordionButton: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accBut: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 2
  },
  petListButton: {
    backgroundColor: '#0E9C9B',
    paddingHorizontal: 8,
    paddingVertical: 20,
    elevation: 5,
    borderRadius: 5,
  },
  floatButtons: {
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
  editPetButton: {
    padding: 8,
    backgroundColor: '#F2AA4CFF',
    marginTop: 5,
    elevation: 2
  },
});
