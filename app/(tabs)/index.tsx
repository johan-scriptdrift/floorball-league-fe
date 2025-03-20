import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import LeagueTable from '@/components/LeagueTable';
import { useState } from 'react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(',', '');
};

export default function TabOneScreen() {
  const [leagueName, setLeagueName] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{leagueName || ''}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <LeagueTable onLeagueNameChange={setLeagueName} onUpdatedAtChange={setUpdatedAt} />
      <Text style={styles.text}>Last Updated: {updatedAt ? formatDate(updatedAt) : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '100%',
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
});
