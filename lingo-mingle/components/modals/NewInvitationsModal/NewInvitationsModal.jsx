import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  FlatList
} from "react-native";
import styles from "./NewInvitationsModal.style";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import { COLOR } from "../../../constants";
import api from "../../../services/api";
//TODO: fix the correct type of each input, fix the styling
const NewInvitationModal = ({ modalVisible, setModalVisible }) => {
  //const [modalVisible, setModalVisible] = useState(false);
  const MY_UUID = "YVBwXkN7cIk7WmZ8oUXG";

  const [text, onChangeText] = useState("");
  const [friend,SetFriend]=useState('');
  const [dropdownOpen,setDropdownOpen]=useState(false)
  const [users,setUsers]=useState([]);
  const onChangeFriend = (value) =>{
    setDropdownOpen(true);
    console.log(value);
    SetFriend(value);
    onSearch(value);
  }
  const onSearch = (searchItem) =>{
    console.log('search', searchItem);
  }

  useEffect(()=>{
    api
    .getAllUsers()
    .then((data)=>setUsers(data))
    .catch((err)=>console.log(err));

  },[])


/*
  const users=[
    {
      uuid:1,
      username:"Matteo"
    },
    {
      uuid:2,
      username:"Francesca"
    },
    {
      uuid:3,
      username:"Giulia"
    },
    {
      uuid:4,
      username:"Matteo"
    },
    {
      uuid:5,
      username:"Matteo"
    },
    {
      uuid:6,
      username:"Matteo"
    },
    {
      uuid:7,
      username:"Matteo"
    },
    {
      uuid:8,
      username:"Matteo"
    },
  ]*/
 
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New invitation</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.userNameInput}
                onChangeText={onChangeFriend}
                value={friend}
                placeholder="Friend Username"
              />
              <FA5Icon name="search" color={COLOR.gray} size={20} />
            </View>

            {dropdownOpen? 
            <View style={dropdownOpen? styles.dropdown : styles.dropdownEmpty}>
              <FlatList
                data={users.filter((item) => {
                  const searchTerm = friend.toLowerCase();
                  const nameuser = item.username.toLowerCase();
                  return searchTerm && nameuser.startsWith(searchTerm) 
                  && searchTerm!==nameuser;
                }).slice(0,10)}
                renderItem={({ item }) => (
                  <Pressable onPress={()=>{SetFriend(item.username)
                  setDropdownOpen(false)
                  }} style={styles.dropdownRow} key={item.uuid}>
                    <Text style={styles.friendStyle}>{item.username}</Text>
                    {console.log(item.username)}
                  </Pressable>
                )}
                keyExtractor={(item) => item.uuid}
                showsHorizontalScrollIndicator={true}
              />
            </View>
             : ''}


            <View style={styles.formview}>
              <TextInput
                style={styles.dateTimeInput}
                onChangeText={onChangeText}
                value={text}
                placeholder="Date"
              />
              <TextInput
                style={styles.dateTimeInput}
                onChangeText={onChangeText}
                value={text}
                placeholder="Hour"
              />
            </View>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Place"
            />

            <View style={styles.formview}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {setModalVisible(!modalVisible)
                setDropdownOpen(false)
                SetFriend("")
                }
                }
              >
                <Text style={styles.cancelTextStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSend]}
                onPress={() => {setModalVisible(!modalVisible)
                setDropdownOpen(false)
                SetFriend("")
                }}
              >
                <Text style={styles.textStyle}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewInvitationModal;
