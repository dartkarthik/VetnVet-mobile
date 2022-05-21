import React, { useState, useEffect, Fragment } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from "react-native";
// import { TextInput, FAB, Dialog, Portal, Paragraph, Divider } from "react-native-paper";
import axios from "react-native-axios";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const ShowVisit = ({ route, navigation }) => {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const isFocused = useIsFocused();

  // const [isVisitData, setVisitData] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    pet_id: "",
    owner_name_id: "",
    visited_date: "",
    visit_purpose: {},
    visited_clinic_id: "",
    doctor_name: "",
  });

  const [show, setShow] = useState(true);

  const [ indData, setIndData ] = useState([]);

  const [VisitPurposeData, setVisitPurposeData] = useState([]);
  const [ClinicNameData, setClinicNameData] = useState([]);

  useEffect(() => {
    if(isFocused) {
      getVisitPurposeData();
      getClinicNameData();
      getIndividualVisitData();
    }
  }, [isFocused]);

  useEffect(() => {
    setFormData({
      ...formData,
      id: route.params.visitData.id,
      pet_id: route.params.visitData.pet_id.id,
      owner_name_id: route.params.visitData.owner_name_id.id,
      visited_date: route.params.visitData.visited_date,
      visit_purpose: route.params.visitData.visit_purpose.id,
      visited_clinic_id: route.params.visitData.visited_clinic_id.id,
      doctor_name: route.params.visitData.doctor_name,
    })
  }, [])

  const getIndividualVisitData = () => {
    let id = route.params.visitData.id;
    axios
      .get(`visitDetail/${id}`)
      .then((res) => {
        if (res.status == 200) {
          // console.log("hdagugagdagdiagig",res.data);
          setIndData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getVisitPurposeData = () => {
    let VisitPurposeData = VisitPurposeData;
    VisitPurposeData = [];
    axios
      .get(`visitPurpose/clinic/${1}`)
      .then((res) => {
        // console.log("asdfghjkl",res.data);
        res.data.map((element, index) => {
        //  console.log("zzzz",actual_name)
          VisitPurposeData.push({
            id: element.id,
            visit_purpose: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
          });
        });
        setVisitPurposeData(VisitPurposeData);
        // console.log(breedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClinicNameData = () => {
    let ClinicNameData = ClinicNameData;
    ClinicNameData = [];
    axios
      .get(`clinic`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          ClinicNameData.push({
            id: element.id,
            clinic_name: element.clinic_name,

          });
        });
        setClinicNameData(ClinicNameData);
        // console.log(breedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.display}>
            <TouchableOpacity 
              style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'flex-end', 
                marginRight: 5,
              }}
              onPress={() => navigation.navigate('EditVisit', {visitsInfo: route.params.visitData, attachments: indData && indData.attachments})}
            >
              <View style={{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  backgroundColor: '#0E9C9B',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 20,
                  elevation: 2,
              }}>
                <Text style={{
                  color: '#fff', 
                  fontWeight: 'bold',
                  marginRight: 5,
                }}>Edit Visit Details
                
                </Text>
                <MaterialCommunityIcons
                    name="pen"
                    color={'#fff'}
                    size={18}
                />
              </View>
            </TouchableOpacity>
        
            <View style={styles.parallel} key={'v-1'}>
                <Text style={styles.heading}>Pet Name:</Text>
                <Text style={styles.text}>{route.params.visitData && route.params.visitData.pet_id.pet_name}</Text>
            </View>

            <View style={styles.parallel} key={'v-2'}>
                <Text style={styles.heading}>Owner Name:</Text>
                <Text style={styles.text}>{route.params.visitData && route.params.visitData.owner_name_id.pet_owner_name}</Text>
            </View>

            <View style={styles.parallel} key={'v-3'}>
              <Text style={styles.heading}>Last Visit:</Text>
              <Text style={styles.text}>{route.params.visitData && route.params.visitData.visited_date}</Text>
            </View>

            <View style={styles.parallel} key={'v-4'}>
              <Text style={styles.heading}>Visit Purpose: </Text>
              <Text style={styles.text}>{route.params.visitData && route.params.visitData.visit_purpose.visit_purpose}</Text>
            </View>

            <View style={styles.parallel} key={'v-5'}>
              <Text style={styles.heading}>Clinic: </Text>
              <Text style={styles.text}>{route.params.visitData && route.params.visitData.visited_clinic_id.clinic_name}</Text>
            </View>

            <View style={styles.parallel} key={'v-6'}>
              <Text style={styles.heading}>Visit Type: </Text>
              <Text style={styles.text}>{route.params.visitData && route.params.visitData.visit_type.visit_type}</Text>
            </View>

            <View style={styles.parallel} key={'v-7'}>
              <Text style={styles.heading}>Weight: </Text>
              <Text style={styles.text}>{route.params.visitData.weight}</Text>
            </View>
            
            <View style={styles.parallel} key={'v-9'}>
              <Text style={styles.heading}>Doctor Name: </Text>
              <Text style={styles.text}>{route.params.visitData.doctor_name}</Text>
            </View>

        </View>
      </ScrollView>
      <TouchableOpacity
        style={{padding: 20, backgroundColor: '#006766', }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{
          textAlign: 'center',
          color: '#fff',
          fontWeight: 'bold',
        }}>Done</Text>
      </TouchableOpacity>
    </>
  );
};

export default ShowVisit;

const styles = StyleSheet.create({
  display: {
    marginVertical: 10,
  },
  btn: {
    width: '100%',
    backgroundColor: "#006766",
    paddingVertical: 20,
  },
  heading: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 20
  },
  text: {
    color: "#006766",
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginRight: 20,
  },
  parallel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 10,
    elevation: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});