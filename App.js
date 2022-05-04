import { StatusBar } from 'expo-status-bar';
import { useState, useEffect} from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, ScrollView, useWindowDimensions, ActivityIndicator, Button, Share } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
const shareIcon = <Icon name="share" size={20} color="#fff" />;

import Culture from './Screens/Culture';
import Sports from './Screens/Sports';
import Social from './Screens/Social';
import Dimotika from './Screens/Dimotika';
import Oikonomika from './Screens/Oikonomika';
import Outofnetwork from './Components/Outofnetwork';

export default function App() {
  
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setConnection] = useState(true);

  const getData = async () =>{
    fetch('https://nstv.gr/data/')
    .then((res)=>res.json())
    .then((json)=>setData(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  } 

  NetInfo.fetch().then(state => {
    state.isConnected ? setConnection(true) : setConnection(false);
 });

  useEffect(() => {
    getData();
  },[]);


  const onRefresh = () => {
    setLoading(false);
    setRefreshing(true);
    getData();
    setRefreshing(false);
};
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  const { width } = useWindowDimensions();
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? <View style={styles.activityContainer}><ActivityIndicator size="large" color="#007cba" /><Text style={styles.isloading}>Κάτι νέο έρχεται...</Text></View> : 
      ( <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={{uri: 'https://nstv.gr/site/templates/images/nstvlogo.png',}} style={styles.logo}/>
          </View>
           {isConnected ?
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({item})=>{
              return (
              <TouchableOpacity style={styles.feedArticleContainer} onPress={() => navigation.navigate('ArticleScreen', {id: `${item.id}`, body: `${item.body}`, title: `${item.title}`, image: `${item.image}`, views: `${item.views}`, date: `${item.date}`, url:`${item.url}`})}>
                <View style={styles.feedImage}>
                <Image fadeDuration={1000} loadingIndicatorSource={{uri:'https://nstv.gr/site/templates/images/nstvlogo.png'}} source={{uri: item.image}} style={styles.image} />
                </View>
                <View style={styles.feedBody}>
                <Text style={styles.dateviews}>Στις: {item.date} </Text>
                <Text style={styles.dateviews}> {item.views} προβολές | {item.category} </Text>
                <View style={styles.listTitle}>
                <RenderHtml
                  contentWidth={width}
                  source={{html:`<h3>${item.title}</h3>`}}
                />
                </View>
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
              /> : <Outofnetwork/>}
        </View>
      )}
    </SafeAreaView>
  );
}  


const ArticleScreen = ({route, navigation}) => {
  const { url, body, title, image, views, date } = route.params;
  const { width } = useWindowDimensions();
  const sourceTitle = {html:`<h3>${title}</h3>`};
  const sourceBody = {html:`${body}`}

  const share = async () => {
    try {
      const result = await Share.share({
        message:`Αξίζει να το διαβάσεις: ${url}`,
        title:"",
        url:""
      });

      // if (result.action === Share.sharedAction) {
      //   alert("Το μοιράστηκες!")y
      // } else 
      if (result.action === Share.dismissedAction) {
        // dismissed
        alert("Το μετάνιωσες;")
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return(
  <ScrollView style={styles.articleContainer}>
    <Image source={{uri: image}} style={styles.imageArticle} />
    <Text style={styles.dateviews}>Δημοσιεύτηκε στις: {date} | {views} προβολές</Text>
    <TouchableOpacity style={styles.Share} onPress={share} ><Text style={styles.shareText}>{shareIcon} Μοιράσου τη Γνώση...</Text></TouchableOpacity>
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



const Live = () => {

  const openVideo = () => {WebBrowser.openBrowserAsync("https://nstv.gr/liveonapp/")};
  const myIcon = <Icon name="play" size={30} color="#fff" />;

  return (
  <SafeAreaView style={{flex:1,flexDirection:'column',alignItems:'center'}}>
    <View style={styles.logoContainer}>
            <Image source={{uri: 'https://nstv.gr/site/templates/images/nstvlogo.png',}} style={styles.logo}/>
    </View>
    <TouchableOpacity style={styles.live} onPress={openVideo}>
    <Text style={styles.liveButtonText}>Click   {myIcon}   Watch</Text>
    <Image source={{uri: "https://nstv.gr/site/assets/files/2615/nstvlive.300x250.jpg"}} style={styles.liveImage} />
    </TouchableOpacity>
    
  </SafeAreaView>
    
  
  );
}


const Root = () => {
  return (
    <Tab.Navigator
    initialRouteName="Ροή"
    activeColor="#f0edf6"
    inactiveColor="#46a1fd"
    barStyle={{ backgroundColor: '#4175bd' }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{
          tabBarLabel: 'Ροή',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={26} />
          ),
          headerShown: false
        }} />
       <Tab.Screen name="Social" component={Social} options={{
          tabBarLabel: 'Κοινωνία',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={26} />
          ),
        }}/>
      <Tab.Screen name="Culture" component={Culture} options={{
          tabBarLabel: 'Πολιτισμός',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="music-clef-treble" color={color} size={26} />
          ),
        }}/>
      <Tab.Screen name="Sports" component={Sports} options={{
          tabBarLabel: 'Αθλητικά',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="basketball" color={color} size={26} />
          ),
        }}/>
       <Tab.Screen name="Dimotika" component={Dimotika} options={{
          tabBarLabel: 'Δημοτικά',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="nature-people" color={color} size={26} />
          ),
        }}/>
        <Tab.Screen name="Oikonomika" component={Oikonomika} options={{
          tabBarLabel: 'Oικονομικά',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-100" color={color} size={26} />
          ),
        }}/>
      <Tab.Screen name="Live" component={Live} options={{
          tabBarLabel: 'NStv Live',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="video" color={color} size={26} />
          ),
        }}/>
    </Tab.Navigator>
  );
} 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Root"
        component={Root}
        options={{ headerShown: false }}
        />
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
  feedArticleContainer:{
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10
    
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  feedImage: {
    flex: 1
  },
  feedBody: {
    flex: 2
  },
  imageArticle: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    marginBottom: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  logoContainer: {
    width: '100%',
    padding: 10,
    marginTop: 20  
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
    width: '100%',
    backgroundColor: '#fff'
  },
  activityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  isloading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10
  },
  Share:{
    marginTop: 5,
    width: '100%',
    backgroundColor: '#46a1fd',
    alignItems: 'center'
    
  },
  shareText:{
    color: '#fff',
    padding: 5,
    fontSize: 16
  },
  live: {
    width: '100%',
  },
  liveImage: {
    width: '100%',
    height: 240
  },
  liveButtonText: {
    width:'100%',
    fontSize: 20, 
    backgroundColor:'#46a1fd', 
    color:'#fff', 
    padding: 20, 
    marginBottom:10, 
    textAlign: 'center', 
    fontWeight: '700'
  }
  
});
