import React, { useEffect, useMemo, useReducer, useState } from 'react';
import axios from 'react-native-axios';
import { TouchableOpacity, Text, LogBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Dashboard from './src/screens/Dashboard';
import Pets from './src/screens/Pets';
import LoginScreen from './src/screens/LoginScreen';
import Owners from './src/screens/Owners';
import Appointments from './src/screens/Appointments';
import Visits from './src/screens/Visits';
import Masters from './src/screens/Masters';
import Templates from './src/screens/Templates';
import Users from './src/screens/Users';
import Settings from './src/screens/Settings';
import SubscriptionAndBilling from './src/screens/SubscriptionAndBilling';
import LeftCredits from './src/screens/LeftCredits';

// Masters
import Animal from './src/screens/Masters/Animal';
import Breed from './src/screens/Masters/Breed';
import Colors from './src/screens/Masters/Colors';
import Disease from './src/screens/Masters/Disease';
import Medicine from './src/screens/Masters/Medicine';
import Symptoms from './src/screens/Masters/Symptoms';
import Vaccines from './src/screens/Masters/Vaccines';
import VisitPurpose from './src/screens/Masters/VisitPurpose';
import VisitType from './src/screens/Masters/VisitType';

// Add Components
import AddMedicine from './src/components/Medicine_components/AddMedicine';
import AddBreed from './src/components/breed_components/AddBreed';
import AddColor from './src/components/colors_components/AddColor';
import AddDisease from './src/components/disease_components/AddDisease';
import AddSymptom from './src/components/symptoms_components/AddSymptom';
import AddVaccine from './src/components/vaccine_components/AddVaccine';
import AddAnimal from './src/components/animal_components/AddAnimal';
import AddUser from './src/components/user_components/AddUser';
import AddPetOwner from './src/components/petOwner_components/AddPetOwner';
import AddVisitType from './src/components/visitType_components/AddVisitType';
import AddVisitPurpose from './src/components/visitPurpose_components/AddVisitPurpose';
import NewVisit from './src/components/visits_components/NewVisit';
import AddNewVisitDetails from './src/components/visits_components/AddNewVisitDetails';
import AddPet from './src/components/pets_components/AddPet';

// Edit Components
import EditAnimal from './src/components/animal_components/EditAnimal';
import EditBreed from './src/components/breed_components/EditBreed';
import EditColor from './src/components/colors_components/EditColor';
import EditDisease from './src/components/disease_components/EditDisease';
import EditSymptom from './src/components/symptoms_components/EditSymptom';
import EditVisitType from './src/components/visitType_components/EditVisitType';
import EditVisitPurpose from './src/components/visitPurpose_components/EditVisitPurpose';
import EditVisit from './src/components/visits_components/EditVisit';
import ShowVisit from './src/components/visits_components/ShowVisit';
import EditMedicine from './src/components/Medicine_components/EditMedicine';
import ShowUser from './src/components/user_components/ShowUser';
import EditPet from './src/components/pets_components/EditPet';

// App Components
import Message from './src/components/Message';
import PetDetails from './src/components/pets_components/PetDetails';
import VisitHistory from './src/components/visitHistory_components/VisitHistory';
import DocumentUpload from './src/components/DocumentUpload';
import SubmitNewVisitForm from './src/components/visits_components/SubmitNewVisitForm';
import petSubmitPage from './src/components/pets_components/petSubmitPage'
import VisitHistoryDetails from './src/components/visitHistory_components/VisitHistoryDetails';
import PetOwnerDetail from './src/components/petOwner_components/PetOwnerDetail';

// Prescription Components
import AddPrescription from './src/components/prescription_components/AddPrescription';
import AddMedicineToPrescription from './src/components/prescription_components/AddMedicineToPrescription';

// Auth
import { AuthContext } from './src/components/Context';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// axios.defaults.baseURL = "https://vetsoftws.demodooms.com/api";
axios.defaults.baseURL = "http://192.168.1.58:8000/api";

let USERDETAILS = {};

LogBox.ignoreAllLogs(true);
// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);
// Ignore all log notifications:
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function App() {

  const initLoginState = {
    userToken: null,
    userDetails: {},
    isLoading: true
  }

  // AsyncStorage.removeItem('userToken');
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'LOGIN':
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.userToken;
        return {
          ...prevState,
          userToken: action.userToken,
          userDetails: action.userDetails,
          isLoading: false
        }
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          userDetails: {},
          isLoading: false
        }
      case 'RETRIEVE_TOKEN':
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.userToken;
        return {
          ...prevState,
          userToken: action.userToken,
          userDetails: action.userDetails,
          isLoading: false
        }
      default:
        break;
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initLoginState);

  const authContext = useMemo(() => ({
    signIn: (loginData) => {
      axios.post("/auth/login", loginData).then(
        async (res) => {
          if (res.status === 200) {
            let userId = "";
            let token = null;
            let userDetails = {};
            try {
              await AsyncStorage.setItem('userToken', res.data.access_token);
              await AsyncStorage.setItem('userId', res.data.user.id.toString());
              token = res.data.access_token;
              userId = res.data.user.id.toString();
              await getUserDetails(userId, token);
              userDetails = USERDETAILS;
            } catch (e) {
              // saving error
              console.log(e);
            }
            dispatch({ type: 'LOGIN', userToken: token, userDetails: userDetails });
          }
        }
      ).catch(
        err => {
          console.log("Error");
        }
      );
    },
    signOut: async () => {
      // console.log("res");
      await axios.post("/auth/logout").then(
        res => {
          // console.log(res);
          if (res.status === 200) {
            let userToken;
            userToken = null;
            try {
              AsyncStorage.removeItem('userToken');
              AsyncStorage.removeItem('userID');
            } catch (e) {
              // saving error  
              console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
          }
        }
      ).catch(
        err => {
          console.log("Error");
        }
      );

    }
  }), []);

  useEffect(() => {
    getToken();
  }, []);

  const logOut = async () => {
    await axios.post("/auth/logout").then(
      res => {
        if (res.status === 200) {
          let userToken;
          userToken = null;
          try {
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('userId');
          } catch (e) {
            console.log(e);
          }
          dispatch({
            type: 'LOGOUT'
          });
        }
      }
    ).catch(
      err => {
        console.log("Error");
      }
    );
  }

  const getToken = async () => {
    let token = null;
    let userId = "";
    let userDetails = {};
    // token = null;
    try {
      token = await AsyncStorage.getItem('userToken');
      userId = await AsyncStorage.getItem('userId');
      await getUserDetails(userId, token);
      userDetails = USERDETAILS;
    } catch (e) {
      console.log(e);
    }
    dispatch({ type: 'RETRIEVE_TOKEN', userToken: token, userDetails: userDetails });
  }

  const getUserDetails = async (userId, token) => {
    await axios.get(`/user/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(
      res => {
        if (res.data.status == 'Token is Expired') {
          console.log("Token is Expired");
        } else if (res.status == '200') {
          USERDETAILS = res.data;
        }
      }
    ).catch(
      err => {
        console.log(err);
      }
    )
  }

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View >
    );
  }

  // console.log("Login State - ", loginState.userToken);
  // console.log("UserDetails - ", loginState.userDetails);

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider>
        <NavigationContainer>
          {loginState.userToken !== null ?
            <Stack.Navigator
              screenOptions={{
                headerTintColor: '#000',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  alignItems: 'center',
                  color: '#000'
                },
                headerRight: () => (
                  <TouchableOpacity
                    onPress={logOut}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Logout</Text>
                    <MaterialCommunityIcons
                      name="logout"
                      color={'#000'}
                      size={30}
                    />
                  </TouchableOpacity>
                ),
              }}
            >
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Dashboard" component={Dashboard} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Pets" component={Pets} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Owners" component={Owners} options={{ title: 'Pet Owners' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Appointments" component={Appointments} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Visits" component={Visits} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Masters" component={Masters} />

              {/* Masters */}
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Animal" component={Animal} options={{ title: 'Masters/Animal' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Breed" component={Breed} options={{ title: 'Masters/Breed' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Colors" component={Colors} options={{ title: 'Masters/Colors' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Disease" component={Disease} options={{ title: 'Masters/Disease' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Medicine" component={Medicine} options={{ title: 'Masters/Medicine' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Symptoms" component={Symptoms} options={{ title: 'Masters/Symptoms' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Vaccines" component={Vaccines} options={{ title: 'Masters/Vaccines' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="VisitType" component={VisitType} options={{ title: 'Masters/Visit Type' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="VisitPurpose" component={VisitPurpose} options={{ title: 'Masters/Visit Purpose' }} />

              {/* Masters Components*/}
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddMedicine" component={AddMedicine} options={{ title: 'Add New Medicine' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddAnimal" component={AddAnimal} options={{ title: 'Add Animal' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddBreed" component={AddBreed} options={{ title: 'Add Breed' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddDisease" component={AddDisease} options={{ title: 'Add Disease' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddSymptom" component={AddSymptom} options={{ title: 'Add Symptom' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddVaccine" component={AddVaccine} options={{ title: 'Add Vaccine' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddColor" component={AddColor} options={{ title: 'Add Color' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddVisitType" component={AddVisitType} options={{ title: 'Add Visit Type' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddVisitPurpose" component={AddVisitPurpose} options={{ title: 'Add Visit Purpose' }} />
              {/* <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddTemplate" component={AddTemplate} options={{ title: 'Add Prescription' }} /> */}
              {/* <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddPrescription" component={AddPrescription} options={{ title: 'Add Prescription Template' }} /> */}


              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddUser" component={AddUser} options={{ title: 'Add User' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="ShowUser" component={ShowUser} options={{ title: 'User Details' }} />

              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddPetOwner" component={AddPetOwner} options={{ title: 'Add Pet Owner' }} />

              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditAnimal" component={EditAnimal} options={{ title: 'Update Animal' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditBreed" component={EditBreed} options={{ title: 'Update Breed' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditColor" component={EditColor} options={{ title: 'Update Colors' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditDisease" component={EditDisease} options={{ title: 'Update Disease' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditSymptom" component={EditSymptom} options={{ title: 'Update Symptoms' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditVisitType" component={EditVisitType} options={{ title: 'Update Type of Visit' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditVisitPurpose" component={EditVisitPurpose} options={{ title: 'Update Purpose of Visit' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditVisit" component={EditVisit} options={{ title: 'Update Visits' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="ShowVisit" component={ShowVisit} options={{ title: 'Visit Details' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditPet" component={EditPet} options={{ title: 'Update Pet' }} />

              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditMedicine" component={EditMedicine} options={{ title: 'Update Medicine' }} />

              {/* Components */}
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Templates" component={Templates} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Users" component={Users} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Settings" component={Settings} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="SubscriptionAndBilling" component={SubscriptionAndBilling} options={{ title: 'Subscription And Billing' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="LeftCredits" component={LeftCredits} options={{ title: 'Left Credits' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddNewVisitDetails" component={AddNewVisitDetails} options={{ title: 'Add New Visit Details' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddPet" component={AddPet} options={{ title: 'Add Pet' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="Message" component={Message} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="PetDetails" component={PetDetails} options={{ title: 'Pet Details' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="VisitHistory" component={VisitHistory} options={{ title: 'Visit History' }} />
              {/* <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AfterSubmit" component={AfterSubmit} options={{ title: 'After Submit' }}/> */}
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="DocumentUpload" component={DocumentUpload} options={{ title: 'Document Upload' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="SubmitNewVisitForm" component={SubmitNewVisitForm} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="petSubmitPage" component={petSubmitPage} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="VisitHistoryDetails" component={VisitHistoryDetails} options={{ title: 'Visit History Detail' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="NewVisit" component={NewVisit} options={{ title: 'New Visit' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="PetOwnerDetail" component={PetOwnerDetail} options={{ title: 'Pet Owner Details' }} />

              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddPrescription" component={AddPrescription} options={{ title: 'Add Template' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddMedicineToPrescription" component={AddMedicineToPrescription} options={{ title: 'Insert Medicine' }} />
              {/* <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditPrescriptionTemplate" component={EditPrescriptionTemplate} options={{ title: 'Edit Template' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="AddMedicineToPrescription" component={AddMedicineToPrescription} options={{ title: 'Insert Medicine' }} />
              <Stack.Screen initialParams={{ userDetails: loginState.userDetails }} name="EditMedicineToPrescription" component={EditMedicineToPrescription} options={{ title: 'Update Medicine' }} />               */}
            </Stack.Navigator>
            :
            <Stack.Navigator>
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          }
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}