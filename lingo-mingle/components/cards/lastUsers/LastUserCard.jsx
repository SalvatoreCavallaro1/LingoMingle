// Imports
import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";

// Styles
import styles from "./LastUserCard.styles";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import maleAvatar from "../../../assets/images/maleAvatar.png";
import femaleAvatar from "../../../assets/images/femaleAvatar.png";
import { COLOR } from "../../../constants";

// Services
import api from "../../../services/api";

// Hooks
import useNotification from "../../../hooks/useNotification";

const LastUserCard = ({ item, myUUID }) => {
  const notify = useNotification();
  const friendRequestUUID = item.uuid;

  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // TODO: Fix
  const handleSendFriendRequest = () => {
    // api
    //   .sendFriendRequest(myUUID, friendRequestUUID)
    //   .then((res) => {
    //     setFriendRequestSent(true);
    //     notify.success(res.message);
    //   })
    //   .catch((err) => notify.error(err.message));
  };

  // TODO: Fix
  const handleCancelFriendRequest = () => {
    // api
    //   .cancelFriendRequest(myUUID, friendRequestUUID)
    //   .then((res) => {
    //     setFriendRequestSent(false);
    //     notify.success(res.message);
    //   })
    //   .catch((err) => notify.error(err.message));
  };

  const handleStartVideoCall = () => {
    // TODO: Implement this functionality
  };

  // TODO: Evaluate whether to make the card clickable!
  return (
    <View style={styles.container}>
      <Image
        source={item.gender === "M" ? maleAvatar : femaleAvatar}
        style={styles.userImage}
      />
      <Text style={styles.userName}>{item.username}</Text>
      <View style={styles.actions}>
        <Pressable
          onPress={
            !friendRequestSent
              ? handleSendFriendRequest
              : handleCancelFriendRequest
          }
          style={styles.sendFriendRequestBtn}
        >
          {!friendRequestSent ? (
            <FA5Icon name="user-plus" size={20} />
          ) : (
            <FA5Icon name="user-check" size={20} color={COLOR.green} />
          )}
        </Pressable>
        <Pressable onPress={() => handleStartVideoCall()}>
          <FA5Icon name="video" size={20} />
        </Pressable>
      </View>
    </View>
  );
};

export default LastUserCard;
