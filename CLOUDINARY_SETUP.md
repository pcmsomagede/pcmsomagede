# Cloudinary — PC Muhammadiyah Somagede

Cloudinary menjadi penyimpanan file media. GitHub tetap menjadi sumber kode dan metadata konten.

## 1. Buat struktur folder

Gunakan folder berikut di Media Library:

- `pcmsomagede/berita`
- `pcmsomagede/kegiatan`
- `pcmsomagede/agenda`
- `pcmsomagede/organisasi`
- `pcmsomagede/pimpinan`
- `pcmsomagede/galeri`
- `pcmsomagede/poster`
- `pcmsomagede/dokumen`

Cloudinary mendukung folder bertingkat untuk pengelompokan aset. Pada dynamic folder mode, folder Media Library terpisah dari public ID, sehingga struktur folder dapat dikelola tanpa menjadikan folder sebagai bagian wajib URL delivery. Tetap hindari memindahkan atau mengganti nama public ID aset yang sudah dipakai di website. 

## 2. Buat upload preset

Buat preset bernama misalnya:

`pcmsomagede_web_upload`

Untuk tahap awal widget dapat menggunakan **unsigned preset**, tetapi preset harus dibatasi dengan ketat. Cloudinary merekomendasikan pembatasan format file, ukuran maksimum, dan pengaturan penyimpanan pada preset unsigned karena nama preset terlihat di kode browser.

Rekomendasi awal:

- allowed formats: `jpg,jpeg,png,webp,pdf`
- max file size: `10 MB`
- jangan izinkan overwrite asset lama
- gunakan folder yang sesuai kebutuhan upload
- gunakan transformasi incoming/eager bila diperlukan untuk normalisasi gambar

Untuk panel admin produksi, tahap berikutnya sebaiknya menggunakan **signed upload** agar upload terautentikasi.

## 3. Environment variable

Buat file `.env` lokal (jangan commit file ini):

```text
PUBLIC_CLOUDINARY_CLOUD_NAME=isi_cloud_name
PUBLIC_CLOUDINARY_UPLOAD_PRESET=isi_upload_preset
```

`cloud_name` dan nama upload preset boleh digunakan di sisi browser. **API Secret Cloudinary tidak boleh dimasukkan ke frontend, `.env` publik, atau repository GitHub.**

## 4. GitHub Actions

Jika build GitHub Pages membutuhkan Cloudinary URL saat build, tambahkan repository variable:

- `PUBLIC_CLOUDINARY_CLOUD_NAME`

Jika nanti ada signed upload, secret backend seperti API Secret harus disimpan sebagai GitHub Actions Secret atau environment secret yang sesuai. Jangan gunakan API Secret dalam file `src/`.

## 5. Konvensi metadata

Setiap media yang diunggah sebaiknya memiliki:

- judul
- tahun
- kategori
- tanggal kegiatan
- slug berita/kegiatan jika terkait
- alt text
- tag organisasi

Metadata indeksnya disimpan di GitHub melalui `src/data/media.ts`; file aslinya tetap di Cloudinary.

## 6. Konvensi nama

Gunakan slug yang stabil, misalnya:

`2026/08/rapat-pimpinan-cabang-2026-08-20`

Hindari nama seperti `IMG_4837.jpg` sebagai public ID utama.

## 7. URL media

Website menggunakan helper `src/lib/cloudinary.ts` untuk membentuk URL delivery dan transformasi seperti `q_auto` dan `f_auto`. Dengan begitu gambar yang sama dapat dikirim dalam ukuran yang berbeda untuk desktop dan mobile tanpa membuat salinan file manual.

## 8. Alur kerja yang dituju

```text
Pengurus
   ↓
Panel Editor
   ↓
Cloudinary Upload Widget
   ↓
Cloudinary
   ├── foto
   ├── video
   └── PDF/dokumen

Metadata konten
   ↓
GitHub
   ↓
Astro build
   ↓
GitHub Pages
```

Upload Widget Cloudinary mendukung drag-and-drop, cropping, progress, thumbnail, dan callback setelah upload. Untuk unsigned upload, gunakan preset yang dibatasi dengan format dan ukuran file yang diperbolehkan.
