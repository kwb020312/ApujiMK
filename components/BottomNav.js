import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

export default function BottomNav() {
  const dispatch = useDispatch();

  const { nearStore } = useSelector((state) => ({
    nearStore: state.nearStore,
  }));

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.icon}>
          <AntDesign name="heart" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <MaterialCommunityIcons name="bell" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch({ type: "NEARLY_STORE" })}
          style={styles.icon}
        >
          <Fontisto
            name="pills"
            size={35}
            color={nearStore === true ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    marginLeft: 30,
    marginRight: 30,
  },
});
