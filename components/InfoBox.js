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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 0.3,
    padding: 8,
    borderColor: "white",
    backgroundColor: "#292929",
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  white: {
    color: "white",
    fontSize: 20,
  },
  imageAndText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 34,
    height: 34,
    marginRight: 8,
  },
  smaller: {
      color: "white",
      fontSize: 16,
  }
});

export default InfoBox;
