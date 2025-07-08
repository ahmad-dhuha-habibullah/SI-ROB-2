<template>
    <header class="header shadow-md sticky top-0 z-50 bg-white">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-2">
                <div class="flex items-center space-x-4">
                    <a href="#">
                        <img src="/si-rob-logo.png" alt="SI-ROB Logo" class="h-12">
                    </a>
                </div>
                <div class="hidden lg:flex items-center space-x-6">
                    <nav id="desktop-navigation-menu" class="flex items-center">
                        <a v-for="tab in tabs" :key="tab.id" href="#" class="nav-tab" 
                           :class="{ 'active': store.activeTab === tab.id }" 
                           @click.prevent="navigate(tab.id)">
                           {{ tab.name }}
                        </a>
                    </nav>
                    <div class="flex items-center space-x-2 text-sm text-gray-700 font-medium pl-4 border-l border-gray-200">
                        <i data-lucide="calendar" class="w-5 h-5 text-pertamina-blue"></i>
                        <span>{{ currentDateTime }}</span>
                    </div>
                </div>
                <div class="lg:hidden flex items-center">
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>
        </div>
        <nav v-show="mobileMenuOpen" class="lg:hidden flex-col border-t border-gray-200 bg-white">
            <a v-for="tab in tabs" :key="tab.id" href="#" class="nav-tab" 
               :class="{ 'active': store.activeTab === tab.id }" 
               @click.prevent="navigate(tab.id, true)">
               {{ tab.name }}
            </a>
            <div class="flex items-center space-x-2 text-sm text-gray-700 font-medium p-4 border-t">
                <i data-lucide="calendar" class="w-5 h-5 text-pertamina-blue"></i>
                <span>{{ currentDateTime }}</span>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAppStore } from '../stores/appStore';

const store = useAppStore();
const emit = defineEmits(['navigate']);

const tabs = ref([
    { id: 'beranda', name: 'Beranda' },
    { id: 'cuaca', name: 'Info Cuaca' },
    { id: 'pasut', name: 'Prediksi Pasang Surut' },
    { id: 'tentang-kami', name: 'Tentang Kami' }
]);
const mobileMenuOpen = ref(false);
const currentDateTime = ref('Memuat...');
let clockInterval = null;

const updateClock = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };
    currentDateTime.value = now.toLocaleDateString('id-ID', options) + ' WIB';
};

const navigate = (tabId, isMobile = false) => {
    emit('navigate', tabId);
    if (isMobile) {
        mobileMenuOpen.value = false;
    }
};

onMounted(() => {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
    clearInterval(clockInterval);
});
</script>