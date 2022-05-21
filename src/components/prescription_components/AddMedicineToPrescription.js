import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Dropdown } from "react-native-element-dropdown";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import axios from "react-native-axios";
import CourseComponent from './sub_components/CourseComponent';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AddMedicineToPrescription = ({route, navigation}) => {

    const [formData, setFormData] = useState({
        medicine: {},
        courses: '',
        course_data: [],
    });

    const courseItem = [
        {id: '1', label: 'Single Course'},
        {id: '2', label: 'Course 2'},
        {id: '3', label: 'Course 3'},
        {id: '4', label: 'Course 4'},
        {id: '5', label: 'Course 5'},
        {id: '6', label: 'Course 6'},
        {id: '7', label: 'Course 7'},
        {id: '8', label: 'Course 8'},
        {id: '9', label: 'Course 9'},
    ]

    const [noOfCourse, setNoOfCourse] = useState();
    const [isCourseAdded, setIsCourseAdded] = useState(false);

    const [medicineType, setMedicineType] = useState("");
    const [medicineData, setMedicineData] = useState([]);
    const [medicineTypeId, setMedicineTypeId] = useState("");
    const [sizes, setSizes] = useState("");
    const [coursesComponentElementData, setCoursesComponentElementData] = useState([]);
    const [course_block, setCourse_block] = useState();

    useEffect(() => {
        getMedicineData();
    }, []);

    useEffect(() => {
        if(route.params.editMedicineDetails) {
            setNoOfCourse(route.params.editMedicineDetails.courses);
              console.log("fdgdgdgd",route.params.editMedicineDetails);
            setFormData({
                courses: route.params.editMedicineDetails.courses,
                medicine: route.params.editMedicineDetails.medicine,
                course_data: route.params.editMedicineDetails.course_data,
            })
            setMedicineType(route.params.editMedicineDetails.medicine.medicine_categories.medicine_type);
            setIsCourseAdded(false);
        }
    }, [route.params.editMedicineDetails])
    
    
    // console.log("medicineTypeId", medicineTypeId);

    const getMedicineData = async () => {
        let userClinicId = route.params.userDetails.clinic.id
        await axios
        .get(`medicine/clinic/${userClinicId}`)
        .then((res) => {
            if (res.status === 200) {
            let medicineData = medicineData;
            medicineData = [];
            res.data.map((element, index) => {
                // console.log(element);
                medicineData.push({
                    label: element.medicine_name,
                    id: element.id,
                    type: element.medicine_categories.medicine_type,
                    size: element.size,
                });
            });
            setMedicineData(medicineData);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const onHandleType = (item) => {
        console.log("item", item);
        setMedicineType(item.type);
        setSizes(item.size);
        setIsCourseAdded(false);
        let medicineTypeId = item.id;
        axios
        .get(`medicine/${medicineTypeId}`)
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data);
                let medicineTypeId = res.data
                // console.log(medicineTypeData);
                setMedicineTypeId(res.data);
                setFormData({
                    ...formData,
                    medicine: medicineTypeId
                })
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const onHandleCourse = (item) => {
        // let noOfCourse = item.value;
        setNoOfCourse(item.id);
        setIsCourseAdded(false);
        // console.log(item.value);
        setFormData({
            ...formData,
            courses: item.id,
        })
    }

    const templateData = (data, index) => {
        console.log("Add Med to Index", index);
        // let courseIndex = index;
        // console.log("Add Med to Presc", data);
        setCourse_block(data);
        let tempData = {};
        let tempCourseData = formData.course_data;
        Object.keys(data).map((key, index) => {
            tempData[key] = data[key];
        });
        tempCourseData[index]=tempData;
        setFormData({
            ...formData,
            course_data: tempCourseData
        });
    }

    let coursesComponent = [];
    if (!isCourseAdded) {
        coursesComponent = coursesComponentElementData;
        coursesComponent = [];
        // let noOfCourse = noOfCourse;
        for (let i = 0; i < noOfCourse; i++) {            
            coursesComponent.push(
                <CourseComponent
                    componentIndex={i}
                    medicineType={medicineType}
                    templateData={templateData}
                    editMedicineDetails={formData && formData.course_data[i]}
                />
            )
        }
        setCoursesComponentElementData(coursesComponent);
        setIsCourseAdded(true);
    } else {
        coursesComponent = coursesComponentElementData;
    }

    const onDone = () => {
        if(route.params.updatingMedicineQueueToPrescription) {
            route.params.updatingMedicineQueueToPrescription(formData);
        } else if (route.params.prescTemplateData) {
            route.params.prescTemplateData(formData);
        }
        navigation.goBack({ "formData": formData });
    }

    return (
        <ScrollView>
            <View style={{marginHorizontal: 10}} key={'pr-1'}>
                <View>
                    <Text style={styles.heading}>Medicine</Text>
                    <CustomDropdown
                        // handleAddEvent={handleAddNewDisease}
                        onChange={(value) => onHandleType(value)}
                        // buttonLabel={"Add new disease"}
                        // defaultValue={5}
                        defaultValue={formData.medicine && formData.medicine.id}
                        data={medicineData}
                        labelField="label"
                        valueField="id"
                        enableSearch={"true"}
                        autoFocusSearch={'false'}
                    />
                    <View style={styles.details}>
                        <Text style={styles.sub}>{medicineType && medicineType}</Text>
                        <Text style={styles.sub}>{sizes}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.heading}>Select Courses</Text>
                    <CustomDropdown
                        onChange={(value) => onHandleCourse(value)}
                        defaultValue={formData && formData.courses}
                        data={courseItem}
                        labelField="label"
                        valueField="id"
                        enableSearch={"true"}
                        autoFocusSearch={'false'}
                    />
                </View>
            </View>

            {coursesComponent}
            <TouchableOpacity
                onPress={onDone}
                style={styles.done}
            >
                <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>Done</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default AddMedicineToPrescription

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        marginTop: 10,
        marginHorizontal: 7,
        marginBottom: 10
    },
    details: {
        flexDirection: "row",
        // justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 10
    },
    parallel: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sub: {
        fontSize: 12,
        color: "#006766",
        fontWeight: "bold",
        textTransform: 'capitalize',
        // textAlign: 'center'
    },
    dropdown: {
        marginHorizontal: 16,
        marginVertical: 16,
        height: 50,
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2
    },
    done: {
        backgroundColor: '#006766',
        padding: 20,
        marginTop: 20,
    },
});