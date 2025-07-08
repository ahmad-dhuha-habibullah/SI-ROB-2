<template>
  <div class="flex flex-col lg:flex-row gap-4 h-full">
    <div class="lg:w-2/3 w-full h-96 lg:h-full rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div ref="mapContainer" class="w-full h-full"></div>
    </div>
    
    <div class="lg:w-1/3 w-full flex flex-col gap-4 overflow-y-auto">
      <div v-if="!store.isLoading" class="p-4 rounded-lg shadow-lg flex items-start space-x-4 border-l-4" :style="{ backgroundColor: statusInfo.bgColor, borderColor: statusInfo.color }">
        <div class="p-3 rounded-full flex-shrink-0" :style="{ backgroundColor: statusInfo.color }">
          <i :data-lucide="statusInfo.icon" class="w-8 h-8 text-white"></i>
        </div>
        <div>
          <h3 class="font-bold text-lg">Status Peringatan: {{ statusInfo.text }}</h3>
          <p class="text-sm">{{ statusInfo.message }}</p>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h2 class="text-xl font-bold mb-4 text-pertamina-blue flex items-center"><i data-lucide="cloud-sun" class="w-5 h-5 mr-2"></i>Ringkasan Cuaca & Pasut</h2>
        <div v-if="summaryData" class="space-y-3 text-sm">
           <div class="flex justify-between items-center"><span class="font-semibold flex items-center"><i data-lucide="thermometer" class="w-4 h-4 mr-2 text-gray-500"></i>Suhu Udara</span><span class="font-bold">{{ summaryData.temp }}°C</span></div>
           <div class="flex justify-between items-center"><span class="font-semibold flex items-center"><i data-lucide="wind" class="w-4 h-4 mr-2 text-gray-500"></i>Kecepatan Angin</span><span>{{ summaryData.wind }} km/j</span></div>
           <div class="flex justify-between items-center"><span class="font-semibold flex items-center"><i data-lucide="waves" class="w-4 h-4 mr-2 text-gray-500"></i>Pasang Tertinggi (48j)</span><span class="font-bold text-pertamina-blue">{{ summaryData.tide }} m</span></div>
        </div>
         <p v-else class="text-sm text-gray-500">Memuat ringkasan...</p>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h2 class="text-xl font-bold mb-2 text-pertamina-blue flex items-center"><i data-lucide="map-pin" class="w-5 h-5 mr-2"></i>Status Stasiun</h2>
        <div v-if="store.stationData.length" class="space-y-3">
            <div v-for="station in store.stationData" :key="station.id" @click="panToStation(station.coords)"
                 class="flex justify-between items-center p-2.5 rounded-md hover:bg-gray-50 cursor-pointer border-l-4" 
                 :style="{ borderColor: getStatusInfo(station.status).color }">
                <div>
                    <p class="font-semibold">{{ station.name }}</p>
                    <p class="text-xs text-gray-500">Ketinggian: {{ station.waterLevel.toFixed(2) }} m</p>
                </div>
                <span class="px-2 py-1 text-xs font-bold text-white rounded-full" :style="{ backgroundColor: getStatusInfo(station.status).color }">
                    {{ station.status }}
                </span>
            </div>
        </div>
         <p v-else class="text-sm text-gray-500">Memuat status stasiun...</p>
      </div>
    </div>

    <HistoryModal v-if="isHistoryModalOpen" :station-id="selectedStationId" @close="isHistoryModalOpen = false"/>
    <CctvModal v-if="isCctvModalOpen" :station-id="selectedStationId" @close="isCctvModalOpen = false"/>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import HistoryModal from './modals/HistoryModal.vue';
import CctvModal from './modals/CctvModal.vue';

const store = useAppStore();
const mapContainer = ref(null);
let map = null;
let markers = {};

const isHistoryModalOpen = ref(false);
const isCctvModalOpen = ref(false);
const selectedStationId = ref(null);

const panToStation = (coords) => {
    if (map) {
        map.setView(coords, 14);
    }
};

const openModal = (type, stationId) => {
    selectedStationId.value = stationId;
    if (type === 'history') {
        isHistoryModalOpen.value = true;
    } else if (type === 'cctv') {
        isCctvModalOpen.value = true;
    }
};

const getStatusInfo = (status) => {
    const statuses = {
        Bahaya: { c: 'var(--status-bahaya)', bg: '#fee2e2', i: 'shield-alert', t: 'BAHAYA', m: 'Level air berbahaya terdeteksi di beberapa titik.' },
        Waspada: { c: 'var(--status-waspada)', bg: '#fef3c7', i: 'shield-check', t: 'WASPADA', m: 'Level air meningkat, potensi rob. Harap waspada.' },
        Aman: { c: 'var(--status-aman)', bg: '#dcfce7', i: 'shield-check', t: 'AMAN', m: 'Semua stasiun dalam kondisi normal dan terkendali.' }
    };
    return statuses[status] || statuses['Aman'];
};

const statusInfo = computed(() => getStatusInfo(store.overallStatus));

const summaryData = computed(() => {
    if (!store.weatherData || !store.tidalData?.minutely_15) return null;
    
    const stationWeather = store.weatherData[store.selectedWeatherStationId];
    const { hourly } = stationWeather;
    const now_hourly_iso = new Date().toISOString().slice(0, 13) + ":00";
    const weatherIdx = hourly.time.indexOf(now_hourly_iso);
    if (weatherIdx === -1) return null;

    const maxTide = Math.max(...store.tidalData.minutely_15.sea_level_height_msl.slice(0, 4 * 48));

    return {
        temp: hourly.temperature_2m[weatherIdx].toFixed(1),
        wind: hourly.wind_speed_10m[weatherIdx].toFixed(1),
        tide: maxTide.toFixed(2),
    };
});

const createMarkerIcon = (color) => {
    const html = `<div class="relative flex justify-center items-center">
                    <div class="pulse" style="background-color: ${color};"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" class="relative map-marker-svg">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>`;
    return L.divIcon({ html: html, className: '', iconSize: [28, 28], iconAnchor: [14, 28] });
};

const updateMapMarkers = () => {
    if (!map || !store.stationData.length) return;
    store.stationData.forEach(station => {
        const marker = markers[station.id];
        if (marker) {
            const info = getStatusInfo(station.status);
            marker.setIcon(createMarkerIcon(info.color));
            
            // Popup content with event listeners
            const popupContent = document.createElement('div');
            popupContent.innerHTML = `<div class="popup-title">${station.name}</div>
                <div class="text-sm space-y-1">
                    <div class="flex justify-between"><span>Status:</span> <strong style="color: ${info.color};">${station.status}</strong></div>
                    <div class="flex justify-between"><span>Ketinggian:</span> <strong>${station.waterLevel.toFixed(2)} m</strong></div>
                </div>
                <div class="mt-3 flex space-x-2">
                    <button class="popup-button popup-button-primary flex-1" data-action="history">Riwayat</button>
                    <button class="popup-button popup-button-secondary flex-1" data-action="cctv">CCTV</button>
                </div>`;
            
            popupContent.querySelector('[data-action="history"]').addEventListener('click', () => openModal('history', station.id));
            popupContent.querySelector('[data-action="cctv"]').addEventListener('click', () => openModal('cctv', station.id));

            marker.unbindPopup().bindPopup(popupContent);
        }
    });
};

onMounted(() => {
    if (mapContainer.value) {
        map = L.map(mapContainer.value).setView([1.2, 101.45], 9);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        store.stations.forEach(s => {
            markers[s.id] = L.marker(s.coords).addTo(map);
        });
        
        updateMapMarkers();
    }
});

watch(() => store.stationData, updateMapMarkers, { deep: true });

// Invalidate map size when the tab becomes active
onMounted(() => {
    if (map) map.invalidateSize();
});
</script>