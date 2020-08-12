import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { DataTable } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
var DOMParser = require("xmldom").DOMParser;

const Stack = createStackNavigator();

const screenWidth = Dimensions.get("window").width;
/* 필요한 데이터를 모두 불러옴 주변 약국의 위치만 찾아 표시하면 됨 */
function Detail({ route }) {
  const dispatch = useDispatch();

  const { value } = useSelector((state) => ({
    value: state.value,
  }));

  const [datas, setDatas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [heart, setHeart] = useState("hearto");
  const regex = /.+(?=정|슐)[.+(?=정|슐)]/;
  const dataName = regex.exec(route.params.dataName)[0];
  // const header = /^[0-9][.]/;
  // const desc = /^[0-9][)]/;
  const getDetail = async () => {
    await axios
      .get(
        `http://apis.data.go.kr/1471057/MdcinPrductPrmisnInfoService/getMdcinPrductItem?serviceKey=bsOGW2dlv4942siEKSx3tcEP%2BR541RQYI8HlkZ1sznqHhpe2oK%2Fz5lvxXgmg2QSLCUyn59odtmUotuqq960RfA%3D%3D&item_seq=${route.params.ID}&numOfRows=1`
      )
      .then((res) => {
        const dataParser = new DOMParser().parseFromString(
          res.data,
          "text/xml"
        );
        let newDatas = [];
        const ARTICLE = dataParser.getElementsByTagName("ARTICLE");
        for (let i = 0; i < ARTICLE.length; i++) {
          const newData = ARTICLE[i].getAttribute("title");
          if (ARTICLE[i].childNodes.length !== 0) {
            newDatas.push(newData);
            newDatas.push(ARTICLE[i].textContent);
          } else {
            newDatas.push(newData);
          }
        }
        setDatas(newDatas);
        setIsLoaded(false);
      });
  };

  useEffect(() => {
    setDatas("");
    setIsLoaded(true);
    getDetail();
  }, []);

  if (isLoaded === false) {
    return (
      <>
        <View style={styles.DetailContainer}>
          <ScrollView>
            <View style={{ flexDirection: "column", width: screenWidth }}>
              <Image
                style={{ width: screenWidth, height: 200, display: "flex" }}
                source={{
                  uri: route.params.userImg,
                }}
              />
              <View style={styles.title}>
                <Text style={{ fontSize: 30 }}>{dataName}</Text>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() =>
                    heart == "heart" ? setHeart("hearto") : setHeart("heart")
                  }
                >
                  <AntDesign name={heart} size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <Text>{value}</Text>
            {datas.length !== 0 ? (
              datas.map((data) => <Text style={styles.desc}>{data}</Text>)
            ) : (
              <Text>데이터 베이스에 저장된 값이 없습니다 ㅠㅠ</Text>
            )}
          </ScrollView>
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.loading}>
          <Text style={{ fontSize: 30 }}>Loading...</Text>
        </View>
      </>
    );
  }
}

function Home({ data, navigation, OnReload, nextData, loadCount }) {
  const [pageHeight, setPageHeight] = useState(null);
  return (
    <>
      <View style={styles.container}>
        <ScrollView
          onLayout={(e) => {
            setPageHeight(e.nativeEvent.layout.height);
          }}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y < -10) {
              OnReload();
            }
            if (pageHeight + e.nativeEvent.contentOffset.y > 500 * loadCount) {
              nextData(loadCount + 1);
              setPageHeight(pageHeight + pageHeight);
            }
          }}
        >
          <DataTable>
            {data.map((data, index) => (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => {
                  navigation.navigate("Detail", {
                    userImg: data.image,
                    dataName: data.name,
                    ID: data.id,
                  });
                }}
                key={index}
              >
                <DataTable.Row>
                  <DataTable.Cell>
                    <Image
                      style={styles.Images}
                      source={{
                        uri: data.image,
                      }}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell>{data.name}</DataTable.Cell>
                </DataTable.Row>
              </TouchableHighlight>
            ))}
          </DataTable>
        </ScrollView>
      </View>
    </>
  );
}

export default function Main({ data, OnReload, nextData, loadCount }) {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home">
            {(props) => (
              <Home
                {...props}
                nextData={nextData}
                OnReload={OnReload}
                data={data}
                loadCount={loadCount}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    justifyContent: "center",
  },
  Images: {
    height: 50,
    width: 50,
    resizeMode: "cover",
  },
  DetailContainer: {
    display: "flex",
    flex: 1,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  desc: {
    fontSize: 15,
  },
  icon: {
    marginLeft: 180,
  },
});
