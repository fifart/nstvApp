import { useState, useEffect} from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, useWindowDimensions, ActivityIndicator } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
const shareIcon = <Icon name="share" size={20} color="#fff" />;

export default function Sports({navigation}) {
  
    const [isSportLoading, setSportLoading] = useState(true);
    const [sportData, setSportData] = useState([]);
    const [sportRefreshing, setSportRefreshing] = useState(false);
    
  
    const getSportData = async () =>{
      fetch('https://nstv.gr/sport-data/')
      .then((res)=>res.json())
      .then((json)=>setSportData(json))
      .catch((error) => console.error(error))
      .finally(() => setSportLoading(false));
    } 
  
    useEffect(() => {
      getSportData();
    },[]);
  
  
    const onSportRefresh = () => {
      setSportLoading(false);
      setSportRefreshing(true);
      getSportData();
      setSportRefreshing(false);
  };
    const { width } = useWindowDimensions();
    
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {isSportLoading ? <View style={styles.activityContainer}><ActivityIndicator size="large" color="#007cba" /><Text style={styles.isloading}>Κάτι νέο έρχεται...</Text></View> : 
        ( <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={{uri: 'https://nstv.gr/site/templates/images/nstvlogo.png',}} style={styles.logo}/>
            </View>
            <FlatList
              data={sportData}
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
                  refreshing={sportRefreshing}
                  onRefresh={onSportRefresh}
                  tintColor="#dd0020"
                />
              }
                />
          </View>
        )}
      </SafeAreaView>
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
