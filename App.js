import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, Image, Button } from "react-native";
import InfoBox from "./components/InfoBox";
import * as Notifications from "expo-notifications";

export default function App() {
  const [fetchedData, setFetchedData] = useState();
  const [expoPushToken, setExpoPushToken] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    registerForPushNotification()
      .then((token) => setExpoPushToken(token))
      .catch((err) => console.warn(err));
  });

  // PUSH NOTIFICATIONS
  async function registerForPushNotification() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status != "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
    }
    if (status != "granted") {
      alert("failed to get the push perm");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (!showLoading) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "ČeskýCovid",
        body: `Aktuálně nakažených: ${fetchedData[0].aktivni_pripady}`,
      },
      trigger: {
        hour: 20,
        minute: 20,
        repeats: true,
      },
    });
  }

  const getData = async () => {
    try {
      const response = await fetch(
        "https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=642ae5d03f00dad4e9dc44d811d9afda",
        { headers: { accept: "application/json" } }
      );
      const json = await response.json();
      setFetchedData(json);
    } catch (err) {
      console.warn(err);
    } finally {
      setShowLoading(false);
    }
  };
  /*
  function getData() {
    const response = [
      {
        datum: "2022-02-05",
        provedene_testy_celkem: 1234124,
        potvrzene_pripady_celkem: 13534,
        aktivni_pripady: 306000,
        vyleceni: 1324513,
        umrti: 432424,
        aktualne_hospitalizovani: 3120,
        provedene_testy_vcerejsi_den: 0,
        potvrzene_pripady_vcerejsi_den: 0,
        provedene_testy_vcerejsi_den_datum: "2022-02-05",
        potvrzene_pripady_vcerejsi_den_datum: "2022-02-05",
        provedene_antigenni_testy_celkem: 0,
        provedene_antigenni_testy_vcerejsi_den: 0,
        provedene_antigenni_testy_vcerejsi_den_datum: "2022-02-05",
        vykazana_ockovani_celkem: 0,
        vykazana_ockovani_vcerejsi_den: 0,
        vykazana_ockovani_vcerejsi_den_datum: "2022-02-05",
        potvrzene_pripady_65_celkem: 0,
        potvrzene_pripady_65_vcerejsi_den: 0,
        potvrzene_pripady_65_vcerejsi_den_datum: "2022-02-05",
        ockovane_osoby_celkem: 0,
        ockovane_osoby_vcerejsi_den: 0,
        ockovane_osoby_vcerejsi_den_datum: "2022-02-05",
      },
    ];
    setFetchedData(response);
    setShowLoading(false);
  }
*/
  useEffect(() => {
    getData();
  }, []);
  if (showLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading ⌛</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" animated={true} />
        <View style={styles.content}>
          <Image
            style={styles.logoImage}
            source={require("./images/ceskycovid.png")}
          ></Image>
          <InfoBox
            graph={false}
            title="Aktivní případy:"
            value={fetchedData[0].aktivni_pripady.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Aktuálně hospitalizováni:"
            value={fetchedData[0].aktualne_hospitalizovani.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Vyléčení:"
            value={fetchedData[0].vyleceni.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Úmrtí:"
            value={fetchedData[0].umrti.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Počet očkovaných:"
            value={fetchedData[0].ockovane_osoby_celkem.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Celkem případů:"
            value={fetchedData[0].potvrzene_pripady_celkem.toLocaleString()}
          ></InfoBox>
          <InfoBox
            graph={false}
            title="Včerejší případy:"
            value={fetchedData[0].potvrzene_pripady_vcerejsi_den.toLocaleString()}
          ></InfoBox>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 60,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  logoImage: {
    resizeMode: "contain",
    width: "80%",
    alignContent: "center",
    marginHorizontal: 30,
    marginBottom: 15,
  },
});
