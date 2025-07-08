<template>
    <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 class="text-2xl font-bold text-pertamina-blue mb-2">Prediksi Pasang Surut (Sea Level)</h1>
        <p class="text-gray-600 mb-6">Grafik ketinggian permukaan air laut (Mean Sea Level), termasuk data historis dan prakiraan untuk 2 hari kedepan.</p>
        <div class="mt-6 h-96 relative">
            <div v-if="store.isLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
                <p class="text-lg font-semibold text-gray-500">Memuat data grafik...</p>
            </div>
            <canvas ref="tidalChartCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useAppStore } from '../stores/appStore';
import Chart from 'chart.js/auto';

const store = useAppStore();
const tidalChartCanvas = ref(null);
let tidalChart;

const renderChart = () => {
    if (!store.tidalData?.minutely_15 || !tidalChartCanvas.value) return;
    if (tidalChart) tidalChart.destroy();

    const { time, sea_level_height_msl } = store.tidalData.minutely_15;
    const labels = time.map(t => new Date(t));
    
    tidalChart = new Chart(tidalChartCanvas.value, {
        type: 'line',
        // ... Chart config from renderTidalChart in original script.js ...
        data: {
            labels: labels,
            datasets: [{
                label: 'Ketinggian Permukaan Laut (m)', 
                data: sea_level_height_msl,
                borderColor: 'var(--pertamina-blue)', backgroundColor: 'rgba(60, 109, 178, 0.2)',
                fill: true, tension: 0.2, pointRadius: 0
            }]
        },
        options: {
             responsive: true, maintainAspectRatio: false,
             // ... other options
        }
    });
};

watch(() => store.tidalData, renderChart, { deep: true });
onMounted(() => {
    nextTick(() => {
        renderChart();
    });
});
</script>