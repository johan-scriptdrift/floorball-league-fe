import React, { useState, useEffect } from 'react'
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native'
import { useColorScheme } from './useColorScheme'

type Player = {
	Id: string
	Name: string
	JerseyNumber: string
	Team: string
	Goals: number
	Assists: number
}

type SortKey = keyof Player

interface PlayerTableProps {
	onLeagueNameChange?: (name: string) => void
	onUpdatedAtChange?: (date: string) => void
}

export default function PlayerTable() {
	const [data, setData] = useState<Player[]>([])
	const [loading, setLoading] = useState(true)
	const colorScheme = useColorScheme()
	const [sortKey, setSortKey] = useState<SortKey>('Goals')
	const [sortAsc, setSortAsc] = useState(false)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		try {
			const response = await fetch(
				'https://floorball-league.vercel.app/api/players/stats/goals/3'
			)
			const jsonData = await response.json()
			setData(jsonData)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortAsc(!sortAsc)
		} else {
			setSortKey(key)
			setSortAsc(false)
		}
	}

	const sortedPlayers = data
		? [...data].sort((a, b) => {
				if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1
				if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1
				return 0
		  })
		: []

	const textColor = colorScheme === 'dark' ? '#fff' : '#000'

	return (
		<View>
			<View style={styles.headerRow}>
				<TouchableOpacity
					style={[styles.headerCell, styles.teamHeaderCell]}
					onPress={() => handleSort('Team')}
				>
					<Text
						style={[
							styles.headerText,
							{ color: textColor, textAlign: 'left' }
						]}
					>
						Team
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.headerCell, styles.nameHeaderCell]}
					onPress={() => handleSort('Name')}
				>
					<Text
						style={[
							styles.headerText,
							{ color: textColor, textAlign: 'left' }
						]}
					>
						Name
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.headerCell}
					onPress={() => handleSort('Goals')}
				>
					<Text
						style={[
							styles.headerText,
							{ color: textColor, textAlign: 'center' }
						]}
					>
						G
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.headerCell}
					onPress={() => handleSort('Assists')}
				>
					<Text
						style={[
							styles.headerText,
							{ color: textColor, textAlign: 'center' }
						]}
					>
						A
					</Text>
				</TouchableOpacity>
			</View>
			{sortedPlayers.map((player) => (
				<View key={player.Id} style={styles.row}>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={[
							styles.cell,
							styles.teamCell,
							{ color: textColor }
						]}
					>
						{player.Team}
					</Text>
					<Text
						style={[
							styles.cell,
							styles.nameCell,
							{ color: textColor }
						]}
					>
						{player.Name}
					</Text>
					<Text style={[styles.cell, { color: textColor }]}>
						{player.Goals}
					</Text>
					<Text style={[styles.cell, { color: textColor }]}>
						{player.Assists}
					</Text>
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		backgroundColor: '#f5f5f5'
	},
	headerCell: {
		padding: 8,
		width: 40,
		justifyContent: 'center'
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 13,
		textAlign: 'center'
	},
	teamHeaderCell: {
		width: 100,
		textAlign: 'left'
	},
	nameHeaderCell: {
		width: 150,
		textAlign: 'left'
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},

	cell: {
		padding: 8,
		width: 40,
		textAlign: 'center'
	},

	teamCell: {
		width: 100,
		textAlign: 'left'
	},
	nameCell: {
		width: 150,
		textAlign: 'left'
	}
})
