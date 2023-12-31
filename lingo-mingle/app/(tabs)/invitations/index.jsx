//Hooks
import React, { useEffect, useState } from "react";
import useNotification from "../../../hooks/useNotification";
// Styles
import { InvitationsPageStyle as styles } from "../../../styles";
// Components
import {
  ScrollView,
  Text,
  FlatList,
  Pressable,
  View,
  SectionList,
} from "react-native";
import { Loader } from "../../../components/common";
import {
  NewInvitationCard,
  ScheduledInvitationCard,
} from "../../../components/cards";
import { NewInvitaionModal } from "../../../components/modals";
import NewInvitationModal from "../../../components/modals/NewInvitationsModal/NewInvitationsModal";
import EditInvitationModal from "../../../components/modals/EditInvitationsModal/EditInvitationsModal";
import AcceptDeclineInvitationsModal from "../../../components/modals/AcceptDeclineInvitation/AcceptDeclineInvitation";
import { SafeAreaView } from "react-native-safe-area-context";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import { Link } from "expo-router";
//Constants
import { COLOR } from "../../../constants";
// Services
import api from "../../../services/api";

const InvitationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [pageStatus, setPageStatus] = useState("new");
  const MY_UUID = "YVBwXkN7cIk7WmZ8oUXG";
  const [invitations, setInvitations] = useState([]);
  const [accInvitations, setAccInvitations] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [dirty2, setDirty2] = useState(true);
  const notify = useNotification();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [confirmationModalStatus, setConfirmationModalStatus] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const [invitationUUID, setInvitationUUID] = useState(null);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleModalEdit = (value, item) => {
    setEditModalVisible(!editModalVisible);
    if (!editModalVisible) {
      setToEdit(item);
    }
  };

  const toggleModalConfirmation = () => {
    setConfirmationModalVisible(!confirmationModalVisible);
  };

  const handleAcceptInvitation = (invitationUUID) => {
    api
      .acceptInvitation(invitationUUID)
      .then((res) => {
        setDirty(true);
        setDirty2(true);
        notify.success(res.message);
      })
      .catch((err) => notify.error(err.message));
  };

  const handleCancelInvitation = (invitationUUID) => {
    api
      .cancelInvitation(invitationUUID)
      .then((res) => {
        setDirty(true);
        setDirty2(true);
        notify.success("Inviation deleted");
      })
      .catch((err) => notify.error("Error while deleting the invitation"));
  };

  const handleRejectInvitation = (invitationUUID) => {
    api
      .cancelInvitation(invitationUUID)
      .then((res) => {
        setDirty(true);
        setDirty2(true);
        notify.success("Inviation rejected");
      })
      .catch((err) => notify.error("Error while rejecting the invitation"));
  };

  useEffect(() => {
    if (dirty) {
      api
        .getInvitation(MY_UUID, "pending")
        .then((data) => {
          if (data) {
            setInvitations(data);
            setDirty(false);
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [invitations, dirty]);

  useEffect(() => {
    if (dirty2) {
      api
        .getInvitation(MY_UUID, "accepted")
        .then((data) => {
          if (data) {
            setAccInvitations(data);
            setDirty2(false);
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [accInvitations, dirty2]);

  const handleSetNew = () => {
    setPageStatus("new");
  };
  const handleSetScheduled = () => {
    setPageStatus("scheduled");
  };
  if (loading) return <Loader />;

  //TODO: implement modal to confirm invitation sent
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      <View style={styles.topNav}>
        <Pressable
          style={
            pageStatus === "new"
              ? styles.topNavLinksSelected
              : styles.topNavLinks
          }
          onPress={handleSetNew}
        >
          <Text>New Invitations</Text>
        </Pressable>
        <Pressable
          style={
            pageStatus === "scheduled"
              ? styles.topNavLinksSelected
              : styles.topNavLinks
          }
          onPress={handleSetScheduled}
        >
          <Text> Scheduled </Text>
        </Pressable>
        <NewInvitationModal
          modalVisible={modalVisible}
          setModalVisible={toggleModal}
        />
        {editModalVisible ? (
          <EditInvitationModal
            modalVisible={editModalVisible}
            setModalVisible={toggleModalEdit}
            toEdit={toEdit}
            setDirty={setDirty2}
          />
        ) : (
          ""
        )}
        <AcceptDeclineInvitationsModal
          modalVisible={confirmationModalVisible}
          setModalVisible={toggleModalConfirmation}
          handleAcceptInvitation={handleAcceptInvitation}
          handleRejectInvitation={handleRejectInvitation}
          handleCancelInvitation={handleCancelInvitation}
          invitationUUID={invitationUUID}
          confirmationModalStatus={confirmationModalStatus}
        />
      </View>

      {invitations?.length === 0 && pageStatus === "new" ? (
        <Text style={styles.noInfoText}>There are no new invitations</Text>
      ) : invitations?.length !== 0 && pageStatus === "new" ? (
        <ScrollView
          horizontal={true}
          showsVerSectionListticalScrollIndicator={false}
          style={styles.sectionContainer}
          bounces={false}
        >
          <>
            <FlatList
              data={invitations}
              renderItem={({ item }) => (
                <NewInvitationCard
                  item={item}
                  myUUID={MY_UUID}
                  setInvitationUUID={setInvitationUUID}
                  modalVisible={confirmationModalVisible}
                  setModalVisible={toggleModalConfirmation}
                  setConfirmationModalStatus={setConfirmationModalStatus}
                />
              )}
              keyExtractor={(item) => item.uuid}
              showsHorizontalScrollIndicator={false}
            />
          </>
        </ScrollView>
      ) : accInvitations?.length !== 0 && pageStatus === "scheduled" ? (
        <ScrollView
          horizontal={true}
          showsVerSectionListticalScrollIndicator={false}
          style={styles.sectionContainer}
          bounces={false}
        >
          <>
            <FlatList
              data={accInvitations}
              renderItem={({ item }) => (
                <ScheduledInvitationCard
                  item={item}
                  myUUID={MY_UUID}
                  modalVisible={editModalVisible}
                  setModalVisible={toggleModalEdit}
                  setToEdit={setToEdit}
                  confirmationModalVisible={confirmationModalVisible}
                  setConfirmationModalVisible={toggleModalConfirmation}
                  setConfirmationModalStatus={setConfirmationModalStatus}
                  setInvitationUUID={setInvitationUUID}
                />
              )}
              keyExtractor={(item) => item.uuid}
              showsHorizontalScrollIndicator={false}
            />
          </>
        </ScrollView>
      ) : (
        <View>
          <Text style={styles.noInfoText}>There are no new Scheduled</Text>
        </View>
      )}

      {pageStatus === "new" ? (
        <View style={styles.buttonView}>
          <Pressable onPress={() => setModalVisible(true)}>
            <FA5Icon
              name="plus-circle"
              color={COLOR.primary}
              regular
              size={56}
            />
          </Pressable>
        </View>
      ) : (
        ""
      )}
    </SafeAreaView>
  );
};

export default InvitationsPage;
