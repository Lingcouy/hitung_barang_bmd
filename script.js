// Fungsi untuk memformat angka dengan tanda titik ribuan
function formatRupiah(nilai) {
    return nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk menghapus titik agar bisa dikonversi kembali menjadi angka
function hapusFormat(nilai) {
    return nilai.replace(/\./g, "");
}

// Fungsi untuk menangani input angka dengan format ribuan
function formatInputRupiah(element) {
    let nilaiTanpaTitik = hapusFormat(element.value); // Hapus format dari nilai input
    element.value = formatRupiah(nilaiTanpaTitik); // Format ulang dengan titik ribuan
    element.selectionStart = element.selectionEnd = element.value.length; // Posisikan kursor di akhir input
}

// Menambahkan event listener untuk menghitung harga kotor saat volume atau harga satuan berubah
document.getElementById("volume").addEventListener("input", function () {
    this.value = formatRupiah(hapusFormat(this.value)); // Memformat input volume dengan titik ribuan
    hitungHargaKotor();
});
document.getElementById("hargaSatuan").addEventListener("input", function () {
    formatInputRupiah(this); // Memformat input harga satuan dengan titik ribuan
    hitungHargaKotor();
});

// Menambahkan event listener untuk menghitung harga bersih saat PPN atau PPh berubah
document.getElementById("ppn").addEventListener("input", function () {
    formatInputRupiah(this); // Memformat input PPN dengan titik ribuan
    hitungHargaBersih();
});

document.getElementById("pph").addEventListener("input", function () {
    formatInputRupiah(this); // Memformat input PPh dengan titik ribuan
    hitungHargaBersih();
});

// Fungsi untuk menghitung harga kotor
function hitungHargaKotor() {
    const volume = parseFloat(hapusFormat(document.getElementById("volume").value)) || 0; // Menghapus format lalu mengonversi volume ke angka
    const hargaSatuan = parseFloat(hapusFormat(document.getElementById("hargaSatuan").value)) || 0; // Menghapus format lalu mengonversi harga satuan ke angka
    const hargaKotor = volume * hargaSatuan; // Menghitung harga kotor sebagai hasil perkalian volume dan harga satuan
    document.getElementById("hargaKotor").value = formatRupiah(hargaKotor.toFixed(0)); // Menampilkan harga kotor dengan format ribuan tanpa desimal
    hitungHargaBersih(); // Memanggil fungsi untuk menghitung harga bersih
}

// Fungsi untuk menghitung harga bersih
function hitungHargaBersih() {
    const hargaKotor = parseFloat(hapusFormat(document.getElementById("hargaKotor").value)) || 0; // Menghapus format lalu mengonversi harga kotor ke angka
    const ppn = parseFloat(hapusFormat(document.getElementById("ppn").value)) || 0; // Menghapus format lalu mengonversi PPN ke angka
    const pph = parseFloat(hapusFormat(document.getElementById("pph").value)) || 0; // Menghapus format lalu mengonversi PPh ke angka
    const hargaBersih = hargaKotor + ppn + pph; // Menghitung harga bersih dengan menambahkan PPN dan PPh ke harga kotor
    document.getElementById("hargaBersih").value = formatRupiah(hargaBersih.toFixed(0)); // Menampilkan harga bersih dengan format ribuan tanpa desimal
}

// Fungsi untuk menghitung harga satuan yang disesuaikan
function hitungHargaSatuanDisesuaikan() {
    const volume = parseFloat(hapusFormat(document.getElementById("volume").value)); // Menghapus format lalu mengonversi volume ke angka
    const hargaBersih = parseFloat(hapusFormat(document.getElementById("hargaBersih").value)); // Menghapus format lalu mengonversi harga bersih ke angka

    if (volume && hargaBersih) { // Memeriksa apakah volume dan harga bersih ada
        let hargaSatuanDisesuaikan = hargaBersih / volume; // Membagi harga bersih dengan volume untuk mendapatkan harga satuan awal
        hargaSatuanDisesuaikan = Math.floor(hargaSatuanDisesuaikan / 1000) * 1000; // Membulatkan harga satuan ke ribuan terdekat

        const volumeDisesuaikan = volume - 1; // Mengurangi volume dengan 1 untuk perhitungan ulang
        const totalHargaDisesuaikan = hargaSatuanDisesuaikan * volumeDisesuaikan; // Menghitung total harga untuk input pertama

        const sisaHarga = hargaBersih - totalHargaDisesuaikan; // Menghitung sisa harga untuk input kedua

        // Menampilkan hasil perhitungan harga satuan yang disesuaikan
        document.getElementById("hasil").innerHTML = `
            <p>Input 1: Volume = ${volumeDisesuaikan}, Harga Satuan = Rp ${formatRupiah(hargaSatuanDisesuaikan.toFixed(0))}</p>
            <p>Input 2: Volume = 1, Harga Satuan = Rp ${formatRupiah(sisaHarga.toFixed(0))}</p>
        `;
    } else {
        alert("Mohon isi volume dan harga bersih."); // Menampilkan pesan jika volume atau harga bersih belum diisi
    }
}
