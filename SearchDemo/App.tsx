import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, Button, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import axios from 'axios';
import { platform } from 'os';


const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');


  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');


  useEffect(() => {
    // Fetch data from the API
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    // Filter data based on search term
    const filtered = data.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    const sortedFiltered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    setFilteredData(sortedFiltered);
  }, [search, data]);



  const deleteItem = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    setFilteredData(updatedData.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.title.localeCompare(a.title)));
  };


  const addItem = () => {
    const newItem = {
      id: data.length + 1, // or use a proper ID generation method
      title: newTitle,
      body: newBody
    };
    console.log("newItem---", newItem);


    const updatedData = [...data, newItem];
    console.log("updatedData---", updatedData);


    const sortedData = updatedData.sort((a, b) => b.title.localeCompare(a.title));
    setData(sortedData);
    setFilteredData(sortedData.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ));
    setNewTitle('');
    setNewBody('');
  };



  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          {/* <Image source={require('./images/DeleteIcon.png')} style={{ height: 30, width: 30 }} /> */}
        </TouchableOpacity>
      </View>
      <Text>{item.body}</Text>
    </View>
  );


  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* version check */}
      <Text style={{ fontSize: 20 }}>{JSON.stringify(Platform.constants.reactNativeVersion.minor)}</Text>

      <View style={[styles.searchBar, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
        <TextInput
          placeholder="Search by title..."
          value={search}
          onChangeText={setSearch}
        />
        {search &&
          <TouchableOpacity onPress={() => { setSearch("") }}>
            {/* <Image source={require('./images/close.png')} style={{ height: 30, width: 30 }} /> */}
          </TouchableOpacity>
        }
      </View>


      <TextInput
        placeholder="New item"
        value={newBody}
        onChangeText={setNewBody}
      />


      <Button title="Add Item" onPress={addItem} />


      {filteredData.length > 0 ? (<FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />) : (<View>
        <Text>No Data Found</Text>
      </View>)}


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default App;