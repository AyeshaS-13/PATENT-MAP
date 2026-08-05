import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput } from 'react-native';

export default function App() {
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [patentText, setPatentText] = useState('');
  const [activePatent, setActivePatent] = useState(null);

  const isDark = themeMode === 'dark';

  const bgStyle = { backgroundColor: isDark ? '#0b0f19' : '#f8fafc', flex: 1 };
  const cardStyle = { backgroundColor: isDark ? '#111827' : '#ffffff', borderColor: isDark ? '#1f2937' : '#e5e7eb' };
  const textStyle = { color: isDark ? '#f3f4f6' : '#1e293b' };
  const subTextStyle = { color: isDark ? '#9ca3af' : '#64748b' };

  const handleProcessPatent = () => {
    setActivePatent({
      title: patentText.split('\n')[0] || 'Multi-Modal Neural Sensor Classification',
      abstract: patentText || 'Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction.',
      cpcCode: 'G06F 18/20',
      domain: 'Artificial Intelligence & ML (78.5%)',
      confidence: '94.2%'
    });
    setCurrentScreen('Extraction');
  };

  return (
    <SafeAreaView style={bgStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Mobile Header */}
      <View style={[styles.header, cardStyle]}>
        <View style={styles.brandBox}>
          <Text style={styles.brandBadge}>PM</Text>
          <View>
            <Text style={[styles.headerTitle, textStyle]}>PATENT MAP</Text>
            <Text style={[styles.headerSubtitle, subTextStyle]}>Mobile CPC Assistant</Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            if (themeMode === 'light') setThemeMode('dark');
            else if (themeMode === 'dark') setThemeMode('system');
            else setThemeMode('light');
          }}
          style={styles.themeBtn}
        >
          <Text style={{ color: '#6366f1', fontWeight: 'bold', fontSize: 12 }}>
            {themeMode.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {currentScreen === 'Dashboard' && (
          <View>
            <Text style={[styles.sectionTitle, textStyle]}>Classification Workspace</Text>
            
            <View style={[styles.card, cardStyle]}>
              <Text style={[styles.cardTitle, textStyle]}>Quick Patent Classifier</Text>
              <Text style={[styles.cardDesc, subTextStyle]}>
                Paste patent abstract or claims to trigger mobile AI extraction & CPC recommendation
              </Text>
              
              <TextInput
                style={[styles.input, { color: textStyle.color, borderColor: cardStyle.borderColor }]}
                multiline
                numberOfLines={5}
                placeholder="Paste patent title, abstract, or claims..."
                placeholderTextColor={subTextStyle.color}
                value={patentText}
                onChangeText={setPatentText}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleProcessPatent}>
                <Text style={styles.btnText}>Run Mobile AI Analysis</Text>
              </TouchableOpacity>
            </View>

            {activePatent && (
              <View style={[styles.card, cardStyle, { marginTop: 16 }]}>
                <Text style={[styles.cardTitle, { color: '#6366f1' }]}>{activePatent.title}</Text>
                <Text style={[styles.cardDesc, subTextStyle]}>{activePatent.abstract.substring(0, 120)}...</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.cpcBadge}>{activePatent.cpcCode}</Text>
                  <Text style={[styles.metaText, subTextStyle]}>{activePatent.domain}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {currentScreen === 'Extraction' && activePatent && (
          <View>
            <Text style={[styles.sectionTitle, textStyle]}>Mobile Extracted Content</Text>
            <View style={[styles.card, cardStyle]}>
              <Text style={[styles.label, { color: '#6366f1' }]}>TITLE</Text>
              <Text style={[styles.cardTitle, textStyle]}>{activePatent.title}</Text>
              <Text style={[styles.label, { color: '#6366f1', marginTop: 12 }]}>ABSTRACT</Text>
              <Text style={[styles.cardDesc, textStyle]}>{activePatent.abstract}</Text>
              <Text style={[styles.label, { color: '#6366f1', marginTop: 12 }]}>PREDICTED CPC CODE</Text>
              <Text style={styles.cpcBadge}>{activePatent.cpcCode} (Confidence: {activePatent.confidence})</Text>
            </View>
          </View>
        )}

        {currentScreen === 'Explorer' && (
          <View>
            <Text style={[styles.sectionTitle, textStyle]}>CPC Hierarchy Explorer</Text>
            <View style={[styles.card, cardStyle]}>
              <Text style={[styles.cardTitle, textStyle]}>Section G: Physics & AI</Text>
              <Text style={[styles.cardDesc, subTextStyle]}>G06F 18/20 - Pattern recognition & classifiers</Text>
              <Text style={[styles.cardDesc, subTextStyle]}>G06N 3/02 - Neural network architectures</Text>
            </View>
          </View>
        )}

        {currentScreen === 'Settings' && (
          <View>
            <Text style={[styles.sectionTitle, textStyle]}>Theme Settings</Text>
            <View style={[styles.card, cardStyle]}>
              <Text style={[styles.cardTitle, textStyle]}>Appearance Mode</Text>
              {['light', 'dark', 'system'].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setThemeMode(m)}
                  style={[styles.radioRow, themeMode === m && { backgroundColor: isDark ? '#1f2937' : '#e0e7ff' }]}
                >
                  <Text style={[styles.radioText, textStyle]}>{m.toUpperCase()} MODE</Text>
                  {themeMode === m && <Text style={{ color: '#6366f1', fontWeight: 'bold' }}>✓ Active</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Mobile Tab Navigation */}
      <View style={[styles.tabBar, cardStyle]}>
        {[
          { key: 'Dashboard', label: 'Dashboard' },
          { key: 'Extraction', label: 'Extraction' },
          { key: 'Explorer', label: 'CPC Tree' },
          { key: 'Settings', label: 'Settings' }
        ].map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setCurrentScreen(tab.key)} style={styles.tabItem}>
            <Text style={{ color: currentScreen === tab.key ? '#6366f1' : subTextStyle.color, fontWeight: currentScreen === tab.key ? 'bold' : 'normal', fontSize: 12 }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },
  brandBox: { flexDirection: 'row', alignItems: 'center' },
  brandBadge: { width: 32, height: 32, backgroundColor: '#6366f1', color: '#fff', textAlign: 'center', lineHeight: 32, borderRadius: 8, fontWeight: 'bold', marginRight: 10 },
  headerTitle: { fontWeight: 'bold', fontSize: 16 },
  headerSubtitle: { fontSize: 11 },
  themeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#6366f1' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 12, height: 100, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: '#6366f1', paddingVertical: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cpcBadge: { backgroundColor: '#6366f1', color: '#fff', fontWeight: 'bold', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  metaText: { fontSize: 12 },
  label: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  radioRow: { padding: 12, borderRadius: 8, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radioText: { fontWeight: '600', fontSize: 13 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
