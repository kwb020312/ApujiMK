import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, Text } from "react-native";
import axios from "axios";
import Main from "./components/Main";
import Topstatus from "./components/Topstatus";
import BottomNav from "./components/BottomNav";
import { NativeRouter } from "react-router-native";
import { useSelector, useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";
var DOMParser = require("xmldom").DOMParser;

const screenWidth = Dimensions.get("window").width - 200;
const screenHeight = Dimensions.get("window").height - 450;

export default function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([]);

  const [loadCount, setLoadCount] = useState(1);

  const { Lat, Lon } = useSelector((state) => ({
    Lat: state.Lat,
    Lon: state.Lon,
  }));

  const getData = async () => {
    await axios
      .get(
        `http://apis.data.go.kr/1470000/MdcinGrnIdntfcInfoService/getMdcinGrnIdntfcInfoList?serviceKey=bsOGW2dlv4942siEKSx3tcEP%2BR541RQYI8HlkZ1sznqHhpe2oK%2Fz5lvxXgmg2QSLCUyn59odtmUotuqq960RfA%3D%3D&numOfRows=11`
      )
      .then(async (res) => {
        setData([]);
        let newArr = [];
        const TopData = new DOMParser().parseFromString(res.data, "text/xml");
        const ITEM_SEQ = TopData.getElementsByTagName("ITEM_SEQ");
        const x = TopData.getElementsByTagName("ITEM_NAME");
        const img = TopData.getElementsByTagName("ITEM_IMAGE");
        for (let i = 0; i < x.length; i++) {
          let id = ITEM_SEQ[i].childNodes[0].nodeValue;
          let name = x[i].childNodes[0].nodeValue;
          let url = img[i].childNodes[0].nodeValue;
          let newobj = {
            id: id,
            name: name,
            image: url,
          };
          newArr.push(newobj);
        }
        setData(newArr);
      });
    setIsLoading(false);
    setLoadCount(1);
    curPos();
  };

  const curPos = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      const lat = String(position.coords.latitude);
      const lon = String(position.coords.longitude);
      const newLat = Number(lat.substr(0, 8));
      const newLon = Number(lon.substr(0, 9));
      dispatch({ type: "GET_POS", lat: newLat, lon: newLon });
    });
    await alert("Lat : " + Lat + "\n" + "Lon : " + Lon);
    await axios
      .get(
        `
      http://apis.vworld.kr/coord2new.do?x=${Lon}&y=${Lat}&output=xml&epsg=epsg:4326&apiKey=43467595-7C52-3201-BBDE-DCCB07EF58B9
    `
      )
      .then((res) => alert(res));
  };

  const OnReload = () => {
    setIsLoading(true);
    getData();
  };

  const nextData = async (pagenum) => {
    await axios
      .get(
        `http://apis.data.go.kr/1470000/MdcinGrnIdntfcInfoService/getMdcinGrnIdntfcInfoList?serviceKey=bsOGW2dlv4942siEKSx3tcEP%2BR541RQYI8HlkZ1sznqHhpe2oK%2Fz5lvxXgmg2QSLCUyn59odtmUotuqq960RfA%3D%3D&numOfRows=11&pageNo=${pagenum}`
      )
      .then((res) => {
        let newArr = [];
        const TopData = new DOMParser().parseFromString(res.data, "text/xml");
        const x = TopData.getElementsByTagName("ITEM_NAME");
        const img = TopData.getElementsByTagName("ITEM_IMAGE");
        const ITEM_SEQ = TopData.getElementsByTagName("ITEM_SEQ");
        for (let i = 0; i < x.length; i++) {
          let name = x[i].childNodes[0].nodeValue;
          let url = img[i].childNodes[0].nodeValue;
          let id = ITEM_SEQ[i].childNodes[0].nodeValue;
          let newobj = {
            id: id,
            name: name,
            image: url,
          };
          newArr.push(newobj);
        }
        setData(data.concat(newArr));
      });
    setIsLoading(false);
    setLoadCount((prevState) => prevState + 1);
  };

  const { searchData, nearStore } = useSelector((state) => ({
    searchData: state.search_data,
    nearStore: state.nearStore,
  }));
  useEffect(() => {
    OnReload();
  }, []);

  if (nearStore === true) {
    if (Lat.length !== 0 && Lon.length !== 0) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <Topstatus data={data} />
          <MapView
            style={{ width: 400, height: 550 }}
            initialRegion={{
              latitude: Lat,
              longitude: Lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: 37.2967139,
                longitude: 127.0085259,
              }}
              title="은구김"
              description="은구에오"
            />
          </MapView>
          <BottomNav />
        </View>
      );
    } else {
      return (
        <View>
          <Text>데이터 로딩중</Text>
        </View>
      );
    }
  }

  return (
    <NativeRouter>
      <StatusBar hidden />

      {isLoading === false ? (
        <View style={styles.container}>
          <Topstatus data={data} />
          <Main
            loadCount={loadCount}
            nextData={nextData}
            OnReload={OnReload}
            data={searchData.length !== undefined ? searchData : data}
          />
          <BottomNav />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: screenWidth,
              height: screenHeight,
              resizeMode: "stretch",
            }}
            source={{
              uri:
                "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F95zWg%2FbtqF9DYyRQC%2FhTPekyG8tGRVzNwfnRdoc1%2Fimg.png",
            }}
          ></Image>
        </View>
      )}
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
