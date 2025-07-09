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
      { nama: "Replaceability", pertanyaan: "Seberapa mudah aplikasi digantikan dengan apk lain?" }
    ]
  }
];

let jawaban = [];
let currentIndex = 0;
let currentSub = 0;
let namaAplikasi = '';
let lastSkor = null;

const app = document.getElementById('app');
const STORAGE_KEY = 'penilaian_iso25010';

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    jawaban,
    currentIndex,
    currentSub,
    namaAplikasi
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
      typeof parsed.currentSub === 'number' &&
      typeof parsed.namaAplikasi === 'string'
    ) {
      jawaban = parsed.jawaban;
      currentIndex = parsed.currentIndex;
      currentSub = parsed.currentSub;
      namaAplikasi = parsed.namaAplikasi;
      return true;
    }
  } catch (e) {}
  return false;
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function renderInputNamaAplikasi() {
  app.innerHTML = `
    <div class="question-box">
      <div style="font-size:1.08em;color:#2563eb;font-weight:600;">Masukkan Nama Aplikasi yang Akan Dinilai:</div>
    </div>
    <div class="penilaian-box">
      <input id="namaAplikasiInput" type="text" class="input-nama-aplikasi" placeholder="Contoh: MyIstri" />
      <div id="error" class="error"></div>
      <button id="mulaiBtn">Mulai Penilaian</button>
    </div>
  `;
  document.getElementById('mulaiBtn').onclick = () => {
    const input = document.getElementById('namaAplikasiInput').value.trim();
    const errorDiv = document.getElementById('error');
    if (input.length < 2) {
      errorDiv.textContent = 'Nama aplikasi harus diisi minimal 2 karakter.';
      return;
    }
    namaAplikasi = input;
    renderQuestion();
  };
}

function renderQuestion(withSlide) {
  const kar = karakteristik[currentIndex];
  const sub = kar.sub[currentSub];
  let pertanyaan = sub.pertanyaan;
  pertanyaan = pertanyaan.replace(/aplikasi(?!\s*([A-Za-z0-9_\-\(\[]*${namaAplikasi}[A-Za-z0-9_\-\)\]]*))/gi, match => `${match} <span class='nama-aplikasi-green'>${namaAplikasi}</span>`);
  const html = `
    <div class="question-box">
      <div style="font-size:1.05em;color:#2563eb;font-weight:600;">${pertanyaan}</div>
    </div>
    <div class="penilaian-box">
      <label>Nilai untuk <b>${kar.nama}</b> &gt; <b>${sub.nama}</b>:</label><br>
      <select id="skor">
        <option value="">Pilih nilai</option>
        <option value="5">Sangat Baik</option>
        <option value="4">Baik</option>
        <option value="3">Cukup</option>
        <option value="2">Kurang</option>
        <option value="1">Sangat Kurang</option>
      </select>
      <div id="error" class="error"></div>
      <button id="nextBtn">Berikutnya</button>
    </div>
  `;
  if (withSlide) {
    const appDiv = document.getElementById('app');
    appDiv.classList.remove('slide-in-right');
    appDiv.classList.add('slide-in-right');
    setTimeout(() => {
      appDiv.classList.remove('slide-in-right');
    }, 400);
  }
  app.innerHTML = html;
  document.getElementById('nextBtn').onclick = nextHandler;
}

function labelSkor(skor) {
  switch (parseInt(skor)) {
    case 5: return 'Sangat Baik';
    case 4: return 'Baik';
    case 3: return 'Cukup';
    case 2: return 'Kurang';
    case 1: return 'Sangat Kurang';
    default: return skor;
  }
}

function renderAlasan(skor) {
  const kar = karakteristik[currentIndex];
  const sub = kar.sub[currentSub];
  app.innerHTML = `
    <div class="question-box">
      <div style="font-size:1.05em;color:#2563eb;font-weight:600;">✏️ Alasan memberi nilai <b>${labelSkor(skor)}</b> pada <b>${sub.nama}</b>:</div>
    </div>
    <div class="penilaian-box">
      <textarea id="alasanInput" rows="3" placeholder="Tulis alasan Anda di sini..." style="font-size:1.05em;width:100%;padding:10px;border-radius:8px;border:1.5px solid #b6b6b6;"></textarea>
      <div id="error" class="error"></div>
      <button id="alasanBtn">Lanjutkan</button>
    </div>
  `;
  document.getElementById('alasanBtn').onclick = () => {
    const alasan = document.getElementById('alasanInput').value.trim();
    const errorDiv = document.getElementById('error');
    if (alasan.length < 2) {
      errorDiv.textContent = 'Alasan harus diisi minimal 2 karakter.';
      return;
    }
    // Simpan skor dan alasan
    const kar = karakteristik[currentIndex];
    const sub = kar.sub[currentSub];
    jawaban.push({ karakteristik: kar.nama, subkarakteristik: sub.nama, skor: lastSkor, alasan });
    currentSub++;
    if (currentSub >= kar.sub.length) {
      currentSub = 0;
      currentIndex++;
    }
    if (currentIndex < karakteristik.length) {
      saveProgress();
      // SLIDE OUT, THEN RENDER NEXT WITH SLIDE IN
      const appDiv = document.getElementById('app');
      appDiv.classList.add('slide-out-left');
      appDiv.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'transform') {
          appDiv.removeEventListener('transitionend', handler);
          appDiv.classList.remove('slide-out-left');
          renderQuestion(true);
        }
      });
    } else {
      renderResult();
    }
  };
}

function nextHandler() {
  const skor = parseInt(document.getElementById('skor').value);
  const errorDiv = document.getElementById('error');
  if (skor >= 1 && skor <= 5) {
    lastSkor = skor;
    renderAlasan(skor);
  } else {
    errorDiv.textContent = "❌ Masukkan angka antara 1 sampai 5!";
  }
}

function renderResult() {
  let totalSkor = 0;
  let totalSkorMaksimal = 0;
  let resultHTML = `<div class="result">
    <div style="font-size:1.13em;font-weight:600;color:#2563eb;margin-bottom:8px;">Hasil Evaluasi: <span style="color:#2d3a4a">${namaAplikasi}</span></div>
    <b>📊 Rekap Penilaian:</b><br><ul>`;

  karakteristik.forEach(kar => {
    const subJawaban = jawaban.filter(j => j.karakteristik === kar.nama);
    const subSkor = subJawaban.map(j => j.skor);

    const totalSkorSub = subSkor.reduce((a, b) => a + b, 0);
    const skorMaksKar = 5 * kar.sub.length;
    const persentaseKar = (totalSkorSub / skorMaksKar) * 100;
    const nilaiBobot = persentaseKar * kar.bobot;

    totalSkor += nilaiBobot;
    totalSkorMaksimal += 100 * kar.bobot;

    resultHTML += `<li><b>${kar.nama}</b> (${(kar.bobot * 100).toFixed(0)}%): ${persentaseKar.toFixed(2)}% × Bobot = ${nilaiBobot.toFixed(2)}<ul style='margin-top:4px;'>`;

    subJawaban.forEach(j => {
      const subPersen = (j.skor / 5) * 100;
      resultHTML += `<li style='margin-bottom:2px;'>${j.subkarakteristik}: <b>${j.skor}</b> (${subPersen.toFixed(0)}%)<br><span style='color:#64748b;font-size:0.97em;'>Alasan: ${j.alasan}</span></li>`;
    });

    resultHTML += `</ul></li>`;
  });

  resultHTML += '</ul>';

  const persentase = (totalSkor / totalSkorMaksimal) * 100;

  resultHTML += `<br><b>🧮 Skor Akhir:</b> ${totalSkor.toFixed(2)} dari ${totalSkorMaksimal.toFixed(2)}<br>`;
  resultHTML += `<b>🎯 Persentase Kualitas:</b> ${persentase.toFixed(2)}%<br>`;

  let kategori = "";
  if (persentase >= 81) kategori = "SANGAT BAIK ✅";
  else if (persentase >= 61) kategori = "BAIK 👍";
  else if (persentase >= 41) kategori = "CUKUP ⚠️";
  else if (persentase >= 21) kategori = "KURANG ❌";
  else kategori = "SANGAT KURANG ❌❌";

  resultHTML += `<div class="kategori">🧠 Kategori: ${kategori}</div>`;
  resultHTML += `</div>`;

  // Render result + tombol ulang
  app.innerHTML = resultHTML + `\n<div style='text-align:center;margin-top:18px;'><button id="ulangBtn" style="background:linear-gradient(90deg,#22c55e,#38bdf8);color:#fff;font-weight:600;padding:12px 24px;border:none;border-radius:8px;box-shadow:0 2px 8px #38bdf822;cursor:pointer;font-size:1em;">Ingin nilai aplikasi lain?</button></div>`;

  // Simpan hasil terakhir ke localStorage
  localStorage.setItem('hasil_terakhir_iso25010', JSON.stringify({ jawaban, namaAplikasi }));
  clearProgress();

  document.getElementById('ulangBtn').onclick = () => {
    localStorage.removeItem('hasil_terakhir_iso25010');
    jawaban = [];
    currentIndex = 0;
    currentSub = 0;
    namaAplikasi = '';
    renderInputNamaAplikasi();
  };
}

// Saat load, jika ada hasil terakhir, tampilkan hasil
(function init() {
  const hasilTerakhir = localStorage.getItem('hasil_terakhir_iso25010');
  if (hasilTerakhir) {
    const parsed = JSON.parse(hasilTerakhir);
    if (parsed && Array.isArray(parsed.jawaban) && typeof parsed.namaAplikasi === 'string') {
      jawaban = parsed.jawaban;
      namaAplikasi = parsed.namaAplikasi;
      renderResult();
      return;
    }
  }
  if (loadProgress()) {
    if (window.confirm('Lanjutkan penilaian yang belum selesai?')) {
      if (!namaAplikasi) {
        renderInputNamaAplikasi();
      } else {
        renderQuestion();
      }
      return;
    } else {
      clearProgress();
    }
  }
  jawaban = [];
  currentIndex = 0;
  currentSub = 0;
  namaAplikasi = '';
  renderInputNamaAplikasi();
})(); 