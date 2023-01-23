import React,{ useEffect ,useState} from 'react';
import { StyleSheet, Text, Dimensions ,View,ScrollView,ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from "@expo/vector-icons";
const API키 = `113a7721a9db2036c050f3c88d84b228`;
const 아이콘들 = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

const {width:폰가로길이} = Dimensions.get('window');

export default function App() {
  const [도시, 도시설정] = useState('Loading...');
  const [날씨, 날씨설정] = useState([]);
  const [ok, setOk] = useState(true);
  
  const get날씨 = async () => {   
    const 허가 = await Location.requestForegroundPermissionsAsync();
    if(!허가)setOk(false);
    const {coords:{latitude,longitude},} = await Location.getCurrentPositionAsync({accuracy:5});
    const 위치 = await Location.reverseGeocodeAsync(
      {latitude,longitude},
      {useGoogleMaps:false}
    );
    도시설정(위치[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely&appid=${API키}&units=metric`)
    const json = await response.json();
    날씨설정(json.daily)
  }
  
  useEffect(()=>{
    get날씨();
  },[]);


  return (
    <View style={styles.container}>
      <View style={styles.도시}>
        <Text style={styles.도시이름}>{도시}</Text>
      </View>
      <ScrollView 
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator='false'
      contentContainerStyle={styles.날씨}
      >
        {날씨.length === 0 ? 
        <View style={styles.날짜}>
          <ActivityIndicator color='white' size='large'/>
        </View> : 
        날씨.map((day,index) => 
        <View key={index} style={styles.날짜}>
          <View style={{flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between'}}>
          <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
          <Fontisto name={아이콘들[day.weather[0].main]} size={68} color='white'/>
          </View>
          <Text style={styles.작은날짜}>{index===0 ? '오늘' : '오늘'+" +"+index+'일 후'}</Text>
          <Text style={styles.설명}>{day.weather[0].main}</Text>
          <Text style={styles.작은설명}>{day.weather[0].description}</Text>
        </View>)
      }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'tomato'
  },
  도시:{
    flex:1.2,
    justifyContent:'center',
    alignItems:'center'
  },
  도시이름:{
    fontSize:70,
    fontWeight:'600',
    color:'white'
  },
  날씨:{
    
  },
  날짜:{
    width:폰가로길이,
    alignItems:'flex-start',
    paddingHorizontal:20,
  },
  temp:{
    fontSize:100,
    marginTop:50,
    color:'white'
  },
  설명:{
    fontSize:30,
    marginTop:-10,
    color:'white',
    fontWeight:'500'
  },
  작은설명:{
    fontSize:25,
    marginTop:-5,
    color:'white',
    fontWeight:'500'
  },
  작은날짜:{
    fontSize:15,
    marginTop:-10,
    marginBottom:5,
    color:'white',
    fontWeight:'500'
  }
});
