<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[2000]">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-2 relative">
            <button @click="$emit('close')" class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 z-20">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <h2 class="text-lg font-bold text-white bg-black bg-opacity-70 absolute top-2 left-2 p-2 rounded-md">CCTV: {{ station?.name }}</h2>
            <div class="relative">
                <img src="https://placehold.co/1280x720/607d8b/ffffff?text=Simulasi+Feed+CCTV" class="rounded-md w-full">
                <div class="absolute bottom-0 left-0 w-full bg-blue-500 bg-opacity-50 transition-all duration-500" :style="{ height: `${waterLevelPercent}%` }"></div>
                <div class="absolute bottom-4 right-28 text-white font-bold text-xl p-2 bg-black bg-opacity-50 rounded">{{ stationData?.waterLevel.toFixed(2) }} m</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../../stores/appStore';

const props = defineProps({ stationId: Number });
const emit = defineEmits(['close']);
const store = useAppStore();

const station = computed(() => store.stations.find(s => s.id === props.stationId));
const stationData = computed(() => store.stationData.find(s => s.id === props.stationId));

const waterLevelPercent = computed(() => {
    if (!stationData.value) return 0;
    const maxLevel = 2.5;
    return Math.min(100, (stationData.value.waterLevel / maxLevel) * 100);
});
</script>