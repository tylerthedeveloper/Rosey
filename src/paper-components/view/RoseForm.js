import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Avatar, Button, Card, Chip, Paragraph, TextInput, Searchbar } from 'react-native-paper';
import PlacesInput from 'react-native-places-input';
import Spacer from '../../components/Spacer';
import { Context as TagContext } from '../../context/TagContext';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import { MyTextInput } from '../../paper-components/memo';
import { SocialIcon } from 'react-native-elements'

const RoseForm = ({ user, props,
    form_updateFunction, form_updateFunctionText,
    form_secondFunction, form_secondFunctionText,
    form_updateFunction_callback
}) => {

    const {
        birthday, dateMet, email, homeLocation, name, nickName, notes, phoneNumber, placeMetAt, picture, socialProfiles, tags, work, roseId
    } = user || {};

    const { currentLocation, geoCodedLocation } = useCurrentLocation();
    // console.log(geoCodedLocation);

    const { state: { tags: contextTags }, addTag } = useContext(TagContext);

    const [updated_birthday, setBirthday] = useState(birthday || new Date(Date.now()));
    const [updated_dateMet, setDateMet] = useState(dateMet || new Date(Date.now()));
    const [updated_email, setEmail] = useState(email);
    const [updated_tags, setTags] = useState(tags || []);
    const [updated_work, setWork] = useState(work);
    const [updated_name, setName] = useState(name);
    const [updated_notes, setNotes] = useState(notes);
    const [updated_nickName, setNickName] = useState(nickName);
    const [updated_phoneNumber, setPhone] = useState(phoneNumber);
    const [updated_homeLocation, setUpdated_homeLocation] = useState(homeLocation || {});
    const [updated_placeMetAt, setUpdated_placeMetAt] = useState(placeMetAt || {});

    const { facebook, linkedin, instagram, medium, snapchat, twitter, whatsapp } = socialProfiles || {};

    const [updated_facebook, setFacebook] = useState(facebook || '');
    const [updated_linkedin, setLinkedin] = useState(linkedin || '');
    const [updated_instagram, setInstagram] = useState(instagram || '');
    const [updated_medium, setMedium] = useState(medium || '');
    const [updated_snapchat, setSnapchat] = useState(snapchat || '');
    const [updated_twitter, setTwitter] = useState(twitter || '');
    const [updated_whatsapp, setWhatsapp] = useState(whatsapp || '');

    // ────────────────────────────────────────────────────────────────────────────────
    // TODO: NOT YET USED //
    const [updated_picture, setPicture] = useState(picture);
    // ────────────────────────────────────────────────────────────────────────────────

    // TODO: Convert to one user object?
    const updatedUser = {
        birthday: updated_birthday || new Date(Date.now()),
        dateMet: updated_dateMet || new Date(Date.now()),
        email: updated_email || '',
        /* -------------------------------------------------------------------------- */
        homeLocation: updated_homeLocation || {
            homeLocationCoords: { latitude: -369, longitude: -369 },
            homeFormatted_address: '',
            homeLocationName: ''
        },
        placeMetAt: updated_placeMetAt
        ,
        /* -------------------------------------------------------------------------- */
        name: updated_name || '',
        notes: updated_notes || '',
        nickName: updated_nickName || '',
        phoneNumber: updated_phoneNumber || '',
        picture: updated_picture || '',
        socialProfiles: {
            facebook: updated_facebook,
            linkedin: updated_linkedin,
            instagram: updated_instagram,
            medium: updated_medium,
            snapchat: updated_snapchat,
            twitter: updated_twitter,
            whatsapp: updated_whatsapp
        },
        tags: updated_tags || [],
        work: updated_work || '',
        roseId: roseId || ''
    };

    const socialLinkedIcons = [
        { type: 'facebook', value: updated_facebook, setter: setFacebook },
        { type: 'linkedin', value: updated_linkedin, setter: setLinkedin },
        { type: 'instagram', value: updated_instagram, setter: setInstagram },
        { type: 'medium', value: updated_medium, setter: setMedium },
        { type: 'snapchat', value: updated_snapchat, setter: setSnapchat },
        { type: 'twitter', value: updated_twitter, setter: setTwitter },
        { type: 'whatsapp', value: updated_whatsapp, setter: setWhatsapp }
    ];

    const formRows = [
        {
            value: updated_name, subtitle: 'name',
            left: "account",
            rightIcon: "account-plus",
            editFunc: setName,
            autoCapitalize: "words"
        },
        {
            value: updated_nickName, subtitle: 'nickname',
            left: "account",
            rightIcon: "account-plus",
            editFunc: setNickName,
            autoCapitalize: "words"
        },
        {
            value: updated_phoneNumber, subtitle: 'phone',
            left: "phone",
            rightIcon: "phone",
            keyboardType: 'phone-pad',
            editFunc: setPhone
        },
        {
            value: updated_email, subtitle: 'email',
            left: "email",
            rightIcon: "email",
            editFunc: setEmail
        },
        {
            value: updated_work, subtitle: 'occupation',
            left: "briefcase-account",
            rightIcon: "briefcase-plus",
            editFunc: setWork,
            autoCapitalize: "words"
        },
        {
            value: updated_notes, subtitle: 'notes',
            left: "note",
            rightIcon: "note",
            editFunc: setNotes,
            multiline: true,
            autoCapitalize: "sentences"
        }
    ];
    /* -------------------------------------------------------------------------- */
    /*                                Functions                                   */
    /* -------------------------------------------------------------------------- */
    const [currentSocialEntry, setCurrentSocialEntry] = useState({
        editSocialEntry: false, type: '', setter: () => null
    });

    // TODO: MOVE OUT?
    const _clearFormData = () => formRows.map(row => row.editFunc(''));

    const [birth_datePicker, setBirth_datePicker] = useState(false);
    const [datemet_Picker, setDatemet_Picker] = useState(false);

    const toggledSelected = (tag) => {
        // const str = (tag + idx);
        if (!updated_tags.includes(tag)) {
            setTags([...updated_tags, tag]);
        } else {
            const filteredTags = updated_tags.filter(tg => tag !== tg);
            setTags(filteredTags);
        }
    }

    const _addTag = (newTag) => {
        addTag(newTag);
        setNewTag('')
        setTags([...updated_tags, newTag]);
    }

    const [newTag, setNewTag] = useState('');
    // console.log(updated_tags);

    const _makeLocationObject = (locationObject, locationType, locationSetter) => {
        if (locationType.includes('default')) {
            const { location: { latitude, longitude }, formatted_address, name } = locationObject;
            if (locationType === 'default_home') {
                locationSetter({
                    homeLocationCoords: { latitude, longitude },
                    homeFormatted_address: formatted_address,
                    homeLocationName: name
                });
            } else if (locationType === 'default_place_met') {
                locationSetter({
                    placeMetAtLocationCoords: { latitude, longitude },
                    placeMetAtFormatted_address: formatted_address,
                    placeMetAtName: name
                });
            }
        } else {
            const { geometry: { location: { lat, lng } }, formatted_address, name } = locationObject;
            if (locationType === 'home') {
                locationSetter({
                    homeLocationCoords: { latitude: lat, longitude: lng },
                    homeFormatted_address: formatted_address,
                    homeLocationName: name
                });
            } else if (locationType === 'place_met') {
                locationSetter({
                    placeMetAtLocationCoords: { latitude: lat, longitude: lng },
                    placeMetAtFormatted_address: formatted_address,
                    placeMetAtName: name
                });
            }
        }
    }

    const _setPlaceMet = () => {
        if (!Object.keys(updatedUser.placeMetAt).length > 0) {
            // console.log('please set me!!');
            updatedUser.placeMetAt = {
                placeMetAtFormatted_address: geoCodedLocation,
                placeMetAtLocationCoords: {
                    latitude: currentLocation.latitude || -369,
                    longitude: currentLocation.longitude || -369,
                },
                placeMetAtName: "",
            }
        } else {
            // console.log('i am set??');
        }
    }

    const _setHelperText = (type) => {
        switch (type) {
            case 'facebook':
            case 'linkedin':
            case 'medium':
                return `Enter username for ${type}`;
            case 'instagram':
            case 'snapchat':
            case 'twitter':
                return `Enter handle for ${type}`;
            case 'whatsapp':
                return 'Add Intnl number for whatsapp';
            default:
                return `Enter value for ${type}`;
        }
    }

    const [contentHeight, setContentHeight] = useState();
    const scrollRef = React.createRef();
    const placeInputRef = React.createRef();
    /* -------------------------------------------------------------------------- */


    /* -------------------------------------------------------------------------- */
    /*                         User Card Specifics                                */
    /* -------------------------------------------------------------------------- */
    const contactCardRowsToIgnore = ['notes', 'date met']
    const isUserContactCard = (form_updateFunctionText === 'Save contact card');

    if (isUserContactCard) {
        updatedUser.dateMet = undefined;
        updatedUser.placeMetAt = undefined;
        updatedUser.notes = undefined;
        
        // TODO:? KEEP?
        updatedUser.tags = undefined; 
        ///
        
        updatedUser.roseId = undefined;
    }
    // ────────────────────────────────────────────────────────────────────────────────

    // FIXME:
    // console.log(socialProfiles);
    console.log(JSON.stringify(user), JSON.stringify(updatedUser));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={80}
            style={{ flex: 1 }}
        >
            <ScrollView keyboardShouldPersistTaps="always"
                ref={scrollRef}
                onContentSizeChange={(contentHeight) => setContentHeight(contentHeight)}
            >
                {/* Social Section */}
                <Paragraph style={styles.sectionTitle}> Social Media </Paragraph>
                <View style={styles.socialMediaSection}>
                    {
                        socialLinkedIcons.map(({ setter, type, value }) => (
                            <TouchableOpacity key={type} style={{ marginHorizontal: 10 }}
                                onPress={() => {
                                    setCurrentSocialEntry({ setter, type, editSocialEntry: true })
                                }}
                            >
                                <SocialIcon
                                    raised
                                    light
                                    style={{
                                        opacity: (value) ? 1 : .5
                                    }}
                                    type={type}
                                />
                            </TouchableOpacity>
                        ))}
                </View>
                {
                    // TODO: Different keyboards for whatsap??
                    // TODO: Combine whatsapp and phone?
                    (currentSocialEntry.editSocialEntry)
                        ? <>
                            {/* <Paragraph style={{ alignSelf: 'center' }}> Click here for help! {_setHelperText(currentSocialEntry.type)}</Paragraph> */}
                            <Searchbar
                                placeholder={_setHelperText(currentSocialEntry.type)}
                                style={{ marginHorizontal: 25, marginVertical: 10 }}
                                icon={currentSocialEntry.type}
                                onChangeText={currentSocialEntry.setter}
                                keyboardType={(currentSocialEntry.type !== 'whatsapp') ? "default" : 'phone-pad'}
                                returnKeyType={"done"}
                                autoCompleteType={"off"}
                                autoCorrect={false}
                                autoCapitalize={"none"}
                                value={eval(`updated_${currentSocialEntry.type}`)}
                            />
                        </>
                        : null
                }
                {/* Form Section */}
                <Paragraph style={styles.sectionTitle}> Personal </Paragraph>
                {
                    formRows.map(({ left, subtitle, value, editFunc, keyboardType, autoCapitalize, multiline }) => (
                        ((isUserContactCard && !contactCardRowsToIgnore.includes(subtitle) || !isUserContactCard))
                            ? <Card.Actions style={styles.cardContent} key={subtitle} >
                                <Avatar.Icon {...props} icon={left} size={40} style={{ marginRight: 20 }} />
                                <TextInput mode="outlined"
                                    label={subtitle}
                                    style={styles.textInput}
                                    // placeholder={value}
                                    value={value}
                                    autoCapitalize={autoCapitalize || "none"}
                                    autoComplete={false}
                                    autoCorrect={false}
                                    autoCompleteType={"off"}
                                    onChangeText={editFunc}
                                    multiline={multiline}
                                    keyboardType={keyboardType}
                                />
                            </Card.Actions>
                            : null
                    ))
                }
                {/* Tag Section */}
                <Paragraph style={styles.sectionTitle}> Tags (select below) </Paragraph>
                <View style={styles.chips}>
                    {
                        contextTags.map((tag, index) =>
                            (<Chip mode="outlined" style={styles.chip}
                                key={tag + index}
                                icon={'tag'}
                                selectedColor={'blue'}
                                selected={updated_tags.includes(tag)}
                                onPress={() => toggledSelected(tag)}
                            >
                                {tag}
                            </Chip>)
                        )
                    }
                </View>
                {/* TODO:  learn to center these*/}
                <MyTextInput value={newTag} onChangeText={setNewTag} style={{ height: 50, marginLeft: 30, width: '100%', textAlign: 'center' }} />
                <Button onPress={() => _addTag(newTag)} disabled={!newTag}>
                    Add Tag
                </Button>
                {/*  DATE SECTION */}
                <Paragraph style={styles.sectionTitle}> Date Info </Paragraph>
                {
                    (!isUserContactCard)
                        ? <View style={{ alignItems: 'center' }}>
                            <Card.Actions style={styles.cardContent}>
                                <TouchableOpacity onPress={() => setDatemet_Picker(!datemet_Picker)}>
                                    <Avatar.Icon {...props} icon={'calendar'} size={40} style={{ marginRight: 20 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setDatemet_Picker(!datemet_Picker)}
                                    style={styles.textInput}
                                >
                                    <Paragraph style={{ fontStyle: 'italic' }}> Date Met </Paragraph>
                                    <TextInput
                                        disabled={true}
                                        onTouchStart={() => setDatemet_Picker(!datemet_Picker)}
                                        value={moment(new Date(updated_dateMet)).format('MMM DD, YYYY')}
                                    />
                                </TouchableOpacity>
                            </Card.Actions>
                            {
                                (datemet_Picker)
                                    ?
                                    <DateTimePicker
                                        value={updated_dateMet}
                                        display="default"
                                        style={{ width: '70%', alignSelf: 'center' }}
                                        onChange={(event, value) => {
                                            setDateMet(value || updated_dateMet || new Date(Date.now()));
                                            setTimeout(() => setDatemet_Picker(false), 2000);
                                        }}
                                    />
                                    : null
                            }
                        </View>
                        : null
                }
                <View style={{ alignItems: 'center' }}>
                    <Card.Actions style={styles.cardContent}>
                        <TouchableOpacity onPress={() => setBirth_datePicker(!birth_datePicker)}>
                            <Avatar.Icon {...props} icon={'calendar'} size={40} style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setBirth_datePicker(!birth_datePicker)}
                            style={styles.textInput}>
                            <Paragraph style={{ fontStyle: 'italic' }}> Birthday </Paragraph>
                            <TextInput
                                onTouchStart={() => setBirth_datePicker(!birth_datePicker)}
                                disabled={true}
                                value={moment(new Date(updated_birthday)).format('MMM DD, YYYY')}
                            />
                        </TouchableOpacity>
                    </Card.Actions>
                    {
                        (birth_datePicker)
                            ? <DateTimePicker
                                value={updated_birthday}
                                display="default"
                                style={{ width: '70%', alignSelf: 'center' }}
                                onChange={(e, value) => {
                                    setBirthday(value || updated_birthday || new Date(Date.now()));
                                    setTimeout(() => setBirth_datePicker(false), 2000);
                                }}
                            />
                            : null
                    }
                </View>
                {/* Location Section */}
                {/* TODO: preset location.... */}
                <Paragraph style={styles.sectionTitle}> Location Section (please select below)</Paragraph>
                <TouchableOpacity
                    onPress={() => _makeLocationObject({
                        location: currentLocation, formatted_address: geoCodedLocation, name: ""
                    }, "default_home", setUpdated_homeLocation)}>
                    <Paragraph style={{ alignSelf: 'center', color: 'blue' }}>
                        Use location for home
                    </Paragraph>
                </TouchableOpacity>
                <Card.Actions style={styles.cardContent}>
                    <Avatar.Icon {...props} icon={'crosshairs-gps'} size={40} style={{ marginRight: 10 }} />
                    <PlacesInput
                        googleApiKey={GOOGLE_API_KEY}
                        onSelect={place => _makeLocationObject(place.result, 'home', setUpdated_homeLocation)}
                        placeHolder={(updated_homeLocation && updated_homeLocation.homeFormatted_address) ? updated_homeLocation.homeFormatted_address : "Home location"}
                        language={"en-US"}
                        textInputProps={{
                            autoCorrect: false,
                            fontWeight: 'bold'
                        }}
                        stylesContainer={{
                            position: 'relative',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            margin: 0,
                            width: '80%',
                            marginBottom: 10
                        }}
                        //onChangeText={() => scrollRef.current?.scrollTo({ y: 2 * contentHeight, animated: true })}
                        onChangeText={() => scrollRef.current?.scrollToEnd()}
                    />
                </Card.Actions>
                {
                    (!isUserContactCard)
                        ? <>
                            <TouchableOpacity
                                onPress={() => _makeLocationObject({
                                    location: currentLocation, formatted_address: geoCodedLocation, name: ""
                                }, "default_place_met", setUpdated_placeMetAt)}>
                                <Paragraph style={{ alignSelf: 'center', color: 'blue' }}>
                                    Use location for place met
                                </Paragraph>
                            </TouchableOpacity>
                            <Card.Actions style={styles.cardContent}>
                                {/* TODO: SET NAME??? */}
                                <Avatar.Icon {...props} icon={'crosshairs-gps'} size={40} style={{ marginRight: 10 }} />
                                <PlacesInput
                                    googleApiKey={GOOGLE_API_KEY}
                                    onSelect={place => _makeLocationObject(place.result, 'place_met', setUpdated_placeMetAt)}
                                    placeHolder={updated_placeMetAt.placeMetAtFormatted_address || geoCodedLocation || "Place you met!"}
                                    language={"en-US"}
                                    onChangeText={() => scrollRef.current?.scrollToEnd()}
                                    textInputProps={{
                                        autoCorrect: false,
                                        fontWeight: 'bold',
                                    }}
                                    query={geoCodedLocation}
                                    stylesContainer={{
                                        position: 'relative',
                                        alignSelf: 'center',
                                        margin: 0,
                                        width: '80%',
                                        marginBottom: 10
                                    }}
                                    ref={placeInputRef}
                                    stylesList={{
                                        position: 'absolute',
                                        bottom: (placeInputRef.current) ? placeInputRef.current.height : 0
                                    }}
                                />
                            </Card.Actions>
                        </>
                        : null
                }
                <Button disabled={JSON.stringify(user) === JSON.stringify(updatedUser)}
                    onPress={() => {
                        if (!isUserContactCard) _setPlaceMet();
                        form_updateFunction({ roseObj: updatedUser, callback: () => form_updateFunction_callback(updatedUser) })
                    }}>
                    {form_updateFunctionText || 'Save'}
                </Button>
                <Button
                    onPress={() => {
                        _clearFormData();
                        form_secondFunction();
                    }}
                    style={{}}
                >
                    {form_secondFunctionText}
                </Button>
            </ScrollView>
            <Spacer />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    cardContent: {
        paddingLeft: 22,
        paddingRight: 20,
        marginTop: 3,
        marginLeft: 2,
        width: '100%',
        marginBottom: 5
    },
    // TODO:
    textInput: {
        //width: '70%',
        minWidth: '70%',
        maxWidth: '90%'
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginVertical: 10
    },
    chips: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 5,
    },
    chip: {
        marginHorizontal: 5,
        marginVertical: 5
    },
    socialMediaSection: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
});

export default RoseForm;