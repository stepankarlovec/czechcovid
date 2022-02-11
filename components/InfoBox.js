import { View, Text, StyleSheet, Image } from "react-native";

const InfoBox = (props) => {
  if (props.graph) {
    return <View></View>;
  }
  //const myImage = require(`${props.image}`) | require("./images/icon_death.png");
  let textSize = "";
  if(props.textSize=="smaller"){
    textSize = styles.smaller;
  }else{
    textSize = styles.white;
  }
  return (
    <View style={styles.dataBox}>
      <View style={styles.imageAndText}>
          <Image
            style={styles.logoImage}
            source={props.image}
          ></Image>
      <Text style={textSize}>{props.title}</Text>
      </View>
      <Text style={styles.white}>{props.value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dataBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "48%",
    height: 150,
    borderWidth: 0.3,
    padding: 8,
    borderColor: "white",
    backgroundColor: "#292929",
    borderRadius: 16,
    alignItems: "center",
  },
  white: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    padding: 8,
  },
  imageAndText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logoImage: {
    marginBottom: 1,
    width: 34,
    height: 34,
  },
  smaller: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
  }
});

export default InfoBox;
