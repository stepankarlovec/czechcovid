import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, Image, Button, ScrollView, TouchableHighlight } from "react-native";
import InfoBox from "./components/InfoBox";
import * as Notifications from "expo-notifications";

export default function App() {
  const [fetchedData, setFetchedData] = useState();
  const [expoPushToken, setExpoPushToken] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [ringBellImage, setRingBellImage] = useState(require("./images/icon_ringbell_empty.png"));
  const [notifAllowed, setNotifAllowed] = useState(false);

  const turnOnNotifications = () => {
    if(expoPushToken!=true && notifAllowed==false){
      getToken();
      if(expoPushToken!=true){
        setRingBellImage(require("./images/icon_ringbell_green.png"));
        setNotifAllowed(true);
      }else{
        setNotifAllowed(false);
        setRingBellImage(require("./images/icon_ringbell_empty.png"));
      }
    }else{
      setExpoPushToken(false);
      setNotifAllowed(false);
      setRingBellImage(require("./images/icon_ringbell_empty.png"));
    }
  }

  const getToken = () => {
    registerForPushNotification()
    .then((token) => setExpoPushToken(token))
    .catch((err) => console.warn(err));
  }

  // PUSH NOTIFICATIONS
  async function registerForPushNotification() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus != "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus != "granted") {
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

  if (!showLoading && notifAllowed) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "ČeskýCovid",
        body: `Podívej se na dnešní statistiky 🦠!`,
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
        <ScrollView>
        <StatusBar barStyle="light-content" animated={true} />
        <View style={styles.content}>
          <Image
            style={styles.logoImage}
            source={require("./images/ceskycovid.png")}
          ></Image>
          <View style={styles.twoBoxContainer}>
              <InfoBox
                graph={false}
                title="Případů za den:"
                value={fetchedData[0].potvrzene_pripady_vcerejsi_den.toLocaleString()}
                image={require("./images/icon_yesterday.png")}
                textSize="regular"
              ></InfoBox>
              <InfoBox
                graph={false}
                title="Aktivní případy:"
                value={fetchedData[0].aktivni_pripady.toLocaleString()}
                image={require("./images/icon_today.png")}
                textSize="regular"
              ></InfoBox>
          </View>
          <View style={styles.twoBoxContainer}>
              <InfoBox
                graph={false}
                title="Aktuálně hospitalizováni:"
                value={fetchedData[0].aktualne_hospitalizovani.toLocaleString()}
                image={require("./images/icon_hospitalised.png")}
                textSize="smaller"
              ></InfoBox>
              <InfoBox
                graph={false}
                title="Vyléčení:"
                value={fetchedData[0].vyleceni.toLocaleString()}
                image={require("./images/icon_health.png")}
                textSize="regular"
              ></InfoBox>
          </View>
          <View style={styles.twoBoxContainer}>
              <InfoBox
                graph={false}
                title="Úmrtí:"
                value={fetchedData[0].umrti.toLocaleString()}
                image={require("./images/icon_death.png")}
                textSize="regular"
              ></InfoBox>
              <InfoBox
                graph={false}
                title="Počet očkovaných:"
                value={fetchedData[0].ockovane_osoby_celkem.toLocaleString()}
                image={require("./images/icon_vaccine.png")}
                textSize="smaller"
              ></InfoBox>
          </View>
          <View style={styles.twoBoxContainer}>
              <InfoBox
                graph={false}
                title="Celkem případů:"
                value={fetchedData[0].potvrzene_pripady_celkem.toLocaleString()}
                image={require("./images/icon_today.png")}
                textSize="smaller"
              ></InfoBox>
          </View>
          <View style={styles.ringFlex}>
            <TouchableHighlight onPress={turnOnNotifications}>
              <Image
                style={styles.ringBell}
                source={ringBellImage}
              ></Image>
              </TouchableHighlight>
          </View>
        </View>
        </ScrollView>
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
  ringFlex:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBell: {
    resizeMode: "contain",
    marginBottom: 15,
    width: 60,
  },
  twoBoxContainer: {
    alignSelf: "center",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  }
});
