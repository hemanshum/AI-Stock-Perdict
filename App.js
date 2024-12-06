import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StockPredict from './src/screens/StockPredict';

export default function App() {
  return (
    <View style={styles.container}>
      <StockPredict />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 32
  },
});
