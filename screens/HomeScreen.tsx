import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Button, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { WebView } from 'react-native-webview';

const RSS_SOURCES = [
  { name: '연합', url: 'https://www.yna.co.kr/rss/news.xml' },
  { name: 'JTBC', url: 'https://news-ex.jtbc.co.kr/v1/get/rss/issue' },
  { name: 'SBS', url: 'https://news.sbs.co.kr/news/newsflashRssFeed.do?plink=RSSREADER' },
  { name: '경향', url: 'https://www.khan.co.kr/rss/rssdata/total_news.xml' },
  { name: '한겨례', url: 'https://www.hani.co.kr/rss' }, 
  { name: '오마이', url: 'https://rss.ohmynews.com/rss/ohmynews.xml' },    
  { name: '동아', url: 'https://rss.donga.com/total.xml' },
  { name: '조선', url: 'https://www.chosun.com/arc/outboundfeeds/rss/?outputType=xml' },
  { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },  
  { name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' }
];

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedSource, setSelectedSource] = useState(RSS_SOURCES[0]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (source) => {
    try {
      const response = await axios.get(source.url);
      const parser = new XMLParser();
      const json = parser.parse(response.data);
      if (json.rss && json.rss.channel && json.rss.channel.item) {
        const items = json.rss.channel.item.map((item, index) => ({
          id: `${source.url}-${index}`,
          title: item.title,
          link: item.link,
        }));
        setNews(items);
      }
    } catch (error) {
      console.error('Error fetching RSS:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(selectedSource);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNews(selectedSource);
  }, [selectedSource]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.tabContainer}>
        {RSS_SOURCES.map((source) => (
          <TouchableOpacity key={source.name} onPress={() => setSelectedSource(source)} style={[styles.tab, selectedSource.name === source.name && styles.activeTab]}>
            <Text style={styles.tabText}>{source.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedNews(item)} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal visible={!!selectedNews} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{selectedNews?.title}</Text>
            <View style={styles.webViewContainer}>
              {selectedNews?.link && (
                <WebView source={{ uri: selectedNews.link }} style={styles.webView} />
              )}
            </View>
            <TouchableOpacity onPress={() => setSelectedNews(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', marginBottom: 10 },
  tab: { padding: 10, marginRight: 10, backgroundColor: '#ddd', borderRadius: 5 },
  activeTab: { backgroundColor: '#007bff' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', height: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  webViewContainer: { flex: 1, width: '100%', height: '100%' },
  webView: { flex: 1, width: '100%', height: '100%' },
  closeButton: { marginTop: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
  closeText: { color: 'white', fontWeight: 'bold' },
});

export default NewsList;
