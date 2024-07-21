import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    header:{
        justifyContent: 'flex-start',
        width: 330,
        padding: 25,
        marginTop: 60,
        height: 260
    },
    container: {
      flex: 1,
      backgroundColor: '#001029',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    cardView: {
        padding: 10,
        marginBottom: 10,
        height : 90,
        width: 400,
        backgroundColor: '#000c1f',
        marginTop: 10
    },
    cardModal:{
        backgroundColor: '#F6F6F6',
        width: 340,
        height: 800,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    cardModalbtn:{
        backgroundColor: '#030b18', 
        width: 220, 
        height: 45,
        marginBottom: 15
    },
    formInput:{
        backgroundColor: '#E7E7E7',
        width: 250,
        height: 45,
        margin: 10,
        fontSize: 16,
        padding: 10

    },
    uploadInput:{
        backgroundColor:'lightgray',
        width: 250,
        height: 45,
        margin: 10,
    },
    register:{
        backgroundColor: '#030b18',
        width: 250,
        height: 45,
        margin: 10,
        padding: 10,
    },
    close:{
        backgroundColor: '#212121',
        width: 250,
        height: 45,
        margin: 10,
        padding: 10,
    },
    createIncidentBtn:{
        backgroundColor: '#030b18',
        width: 250,
        height: 50,
        marginTop: 5,
        marginBottom: 20,
        padding: 10,
        borderRadius: 10
    }
  });
  