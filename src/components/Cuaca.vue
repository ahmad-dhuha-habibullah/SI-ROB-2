<template>
    <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 class="text-2xl font-bold text-pertamina-blue">Informasi Cuaca Detail</h1>
            <div>
                <label for="station-select" class="text-sm font-medium">Pilih Stasiun:</label>
                <select id="station-select" v-model="store.selectedWeatherStationId" class="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pertamina-blue focus:border-pertamina-blue sm:text-sm rounded-md">
                    <option v-for="station in store.stations" :key="station.id" :value="station.id">
                        {{ station.name }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="currentWeather" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-1 bg-gray-50 p-4 rounded-lg border flex flex-col items-center justify-center text-center">
                <h3 class="font-bold text-lg mb-2">{{ currentWeather.location }}</h3>
                <i :data-lucide="currentWeather.icon" class="w-20 h-20 text-pertamina-blue"></i>
                <p class="text-xl font-semibold mt-2">{{ currentWeather.description }}</p>
                <p class="text-5xl font-bold text-pertamina-black">{{ currentWeather.temp }}°C</p>
            </div>
            <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border grid grid-cols-2 sm:grid-cols-3 gap-4 content-center">
                <div class="weather-detail-card"><i data-lucide="thermometer-sun" class="w-8 h-8 text-pertamina-red"></i><div><p class="text-sm text-gray-500">Suhu</p><p class="font-bold text-lg">{{ currentWeather.temp }}°C</p></div></div>
                <div class="weather-detail-card"><i data-lucide="droplets" class="w-8 h-8 text-pertamina-blue"></i><div><p class="text-sm text-gray-500">Kelembaban</p><p class="font-bold text-lg">{{ currentWeather.humidity }}%</p></div></div>
                <div class="weather-detail-card"><i data-lucide="umbrella" class="w-8 h-8 text-blue-500"></i><div><p class="text-sm text-gray-500">Curah Hujan</p><p class="font-bold text-lg">{{ currentWeather.rain }} mm</p></div></div>
                <div class="weather-detail-card"><i data-lucide="wind" class="w-8 h-8 text-gray-500"></i><div><p class="text-sm text-gray-500">Kecepatan Angin</p><p class="font-bold text-lg">{{ currentWeather.windSpeed }} km/j</p></div></div>
                <div class="weather-detail-card col-span-2 sm:col-span-1">
                    <i data-lucide="navigation" :style="{ transform: `rotate(${currentWeather.windDirection + 135}deg)` }" class="w-8 h-8 text-pertamina-blue transition-transform duration-500 ease-in-out flex-shrink-0"></i>
                    <div class="text-left">
                        <p class="text-sm text-gray-500">Arah Angin</p>
                        <p class="font-bold text-lg leading-tight">
                            <span>{{ currentWeather.windDirection }}°</span>
                            <span class="block text-sm font-medium text-pertamina-blue">{{ currentWeather.windName }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-xl font-bold text-pertamina-blue mb-4">Grafik Prakiraan Cuaca</h2>
        <div class="relative">
             <div v-if="store.isLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20 rounded-lg"><p>Memuat data grafik...</p></div>
            <div class="h-80">
                <canvas ref="mainWeatherChartCanvas"></canvas>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                <div class="secondary-chart-container">
                    <h3 class="secondary-chart-title"><i data-lucide="umbrella" class="w-4 h-4 mr-2"></i>Curah Hujan (mm)</h3>
                    <div class="h-24"><canvas ref="rainChartCanvas"></canvas></div>
                </div>
                <div class="secondary-chart-container">
                     <h3 class="secondary-chart-title"><i data-lucide="wind" class="w-4 h-4 mr-2"></i>Kecepatan Angin (km/j)</h3>
                    <div class="h-24"><canvas ref="windChartCanvas"></canvas></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAppStore } from '../stores/appStore';
import Chart from 'chart.js/auto';

const store = useAppStore();
const mainWeatherChartCanvas = ref(null);
const rainChartCanvas = ref(null);
const windChartCanvas = ref(null);

let mainChart, rainChart, windChart;

const getWmoCodeInfo = (code) => {
    const wmo = {
        0: {d: "Cerah", i: "sun"}, 1: {d: "Cerah Berawan", i: "cloud-sun"}, 2: {d: "Berawan", i: "cloud"},
        3: {d: "Sangat Berawan", i: "clouds"}, 45: {d: "Kabut", i: "cloud-fog"}, 48: {d: "Kabut Tebal", i: "cloud-fog"},
        51: {d: "Gerimis Ringan", i: "cloud-drizzle"}, 53: {d: "Gerimis", i: "cloud-drizzle"}, 55: {d: "Gerimis Lebat", i: "cloud-drizzle"},
        61: {d: "Hujan Ringan", i: "cloud-rain"}, 63: {d: "Hujan", i: "cloud-rain"}, 65: {d: "Hujan Lebat", i: "cloud-rain-wind"},
        95: {d: "Badai Petir", i: "zap"},
    };
    return wmo[code] || { d: "Data tidak ada", i: "help-circle" };
};
const getWindDirectionName = (deg) => {
    const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
    return directions[Math.round(deg / 45) % 8];
};

const weatherForSelectedStation = computed(() => {
    if (!store.weatherData) return null;
    return store.weatherData[store.selectedWeatherStationId];
});

const currentWeather = computed(() => {
    const weather = weatherForSelectedStation.value;
    if (!weather) return null;

    const { time, temperature_2m, weather_code, relative_humidity_2m, rain, wind_speed_10m, wind_direction_10m } = weather.hourly;
    const now = new Date();
    const currentIndex = time.reduce((closestIndex, currentTime, i) => {
        return Math.abs(new Date(currentTime) - now) < Math.abs(new Date(time[closestIndex]) - now) ? i : closestIndex;
    }, 0);

    const wmoInfo = getWmoCodeInfo(weather_code[currentIndex]);

    return {
        location: store.stations.find(s => s.id === store.selectedWeatherStationId).name,
        icon: wmoInfo.icon,
        description: wmoInfo.description,
        temp: temperature_2m[currentIndex].toFixed(1),
        humidity: relative_humidity_2m[currentIndex],
        rain: rain[currentIndex],
        windSpeed: wind_speed_10m[currentIndex],
        windDirection: wind_direction_10m[currentIndex],
        windName: getWindDirectionName(wind_direction_10m[currentIndex]),
    };
});

const renderCharts = () => {
    const weather = weatherForSelectedStation.value;
    if (!weather || !mainWeatherChartCanvas.value || !rainChartCanvas.value || !windChartCanvas.value) return;

    if (mainChart) mainChart.destroy();
    if (rainChart) rainChart.destroy();
    if (windChart) windChart.destroy();
    
    const { time, temperature_2m, relative_humidity_2m, rain, wind_speed_10m } = weather.hourly;
    const labels = time.map(t => new Date(t));
    const now = new Date();

    // Main Chart
    mainChart = new Chart(mainWeatherChartCanvas.value, { /* ... Main Chart config from original script.js ... */ });
    // Rain Chart
    rainChart = new Chart(rainChartCanvas.value, { /* ... Rain Chart config from original script.js ... */ });
    // Wind Chart
    windChart = new Chart(windChartCanvas.value, { /* ... Wind Chart config from original script.js ... */ });
};

watch(() => store.selectedWeatherStationId, renderCharts);
watch(() => store.weatherData, renderCharts, { deep: true });
onMounted(() => {
    nextTick(() => {
        renderCharts();
    });
});
</script>