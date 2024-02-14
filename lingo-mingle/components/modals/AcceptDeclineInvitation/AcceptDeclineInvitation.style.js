// Imports
import { StyleSheet } from "react-native";

// Styles
import { FONT } from "../../../constants";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "70%",
  },
  buttons: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: FONT.bold,
    fontSize: 20,
  },
});

export default styles;
