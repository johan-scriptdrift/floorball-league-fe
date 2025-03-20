import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useColorScheme } from './useColorScheme';

type Team = {
  TeamID: number;
  TeamName: string;
  GamesPlayed: number;
  Wins: number;
  Losses: number;
  Draws: number;
  GoalsFor: number;
  GoalsAgainst: number;
  Points: number;
};

type LeagueData = {
  LeagueID: number;
  LeagueName: string;
  UpdatedAt: string;
  Teams: Team[];
};

type SortKey = keyof Team;

interface LeagueTableProps {
  onLeagueNameChange?: (name: string) => void;
  onUpdatedAtChange?: (date: string) => void;
}

export default function LeagueTable({ onLeagueNameChange, onUpdatedAtChange }: LeagueTableProps) {
  const [data, setData] = useState<LeagueData | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('Points');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/table');
      const jsonData = await response.json();
      setData(jsonData);
      onLeagueNameChange?.(jsonData.LeagueName);
      onUpdatedAtChange?.(jsonData.UpdatedAt);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sortedTeams = data?.Teams ? [...data.Teams].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  }) : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.headerCell, styles.teamHeaderCell]} onPress={() => handleSort('TeamName')}>
            <Text style={[styles.headerText, { color: textColor, textAlign: 'left' }]}>Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('GamesPlayed')}>
            <Text style={[styles.headerText, { color: textColor }]}>GP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('Wins')}>
            <Text style={[styles.headerText, { color: textColor }]}>W</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('Draws')}>
            <Text style={[styles.headerText, { color: textColor }]}>D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('Losses')}>
            <Text style={[styles.headerText, { color: textColor }]}>L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('GoalsFor')}>
            <Text style={[styles.headerText, { color: textColor }]}>GF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('GoalsAgainst')}>
            <Text style={[styles.headerText, { color: textColor }]}>GA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerCell} onPress={() => handleSort('Points')}>
            <Text style={[styles.headerText, { color: textColor }]}>Pts</Text>
          </TouchableOpacity>
        </View>
        {sortedTeams.map((team) => (
          <View key={team.TeamID} style={styles.row}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.cell, styles.teamCell, { color: textColor }]}>{team.TeamName}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.GamesPlayed}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.Wins}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.Draws}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.Losses}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.GoalsFor}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.GoalsAgainst}</Text>
            <Text style={[styles.cell, { color: textColor }]}>{team.Points}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCell: {
    padding: 8,
    width: 40,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  cell: {
    padding: 8,
    width: 40,
    textAlign: 'center',
  },
  teamCell: {
    width: 100,
    textAlign: 'left',
  },
  teamHeaderCell: {
    width: 100,
    textAlign: 'left',
  },
});
