import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const InfoBox = (props) => {
  if (props.graph) {
    return <View></View>;
  }
  if(props.image){
    const myImage = require(props.image);
  }else{
    myImage = require("./images/icon_death.png");
  }
  return (
    <View style={styles.dataBox}>
      <View>
          <Image
            style={styles.logoImage}
            source={require(myImage)}
          ></Image>
      <Text style={styles.white}>{props.title}</Text>
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
    borderRadius: 8,
    marginBottom: 10,
  },
  white: {
    color: "white",
    fontSize: 20,
  },
});

export default InfoBox;
