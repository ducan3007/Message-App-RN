import React, { memo } from 'react'
import { FlatList, Dimensions } from 'react-native'

import Emoji from './Emoji';
import { emojisByCategory } from '../../../data/emojis';

const WIDTH = Dimensions.get('screen').width;

const EmojiCategory = ({ category,setMessage }) => {


	return (
		<FlatList
			data={emojisByCategory[category]}
			renderItem={({ item }) => <Emoji setMessage={setMessage} item={item} />}
			keyExtractor={(item) => item}
			numColumns={7}
		/>
	)
}

export default memo(EmojiCategory);