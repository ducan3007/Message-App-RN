import React, { memo } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import shortnameToUnicode from '../../../data/shortnameToUnicode';

const Emoji = ({ item ,setMessage}) => {
	const handlePress = () => {
		setMessage((prev)=>{
			return prev+shortnameToUnicode[`:${item}:`]
		
		})
	}
	return (
		<TouchableOpacity style={styles.emojiContainer} onPress={handlePress}>
			<Text style={styles.emoji}>{shortnameToUnicode[`:${item}:`]}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	emojiContainer: {
		marginHorizontal: 5,
		
	},
	emoji: {
		fontSize: 25
	}
})

export default memo(Emoji)