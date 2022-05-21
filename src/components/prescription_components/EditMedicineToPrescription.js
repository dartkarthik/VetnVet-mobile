import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Dropdown } from "react-native-element-dropdown";
import axios from "react-native-axios";
import CourseComponent from './sub_components/CourseComponent';

const EditMedicineToPrescription = ({ route, navigation }) => {

    const [formData, setFormData] = useState({
        medicine: {},
        courses: '1',
        course_data: [],
    });

    const courseItem = [
        { value: '1', label: 'Single Course' },
        { value: '2', label: 'Course 2' },
        { value: '3', label: 'Course 3' },
        { value: '4', label: 'Course 4' },
        { value: '5', label: 'Course 5' },
        { value: '6', label: 'Course 6' },
        { value: '7', label: 'Course 7' },
        { value: '8', label: 'Course 8' },
        { value: '9', label: 'Course 9' },
    ]

    // const editMedicineDetails = route.params.editMedicineDetails;

    const [course_block, setCourse_block] = useState();

    const [noOfCourse, setNoOfCourse] = useState('');
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const [coursesComponentElementData, setCoursesComponentElementData] = useState([]);

    const [medicineData, setMedicineData] = useState([]);

    const [medicineType, setMedicineType] = useState("");

    const [medicineTypeId, setMedicineTypeId] = useState("");
    const [sizes, setSizes] = useState("");

    const [ index, setIndex ] = useState();

    useEffect(() => {
        if(route.params.editMedicineDetails) {
            setNoOfCourse(route.params.editMedicineDetails.courses);
            // console.log("courses", editMedicineDetails.courses);
            setFormData({
                courses: route.params.editMedicineDetails.courses,
                medicine: route.params.editMedicineDetails.medicine,
                course_data: route.params.editMedicineDetails.course_data,
            })
            setMedicineType(route.params.editMedicineDetails.medicine.medicine_categories.medicine_type);
            setIsCourseAdded(false);
            // console.log("sdfsadfwrwr", route.params.editMedicineDetails.medicine.medicine_categories.medicine_type);
        }
        getMedicineData();
    }, [route.params.editMedicineDetails]);

    // console.log("formData", formData);
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
                            value: element.id,
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
        setMedicineType(item.type);
        setSizes(item.size);
        setIsCourseAdded(false);
        let medicineTypeId = item.value;
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
        // let noOfCourses = item.value;
        setNoOfCourse(item.value);
        setIsCourseAdded(false);
        // console.log(item.value);
        setFormData({
            ...formData,
            courses: item.value,
        })
    }

    const templateData = (data, index) => {
        // console.log("Add Med to Index", index);
        // console.log("Add Med to Presc", data);
        setCourse_block(data);
        let tempData = {};
        let tempCourseData = formData.course_data;
        Object.keys(data).map((key, index) => {
            tempData[key] = data[key];
            setIndex(index);
        });
        tempCourseData[index] = tempData;
        setFormData({
            ...formData,
            course_data: tempCourseData
        });
    }

    // console.log("fsfsfsfsf", formData);

    const onDone = () => {
        
        if(route.params.updatingMedicineQueueToPrescription) {
            route.params.updatingMedicineQueueToPrescription(formData);
        } else if (route.params.prescTemplateData) {
            route.params.prescTemplateData(formData);
        }

        // route.params.updatingMedicineQueueToPrescription(formData);
        navigation.goBack({ "formData": formData })
    }

    let coursesComponent = [];
    if (!isCourseAdded) {
        coursesComponent = coursesComponentElementData;
        coursesComponent = [];
        // let noOfCourse = editMedicineDetails.courses
        for (let i = 0; i < noOfCourse; i++) {
            // console.log("IN EditM2P");
            coursesComponent.push(
                <CourseComponent
                    componentIndex={i}
                    medicineType={medicineType}
                    templateData={templateData}
                    // data={route.params.editMedicineDetails}
                    editMedicineId={route.params.editMedicineDetails && route.params.editMedicineDetails.medicine.id}
                    editMedicineDetails={route.params.editMedicineDetails && route.params.editMedicineDetails.course_data[i]}
                />
            )
        }
        // console.log("coursesComponent", coursesComponent);
        setCoursesComponentElementData(coursesComponent);
        setIsCourseAdded(true);
    } else {
        coursesComponent = coursesComponentElementData;
    }

    return (
        <>
            <ScrollView>
                <View>
                    <Text style={styles.heading}>* Medicine</Text>
                    <Dropdown
                        search
                        searchPlaceholder='search ...'
                        placeholder='Select Medicine'
                        placeholderStyle={{ color: '#00000080' }}
                        style={styles.dropdown}
                        maxHeight={250}
                        data={medicineData}
                        labelField="label"
                        valueField="value"
                        value={route.params.editMedicineDetails.medicine.id}
                        onChange={(item) => onHandleType(item)}
                        selectedTextStyle={{ color: '#000' }}
                    />
                    <View style={styles.details}>
                        <Text style={styles.sub}><Text style={{ fontWeight: 'normal' }}>medicine type -</Text> {medicineType.toUpperCase()} </Text>
                        <Text style={styles.sub}>{sizes}</Text>
                    </View>
                </View>
                <View>
                    <Dropdown
                        placeholder='Select Course'
                        placeholderStyle={{ color: '#00000080' }}
                        style={styles.dropdown}
                        maxHeight={250}
                        data={courseItem}
                        labelField="label"
                        valueField="value"
                        value={noOfCourse}
                        onChange={(item) => onHandleCourse(item)}
                        selectedTextStyle={{ color: '#000' }}
                    />
                </View>

                {coursesComponent}
                <View>
                    <TouchableOpacity
                        onPress={onDone}
                        style={styles.done}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}

export default EditMedicineToPrescription

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        marginTop: 10,
        marginHorizontal: 7
    },
    details: {
        flexDirection: "row",
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    parallel: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sub: {
        fontSize: 12,
        color: "black",
        fontWeight: "bold",
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
    },
});
