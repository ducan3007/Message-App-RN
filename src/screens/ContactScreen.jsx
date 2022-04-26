import React from 'react'
import { View, ScrollView } from 'react-native'
import Contacts from '../components/Contact/Contacts';

const ContactScreen = () => {

	return (
		<View style={{ flex: 1,backgroundColor:'white' }}>
			<ScrollView>
				<Contacts />
			</ScrollView>
		</View>
	)
}

export default ContactScreen