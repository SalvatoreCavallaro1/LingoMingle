import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  Text,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import GamesModal from "../../components/modals/GamesModal/GamesModal";
import AdivinaLaPalabraModal from "../../components/modals/AdivinaLaPalabraModal/AdivinaLaPalabraModal";
import CantenJuntosModal from "../../components/modals/CantenJuntosModal/CantenJuntosModal";
import NuevoTemaModal from "../../components/modals/NuevoTemaModal/NuevoTemaModal";
import Spinner from "react-native-loading-spinner-overlay";
import {
  CallContent,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

// Components
import CustomBottomSheet from "../../components/videocall/CustomBottomSheet";
import CustomCallControls from "../../components/videocall/CustomCallControl";

// Context
import { AuthContext } from "../../contexts/AuthContext";
import CustomCallControls from "../../components/videocall/CustomCallControls";
import { SafeAreaView } from "react-native-safe-area-context";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Room = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [advinaLaPalabraVisible, setAdivinaLaPalabraVisible] = useState(false);
  const [cantenJuntosVisible, setCantenJuntosVisible] = useState(false);
  const [nuevoTemaVisible, setNuevoTemaVisible] = useState(false);
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  const [call, setCall] = useState(null);
  const client = useStreamVideoClient();
  const { id } = useLocalSearchParams();

  const BottomSheetModalRef = useRef();

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    console.log(BottomSheetModalRef.current);
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const toggleModalCantenJuntos = () => {
    setModalVisible(!modalVisible);
    setCantenJuntosVisible(!cantenJuntosVisible);
  };

  const toggleModalAdivina = () => {
    setModalVisible(!modalVisible);
    setAdivinaLaPalabraVisible(!advinaLaPalabraVisible);
  };

  const toggleModalNuevoTema = ()=>{
    setModalVisible(!modalVisible)
    setNuevoTemaVisible(!nuevoTemaVisible);
  }

  // Join the call
  useEffect(() => {
    if (!client || call) return;

    const joinCall = async () => {
      const call = client.call("default", id);
      await client.connectUser({ id: user.uuid }, token);
      await call.join({ create: true });
      setCall(call);
    };

    joinCall();
  }, [client, call]);

  // Navigate back home on hangup
  const goToHomeScreen = async () => {
    await call.endCall();
    router.back();
  };

  const handleChat = () => {
    if (isChatOpen) BottomSheetModalRef.current?.close();
    else BottomSheetModalRef.current?.expand();
    setIsChatOpen(!isChatOpen);
  };

  const customCallControlsProps = {
    toggleModal: toggleModal,
    onChatOpenHandler: handleChat,
    onHangupCallHandler: goToHomeScreen,
  };


  if (!call) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner visible={!call} />

      <StreamCall call={call}>
        <CallContent
          CallControls={(props) => (
            <CustomCallControls {...customCallControlsProps} />
          )}
          onHangupCallHandler={goToHomeScreen}
          toggleModal={toggleModal}
        />

        <GamesModal
          modalVisible={modalVisible}
          setModalVisible={toggleModal}
          AdivinamodalVisible={advinaLaPalabraVisible}
          
          setModalAdivinaVisible={toggleModalAdivina}
          setModalCantenJuntosVisible={toggleModalCantenJuntos}
          setModalNuevoTemaVisible = {toggleModalNuevoTema}

        />
        <AdivinaLaPalabraModal
          modalVisible={advinaLaPalabraVisible}
          setModalVisible={toggleModalAdivina}
        />
        <CantenJuntosModal
          modalVisible={cantenJuntosVisible}
          setModalVisible={toggleModalCantenJuntos}
        />
         <NuevoTemaModal
          modalVisible={nuevoTemaVisible}
          setModalVisible={toggleModalNuevoTema}
        />
        {/* <View style={styles.container}>
          <CallContent onHangupCallHandler={goToHomeScreen} layout="grid" />

          {WIDTH > HEIGHT ? (
            <View style={styles.videoContainer}>
              <Text>Tablet chat</Text>
            </View>
          ) : (
            <Text>Mobile chat</Text>
          )}
        </View> */}
      </StreamCall>
    </SafeAreaView>
  );
};

export default Room;
