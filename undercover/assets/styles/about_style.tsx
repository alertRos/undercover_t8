import { StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      backgroundColor: '#001029',
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    container_btn: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 260
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 60,
      color: '#b6e2ff',
      marginBottom: 30
    },
    reflection: {
      marginTop: 20,
      color: '#fff',
      fontSize: 16,
      fontStyle: 'italic',
      marginVertical: 20,
      textAlign: 'center',
    },
    securitySection: {
      marginTop: 30,
      flexDirection: 'column',
      paddingBottom: 50
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    outerCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      position: 'absolute',
    },
    innerCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  });
  