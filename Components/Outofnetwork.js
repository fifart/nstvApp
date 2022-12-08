import React from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';


export default function Outofnetwork() {
    return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:16,fontWeight:'600'}}>Δεν Υπάρχουν δεδομένα! Είστε εκτός σύνδεσης!</Text>
    </View>
        );
}