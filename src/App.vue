<template>
  <Header @navigate="store.setActiveTab" />
  
  <main class="flex-grow p-4 overflow-auto">
    <KeepAlive>
      <component :is="activeComponent" />
    </KeepAlive>
  </main>
</template>

<script setup>
import { onMounted, onUpdated, computed } from 'vue';
import { useAppStore } from './stores/appStore';
import Header from './components/Header.vue';
import Beranda from './components/Beranda.vue';
import Cuaca from './components/Cuaca.vue';
import Pasut from './components/Pasut.vue';
import TentangKami from './components/TentangKami.vue';

const store = useAppStore();

const componentMap = {
  beranda: Beranda,
  cuaca: Cuaca,
  pasut: Pasut,
  'tentang-kami': TentangKami
};

const activeComponent = computed(() => componentMap[store.activeTab]);

onMounted(() => {
  store.initializeApp();
  setInterval(() => store.processAllData(), 300000); // Update data every 5 mins
});

onUpdated(() => {
  // This is a crucial step to make sure the Lucide icons render after Vue updates the DOM
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
</script>