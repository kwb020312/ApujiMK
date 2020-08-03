import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

function Top({ navigation, data }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const searChing = (e) => {
    const result = e;
    setSearch(result);
    // console.log(search);
    let manyData = data.filter((item) => {
      return item.name.indexOf(result) > -1;
    });
    dispatch({ type: "SEARCH_DATA", search_data: manyData });
  };

  useEffect(() => {
    setSearch("");
  }, []);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.setting}>
          <Ionicons name="ios-settings" size={35} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="찾으시는 알약을 검색해주세요!"
          value={search}
          onChangeText={(e) => {
            searChing(e);
          }}
          underlineColorAndroid="transparent"
          underlineColor="transparent"
        ></TextInput>
        <TouchableOpacity style={styles.search}>
          <FontAwesome name="search" size={35} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
}

function Notice({ navigation }) {
  return <View style={styles.container}></View>;
}

const Drawer = createDrawerNavigator();

export default function Topstatus({ data }) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <Notice {...props} />}
        initialRouteName="Top"
      >
        <Drawer.Screen name="Top">
          {(props) => <Top {...props} data={data} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  setting: {
    marginLeft: 20,
    marginRight: 25,
  },
  input: {
    width: 220,
    height: 50,
    fontSize: 15,
    borderRadius: 15,
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
  },
  search: {
    marginLeft: 20,
  },
});
