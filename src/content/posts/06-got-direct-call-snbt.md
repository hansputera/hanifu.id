---
title: Jalur Polisi atau Takedown?
description: Selang 2-3 bulan ramainya project SNBT Dumper yang saya dan teman saya. Hal tersebut mendapatkan notice dari Kemdikbudristek untuk meminta saya untuk melakukan takedown atau melalui jalur kepolisian.
draft: false
published: 2025-07-26
category: General
tags: [daily, technology, dumping, scraping, web, journal]
---

## Perkenalan
Halo guys, bagi yang belum kenal saya, kenalin nama saya **Hanif**, panggil aja **Nif** atau **Nip**.
Aku programmer pemula yang baru belajar programming kurang lebih 3 tahun lamanya. Dan, memiliki pengalaman bekerja di real projects kurang lebih 1 tahun.

## SNBT Dumper
Bagi teman-teman yang belum mengetahui SNBT Dumper. SNBT Dumper adalah project dumping data UTBK/SNBT saat lalu yang dibuat oleh teman saya dan saya pribadi untuk kebutuhan statistik lulusan sekolah. Project ini tentunya sangat bermanfaat bagi sekolah dalam melakukan tracking alumni/lulusan melalui jalur SNBT.

::github{repo="hansputera/snbt-historic"}

Sekali lagi, saya menekankan project ini **berdasarkan ide atau gagasan kami untuk memudahkan kami dalam melakukan kolektif data atau membuat statistika data terkait UTBK** yang telah dimulai sejak tahun 2024. Tidak ada maksud dalam melakukan _data leaking_, karena pada waktu tersebut data yang disajikan telah terbuka secara publik oleh pihak SNPMB.

## UTBK2025 Service
Setelah hadirnya project **SNBT Dumper**, saya membuat kembali project bernama **UTBK2025** dengan host **https://utbk2025.hanifu.id** untuk melakukan data view per universitas dan per prodi untuk memudahkan dalam melakukan analisis dan statistik data.

::github{repo="hansputera/utbk2025-api"}
::github{repo="hansputera/utbk2025-preview"}

Website saya tersebut mendapat high demand traffic ketika sedang booming di platform **X** (lihat di https://x.com/mawleleee/status/1942529979809427605), hal ini menyebabkan pada per tanggal **8 Juli 2025** resource server yang saya gunakan untuk melakukan deployment project tersebut mengalami usage resources yang cukup tinggi sehingga sempat mengalami down (_redisnya penuh bang wkwkwk_)

Berdasarkan sentimen, respons orang-orang sedikit negatif dengan pemerintah tentang keamanan data. Dan, mostly menilai mengapa data seperti ini lengkap sedetail-detailnya terexpose ke publik baik yang lolos dan tidak.

## Notice dari Kemdikbudristek! 🤔🤔
Per tanggal **14 Juli 2025**, pada kurang lebih pukul 13.00 WITA saya mendapatkan telepon langsung dari guru saya yang berada di sekolah untuk memberitahukan kepada saya terkait _direct call_ dari Kemdikbudristek untuk meminta saya untuk melakukan _takedown_ 2 services, yakni:
1. https://utbk2025.hanifu.id
2. https://snbtx.mnct.eu.org

![Gambar](https://pbs.twimg.com/media/GvzKtLBWIAAxkPz?format=png&name=small)

Pada pemberitahuan yang diberikan kepada saya, utusan dari Kemdikbudristek meminta kepada saya melalui Kepala Sekolah SMA Negeri 3 Palu (sekolah saya) untuk melakukan takedown atau dibawa ke ranah kepolisian. Sontak saya, otomatis untuk melakukan takedown saja daripada urusan yang lebih panjang berikutnya (_I'm poor wkwk, and masih ingin melanjutkan kuliah_)

Telepon kepada Kepala Sekolah berdasarkan informasi yang saya tanyakan pada guru yang menyampaikan informasi tersebut kepada saya, kurang lebih pada pukul 10.00 WITA. Dan, disampaikan kepada saya kurang lebih pukul 13.00 WITA.

## Catatan
1. Data UTBK 2025 masih ada dalam file storage saya, dan limited access untuk websitenya.
```json
[
    {
        "file": "utbk-2025.db",
        "size": "73.9 MB",
        "dumps": [2025]
    },
    {
        "file": "data.db",
        "size": "209.1 MB",
        "dumps": [2025, 2025]
    }
]
```

2. Saya hanya melakukan shutdown application yang diminta untuk memberhentikan akses data publik.
3. Harapan saya kepada pihak SNPMB pada tahun depan (2026) lebih memperhatikan kembali GCS (Google Cloud Storage) rules, dan dapat melakukan improvement kembali pada sistem yang digunakan.
4. Saya memiliki data sebelum **28 Mei 2025** yakni **26 Mei 2025**, apabila ditemukannya kejanggalan data yang tersedia dengan setelahnya, akan saya buat _writeup_ nya.