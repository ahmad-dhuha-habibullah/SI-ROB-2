<template>
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200">
        <img src="/si-rob-logo.png" alt="SI-ROB Logo" class="h-20 mx-auto mb-6">
        <h1 class="text-3xl font-bold text-pertamina-blue mb-4 text-center">Tentang SI-ROB</h1>
        <p class="text-lg text-gray-700 leading-relaxed text-center mb-8">
            <strong>SI-ROB (Sistem Integrasi Pemantauan Banjir Rob)</strong> adalah sebuah dashboard inovatif yang dirancang untuk memberikan pemantauan dan peringatan dini terhadap ancaman banjir rob secara real-time, terintegrasi dengan data cuaca dan pasang surut terkini.
        </p>
        
        <div class="grid md:grid-cols-2 gap-8 text-gray-600 mb-12">
            <div class="border-t-4 border-pertamina-blue pt-4">
                <h2 class="text-2xl font-bold text-pertamina-blue mb-3 flex items-center"><i data-lucide="list-checks" class="w-6 h-6 mr-2"></i>Fitur Utama</h2>
                <ul class="list-disc list-inside space-y-2">
                    <li>Pemantauan Real-Time pada Peta Interaktif</li>
                    <li>Integrasi Data Cuaca & Pasut dari Open-Meteo</li>
                    <li>Sistem Peringatan Dini 3 Tingkat (Aman, Waspada, Bahaya)</li>
                    <li>Analisis Data Historis & Prakiraan 5 Hari</li>
                    <li>Visualisasi Data Cuaca Multi-Grafik</li>
                    <li>Antarmuka Responsif dan Intuitif</li>
                </ul>
            </div>
            <div class="border-t-4 border-pertamina-green pt-4">
                <h2 class="text-2xl font-bold text-pertamina-green mb-3 flex items-center"><i data-lucide="database" class="w-6 h-6 mr-2"></i>Sumber Data</h2>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>Cuaca:</strong> Open-Meteo Weather Forecast API</li>
                    <li><strong>Pasang Surut:</strong> Open-Meteo Marine API</li>
                    <li><strong>Peta:</strong> OpenStreetMap & Leaflet.js</li>
                    <li><strong>Ikon:</strong> Lucide Icons</li>
                    <li><strong>Grafik:</strong> Chart.js</li>
                </ul>
            </div>
        </div>

        <div class="border-t-4 border-pertamina-red pt-4">
            <h2 class="text-2xl font-bold text-pertamina-red mb-6 flex items-center justify-center"><i data-lucide="users" class="w-6 h-6 mr-2"></i>Tim Pengembang</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="team-member-card">
                    <img src="/Ahmad Dhuha Habibullah.png" alt="Foto Ahmad Dhuha Habibullah" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                    <h3 class="font-bold text-lg text-center">Ahmad Dhuha Habibullah</h3>
                </div>
                <div class="team-member-card">
                    <img src="/Nabila Afifah Azuga.png" alt="Foto Nabila Afifah Azuga" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                    <h3 class="font-bold text-lg text-center">Nabila Afifah Azuga</h3>
                </div>
                <div class="team-member-card">
                    <img src="/Gandhi Napitupulu.png" alt="Foto Gandhi Napitupulu" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                    <h3 class="font-bold text-lg text-center">Gandhi Napitupulu</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No script logic needed for this static component
</script>
