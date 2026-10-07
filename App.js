import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Linking, Platform } from 'react-native';

export default function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Premium Lace - White", price: 120, stock: 12 },
    { id: 2, name: "Atoghu Fabric", price: 250, stock: 5 },
    { id: 3, name: "Kente - Royal", price: 300, stock: 8 },
  ]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sales, setSales] = useState(0);
  const [search, setSearch] = useState('');

  const addProduct = () => {
    if (!name || !price) { Alert.alert("Enter name and price"); return; }
    setProducts([...products, { id: Date.now(), name, price: Number(price), stock: Number(stock) || 0 }]);
    setName(''); setPrice(''); setStock('');
  };
  
  const sell = (id) => {
    setProducts(products.map(p => p.id === id ? {...p, stock: Math.max(0, p.stock-1)} : p));
    setSales(sales+1);
  };

  const totalValue = products.reduce((s,p)=>s + p.price*p.stock, 0);
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>HOREV GHANA</Text>
      <Text style={styles.sub}>Fashion Inventory</Text>
      
      <View style={styles.stats}>
        <View style={styles.card}><Text style={styles.cardNum}>{products.length}</Text><Text>Products</Text></View>
        <View style={styles.card}><Text style={styles.cardNum}>{sales}</Text><Text>Sales Today</Text></View>
        <View style={styles.card}><Text style={styles.cardNum}>GH₵{totalValue}</Text><Text>Stock Value</Text></View>
      </View>

      <TextInput style={styles.input} placeholder="Search products..." value={search} onChangeText={setSearch} />

      <View style={styles.form}>
        <Text style={styles.label}>Add New Fabric</Text>
        <TextInput style={styles.input} placeholder="Name e.g. Lace Red" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Price GH₵" keyboardType="numeric" value={price} onChangeText={setPrice} />
        <TextInput style={styles.input} placeholder="Stock qty" keyboardType="numeric" value={stock} onChangeText={setStock} />
        <TouchableOpacity style={styles.btn} onPress={addProduct}><Text style={styles.btnText}>+ Add Product</Text></TouchableOpacity>
      </View>

      {filtered.map(p=>(
        <View key={p.id} style={styles.row}>
          <View style={{flex:1}}><Text style={styles.pName}>{p.name}</Text><Text>GH₵{p.price} • Stock: {p.stock}</Text></View>
          <TouchableOpacity style={styles.sellBtn} onPress={()=>sell(p.id)}><Text style={{color:'#fff'}}>Sell 1</Text></TouchableOpacity>
        </View>
      ))}

      <Text style={styles.footer}>HOREV GHANA • Made in Accra • {new Date().getFullYear()}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:16, backgroundColor:'#fffaf5', paddingTop:50},
  header:{fontSize:28, fontWeight:'900', color:'#7c2d12', textAlign:'center'},
  sub:{textAlign:'center', color:'#888', marginBottom:12},
  stats:{flexDirection:'row', justifyContent:'space-between', marginVertical:10},
  card:{backgroundColor:'#fff', padding:12, borderRadius:12, alignItems:'center', flex:1, margin:4, elevation:2},
  cardNum:{fontWeight:'bold', fontSize:16},
  input:{backgroundColor:'#fff', borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:12, marginVertical:6},
  form:{backgroundColor:'#fff7ed', padding:12, borderRadius:12, marginVertical:12},
  label:{fontWeight:'bold', marginBottom:6},
  btn:{backgroundColor:'#7c2d12', padding:14, borderRadius:10, alignItems:'center', marginTop:6},
  btnText:{color:'#fff', fontWeight:'bold'},
  row:{flexDirection:'row', backgroundColor:'#fff', padding:12, borderRadius:10, marginVertical:6, alignItems:'center', borderWidth:1, borderColor:'#eee'},
  pName:{fontWeight:'bold'},
  sellBtn:{backgroundColor:'#000', padding:10, borderRadius:8},
  footer:{textAlign:'center', marginVertical:20, color:'#aaa'}
});
