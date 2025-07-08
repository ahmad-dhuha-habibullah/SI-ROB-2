<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[2000]">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative">
            <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <h2 class="text-2xl font-bold mb-4 text-pertamina-blue">Riwayat & Prediksi Ketinggian Air: {{ station?.name }}</h2>
            <div class="h-96 relative">
                <div v-if="store.isLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg"><p>Memuat data grafik...</p></div>
                <canvas ref="historyChartCanvas"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAppStore } from '../../stores/appStore';
import Chart from 'chart.js/auto';

const props = defineProps({ stationId: Number });
const emit = defineEmits(['close']);
const store = useAppStore();
const historyChartCanvas = ref(null);
let historyChart;

const station = computed(() => store.stations.find(s => s.id === props.stationId));

const renderChart = () => { /* Chart rendering logic from renderHistoryChart */ };

watch(() => store.tidalData, renderChart, { deep: true });
onMounted(() => nextTick(renderChart));
</script>
