import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';

// FINAL HOREV MEGA APP - React Native for Expo Go
// Features: Multi-city, Ride+Delivery+Gas+Food, Rider Registration, Admin, Driver, MoMo, WhatsApp

const CITIES = ['Accra', 'Ho', 'Hohoe', 'Tamale', 'Buipe'];
const PRICES = { Accra: { okada: 15, yellow: 25 }, Ho: { okada: 12, yellow: 20 }, Hohoe: { okada: 10, yellow: 18 }, Tamale: { okada: 12, yellow: 22 }, Buipe: { okada: 8, yellow: 15 } };

export default function App() {
  const [mode, setMode] = useState('customer'); // customer, rider, admin
  const [city, setCity] = useState('Hohoe');
  const [service, setService] = useState('ride');
  const [rideType, setRideType] = useState('okada');
  const [pickup, setPickup] = useState('Circle');
  const [dest, setDest] = useState('');
  const [status, setStatus] = useState('idle');
  const [riderName] = useState('Kwame Asante');
  const [reg, setReg] = useState({ name: '', phone: '', license: '', plate: '', type: 'okada' });
  const [pending, setPending] = useState([
    { id: 1, name: 'Kofi Mensah', city: 'Hohoe', type: 'okada', phone: '0541112233' },
    { id: 2, name: 'Ama Serwaa', city: 'Buipe', type: 'yellow', phone: '0549998877' },
  ]);

  const price = PRICES[city]?.[rideType] || 15;

  const request = () => {
    if (!dest) return Alert.alert('Enter destination');
    setStatus('searching');
    setTimeout(() => setStatus('found'), 2000);
  };

  const callRider = () => Linking.openURL('tel:0541234567');
  const whatsappRider = () => Linking.openURL('https://wa.me/233541234567?text=Hello%20Kwame%20I%20am%20your%20HOREV%20customer');

  const submitRegistration = () => {
    if (!reg.name || !reg.phone) return Alert.alert('Fill name and phone');
    setPending([...pending, { id: Date.now(), name: reg.name, city, type: reg.type, phone: reg.phone }]);
    Alert.alert('Submitted!', `You are #${pending.length + 1} in queue for ${city}. Admin will review in 24h`);
    setReg({ name: '', phone: '', license: '', plate: '', type: 'okada' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HOREV GHANA đŹđ­</Text>
        <Text style={styles.headerSub}>Ride â˘ Deliver â˘ Gas â˘ Food â˘ {city}</Text>
        <View style={styles.modeRow}>
          {['customer', 'rider', 'admin'].map(m => (
            <TouchableOpacity key={m} style={[styles.modeBtn, mode === m && styles.modeActive]} onPress={() => setMode(m)}>
              <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>{m.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {CITIES.map(c => (
            <TouchableOpacity key={c} style={[styles.cityPill, city === c && styles.cityActive]} onPress={() => setCity(c)}>
              <Text style={city === c ? { color: 'white' } : {}}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.body}>
        {mode === 'customer' && status === 'idle' && (
          <>
            <Text style={styles.section}>Choose Service</Text>
            <View style={styles.grid}>
              {[
                { id: 'ride', label: 'đľ Ride', desc: 'Okada & Yellow' },
                { id: 'package', label: 'đŚ Send', desc: 'Package' },
                { id: 'food', label: 'đ˛ Food', desc: 'Buy Food' },
                { id: 'gas', label: 'â˝ Gas/Errand', desc: 'Gas, Market' },
              ].map(s => (
                <TouchableOpacity key={s.id} style={[styles.serviceCard, service === s.id && styles.serviceActive]} onPress={() => setService(s.id)}>
                  <Text style={styles.serviceLabel}>{s.label}</Text>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Pickup</Text>
            <TextInput style={styles.input} value={pickup} onChangeText={setPickup} />
            <Text style={styles.label}>{service === 'ride' ? 'Where to?' : service === 'gas' ? 'Errand Details (e.g. Fill 12kg gas, Buy tomatoes)' : 'Destination / Restaurant'}</Text>
            <TextInput style={styles.input} placeholder={service === 'gas' ? 'e.g. Fill 12kg gas at Total, Buipe' : 'e.g. Kaneshie, Papaye'} value={dest} onChangeText={setDest} />

            {service === 'ride' && (
              <View style={styles.row}>
                <TouchableOpacity style={[styles.rideCard, rideType === 'okada' && styles.selected]} onPress={() => setRideType('okada')}>
                  <Text>đľ Okada</Text><Text style={styles.bold}>GHâľ{PRICES[city].okada}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.rideCard, rideType === 'yellow' && styles.selectedY]} onPress={() => setRideType('yellow')}>
                  <Text>đĄ Yellow Yellow</Text><Text style={styles.bold}>GHâľ{PRICES[city].yellow}</Text>
                </TouchableOpacity>
              </View>
            )}

            {service !== 'ride' && (
              <View style={styles.priceBox}>
                <Text>Delivery Fee: GHâľ15 â˘ Service: GHâľ5</Text>
                <Text style={styles.bold}>Total: GHâľ{service === 'food' ? 35 : 20} + items</Text>
              </View>
            )}

            <Text style={styles.label}>Payment</Text>
            <View style={styles.row}>
              <Text style={styles.pay}>đą MTN MoMo</Text><Text style={styles.pay}>đł Vodafone Cash</Text><Text style={styles.pay}>đľ Cash</Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={request}>
              <Text style={styles.btnText}>Request {service} - GHâľ{service === 'ride' ? price : '20'}</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'searching' && <Text style={styles.big}>đ Finding {rideType} rider in {city}...</Text>}
        {status === 'found' && (
          <View style={styles.riderCard}>
            <Text style={styles.bold}>đ Rider Found! {riderName} â­4.8</Text>
            <Text>Plate M-1234-24 â˘ ETA 3 min â˘ {city}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.callBtn} onPress={callRider}><Text style={styles.btnText}>đ Call</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.callBtn, { backgroundColor: '#25D366' }]} onPress={whatsappRider}><Text style={styles.btnText}>đŹ WhatsApp</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => setStatus('done')}><Text style={styles.btnText}>Complete Trip - OTP 4821</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus('idle')}><Text style={{ marginTop: 10, textAlign: 'center' }}>Cancel</Text></TouchableOpacity>
          </View>
        )}
        {status === 'done' && (
          <View><Text style={styles.big}>â Delivered! Thanks for using HOREV in {city}!</Text><TouchableOpacity style={styles.btn} onPress={() => setStatus('idle')}><Text style={styles.btnText}>New Request</Text></TouchableOpacity></View>
        )}

        {mode === 'rider' && (
          <>
            <Text style={styles.section}>Rider Registration - Become HOREV Rider</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={reg.name} onChangeText={t => setReg({ ...reg, name: t })} />
            <TextInput style={styles.input} placeholder="Phone 054..." value={reg.phone} onChangeText={t => setReg({ ...reg, phone: t })} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="License Number" value={reg.license} onChangeText={t => setReg({ ...reg, license: t })} />
            <TextInput style={styles.input} placeholder="Plate M-1234" value={reg.plate} onChangeText={t => setReg({ ...reg, plate: t })} />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.rideCard, reg.type === 'okada' && styles.selected]} onPress={() => setReg({ ...reg, type: 'okada' })}><Text>đľ Okada</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.rideCard, reg.type === 'yellow' && styles.selectedY]} onPress={() => setReg({ ...reg, type: 'yellow' })}><Text>đĄ Yellow Yellow</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={submitRegistration}><Text style={styles.btnText}>Submit for Approval - {city}</Text></TouchableOpacity>

            <Text style={[styles.section, { marginTop: 30 }]}>Driver Dashboard (Go Online)</Text>
            <View style={styles.stats}><Text>Today: 5 trips â˘ GHâľ120 â˘ â­4.9</Text></View>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#22c55e' }]} onPress={() => Alert.alert('Online!', 'You are now online in ' + city + ' receiving orders')}><Text style={styles.btnText}>đ˘ Go ONLINE in {city}</Text></TouchableOpacity>
          </>
        )}

        {mode === 'admin' && (
          <>
            <Text style={styles.section}>Super Admin - {city} | All Cities</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}><Text style={styles.bold}>527</Text><Text>Riders</Text></View>
              <View style={styles.stat}><Text style={styles.bold}>61</Text><Text>Active</Text></View>
              <View style={styles.stat}><Text style={styles.bold}>GHâľ15k</Text><Text>Today</Text></View>
              <View style={styles.stat}><Text style={styles.bold}>{pending.length}</Text><Text>Pending</Text></View>
            </View>
            <Text style={styles.section}>Pending Approvals - {city}</Text>
            {pending.filter(p => city === 'Accra' ? true : p.city === city).map(p => (
              <View key={p.id} style={styles.pendingCard}>
                <Text style={styles.bold}>{p.name} - {p.type === 'okada' ? 'đľ Okada' : 'đĄ Yellow Yellow'} - {p.city}</Text>
                <Text>đ {p.phone} â˘ License & Docs â</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: '#22c55e' }]} onPress={() => { setPending(pending.filter(x => x.id !== p.id)); Alert.alert('Approved!', p.name + ' can now ride in ' + p.city); }}><Text style={styles.btnText}>â Approve</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: '#ef4444' }]} onPress={() => setPending(pending.filter(x => x.id !== p.id))}><Text style={styles.btnText}>â Reject</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf5' },
  header: { backgroundColor: '#111', padding: 20, paddingTop: 50 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#FFC300', marginTop: 4 },
  modeRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  modeBtn: { borderWidth: 1, borderColor: '#444', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  modeActive: { backgroundColor: '#FFC300', borderColor: '#FFC300' },
  modeText: { color: '#aaa', fontSize: 11, fontWeight: 'bold' },
  modeTextActive: { color: 'black' },
  cityPill: { backgroundColor: '#222', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#333' },
  cityActive: { backgroundColor: '#7c2d12', borderColor: '#7c2d12' },
  body: { flex: 1, padding: 16, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -16 },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#7c2d12' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  serviceCard: { width: '47%', borderWidth: 2, borderColor: '#eee', borderRadius: 16, padding: 14, backgroundColor: '#f9fafb' },
  serviceActive: { borderColor: '#7c2d12', backgroundColor: '#fff7ed' },
  serviceLabel: { fontWeight: 'bold' },
  serviceDesc: { fontSize: 11, color: '#666' },
  label: { marginTop: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginTop: 6, backgroundColor: '#f9fafb' },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  rideCard: { flex: 1, borderWidth: 2, borderColor: '#eee', borderRadius: 12, padding: 12, alignItems: 'center' },
  selected: { borderColor: '#7c2d12', backgroundColor: '#fff7ed' },
  selectedY: { borderColor: '#FFC300', backgroundColor: '#fefce8' },
  bold: { fontWeight: 'bold' },
  priceBox: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginTop: 12 },
  pay: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 8, fontSize: 11 },
  btn: { backgroundColor: '#111', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 18 },
  btnText: { color: 'white', fontWeight: 'bold' },
  big: { fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  riderCard: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fed7aa', marginTop: 16 },
  callBtn: { flex: 1, backgroundColor: '#111', padding: 12, borderRadius: 12, alignItems: 'center' },
  stats: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginTop: 10 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  stat: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  pendingCard: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', padding: 12, borderRadius: 12, marginTop: 10 }
});
