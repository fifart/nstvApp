import { StatusBar } from 'expo-status-bar';
import { useState, useEffect} from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {
  
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  

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


  const onRefresh = () => {
    setLoading(false);
    setRefreshing(true);
    getData();
    setRefreshing(false);
};
const Stack = createNativeStackNavigator();


// const Article = ({item, navigation}) => {
//   return (
//     // () => {WebBrowser.openBrowserAsync(`${item.url}`)}
    
//   <TouchableOpacity onPress={() => navigation.navigate('ArticleScreen', {id: `${item.id}`})}>
//       <Image source={{uri: item.image}} style={styles.image} />
//       <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {item.date}| {item.views} προβολές </Text>
//       <Text style={styles.title}>{item.title}</Text>
//   </TouchableOpacity>
//   )
//   console.log(navigation);
// }

const HomeScreen = ({navigation}) => {
  
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
            renderItem={({item})=>{
              return (
              <TouchableOpacity onPress={() => navigation.navigate('ArticleScreen', {id: `${item.id}`, body: `${item.body}`, title: `${item.title}`, image: `${item.image}`, views: `${item.views}`, date: `${item.date}`})}>
                <Image source={{uri: item.image}} style={styles.image} />
                <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {item.date}| {item.views} προβολές </Text>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
              );
            }}
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


const ArticleScreen = ({route, navigation}) => {
  const { id, body, title, image, views, date } = route.params;
  return(

  
  <ScrollView>
    <Image source={{uri: image}} style={styles.imageArticle} />
    <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {date}| {views} προβολές </Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
  </ScrollView>
  )
}
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="ArticleScreen"
        component={ArticleScreen}
        options={{title: 'Αρχική NStv'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
  imageArticle: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    marginBottom: 10
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
  },
  body: {
    padding: 20
  }
});
