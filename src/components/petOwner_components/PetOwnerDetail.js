import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,

} from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from '../Accordion';
import { useIsFocused } from "@react-navigation/core";
import { FAB, Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import axios from 'react-native-axios';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from '@react-navigation/native';


const renderContent = (item, _) => {

  // console.log("renderContent", item);
  // const navigation = useNavigation();

  const getIndividualPetDetails = (item) => {
    // console.log("section", section);
    navigation.navigate('AddNewVisitDetails', { petNotification: item.id, navOptionsFromPets: item });
  }
  
  const getIndividualVisitHistoryDetails = (item) => {
    // console.log(id);
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
                {item.actual_animal_type} / {item.actual_breed}
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

const Pets = ({petData}) => {

  const navigation = useNavigation();

  return(
    <>
      <View style={{marginBottom: 80}}>
        {petData.map((item, index) => (
          <ScrollView 
              showsVerticalScrollIndicator={false}
              key={'pet_' + index}
            >
              <View>
                    <>
                      <Accordion
                        renderListContent={renderContent(item, index)}
                        renderAccordianList={renderHeader(item, index)}
                        key={index}
                        data={item}
                        // onLongPress={(value)=> onDelete(value, index)}
                      />
                    </>
              </View>
            </ScrollView>
          ))}
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
  )

}

const Profile = ({ownerData, clinic, branch, ownerId}) => {

  // console.log("Profile", ownerData);
  const navigation = useNavigation(); 

  const [formData, setFormData] = useState(
    {
        pet_owner_name: '',
        contact_number: '',
        email: '',
        address: '',
        branch_id: '',
        country: '',
        states: '',
        clinic_id: '',
    }
  );
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [ country_data, set_country_data ] = useState([]);
  const [ selected_country_code, set_selected_country_code ] = useState('');

  const [ state_data, set_state_data ] = useState([]);
  const [ selected_state_code, set_selected_state_code ] = useState('IN');
  const [ clinicData, setClinicData ] = useState([]);
  const [ branchData, setBranchData ] = useState([]);

  useEffect(() => {
    setFormData({
      ...formData,
      pet_owner_name: ownerData.pet_owner_name,
      contact_number: ownerData.contact_number,
      email: ownerData.email,
      address: ownerData.address,
      branch_id: ownerData.branch_id,
      clinic_id: ownerData.clinic_id,
      country: ownerData.country,
    });
    getClinicData();
    // getPetOwnerDetailById();
    getBranchByClinic();
    getCountry();
    getSate();
    // getCity();
  }, [])

  const getCountry = () => {
    let countryData = require('../../country.json');
    let country = country;
    country = [];
    countryData.map((elements, index) => {
      country.push({
        id: index,
        isoCode: elements.isoCode,
        phonecode: elements.phonecode,
        name: elements.name,
        flag: elements.flag,
        label: elements.name + '' + elements.flag
      })
      set_country_data(country);
    })
  }

  const getSate = () => {
    let stateData = require('../../state.json');
    let state = state;
    state = [];
    // stateData.filter((elements) => elements.countryCode !== 'IN')
    stateData.map((element, index) => {
      state.push({
        id: index,
        isoCode: element.isoCode,
        countryCode: element.countryCode,
        name: element.name,
        label: element.name,
      })
      // let filteredState = state.filter((elements) => elements.countryCode !== 'IN')
      set_state_data(state);
    });
  }

  const getClinicData = () => {
    let clinicData = clinicData;
    clinicData = [];
    axios
      .get(`/clinic`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          clinicData.push({
            id: element.id,
            clinic: element.clinic_name,
            title: `${element.clinic_name}`,
          });
        });
        setClinicData(clinicData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchByClinic = () => {
    // let userClinicId = clinic;
    let branchData = branchData;
    branchData = [];
    axios.get(`/clinic/branch/${clinic}`).then(
        res=>{
            // console.log(res.data);
            res.data.map((element,index) =>{
                branchData.push({
                    id:element.id,
                    branch: element.branch,
                    title:`${element.branch}`
                });
            });
            setBranchData(branchData);
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
  }

  const handlePetOwnerNameChange = (value) => {
    setFormData({
        ...formData,
        pet_owner_name: value
    });
  }

  const handleContactNumberChange = (value) => {
    setFormData({
        ...formData,
        contact_number: value
    });
  }

  const handleEmailChange = (value) => {
    setFormData({
        ...formData,
        email: value
    });
  }

  const handleAddressChange = (value) => {
    setFormData({
        ...formData,
        address: value
    });
  }

  const handleRegisteringBranchChange = (value) => {
    setFormData({
        ...formData,
        branch_id: value.id
    });
  }

  const handleClinicChange = (value) => {
    setFormData({
        ...formData,
        clinic_id: value.id
    });
  }

  const handleCountryChange = (value) => {
    set_selected_country_code(value.isoCode);
    setFormData({
      ...formData,
      country: value.isoCode
    })
  }

  const handleStateChange = (value) => {
    set_selected_state_code(value.isoCode);
    setFormData({
      ...formData,
      states: 'IN' + '_' + value.isoCode
    })
  }

  const handleSubmit = () => {
    axios.put(`/petOwner/update/${ownerId}`, formData).then(
        res => {
            if (res.status == '200') {
                console.log("Registered Data", res.data);
                setSuccessMsg(true);
            }
        }
    ).catch(
        err => {
            console.log(err);
            setErrorMsg(true);
        }
    );
  }

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  }

  const handleCancel = () => {
    setErrorMsg(false);
  }

  return(
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{marginBottom: 20}}>
          <View style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Owner Name:</Text>
              <TextInput 
                  defaultValue={formData && formData.pet_owner_name}
                  onChangeText={(value) =>{ value && handlePetOwnerNameChange(value)}}
                  style={styles.textInp}
              />
          </View>

          <View style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Mobile Number:</Text>
              <TextInput 
                  defaultValue={formData && formData.contact_number}
                  keyboardType='number-pad'
                  style={styles.textInp}
                  onChangeText={(value) =>{ value && handleContactNumberChange(value)}}
              />
          </View>

          <View style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Email Id:</Text>
              <TextInput 
                  defaultValue={formData && formData.email}
                  style={styles.textInp}
                  onChangeText={(value) =>{ value && handleEmailChange(value)}}
              />
          </View>

          <View style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Address:</Text>
              <TextInput 
                  multiline
                  numberOfLines={5} 
                  defaultValue={formData && formData.address}
                  style={styles.textInp}
                  onChangeText={(value) =>{ value && handleAddressChange(value)}}
              />
          </View>

          {/* branch */}
          <View  style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Registering Branch:</Text>
              <CustomDropdown
                  // handleAddEvent={handleAddNewVisitPurpose}
                  onChange={(value) => {
                    value && handleRegisteringBranchChange(value);
                  }}
                  // buttonLabel={"Eg: kg / g"}
                  isButton={false}
                  dropdownType={"single"}
                  autoFocusSearch={true}
                  enableSearch={true}
                  labelField='branch'
                  valueField='id'
                  defaultValue={formData && formData.branch_id}
                  data={branchData}
              />
              
          </View>

          {/* clinic */} 
          <View  style={styles.formInput}>
              <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Clinic:</Text>
              <CustomDropdown
                  onChange={(value) => {
                    value && handleClinicChange(value);
                  }}
                  isButton={false}
                  dropdownType={"single"}
                  autoFocusSearch={true}
                  enableSearch={true}
                  labelField='clinic'
                  valueField='id'
                  defaultValue={formData && formData.clinic_id}
                  data={clinicData}
              />
          </View>

          {/* country */}
          <View style={styles.formInput}>
            <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>Country:</Text>
            <CustomDropdown
                onChange={(value) => {
                  value && handleCountryChange(value);
                }}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={true}
                enableSearch={true}
                labelField='label'
                valueField='isoCode'
                data={country_data}
                // defaultValue={formData && formData.country}
            />
          </View>

          {/* state */}
          <View style={styles.formInput}>
            <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>State:</Text>
            {/* <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => {
                  value && handleStateChange(value);
                }}
                // buttonLabel={"Eg: kg / g"}
                isButton={false}
                dropdownType={"single"}
                autoFocusSearch={true}
                enableSearch={true}
                labelField='label'
                valueField='isoCode'
                // defaultValue={formData && formData.visit_purpose}
                data={state_data}
                disable
            /> */}
            <Dropdown
                style={styles.region}
                // placeholder='Select...'
                maxHeight={300}
                disable
                search={true}
                data={state_data}
                labelField='label'
                valueField='isoCode'
                value={state_data}
                // item={weightUnit}
                searchPlaceholder='search...'
                containerStyle={{
                  backgroundColor: '#BFD9D9'
                }}
                selectedTextStyle={{
                    color: '#006766',
                }}
                inputSearchStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 10
                }}
                placeholderStyle={{
                    color: '#bebebe',
                    fontSize: 16
                }}
                onChange={(value) => handleStateChange(value)}
            />
          </View>
          
          {/* city */}
          <View style={styles.formInput}>
            <Text style={{fontWeight: 'bold', fontSize: 14, marginBottom: 10}}>City:</Text>
            <Dropdown
                style={styles.region}
                // placeholder='Select...'
                maxHeight={300}
                disable
                search={true}
                data={state_data}
                labelField='label'
                valueField='isoCode'
                value={state_data}
                // item={weightUnit}
                searchPlaceholder='search...'
                containerStyle={{
                  backgroundColor: '#BFD9D9'
                }}
                selectedTextStyle={{
                    color: '#006766',
                }}
                inputSearchStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 10
                }}
                placeholderStyle={{
                    color: '#bebebe',
                    fontSize: 16
                }}
                onChange={(value) => console.log(value)}
            />
          </View>

          <TouchableOpacity 
              style={{
                padding: 14, 
                backgroundColor: '#0E9C9B', 
                marginTop: 30, 
                elevation: 2, 
                // marginBottom: 2 
                marginHorizontal: 10,
                borderRadius: 20
              }}
              onPress={handleSubmit}
          >
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
                  Done
              </Text>
          </TouchableOpacity>
          <View>
          <>
            {successMsg ?
              <Portal>
                <Dialog visible={successMsg} onDismiss={handlegoback}>
                    <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Pet Owner details updated successfully</Paragraph>
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
                    <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Error while updating a pet owner detail</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancel}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
              </Portal>
              : <></>
            }
          </>
        </View>
      </View>
    </ScrollView>
  )

}

const PetOwnerDetail = ({route, navigation}) => {

  let splitText2 = route.params.petOwnerId.pet_owner_name;
  splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

  let splitText1 = route.params.petOwnerId.city;
  splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

  navigation.setOptions({ title: `${splitText2} / ${splitText1}` });

  const sel_pet_owner_id = route.params.petOwnerId.id;
  // console.log("route.params.petOwnerId", route.params.petOwnerId);

  const sel_pet_owner_clinic = route.params.petOwnerId.clinic_id;
  const sel_pet_owner_branch = route.params.petOwnerId.branch_id;

  const [ profileNav, setProfileNav ] = useState(true);
  const [ petsNav, setPetsNav ] = useState(false);

  const isFocused = useIsFocused();

  const [filteredDataSource, setFilteredDataSource] = useState([]);

  useEffect(() => {
    if(isFocused) {
      petsOfOwnerDetail();
    }
  }, [isFocused])

  const petsOfOwnerDetail = async() => {
    await axios.get(`/pet/owner/${sel_pet_owner_id}`).then(
        res => {
            if (res.status === 200) {
            // setPetData(petData);
            setFilteredDataSource(res.data);
            // console.log("setFilteredDataSource", res.data);
          }
        }
    ).catch(
        err => {
            console.log("Error");
        }
    );
  }

  const navToProfile = () => {
    setProfileNav(true);
    setPetsNav(false);
  }

  const navToPets = () => {
    setProfileNav(false);
    setPetsNav(true);
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>

        {profileNav 
        ? <>
          <Profile ownerId={sel_pet_owner_id} ownerData={route.params.petOwnerId} clinic={sel_pet_owner_clinic} branch={sel_pet_owner_branch}/>
        </> 
        : <></>}

        {petsNav 
        ? <>
          <Pets petData={filteredDataSource} />
        </> 
        : <></>}

      </ScrollView>
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={{
            width: '49.9%',
            padding: 20,
            backgroundColor: profileNav ? '#BFD9D9' : '#006766',
          }}
          onPress={navToProfile}
        >
          <Text style={{
            textAlign: 'center',
            color: profileNav ? '#006766' : '#fff',
            fontWeight: 'bold'
          }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{
            width: '49.9%',
            padding: 20,
            backgroundColor: petsNav ? '#BFD9D9' : '#006766',
          }}
          onPress={navToPets}
        >
          <Text style={{
            textAlign: 'center',
            color: petsNav ? '#006766' : '#fff',
            fontWeight: 'bold'
          }}>Pets</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PetOwnerDetail

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButtonProfile: {
    width: '49.9%',
    padding: 20,
    backgroundColor: '#006766',
  },
  navText: {
    textAlign: 'center',
    color: '#fff',
  },
  editPetButton: {
    padding: 8,
    backgroundColor: '#F2AA4CFF',
    marginTop: 5,
    elevation: 2
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
  accordionButton: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    padding: 10,
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
  formInput: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  textInp: {
    height: 45,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
  },
  region: {
    backgroundColor: '#0E9C9B15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#006766'
  },
});