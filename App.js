import { StatusBar } from 'expo-status-bar';
import { useState, useEffect} from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';

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

const HomeScreen = ({navigation}) => {
  const { width } = useWindowDimensions();
  
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <View style={styles.activityContainer}><ActivityIndicator size="large" color="#007cba" /></View> : 
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
                <View style={styles.listTitle}>
                <RenderHtml
                  contentWidth={width}
                  source={{html:`<h3>${item.title}</h3>`}}
                />
                </View>
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
  const { width } = useWindowDimensions();
  const sourceTitle = {html:`<h3>${title}</h3>`};
  const sourceBody = {html:`${body}`}
  return(

  
  <ScrollView style={styles.articleContainer}>
    <Image source={{uri: image}} style={styles.imageArticle} />
    <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {date}| {views} προβολές </Text>
    <RenderHtml
      contentWidth={width}
      source={sourceTitle}
    />
    <RenderHtml
      contentWidth={width}
      source={sourceBody}
    />
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
    marginTop: 10  
  },
  logo: {
    padding: 40,
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    justifyContent: 'center'
  },
  listTitle: {
    paddingLeft: 15
  },
  dateviews: {
    fontSize: 13,
    fontWeight: '700',
    color: "#222222",
    paddingLeft: 15
  },
  body: {
    padding: 20
  },
  articleContainer: {
    padding: 10,
    width: '100%'
  },
  activityContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});
