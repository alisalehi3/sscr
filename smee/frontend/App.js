import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';

// آدرس API بک‌اند
const API_URL = 'http://localhost:8000';

export default function App() {
  const [status, setStatus] = useState('آماده');
  const [sensorData, setSensorData] = useState({
    visual: 'در انتظار...',
    audio: 'در انتظار...',
    tactile: 'در انتظار...',
    biosensor: 'در انتظار...'
  });

  // بررسی اتصال به سرور
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(API_URL);
        setStatus(`سرور متصل است: ${response.data.message}`);
      } catch (error) {
        setStatus('خطا در اتصال به سرور');
        console.error(error);
      }
    };

    checkServer();
  }, []);

  // ارسال داده‌های حسی به سرور
  const sendSensoryData = async () => {
    try {
      setStatus('در حال ارسال داده‌ها...');
      
      // داده‌های شبیه‌سازی شده
      const mockData = {
        visual_data: "data:image/base64,iVBORw0KGgoAAAANSUhEUgAA...",
        audio_data: "base64-audio-data-here",
        tactile_data: "vibration-pattern-data",
        biosensor_data: {
          eeg: [0.1, 0.2, 0.3, 0.4, 0.5],
          gsr: 1.23,
          heart_rate: 72
        }
      };
      
      const response = await axios.post(`${API_URL}/process-sensory-input`, mockData);
      
      setStatus(`داده‌ها با موفقیت ارسال شدند: ${response.data.message}`);
      setSensorData({
        visual: 'تصویر ارسال شد',
        audio: 'صدا ارسال شد',
        tactile: 'داده لمسی ارسال شد',
        biosensor: JSON.stringify(mockData.biosensor_data)
      });
    } catch (error) {
      setStatus('خطا در ارسال داده‌ها');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>SMEE</Text>
          <Text style={styles.subtitle}>موتور تجربه چندحسی مصنوعی</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>وضعیت:</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.sensorContainer}>
          <Text style={styles.sectionTitle}>داده‌های حسی:</Text>
          
          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>بینایی:</Text>
            <Text style={styles.sensorValue}>{sensorData.visual}</Text>
          </View>
          
          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>شنوایی:</Text>
            <Text style={styles.sensorValue}>{sensorData.audio}</Text>
          </View>
          
          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>لمسی:</Text>
            <Text style={styles.sensorValue}>{sensorData.tactile}</Text>
          </View>
          
          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>داده‌های بیوسنسور:</Text>
            <Text style={styles.sensorValue}>{sensorData.biosensor}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={sendSensoryData}
        >
          <Text style={styles.buttonText}>ارسال داده‌های حسی</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    color: '#388E3C',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
  },
  statusLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
  },
  sensorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1B5E20',
  },
  sensorItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sensorLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  sensorValue: {
    flex: 2,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 