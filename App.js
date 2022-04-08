import { StatusBar } from 'expo-status-bar';
import { useState, useEffect} from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import * as WebBrowser from 'expo-web-browser';



export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log(data);

  const getData = async () =>{
    fetch('https://nstv.gr/data/')
    .then((res)=>res.json())
    .then((json)=>setData(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  } 

  useEffect(() => {
    getData();
    setRefreshing(false);
  },[]);

  const Article = ({item}) => {
    return (
    <TouchableOpacity onPress={() => {WebBrowser.openBrowserAsync(`${item.url}`)}}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {item.date}| {item.views} προβολές </Text>
        <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
    )
  }

  const onRefresh = () => {
    setLoading(false);
    setRefreshing(true);
    getData();
    setRefreshing(false);
};

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <Text>Loading...</Text> : 
      ( <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={{uri: 'https://nstv.gr/site/templates/images/nstvlogo.png',}} style={styles.logo}/>
          </View>
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={Article}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#dd0020"
              />
            }
              />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     flexDirection: 'column', 
     justifyContent:  'space-between'
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'cover'
  },
  logoContainer: {
    width: '100%',
    padding: 10,
    marginTop: 40  
  },
  logo: {
    padding: 40,
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    paddingLeft: 15,
    marginBottom: 10
  },
  dateviews: {
    fontSize: 13,
    fontWeight: '700',
    color: "#222222",
    paddingLeft: 15
  }
});
