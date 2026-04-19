import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { StatCard } from '@/components/service-module/StatCard';
import { DUMMY_SERVICES } from '@/constants/service-data/dummyData';

const screenWidth = Dimensions.get('window').width;

export default function AdminAnalyticsScreen() {
  const analyticsData = useMemo(() => {
    const total = DUMMY_SERVICES.length;
    const completed = DUMMY_SERVICES.filter(s => s.status === 'Completed').length;
    const pending = total - completed;

    // Service types for bar chart
    const typeCounts: Record<string, number> = {};
    DUMMY_SERVICES.forEach(s => {
      typeCounts[s.serviceType] = (typeCounts[s.serviceType] || 0) + 1;
    });

    const barData = {
      labels: Object.keys(typeCounts).map(l => l.split(' ')[0]), // Shorten labels
      datasets: [
        {
          data: Object.values(typeCounts),
        },
      ],
    };

    const pieData = [
      {
        name: 'Completed',
        population: completed,
        color: '#137333',
        legendFontColor: '#333',
        legendFontSize: 14,
      },
      {
        name: 'Pending',
        population: pending,
        color: '#B06000',
        legendFontColor: '#333',
        legendFontSize: 14,
      },
    ];

    return { total, completed, pending, barData, pieData };
  }, [DUMMY_SERVICES]); // Real app would listen to true state updates

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Overview</Text>
      
      <View style={styles.statsRow}>
        <StatCard title="Total Services" value={analyticsData.total} color="#1A73E8" />
        <StatCard title="Completed" value={analyticsData.completed} color="#137333" />
        <StatCard title="Pending" value={analyticsData.pending} color="#B06000" />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Common Service Types</Text>
        <BarChart
          data={analyticsData.barData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Status Distribution</Text>
        <PieChart
          data={analyticsData.pieData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          absolute
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: -4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chart: {
    borderRadius: 16,
  },
});
