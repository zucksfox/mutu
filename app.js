// Struktur: karakteristik utama + subkarakteristik (dengan pertanyaan khusus)
const karakteristik = [
  {
    nama: "Functionality",
    bobot: 0.20,
    sub: [
      { nama: "Suitability", pertanyaan: "Apakah aplikasi sesuai dengan kebutuhan pengguna?" },
      { nama: "Accuracy", pertanyaan: "Seberapa akurat aplikasi dalam menjalankan fungsinya?" },
      { nama: "Interoperability", pertanyaan: "Apakah aplikasi dapat berinteraksi dengan sistem lain?" },
      { nama: "Security", pertanyaan: "Seberapa baik aplikasi melindungi data dan mencegah akses tidak sah?" }
    ]
  },
  {
    nama: "Reliability",
    bobot: 0.20,
    sub: [
      { nama: "Maturity", pertanyaan: "Seberapa stabil aplikasi dalam penggunaan sehari-hari?" },
      { nama: "Availability", pertanyaan: "Seberapa sering aplikasi dapat diakses tanpa gangguan?" },
      { nama: "Fault tolerance", pertanyaan: "Seberapa baik aplikasi menangani kesalahan atau kegagalan?" }
    ]
  },
  {
    nama: "Usability",
    bobot: 0.20,
    sub: [
      { nama: "Learnability", pertanyaan: "Seberapa mudah pengguna mempelajari aplikasi?" },
      { nama: "Operability", pertanyaan: "Seberapa mudah aplikasi dioperasikan oleh pengguna?" },
      { nama: "User error protection", pertanyaan: "Apakah aplikasi membantu mencegah/memperbaiki kesalahan pengguna?" },
      { nama: "Accessibility", pertanyaan: "Apakah aplikasi dapat diakses oleh semua kalangan pengguna?" }
    ]
  },
  {
    nama: "Efficiency",
    bobot: 0.10,
    sub: [
      { nama: "Time behavior", pertanyaan: "Seberapa cepat aplikasi merespon perintah pengguna?" },
      { nama: "Resource utilization", pertanyaan: "Seberapa efisien aplikasi menggunakan sumber daya (memori, CPU, dll)?" }
    ]
  },
  {
    nama: "Maintainability",
    bobot: 0.15,
    sub: [
      { nama: "Modularity", pertanyaan: "Apakah aplikasi memiliki bagian-bagian yang terpisah dengan jelas?" },
      { nama: "Reusability", pertanyaan: "Apakah bagian aplikasi dapat digunakan kembali untuk kebutuhan lain?" },
      { nama: "Analysability", pertanyaan: "Seberapa mudah aplikasi dianalisis untuk menemukan masalah?" },
      { nama: "Modifiability", pertanyaan: "Seberapa mudah aplikasi diubah atau dikembangkan lebih lanjut?" }
    ]
  },
  {
    nama: "Portability",
    bobot: 0.15,
    sub: [
      { nama: "Adaptability", pertanyaan: "Seberapa mudah aplikasi dijalankan di lingkungan/platform berbeda?" },
      { nama: "Installability", pertanyaan: "Seberapa mudah aplikasi diinstal pada perangkat baru?" },
      { nama: "Replaceability", pertanyaan: "Seberapa mudah aplikasi digantikan dengan aplikasi lain?" }
    ]
  }
];

const STORAGE_KEY = 'penilaian_iso25010';

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    jawaban,
    currentIndex,
    currentSub
  }));
}

function loadProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return false;
  try {
    const parsed = JSON.parse(data);
    if (
      Array.isArray(parsed.jawaban) &&
      typeof parsed.currentIndex === 'number' &&
      typeof parsed.currentSub === 'number'
    ) {
      jawaban = parsed.jawaban;
      currentIndex = parsed.currentIndex;
      currentSub = parsed.currentSub;
      return true;
    }
  } catch (e) {}
  return false;
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

let jawaban = [];
let currentIndex = 0;
let currentSub = 0;

const app = document.getElementById('app');

function renderQuestion() {
  const kar = karakteristik[currentIndex];
  const sub = kar.sub[currentSub];
  app.innerHTML = `
    <div class="question-box">
      <div style="font-size:1.05em;color:#2563eb;font-weight:600;">${sub.pertanyaan}</div>
    </div>
    <div class="penilaian-box">
      <label>Nilai untuk <b>${kar.nama}</b> &gt; <b>${sub.nama}</b> (1-5):</label><br>
      <select id="skor">
        <option value="">Pilih nilai</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <div id="error" class="error"></div>
      <button id="nextBtn">Berikutnya</button>
    </div>
  `;
  document.getElementById('nextBtn').onclick = nextHandler;
}

function nextHandler() {
  const skor = parseInt(document.getElementById('skor').value);
  const errorDiv = document.getElementById('error');
  if (skor >= 1 && skor <= 5) {
    const kar = karakteristik[currentIndex];
    const sub = kar.sub[currentSub];
    jawaban.push({ karakteristik: kar.nama, subkarakteristik: sub.nama, skor: skor });
    currentSub++;
    if (currentSub >= kar.sub.length) {
      currentSub = 0;
      currentIndex++;
    }
    if (currentIndex < karakteristik.length) {
      saveProgress();
      renderQuestion();
    } else {
      renderResult();
    }
  } else {
    errorDiv.textContent = "❌ Masukkan angka antara 1 sampai 5!";
  }
}

function renderResult() {
  let totalSkor = 0;
  let resultHTML = '<div class="result"><b>📊 Hasil Evaluasi:</b><br><ul>';
  karakteristik.forEach(kar => {
    const subSkor = jawaban.filter(j => j.karakteristik === kar.nama).map(j => j.skor);
    const rata = subSkor.reduce((a, b) => a + b, 0) / subSkor.length;
    const nilaiBobot = rata * kar.bobot;
    totalSkor += nilaiBobot;
    resultHTML += `<li>${kar.nama} (${(kar.bobot * 100).toFixed(0)}%): Rata-rata ${rata.toFixed(2)} x Bobot = ${nilaiBobot.toFixed(2)}</li>`;
  });
  resultHTML += '</ul>';
  resultHTML += `<br><b>🧮 Skor Akhir:</b> ${totalSkor.toFixed(2)} dari 5.00<br>`;
  let kategori = "";
  if (totalSkor >= 4.0) kategori = "BAIK ✅";
  else if (totalSkor >= 3.0) kategori = "CUKUP ⚠️";
  else kategori = "BURUK ❌";
  resultHTML += `<div class="kategori">🧠 Kategori: ${kategori}</div></div>`;
  app.innerHTML = resultHTML;
  clearProgress();
}

// Start the app
(function init() {
  if (loadProgress()) {
    if (window.confirm('Lanjutkan penilaian yang belum selesai!')) {
      renderQuestion();
      return;
    } else {
      clearProgress();
    }
  }
  jawaban = [];
  currentIndex = 0;
  currentSub = 0;
  renderQuestion();
})(); 