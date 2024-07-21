import { View, ScrollView, Text, Alert, TextInput, Image, TouchableOpacity, } from 'react-native'
import React, {useEffect} from 'react'
import * as Animatable from 'react-native-animatable';
import * as SQLite from 'expo-sqlite'
import { styles } from '../assets/styles/about_style';
const About = () => {
  useEffect(() => {
    async function initializeDatabase() {
      const db = await SQLite.openDatabaseAsync('undercover');
      await db.execAsync('CREATE TABLE IF NOT EXISTS Incident (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, desc TEXT, date TEXT, image TEXT, audio TEXT);');
      await db.closeAsync();
    };
    initializeDatabase();
  }, []);

  const handleDeleteDatabase = () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar todos los datos?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            const db = SQLite.openDatabaseSync('undercover');
            db.execSync('DELETE FROM Incident');
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{overflow: 'hidden'}}>
        <Text style={styles.title}>Agente Rosmel Beltrán</Text>
        <View style={{flexDirection: 'row', marginTop: 30}}>
          <Image source={require('../assets/images/badge.png')} style={{width: 100, height: 100, marginRight: 20}}/>
          <Image source={require('../assets/images/ros.jpeg')} style={{width: 150, height: 150}}/>
        </View>
        
        
        <Text style={{fontSize: 16, color: '#fff'}}>2022-0398</Text>
        <Text style={styles.reflection}>“Al final del día todos queremos lo mismo, protección y seguridad.”</Text>
        <View style={styles.securitySection}>
        <Text style={styles.title}>Seguridad</Text>
          <TouchableOpacity onPress={()=> handleDeleteDatabase()}>
          <View style={styles.container_btn}>
            <Animatable.View 
              animation="pulse" 
              easing="ease-out" 
              iterationCount="infinite" 
              style={styles.outerCircle} 
            />
            <View style={styles.innerCircle}>
              <Text style={{fontSize: 16, color: '#fff', textAlign: 'center', fontWeight: '400'}}>Delete all data</Text>
            </View>
          </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default About
