import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { Notify } from 'notiflix';

const LOCALSTORAGE_KEY = 'contacts-key';

export const App = () => {
	const [contacts, setContacts] = useState(
		JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) ?? []
	);
	const [filter, setFilter] = useState('');
	useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(contacts));
	}, [contacts]);

	const addContact = newContact => {
		const newName = newContact.name.toLowerCase();
		const isCheckedContact = contacts.find(
			({ name }) => name.toLowerCase() === newName
		);

		if (!isCheckedContact) {
			newContact.id = nanoid();
			setContacts(prevContacts => [...contacts, newContact]);
		} else {
			Notify.failure(`${newContact.name} is already in contacts`);
		}
	};

	const findContact = ({ target: { value } }) => {
		setFilter(value.toLowerCase());
	};

	const filteredContact = () => {
		const suitableContacts = contacts.filter(({ name }) =>
			name.toLowerCase().includes(filter)
		);

		return filter === '' ? contacts : suitableContacts;
	};

	const deleteContact = idDeleteContact => {
		setContacts(contacts.filter(({ id }) => id !== idDeleteContact));
	};

	return (
		<div className="container">
			<h1>Phonebook</h1>
			<ContactForm addContact={addContact} />
			<h2>Contacts</h2>
			<Filter findContact={findContact} />
			<ContactList
				filteredContact={filteredContact()}
				deleteContact={deleteContact}
			/>
		</div>
	);
};

export default App;
