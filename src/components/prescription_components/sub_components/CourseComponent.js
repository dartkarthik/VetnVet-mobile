import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
// import { DataRange, consumptionRoutine } from '../../prescription_components/DataRange'
import { CheckBox } from "react-native-elements";
import ConsumptionTimesComponent from './ConsumptionTimesComponent';
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from 'react-native-paper';

const CourseComponent = ({ componentIndex, medicineType, navigation, templateData, editMedicineDetails, updatingMedicineQueueToPrescription }) => {

    // console.log("editMedicineDetails | editMedicineDetails", editMedicineDetails);
    const [courseData, setCourseData] = useState({
        consumption_type: {
            interval: '0',
            unit: 'minutes',
            diet_routine: ''
        },
        duration: {
            interval: '0',
            interval_unit: 'days',
        },
        consumption_times: {
            duration: {
                interval: "0",
                interval_unit: "days"
            },
            medicine_split: [0, 0],
        },
        note: '',
        useAsNeeded: false,
    });
    const [consumptionTimes, setConsumptionTimes] = useState();

    // console.log("consumptionTimesData", consumption_times);

    // console.log("med", medicineType);
    // console.log("medicineType", medicineType);
    // console.log("componentIndex", componentIndex);

    const [consumptionDisable, setConsumptionDisable] = useState(false);
    const [useAsNeeded, setUseAsNeeded] = useState(false);

    //BMAM
    const [minutes, setMinutes] = useState(true);
    const [hours, setHours] = useState(false);

    // every
    const [hour, setHour] = useState(false);
    const [day, setDay] = useState(true);
    const [month, setMonth] = useState(false);
    const [year, setYear] = useState(false);

    // duration
    const [durYear, setDurYear] = useState(true);
    const [durMonth, setDurMonth] = useState(false);
    const [durDay, setDurDay] = useState(false);


    const [consumptionTypeIntervalBMAM, setConsumptionTypeIntervalBMAM] = useState({
        min: 0,
        max: 59
    });
    const [consumptionTypeIntervalEvery, setConsumptionTypeIntervalEvery] = useState({
        min: 0,
        max: 59
    });
    const [HoursTypeIntervalEvery, setHoursTypeIntervalEvery] = useState({
        min: 0,
        max: 59
    });
    const [hoursTypeIntervalBMAM, setHoursTypeIntervalBMAM] = useState({
        min: 0,
        max: 24
    });
    const [consumptionTypeIntervalDuration, setConsumptionTypeIntervalDuration] = useState({
        min: 0,
        max: 59
    });


    // every
    const [everyHours, setEveryHours] = useState({
        min: 0,
        max: 24
    });
    const [everyDays, setEveryDays] = useState({
        min: 0,
        max: 31
    });
    const [everyMonths, setEveryMonths] = useState({
        min: 0,
        max: 12
    });
    const [everyYears, setEveryYears] = useState({
        min: 0,
        max: 15
    });

    //


    // duration
    const [durDays, setDurDays] = useState({
        min: 0,
        max: 31
    });
    const [durMonths, setDurMonths] = useState({
        min: 0,
        max: 12
    });
    const [durYears, setDurYears] = useState({
        min: 0,
        max: 15
    });
    //


    const [BMAMtimes, setBMAMtimes] = useState([
        { "label": 'Hour(s)', 'value': 'hours', 'index': '0' },
        { "label": 'Minute(s)', 'value': 'minutes', 'index': '1' },
    ])
    const [BMAM, setBMAM] = useState([
        { 'value': 'After Meal', 'index': '0' },
        { 'value': 'Before Meal', 'index': '1' },
        { 'value': 'NA', 'index': '2' },
    ])
    const [BBAB, setBBAB] = useState([
        { 'value': 'After Bath', 'index': '0' },
        { 'value': 'Before Bath', 'index': '1' },
        { 'value': 'NA', 'index': '2' },
    ])
    const [everyInt, setEveryInt] = useState([
        { "label": 'Hour(s)', 'value': 'hours', 'index': '0' },
        { "label": 'Day(s)', 'value': 'days', 'index': '1' },
        { "label": 'Month(s)', 'value': 'months', 'index': '2' },
        { "label": 'Year(s)', 'value': 'years', 'index': '3' },
    ])
    const [durationInt, setDurationInt] = useState([
        // {"label": 'Hour(s)','value': 'hours', 'index': '0'},
        { "label": 'Day(s)', 'value': 'days', 'index': '1' },
        { "label": 'Month(s)', 'value': 'months', 'index': '2' },
        { "label": 'Year(s)', 'value': 'years', 'index': '3' },
    ])
    const [hoursInt, setHoursInt] = useState([
        { 'value': '0', 'index': 1 },
        { 'value': '1/4', 'index': 1 },
        { 'value': '1/2', 'index': 1 },
        { 'value': '3/4', 'index': 1 },
    ])

    const [hoursComp, setHoursComp] = useState(false);

    const morningCount = Array(consumptionTypeIntervalBMAM.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })

    // every
    const everyHour = Array(everyHours.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    const everyDay = Array(everyDays.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    const everyMonth = Array(everyMonths.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    const everyYear = Array(everyYears.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })

    const hoursSplit = Array(consumptionTypeIntervalEvery.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })

    // duration
    const durationDay = Array(durDays.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    const durationMonth = Array(durMonths.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    const durationYear = Array(durYears.max + 1).fill().map((_, i) => {
        return { 'id': `${i}` };
    })
    //

    const hoursCount = Array(HoursTypeIntervalEvery.max + 1).fill().map((_, i) => {
        return { 'id': i };
    })
    const hoursTypeBMAM = Array(hoursTypeIntervalBMAM.max + 1).fill().map((_, i) => {
        return { 'id': i };
    })
    const durationCount = Array(consumptionTypeIntervalDuration.max + 1).fill().map((_, i) => {
        return { 'id': i };
    })


    useEffect(() => {
        if (
            medicineType !== 'oinment' &&
            medicineType !== 'spray' &&
            medicineType !== 'balm' &&
            medicineType !== 'lotion' &&
            medicineType !== 'powder'
        ) {
            setUseAsNeeded(false);
        }
        templateData(courseData, componentIndex);
    }, [medicineType, courseData])

    useEffect(() => {
        // console.log("editMedicineDetails", editMedicineDetails);
        if (editMedicineDetails) {
            setCourseData(editMedicineDetails);
        }
    }, [editMedicineDetails])

    // BMAM
    const handleBMAMvalue1 = (value) => {
        setCourseData({
            ...courseData,
            consumption_type: {
                ...courseData.consumption_type,
                interval: value.id,
            }
        })
    }

    const handleBMAMtimes = (value) => {
        // console.log(value);
        if (value.value == "Hours") {
            // console.log("Test");
            setMinutes(false);
            setHours(true);
        } else {
            setMinutes(true);
            setHours(false);
        }

        setCourseData({
            ...courseData,
            consumption_type: {
                ...courseData.consumption_type,
                unit: value.value
            }
        })
    }

    const handleBMAM = (value) => {
        setCourseData({
            ...courseData,
            consumption_type: {
                ...courseData.consumption_type,
                diet_routine: value.value,
            }
        })
    }

    // Duration
    const handleDurationValue = (value) => {
        // console.log(value.id);
        setCourseData({
            ...courseData,
            duration: {
                ...courseData.duration,
                interval: value.id,
            }
        })
    }

    const handleDuration = (value) => {
        // console.log(value);
        if (value.value == "days") {
            setDurDay(true);
            setDurMonth(false);
            setDurYear(false);
        } else if (value.value == "months") {
            setDurMonth(true);
            setDurDay(false);
            setDurYear(false);
        } else if (value.value == "years") {
            setDurYear(true);
            setDurYear(false);
            setDurDay(false);
        } else {
            setDurDay(true);
        }

        setCourseData({
            ...courseData,
            duration: {
                ...courseData.duration,
                interval_unit: value.value,
            }
        })
    }

    // handle every parts
    const handleEveryInt = (value) => {
        // console.log(value);
        if (value.value == "days") {
            setDay(true);
            setHour(false);
            setMonth(false);
            setYear(false);
            setHoursComp(false);
            setConsumptionDisable(false);
        } else if (value.value == "months") {
            setMonth(true);
            setDay(false);
            setHour(false);
            setYear(false);
            setHoursComp(false);
            setConsumptionDisable(false);
        } else if (value.value == "years") {
            setYear(true);
            setMonth(false);
            setDay(false);
            setHour(false);
            setHoursComp(false);
            setConsumptionDisable(false);
        } else if (value.value == "hours") {
            setHoursComp(true);
            setConsumptionDisable(true);
            setHour(true);
            setMonth(false);
            setDay(false);
            setYear(false);
        } else {
            setHoursComp(false);
            setConsumptionDisable(false);
            setDay(true);
        }

        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                duration: {
                    ...courseData.consumption_times.duration,
                    interval_unit: value.value,
                }
            }
        })
    }

    const handleEveryHourInterval = (value) => {
        // console.log(value);
        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                duration: {
                    ...courseData.consumption_times.duration,
                    interval: value.id,
                }
            }
        })
    }

    const handleEveryDayInterval = (value) => {
        // console.log(value);
        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                duration: {
                    ...courseData.consumption_times.duration,
                    interval: value.id,
                }
            }
        })
    }

    const handleEveryMonthInterval = (value) => {
        // console.log(value);
        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                duration: {
                    ...courseData.consumption_times.duration,
                    interval: value.id,
                }
            }
        })
    }

    const handleEveryYearInterval = (value) => {
        // console.log(value);
        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                duration: {
                    ...courseData.consumption_times.duration,
                    interval: value.id,
                }
            }
        })
    }

    const handleHoursCompPart = (value) => {
        let hoursData = courseData.consumption_times.medicine_split
        hoursData[value.index] = value.value;
        setCourseData({
            ...courseData,
            consumption_times: {
                ...courseData.consumption_times,
                medicine_split: hoursData
            }
        })
    }
    // End of handle every parts

    const courseInformation = (data) => {
        console.log("courseInformation", data);
        // setConsumptionTimes(data)
        let tempData = courseData && courseData.consumption_times
        Object.keys(data).map((key, index) => {
            tempData[key] = data[key];
        });
        setCourseData({
            ...courseData,
            consumption_times: tempData
        });
        templateData(courseData, componentIndex);
    }

    const onHandleNote = (value) => {
        let notes = value;
        setCourseData({
            ...courseData,
            note: notes
        });
    }

    const forUseAsNeeded = () => {
        let values = !useAsNeeded;
        setUseAsNeeded(values);
        // console.log("UseAsNeeded", values);
        setCourseData({
            ...courseData,
            useAsNeeded: values
        });
    }

    // console.log(courseData);

    return (
        <>
            <View style={styles.courseCountBlock}>
                <Text style={styles.courseCount}>
                    Course <Text>{(componentIndex + 1)}</Text>
                </Text>
            </View>
            <View style={styles.courseBlock}>
                {/* <Text> textInComponent </Text> */}
                {(
                    medicineType === 'oinment' ||
                    medicineType === 'spray' ||
                    medicineType === 'balm' ||
                    medicineType === 'lotion' ||
                    medicineType === 'powder'
                ) ?
                    <View>
                        <CheckBox
                            title="Use as Needed"
                            checked={useAsNeeded}
                            checkedColor="#006766"
                            onPress={() => forUseAsNeeded()}
                        />
                    </View>
                    : <></>}
                {!useAsNeeded ?
                    <>
                        {!consumptionDisable ?
                            <>
                                <View key={`consumption_block-${componentIndex}`}>
                                    {(
                                        medicineType === 'drops' ||
                                        medicineType === 'injection' ||
                                        medicineType === 'oinment' ||
                                        medicineType === 'powder'
                                    ) ?
                                        <></>
                                        : <>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, marginHorizontal: 10 }}>Before/After Meal</Text>
                                            <View style={styles.bmam}>
                                                <View style={styles.BMAMblock}>
                                                    {minutes ?
                                                        <Dropdown
                                                            placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                                            placeholder='0'
                                                            style={styles.dropdown}
                                                            maxHeight={250}
                                                            data={morningCount}
                                                            value={courseData.consumption_type && courseData.consumption_type.interval}
                                                            labelField="id"
                                                            valueField="id"
                                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                            onChange={(value) => handleBMAMvalue1(value)}
                                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        // containerStyle={styles.dropContainer}
                                                        />
                                                        : <></>}

                                                    {hours ?
                                                        <Dropdown
                                                            placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                                            placeholder='0'
                                                            style={styles.dropdown}
                                                            maxHeight={250}
                                                            data={hoursTypeBMAM}
                                                            value={courseData.consumption_type && courseData.consumption_type.interval}
                                                            labelField="id"
                                                            valueField="id"
                                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                            onChange={(value) => handleBMAMvalue1(value)}
                                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        // containerStyle={styles.dropContainer}
                                                        />
                                                        : <></>}

                                                    <Dropdown
                                                        placeholderStyle={{ color: '#00000040' }}
                                                        placeholder='minutes/hours'
                                                        style={styles.dropdown2}
                                                        maxHeight={120}
                                                        data={BMAMtimes}
                                                        value={courseData.consumption_type && courseData.consumption_type.unit}
                                                        labelField="label"
                                                        valueField="value"
                                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                        onChange={(value) => handleBMAMtimes(value)}
                                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        containerStyle={styles.dropContainer}
                                                    />
                                                </View>

                                                <View>
                                                    <Dropdown
                                                        placeholderStyle={{ color: '#00000040' }}
                                                        placeholder='ex: After Meal'
                                                        style={styles.dropdown}
                                                        maxHeight={170}
                                                        data={BMAM}
                                                        value={courseData.consumption_type && courseData.consumption_type.diet_routine}
                                                        labelField="value"
                                                        valueField="value"
                                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                        onChange={(value) => handleBMAM(value)}
                                                        selectedTextStyle={{ color: '#424651' }}
                                                        containerStyle={styles.dropContainer}
                                                    />
                                                </View>
                                            </View>

                                        </>
                                    }

                                    {(
                                        medicineType === 'oinment' ||
                                        medicineType === 'powder'
                                    ) ?
                                        <>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, marginHorizontal: 10 }}>Before/After Bath</Text>
                                            <View style={styles.bmam}>
                                                <View style={styles.BMAMblock}>
                                                    {minutes ?
                                                        <Dropdown
                                                            placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                                            placeholder='0'
                                                            style={styles.dropdown}
                                                            maxHeight={250}
                                                            data={morningCount}
                                                            value={courseData.consumption_type && courseData.consumption_type.interval}
                                                            labelField="id"
                                                            valueField="id"
                                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                            onChange={(value) => handleBMAMvalue1(value)}
                                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        // containerStyle={styles.dropContainer}
                                                        />
                                                        : <></>}

                                                    {hours ?
                                                        <Dropdown
                                                            placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                                            placeholder='0'
                                                            style={styles.dropdown}
                                                            maxHeight={250}
                                                            data={hoursTypeBMAM}
                                                            value={courseData.consumption_type && courseData.consumption_type.interval}
                                                            labelField="id"
                                                            valueField="id"
                                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                            onChange={(value) => handleBMAMvalue1(value)}
                                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        // containerStyle={styles.dropContainer}
                                                        />
                                                        : <></>}

                                                    <Dropdown
                                                        placeholderStyle={{ color: '#00000040' }}
                                                        placeholder='minutes/hours'
                                                        style={styles.dropdown2}
                                                        maxHeight={120}
                                                        data={BMAMtimes}
                                                        value={courseData.consumption_type && courseData.consumption_type.unit}
                                                        labelField="label"
                                                        valueField="value"
                                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                        onChange={(value) => handleBMAMtimes(value)}
                                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                                        containerStyle={styles.dropContainer}
                                                    />
                                                </View>

                                                <View>
                                                    <Dropdown
                                                        placeholderStyle={{ color: '#00000040' }}
                                                        placeholder='ex: After Bath'
                                                        style={styles.dropdown}
                                                        maxHeight={170}
                                                        data={BBAB}
                                                        value={courseData.consumption_type && courseData.consumption_type.diet_routine}
                                                        labelField="value"
                                                        valueField="value"
                                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                        onChange={(value) => handleBMAM(value)}
                                                        selectedTextStyle={{ color: '#424651' }}
                                                        containerStyle={styles.dropContainer}
                                                    />
                                                </View>
                                            </View>

                                        </>
                                        : <>

                                        </>
                                    }

                                </View>
                                <ConsumptionTimesComponent 
                                    courseInformation={courseInformation} 
                                    medicineType={medicineType} 
                                    componentIndex={componentIndex} 
                                    consumptionDisable={consumptionDisable} 
                                    editMedicineDetails={editMedicineDetails}
                                />
                            </>

                            : <></>}
                        {/* consumptionDisable */}

                        {/* every */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, marginHorizontal: 10 }}>Every :</Text>
                            <View style={styles.everyBlock}>

                                {hour ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={everyHour}
                                        value={courseData.consumption_times && courseData.consumption_times.duration && courseData.consumption_times.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleEveryHourInterval(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                {day ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={everyDay}
                                        value={courseData.consumption_times && courseData.consumption_times.duration && courseData.consumption_times.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleEveryDayInterval(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                {month ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={everyMonth}
                                        value={courseData.consumption_times && courseData.consumption_times.duration && courseData.consumption_times.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleEveryMonthInterval(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                {year ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={everyYear}
                                        value={courseData.consumption_times && courseData.consumption_times.duration && courseData.consumption_times.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleEveryYearInterval(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}


                                <Dropdown
                                    placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                    placeholder='Day(s)'
                                    style={styles.dropdown2}
                                    maxHeight={220}
                                    data={everyInt}
                                    value={courseData.consumption_times && courseData.consumption_times.duration && courseData.consumption_times.duration.interval_unit}
                                    labelField="label"
                                    valueField="value"
                                    // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                    onChange={(value) => handleEveryInt(value)}
                                    selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                // containerStyle={styles.dropContainer}
                                />
                            </View>
                            {hoursComp ?
                                <>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10 }}>
                                        <Dropdown
                                            placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                            placeholder='0'
                                            style={styles.dropdown}
                                            maxHeight={300}
                                            data={hoursSplit}
                                            value={courseData.consumption_times && courseData.consumption_times.medicine_split[0]}
                                            labelField="id"
                                            valueField="id"
                                            // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                            onChange={(value) => handleHoursCompPart(value)}
                                            selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                        // containerStyle={styles.dropContainer}
                                        />
                                        {(
                                            medicineType === 'tonic' ||
                                            medicineType === 'drops'
                                        ) ? <></> :
                                            <Dropdown
                                                placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                                placeholder='0'
                                                style={styles.dropdown2}
                                                maxHeight={220}
                                                data={hoursInt}
                                                value={courseData.consumption_times && courseData.consumption_times.medicine_split[1]}
                                                labelField="value"
                                                valueField="value"
                                                // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                                onChange={(value) =>  handleHoursCompPart(value)}
                                                selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                            // containerStyle={styles.dropContainer}
                                            />
                                        }
                                    </View>
                                </>
                                : <></>}
                        </View>

                        {/* duration part */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 10 }}>Duration :</Text>
                            <View style={styles.durationBlock}>
                                {durDay ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={durationDay}
                                        value={courseData.duration && courseData.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleDurationValue(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                {durMonth ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={durationMonth}
                                        value={courseData.duration && courseData.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        dropdownPosition='auto'
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleDurationValue(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                {durYear ?
                                    <Dropdown
                                        placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                        placeholder='0'
                                        style={styles.dropdown}
                                        maxHeight={300}
                                        data={durationYear}
                                        value={courseData.duration && courseData.duration.interval}
                                        labelField="id"
                                        valueField="id"
                                        // onSelectItem={(value) => value && handleTabletMorningCount(value)}
                                        onChange={(value) => handleDurationValue(value)}
                                        selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                    // containerStyle={styles.dropContainer}
                                    />
                                    : <></>}

                                <Dropdown
                                    placeholderStyle={{ color: '#00000040', textAlign: 'center' }}
                                    placeholder='Day(s)'
                                    style={styles.dropdown2}
                                    maxHeight={170}
                                    data={durationInt}
                                    value={courseData.duration && courseData.duration.interval_unit}
                                    labelField="label"
                                    valueField="value"
                                    onChange={(value) => handleDuration(value)}
                                    selectedTextStyle={{ color: '#424651', textAlign: 'center' }}
                                />
                            </View>
                        </View>
                    </>
                    : <></>}

                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginHorizontal: 10 }}>Note:</Text>
                    <TextInput
                        style={{ marginHorizontal: 10, backgroundColor: '#BFD9D980' }}
                        placeholder='Notes here'
                        onChangeText={(value) => onHandleNote(value)}
                        defaultValue={editMedicineDetails && editMedicineDetails.note}
                    />
                </View>

                {/* useAsNeeded */}
            </View>

        </>
    )
}

export default CourseComponent

const styles = StyleSheet.create({
    BMAMblock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    courseBlock: {
        marginBottom: 40,
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginHorizontal: 8,
        borderRadius: 20,
        elevation: 5
    },
    dropdown: {
        backgroundColor: '#BFD9D980',
        width: '50%',
        paddingLeft: 10,
        paddingRight: 4,
        paddingVertical: 5,
        borderRadius: 10
    },
    dropdown2: {
        backgroundColor: '#BFD9D980',
        width: '40%',
        paddingLeft: 10,
        paddingVertical: 5,
        borderRadius: 10,
        paddingRight: 4,
    },
    bmam: {
        marginBottom: 20,
        marginHorizontal: 10
    },
    everyBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    durationBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    courseCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FE8AA0',
        backgroundColor: '#000',
        width: 100,
        textAlign: 'center',
        borderRadius: 10,
        padding: 5,
    },
    courseCountBlock: {
        padding: 10,
        borderRadius: 20,
        position: 'relative',
    },

})
