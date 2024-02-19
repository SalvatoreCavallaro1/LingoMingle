// Imports
import React, { useEffect, useState } from "react";
import { Text, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

// Components
import { Loader } from "../../../components/common";
import {
  NewInvitationCard,
  PendingInvitationCard,
  ScheduledInvitationCard,
} from "../../../components/cards";
import {
  NewInvitationModal,
  EditInvitationModal,
  AcceptDeclineInvitationsModal,
} from "../../../components/modals";

//Hooks
import useNotification from "../../../hooks/useNotification";

// Styles
import { InvitationsPageStyle as styles } from "../../../styles";
import AntIcon from "react-native-vector-icons/AntDesign";

// Services
import api from "../../../services/api";

const InvitationsPage = () => {
  const MY_UUID = "YVBwXkN7cIk7WmZ8oUXG";
  const notify = useNotification();

  const [swiperIndex, setSwiperIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [pageStatus, setPageStatus] = useState("new");

  const [invitations, setInvitations] = useState([]);
  const [dirty, setDirty] = useState(true);

  const [accInvitations, setAccInvitations] = useState([]);
  const [dirty2, setDirty2] = useState(true);

  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [dirty3, setDirty3] = useState(true);

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
        setDirty3(true);
        notify.success("Invitation deleted");
      })
      .catch((err) => notify.error("Error while deleting the invitation"));
  };

  const handleRejectInvitation = (invitationUUID) => {
    api
      .cancelInvitation(invitationUUID)
      .then((res) => {
        setDirty(true);
        setDirty2(true);
        setDirty3(true);
        notify.success("Invitation rejected");
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

  useEffect(() => {
    if (dirty3) {
      api
        .getInvitation(MY_UUID, "sent")
        .then((data) => {
          if (data) {
            setPendingInvitations(data);
            setDirty3(false);
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [pendingInvitations, dirty3]);

  const handleNavigation = (index) => {
    const statusOptions = ["new", "scheduled", "pending"];

    const pageStatus = statusOptions[index];

    if (pageStatus !== undefined) {
      setPageStatus(pageStatus);
      setSwiperIndex(index);
    }
  };

  if (loading) return <Loader />;

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
          onPress={() => handleNavigation(0)}
        >
          <Text style={styles.topNavLinkText}>New</Text>
        </Pressable>
        <Pressable
          style={
            pageStatus === "scheduled"
              ? styles.topNavLinksSelected
              : styles.topNavLinks
          }
          onPress={() => handleNavigation(1)}
        >
          <Text style={styles.topNavLinkText}>Scheduled</Text>
        </Pressable>
        <Pressable
          style={
            pageStatus === "pending"
              ? styles.topNavLinksSelected
              : styles.topNavLinks
          }
          onPress={() => handleNavigation(2)}
        >
          <Text style={styles.topNavLinkText}>Pending</Text>
        </Pressable>
        {modalVisible ? (
          <NewInvitationModal
            modalVisible={modalVisible}
            setModalVisible={toggleModal}
          />
        ) : (
          ""
        )}

        {editModalVisible && (
          <EditInvitationModal
            modalVisible={editModalVisible}
            setModalVisible={toggleModalEdit}
            toEdit={toEdit}
            setDirty={setDirty2}
          />
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
      <Swiper
        loop={false}
        showsButtons={false}
        showsPagination={false}
        index={swiperIndex}
        onIndexChanged={handleNavigation}
      >
        {/* New Invitation Section */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {invitations?.length === 0 && pageStatus === "new" ? (
            <Text style={styles.noInfoText}>There are no new invitations</Text>
          ) : (
            invitations?.length !== 0 &&
            pageStatus === "new" && (
              <View style={{ marginTop: 10 }}>
                <FlatList
                  data={invitations}
                  renderItem={({ item, index }) => {
                    const lastItem = index === invitations.length - 1;
                    return (
                      <NewInvitationCard
                        item={item}
                        lastItem={lastItem}
                        myUUID={MY_UUID}
                        setInvitationUUID={setInvitationUUID}
                        modalVisible={confirmationModalVisible}
                        setModalVisible={toggleModalConfirmation}
                        setConfirmationModalStatus={setConfirmationModalStatus}
                      />
                    );
                  }}
                  keyExtractor={(item) => item.uuid}
                  showsVerticalScrollIndicator={false}
                />
                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={styles.button}
                >
                  <AntIcon name="pluscircleo" size={44} />
                </Pressable>
              </View>
            )
          )}
        </View>
        {/* Scheduled Invitation Section */}
        <View style={styles.container}>
          {accInvitations?.length !== 0 && pageStatus === "scheduled" ? (
            <FlatList
              data={accInvitations}
              renderItem={({ item, index }) => {
                const lastItem = index === accInvitations.length - 1;
                return (
                  <ScheduledInvitationCard
                    item={item}
                    lastItem={lastItem}
                    myUUID={MY_UUID}
                    modalVisible={editModalVisible}
                    setModalVisible={toggleModalEdit}
                    setToEdit={setToEdit}
                    confirmationModalVisible={confirmationModalVisible}
                    setConfirmationModalVisible={toggleModalConfirmation}
                    setConfirmationModalStatus={setConfirmationModalStatus}
                    setInvitationUUID={setInvitationUUID}
                  />
                );
              }}
              keyExtractor={(item) => item.uuid}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            accInvitations?.length === 0 &&
            pageStatus === "scheduled" && (
              <View>
                <Text style={styles.noInfoText}>
                  There are no new scheduled invitations
                </Text>
              </View>
            )
          )}
        </View>
        {/* Pending Invitation Section */}
        <View style={styles.container}>
          {pendingInvitations?.length !== 0 && pageStatus === "pending" ? (
            <FlatList
              data={pendingInvitations}
              renderItem={({ item, index }) => {
                const lastItem = index === pendingInvitations.length - 1;
                return (
                  <PendingInvitationCard
                    item={item}
                    lastItem={lastItem}
                    setModalVisible={toggleModalConfirmation}
                    setConfirmationModalStatus={setConfirmationModalStatus}
                    setInvitationUUID={setInvitationUUID}
                  />
                );
              }}
              keyExtractor={(item) => item.uuid}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            pendingInvitations?.length === 0 &&
            pageStatus === "pending" && (
              <View>
                <Text style={styles.noInfoText}>
                  There are no pending invitations
                </Text>
              </View>
            )
          )}
        </View>
      </Swiper>
    </SafeAreaView>
  );
};

export default InvitationsPage;
