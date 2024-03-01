import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
  Alert,
  Appearance,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // importando o ícone

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingContactName, setEditingContactName] = useState('');
  const [editingContactLastName, setEditingContactLastName] = useState('');
  const [editingContactPhone, setEditingContactPhone] = useState('');
  const [editingContactEmail, setEditingContactEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(Appearance.getColorScheme() === 'dark'); // determina se o tema atual é escuro ou claro

  const sortContacts = () => {
    setContacts(
      [...contacts].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleAddContact = () => {
    if (
      (contactName.trim() === '' && editingContactName.trim() === '') || 
      (contactPhone.trim() === '' && editingContactPhone.trim() === '') || 
      (!isValidPhoneNumber(contactPhone) && !isValidPhoneNumber(editingContactPhone))
    ) {
      Alert.alert('Preencha os campos de nome e telefone.');
      return;
    }

    const newContact = {
      id: Date.now(),
      name: contactName || editingContactName,
      lastName: contactLastName || editingContactLastName,
      phone: formatPhoneNumber(contactPhone) || formatPhoneNumber(editingContactPhone),
      email: contactEmail || editingContactEmail,
    };

    setContacts(
      [newContact, ...contacts].sort((a, b) => a.name.localeCompare(b.name))
    );
    setContactName('');
    setContactLastName('');
    setContactPhone('');
    setContactEmail('');
    setModalVisible(false);

    // Limpa os campos de edição
    setEditingContactId(null);
    setEditingContactName('');
    setEditingContactLastName('');
    setEditingContactPhone('');
    setEditingContactEmail('');
  };

  const handleEditContact = () => {
    if (
      editingContactName.trim() === '' ||
      editingContactPhone.trim() === '' ||
      !isValidPhoneNumber(editingContactPhone)
    ) {
      Alert.alert('Preencha os campos de nome e telefone.');
      return;
    }

    const updatedContacts = contacts.map((contact) =>
      contact.id === editingContactId
        ? {
            ...contact,
            name: editingContactName,
            lastName: editingContactLastName,
            phone: formatPhoneNumber(editingContactPhone),
            email: editingContactEmail,
          }
        : contact
    );

    setContacts(updatedContacts);
    setEditingContactId(null);
    setEditingContactName('');
    setEditingContactLastName('');
    setEditingContactPhone('');
    setEditingContactEmail('');
    setModalVisible(false);
  };

  const handleDeleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
  };

  const handleOpenEditModal = (contact) => {
    if (contact) {
      setEditingContactId(contact.id);
      setEditingContactName(contact.name);
      setEditingContactLastName(contact.lastName);
      setEditingContactPhone(contact.phone);
      setEditingContactEmail(contact.email);
    } else {
      setEditingContactId(null);
      setEditingContactName('');
      setEditingContactLastName('');
      setEditingContactPhone('');
      setEditingContactEmail('');
    }
    setModalVisible(true);
  };

  const formatPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.replace(/[^\d]/g, ''); // Remove todos os caracteres que não são dígitos

    let formattedNumber = phoneNumber;

    return formattedNumber;
};


const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^0-9]/g, '').length >= 9;
};

const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
};

useEffect(() => {
    sortContacts();
}, []);

const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? 'black' : 'white' }]}>
        <Text style={[styles.title, { color: isDarkTheme ? 'white' : 'black' }]}>Agenda de Contatos</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
            <TextInput
                style={[styles.searchInput, { backgroundColor: isDarkTheme ? '#333' : 'white', color: isDarkTheme ? 'white' : 'black' }]}
                placeholder="Pesquisar..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <TouchableOpacity style={styles.themeButton} onPress={handleThemeToggle}>
                <MaterialIcons name={isDarkTheme ? 'light-mode' : 'dark-mode'} size={30} color={isDarkTheme ? 'white' : 'black'} />
            </TouchableOpacity>
        </View>
        <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.contactContainer}>
                    <Text style={[styles.contactName, { color: isDarkTheme ? 'white' : 'black' }]}>{item.name} {item.lastName}</Text>
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleOpenEditModal(item)}
                        >
                            <Text style={styles.editButtonText}>✎</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deleteButton, { marginLeft: 20 }]}
                            onPress={() => handleDeleteContact(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>🗑</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            style={styles.list}
        />
        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                    {editingContactId ? 'Editar Contato' : 'Adicionar Contato'}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={editingContactName}
                    onChangeText={setEditingContactName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Sobrenome"
                    value={editingContactLastName}
                    onChangeText={setEditingContactLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    value={editingContactPhone}
                    onChangeText={setEditingContactPhone}
                    keyboardType="numeric"
                    maxLength={11}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail (opcional)"
                    value={editingContactEmail}
                    onChangeText={setEditingContactEmail}
                    keyboardType="email-address"
                />
                <View style={styles.buttonContainer}>
                    {editingContactId ? (
                        <Button title="Salvar" onPress={handleEditContact} />
                    ) : (
                        <Button title="Adicionar" onPress={handleAddContact} />
                    )}
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 50,
},
headerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
},
searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
},
themeButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: 'transparent',
},
actionContainer: {
    flexDirection: 'row',
},
editButton: {
    backgroundColor: '#2196F3',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
},
editButtonText: {
    color: '#fff',
    fontSize: 18,
},
contactContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
contactName: {
    fontSize: 18,
    fontWeight: 'bold',
},
deleteButton: {
    backgroundColor: '#F44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
},
deleteButtonText: {
    color: '#fff',
    fontSize: 18,
},
list: {
    flex: 1,
},
bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
},
addButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
},
addButtonText: {
    color: '#fff',
    fontSize: 32,
},
modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
},
modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
},
input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
},
buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
});
