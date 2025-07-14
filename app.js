// Struktur: karakteristik utama + subkarakteristik (dengan pertanyaan khusus)
const karakteristik = [
  {
    nama: "Functionality",
    sub: [
      { nama: "Suitability", pertanyaan: "Apakah aplikasi sesuai dengan kebutuhan pengguna?" },
      { nama: "Accuracy", pertanyaan: "Seberapa akurat aplikasi dalam menjalankan fungsinya?" },
      { nama: "Interoperability", pertanyaan: "Apakah aplikasi dapat berinteraksi dengan sistem lain?" },
      { nama: "Security", pertanyaan: "Seberapa baik aplikasi melindungi data dan mencegah akses tidak sah?" }
    ]
  },
  {
    nama: "Reliability",
    sub: [
      { nama: "Maturity", pertanyaan: "Seberapa stabil aplikasi dalam penggunaan sehari-hari?" },
      { nama: "Availability", pertanyaan: "Seberapa sering aplikasi dapat diakses tanpa gangguan?" },
      { nama: "Fault tolerance", pertanyaan: "Seberapa baik aplikasi menangani kesalahan atau kegagalan?" }
    ]
  },
  {
    nama: "Usability",
    sub: [
      { nama: "Learnability", pertanyaan: "Seberapa mudah pengguna mempelajari aplikasi?" },
      { nama: "Operability", pertanyaan: "Seberapa mudah aplikasi dioperasikan oleh pengguna?" },
      { nama: "User error protection", pertanyaan: "Apakah aplikasi membantu mencegah/memperbaiki kesalahan pengguna?" },
      { nama: "Accessibility", pertanyaan: "Apakah aplikasi dapat diakses oleh semua kalangan pengguna?" }
    ]
  },
  {
    nama: "Efficiency",
    sub: [
      { nama: "Time behavior", pertanyaan: "Seberapa cepat aplikasi merespon perintah pengguna?" },
      { nama: "Resource utilization", pertanyaan: "Seberapa efisien aplikasi menggunakan sumber daya (memori, CPU, dll)?" }
    ]
  },
  {
    nama: "Maintainability",
    sub: [
      { nama: "Modularity", pertanyaan: "Apakah aplikasi memiliki bagian-bagian yang terpisah dengan jelas?" },
      { nama: "Reusability", pertanyaan: "Apakah bagian aplikasi dapat digunakan kembali untuk kebutuhan lain?" },
      { nama: "Analysability", pertanyaan: "Seberapa mudah aplikasi dianalisis untuk menemukan masalah?" },
      { nama: "Modifiability", pertanyaan: "Seberapa mudah aplikasi diubah atau dikembangkan lebih lanjut?" }
    ]
  },
  {
    nama: "Portability",
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
  pertanyaan = pertanyaan.replace(/aplikasi/gi, match => `${match} <span class='nama-aplikasi-green'>${namaAplikasi}</span>`);
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

function nextHandler() {
  const skor = parseInt(document.getElementById('skor').value);
  const errorDiv = document.getElementById('error');
  if (skor >= 1 && skor <= 5) {
    const kar = karakteristik[currentIndex];
    const sub = kar.sub[currentSub];
    jawaban.push({ karakteristik: kar.nama, subkarakteristik: sub.nama, skor });
    currentSub++;
    if (currentSub >= kar.sub.length) {
      currentSub = 0;
      currentIndex++;
    }
    if (currentIndex < karakteristik.length) {
      saveProgress();
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
  } else {
    errorDiv.textContent = "❌ Pilih salah satu nilai!";
  }
}

/** ... kode awal tetap ... */

function renderResult() {
  let totalSkor = 0;
  const totalSkorMaks = 105;
  let resultHTML = `<div class="result" id="hasil-evaluasi">
    <div style="font-size:1.13em;font-weight:600;color:#2563eb;margin-bottom:8px;">Hasil Evaluasi: <span style="color:#2d3a4a">${namaAplikasi}</span></div>
    <b>📊 Rekap Penilaian:</b><br><ul>`;

  karakteristik.forEach(kar => {
    const subJawaban = jawaban.filter(j => j.karakteristik === kar.nama);
    resultHTML += `<li><b>${kar.nama}</b><ul style='margin-top:4px;'>`;
    subJawaban.forEach(j => {
      totalSkor += j.skor;
      resultHTML += `<li style='margin-bottom:2px;'>${j.subkarakteristik}: <b>${labelSkor(j.skor)}</b></li>`;
    });
    resultHTML += `</ul></li>`;
  });

  resultHTML += `</ul>`;

  const persentase = (totalSkor / totalSkorMaks) * 100;
  resultHTML += `<br><b>🧶 Skor Akhir:</b> ${totalSkor} dari ${totalSkorMaks}<br>`;
  resultHTML += `<b>🎯 Persentase Kualitas:</b> ${persentase.toFixed(2)}%<br>`;

  let kategori = "";
  if (totalSkor <= 41) kategori = "❌ Broken (Aplikasi Rusak/Tidak Layak)";
  else if (totalSkor <= 62) kategori = "⚠️ Kurang Optimal (Banyak Kekurangan)";
  else if (totalSkor <= 77) kategori = "⚠️ Biasa Saja (Layak digunakan, Tapi Kurang Memuaskan)";
  else if (totalSkor <= 92) kategori = "👍 Bagus (Sebagian Besar Sudah Baik)";
  else kategori = "✅ Super Bagus (Sangat Layak dan Direkomendasikan)";

  resultHTML += `<div class="kategori">🧠 Kategori: ${kategori}</div>`;
  resultHTML += `</div>`;

  app.innerHTML = resultHTML + `
<div style='text-align:center;margin-top:18px;'>
  <button id="cetakPDFBtn" class="no-print" style="background:linear-gradient(90deg,#f59e42,#f43f5e);color:#fff;font-weight:600;padding:12px 24px;border:none;border-radius:8px;box-shadow:0 2px 8px #f59e4288;cursor:pointer;font-size:1em;margin-right:10px;">Cetak PDF</button>
  <button id="ulangBtn" class="no-print" style="background:linear-gradient(90deg,#22c55e,#38bdf8);color:#fff;font-weight:600;padding:12px 24px;border:none;border-radius:8px;box-shadow:0 2px 8px #38bdf822;cursor:pointer;font-size:1em;">Nilai aplikasi lain?</button>
</div>`;

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

  document.getElementById('cetakPDFBtn').onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const marginLeft = 15;
    let y = 15;
    const lineHeight = 8;
  
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Laporan Evaluasi Aplikasi`, marginLeft, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Nama Aplikasi: ${namaAplikasi}`, marginLeft, y);
    y += lineHeight + 2;
  
    // Header tabel
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("No", marginLeft, y);
    doc.text("Karakteristik", marginLeft + 10, y);
    doc.text("Subkarakteristik", marginLeft + 50, y);
    doc.text("Pertanyaan", marginLeft + 100, y);
    doc.text("Skor", marginLeft + 185, y);
    y += 5;
    doc.setLineWidth(0.2);
    doc.line(marginLeft, y, 200, y);
    y += 3;
  
    let no = 1;
    totalSkor = 0;
  
    karakteristik.forEach(kar => {
      kar.sub.forEach(sub => {
        const jawabanItem = jawaban.find(j => j.karakteristik === kar.nama && j.subkarakteristik === sub.nama);
        const skor = jawabanItem ? jawabanItem.skor : '-';
        totalSkor += jawabanItem ? jawabanItem.skor : 0;
  
        // Wrap teks untuk subkarakteristik dan pertanyaan
        const subkarWrapped = doc.splitTextToSize(sub.nama, 45);
        const pertanyaanWrapped = doc.splitTextToSize(sub.pertanyaan, 80);
        const rowHeight = Math.max(subkarWrapped.length, pertanyaanWrapped.length) * 6;
  
        if (y + rowHeight > 270) {
          doc.addPage();
          y = 15;
        }
  
        doc.setFont('helvetica', 'normal');
        doc.text(String(no++), marginLeft, y);
        doc.text(doc.splitTextToSize(kar.nama, 35), marginLeft + 10, y);
        doc.text(subkarWrapped, marginLeft + 50, y);
        doc.text(pertanyaanWrapped, marginLeft + 100, y);
        doc.text(String(skor), marginLeft + 185, y);
        y += rowHeight;
      });
    });
  
    // Total skor dan kategori
    const persentase = (totalSkor / totalSkorMaks) * 100;
    if (y > 250) {
      doc.addPage();
      y = 15;
    }
  
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Skor: ${totalSkor} / ${totalSkorMaks}`, marginLeft, y);
    y += lineHeight;
    doc.text(`Persentase: ${persentase.toFixed(2)}%`, marginLeft, y);
    y += lineHeight;
  
    let kategori = "";
    if (totalSkor <= 41) kategori = "Broken (Tidak Layak)";
    else if (totalSkor <= 62) kategori = "Kurang Optimal";
    else if (totalSkor <= 77) kategori = "Biasa Saja";
    else if (totalSkor <= 92) kategori = "Bagus";
    else kategori = "Super Bagus";
  
    doc.text(`Kategori: ${kategori}`, marginLeft, y);
    doc.save(`Hasil-Evaluasi-${namaAplikasi}.pdf`);
  };
}  

// Tambahkan CSS agar tombol tidak ikut tercetak
if (!document.getElementById('print-style')) {
  const style = document.createElement('style');
  style.id = 'print-style';
  style.innerHTML = `
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; }
    }
  `;
  document.head.appendChild(style);
}

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