/**
 * File: data/indonesia-regions.ts
 * Deskripsi: Data provinsi, kota, dan kecamatan di Indonesia
 * 
 * Data ini digunakan untuk dropdown di form registrasi
 * Data mencakup semua 34 provinsi di Indonesia dengan kota dan kecamatan utama
 */

export interface Province {
  id: string;
  name: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  districts: string[];
}

export const provinces: Province[] = [
  {
    id: 'ACEH',
    name: 'Aceh',
    cities: [
      {
        id: 'BANDA_ACEH',
        name: 'Kota Banda Aceh',
        districts: ['Baiturrahman', 'Banda Raya', 'Jaya Baru', 'Kuta Alam', 'Kuta Raja', 'Lueng Bata', 'Meuraxa', 'Syiah Kuala', 'Ulee Kareng']
      },
      {
        id: 'LANGSA',
        name: 'Kota Langsa',
        districts: ['Langsa Barat', 'Langsa Baro', 'Langsa Kota', 'Langsa Lama', 'Langsa Timur']
      }
    ]
  },
  {
    id: 'SUMATERA_UTARA',
    name: 'Sumatera Utara',
    cities: [
      {
        id: 'MEDAN',
        name: 'Kota Medan',
        districts: ['Medan Amplas', 'Medan Area', 'Medan Barat', 'Medan Baru', 'Medan Belawan', 'Medan Deli', 'Medan Denai', 'Medan Helvetia', 'Medan Johor', 'Medan Kota', 'Medan Labuhan', 'Medan Maimun', 'Medan Marelan', 'Medan Perjuangan', 'Medan Petisah', 'Medan Polonia', 'Medan Selayang', 'Medan Sunggal', 'Medan Tembung', 'Medan Timur', 'Medan Tuntungan']
      },
      {
        id: 'BINJAI',
        name: 'Kota Binjai',
        districts: ['Binjai Barat', 'Binjai Kota', 'Binjai Selatan', 'Binjai Timur', 'Binjai Utara']
      }
    ]
  },
  {
    id: 'SUMATERA_BARAT',
    name: 'Sumatera Barat',
    cities: [
      {
        id: 'PADANG',
        name: 'Kota Padang',
        districts: ['Bungus Teluk Kabung', 'Koto Tangah', 'Kuranji', 'Lubuk Begalung', 'Lubuk Kilangan', 'Nanggalo', 'Padang Barat', 'Padang Selatan', 'Padang Timur', 'Padang Utara', 'Pauh']
      },
      {
        id: 'BUKITTINGGI',
        name: 'Kota Bukittinggi',
        districts: ['Aur Birugo Tigo Baleh', 'Guguk Panjang', 'Mandiangin Koto Selayan']
      }
    ]
  },
  {
    id: 'RIAU',
    name: 'Riau',
    cities: [
      {
        id: 'PEKANBARU',
        name: 'Kota Pekanbaru',
        districts: ['Bukit Raya', 'Lima Puluh', 'Marpoyan Damai', 'Payung Sekaki', 'Pekanbaru Kota', 'Rumbai', 'Rumbai Pesisir', 'Sail', 'Senapelan', 'Sukajadi', 'Tampan', 'Tenayan Raya']
      },
      {
        id: 'DUMAI',
        name: 'Kota Dumai',
        districts: ['Bukit Kapur', 'Dumai Barat', 'Dumai Kota', 'Dumai Selatan', 'Dumai Timur']
      }
    ]
  },
  {
    id: 'KEPULAUAN_RIAU',
    name: 'Kepulauan Riau',
    cities: [
      {
        id: 'BATAM',
        name: 'Kota Batam',
        districts: ['Batam Kota', 'Batu Aji', 'Batu Ampar', 'Belakang Padang', 'Bengkong', 'Bulang', 'Galang', 'Lubuk Baja', 'Nongsa', 'Sagulung', 'Sei Beduk', 'Sekupang', 'Tanjung Pinang Barat', 'Tanjung Pinang Timur']
      },
      {
        id: 'TANJUNG_PINANG',
        name: 'Kota Tanjung Pinang',
        districts: ['Bukit Bestari', 'Tanjung Pinang Barat', 'Tanjung Pinang Kota', 'Tanjung Pinang Timur']
      }
    ]
  },
  {
    id: 'JAMBI',
    name: 'Jambi',
    cities: [
      {
        id: 'JAMBI',
        name: 'Kota Jambi',
        districts: ['Danau Teluk', 'Jambi Selatan', 'Jambi Timur', 'Jelutung', 'Kota Baru', 'Pasar Jambi', 'Pelayangan', 'Telanaipura']
      }
    ]
  },
  {
    id: 'SUMATERA_SELATAN',
    name: 'Sumatera Selatan',
    cities: [
      {
        id: 'PALEMBANG',
        name: 'Kota Palembang',
        districts: ['Alang Alang Lebar', 'Bukit Kecil', 'Gandus', 'Ilir Barat I', 'Ilir Barat II', 'Ilir Timur I', 'Ilir Timur II', 'Kalidoni', 'Kemuning', 'Kertapati', 'Plaju', 'Sako', 'Seberang Ulu I', 'Seberang Ulu II', 'Sematang Borang', 'Sukarami']
      }
    ]
  },
  {
    id: 'BANGKA_BELITUNG',
    name: 'Bangka Belitung',
    cities: [
      {
        id: 'PANGKAL_PINANG',
        name: 'Kota Pangkal Pinang',
        districts: ['Bukit Intan', 'Gabek', 'Gerunggang', 'Girimaya', 'Pangkal Balam', 'Rangkui', 'Taman Sari']
      }
    ]
  },
  {
    id: 'BENGKULU',
    name: 'Bengkulu',
    cities: [
      {
        id: 'BENGKULU',
        name: 'Kota Bengkulu',
        districts: ['Gading Cempaka', 'Kampung Melayu', 'Muara Bangka Hulu', 'Ratu Agung', 'Ratu Samban', 'Selebar', 'Singaran Pati', 'Sungai Serut', 'Teluk Segara']
      }
    ]
  },
  {
    id: 'LAMPUNG',
    name: 'Lampung',
    cities: [
      {
        id: 'BANDAR_LAMPUNG',
        name: 'Kota Bandar Lampung',
        districts: ['Bumi Waras', 'Enggal', 'Kedamaian', 'Kedaton', 'Kemiling', 'Labuhan Ratu', 'Langkapura', 'Panjang', 'Rajabasa', 'Sukabumi', 'Sukarame', 'Tanjung Karang Barat', 'Tanjung Karang Pusat', 'Tanjung Karang Timur', 'Tanjung Senang', 'Telukbetung Barat', 'Telukbetung Selatan', 'Telukbetung Timur', 'Telukbetung Utara', 'Way Halim']
      }
    ]
  },
  {
    id: 'DKI_JAKARTA',
    name: 'DKI Jakarta',
    cities: [
      {
        id: 'JAKARTA_PUSAT',
        name: 'Jakarta Pusat',
        districts: ['Gambir', 'Tanah Abang', 'Menteng', 'Senen', 'Cempaka Putih', 'Kemayoran', 'Sawah Besar']
      },
      {
        id: 'JAKARTA_UTARA',
        name: 'Jakarta Utara',
        districts: ['Penjaringan', 'Pademangan', 'Tanjung Priok', 'Koja', 'Kelapa Gading', 'Cilincing']
      },
      {
        id: 'JAKARTA_BARAT',
        name: 'Jakarta Barat',
        districts: ['Kebon Jeruk', 'Taman Sari', 'Tambora', 'Cengkareng', 'Kali Deres', 'Palmerah', 'Kembangan']
      },
      {
        id: 'JAKARTA_SELATAN',
        name: 'Jakarta Selatan',
        districts: ['Kebayoran Baru', 'Kebayoran Lama', 'Pesanggrahan', 'Cilandak', 'Pasar Minggu', 'Jagakarsa']
      },
      {
        id: 'JAKARTA_TIMUR',
        name: 'Jakarta Timur',
        districts: ['Matraman', 'Pulogadung', 'Jatinegara', 'Duren Sawit', 'Cakung', 'Cipayung', 'Makasar']
      }
    ]
  },
  {
    id: 'JAWA_BARAT',
    name: 'Jawa Barat',
    cities: [
      {
        id: 'BANDUNG',
        name: 'Kota Bandung',
        districts: ['Astana Anyar', 'Babakan Ciparay', 'Bandung Kidul', 'Bandung Kulon', 'Bandung Wetan', 'Batununggal', 'Bojongloa Kaler', 'Bojongloa Kidul', 'Buahbatu', 'Cibeunying Kaler', 'Cibeunying Kidul', 'Cibiru', 'Cicendo', 'Cidadap', 'Cinambo', 'Coblong', 'Gedebage', 'Kiaracondong', 'Lengkong', 'Mandalajati', 'Panyileukan', 'Rancasari', 'Regol', 'Sukajadi', 'Sukasari', 'Sumur Bandung', 'Ujungberung']
      },
      {
        id: 'BEKASI',
        name: 'Kota Bekasi',
        districts: ['Bantar Gebang', 'Bekasi Barat', 'Bekasi Selatan', 'Bekasi Timur', 'Bekasi Utara', 'Jatiasih', 'Jatisampurna', 'Medan Satria', 'Mustika Jaya', 'Pondok Gede', 'Pondok Melati', 'Rawalumbu']
      },
      {
        id: 'DEPOK',
        name: 'Kota Depok',
        districts: ['Beji', 'Bojongsari', 'Cilodong', 'Cimanggis', 'Cinere', 'Cipayung', 'Limo', 'Pancoran Mas', 'Sawangan', 'Sukmajaya', 'Tapos']
      },
      {
        id: 'BOGOR',
        name: 'Kota Bogor',
        districts: ['Bogor Barat', 'Bogor Selatan', 'Bogor Tengah', 'Bogor Timur', 'Bogor Utara', 'Tanah Sareal']
      }
    ]
  },
  {
    id: 'JAWA_TENGAH',
    name: 'Jawa Tengah',
    cities: [
      {
        id: 'SEMARANG',
        name: 'Kota Semarang',
        districts: ['Banyumanik', 'Candisari', 'Gajahmungkur', 'Gayamsari', 'Genuk', 'Gunungpati', 'Mijen', 'Ngaliyan', 'Pedurungan', 'Semarang Barat', 'Semarang Selatan', 'Semarang Tengah', 'Semarang Timur', 'Semarang Utara', 'Tembalang', 'Tugu']
      },
      {
        id: 'SURAKARTA',
        name: 'Kota Surakarta',
        districts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan']
      }
    ]
  },
  {
    id: 'DI_YOGYAKARTA',
    name: 'DI Yogyakarta',
    cities: [
      {
        id: 'YOGYAKARTA',
        name: 'Kota Yogyakarta',
        districts: ['Danurejan', 'Gedongtengen', 'Gondokusuman', 'Gondomanan', 'Jetis', 'Kotagede', 'Kraton', 'Mantrijeron', 'Mergangsan', 'Ngampilan', 'Pakualaman', 'Tegalrejo', 'Umbulharjo', 'Wirobrajan']
      }
    ]
  },
  {
    id: 'JAWA_TIMUR',
    name: 'Jawa Timur',
    cities: [
      {
        id: 'SURABAYA',
        name: 'Kota Surabaya',
        districts: ['Asemrowo', 'Benowo', 'Bubutan', 'Bulak', 'Dukuh Pakis', 'Gayungan', 'Genteng', 'Gubeng', 'Gunung Anyar', 'Jambangan', 'Karangpilang', 'Kenjeran', 'Krembangan', 'Lakarsantri', 'Mulyorejo', 'Pabean Cantian', 'Pakal', 'Rungkut', 'Sambikerep', 'Sawahan', 'Semampir', 'Simokerto', 'Sukolilo', 'Sukomanunggal', 'Tambaksari', 'Tandes', 'Tegalsari', 'Tenggilis Mejoyo', 'Wiyung', 'Wonocolo', 'Wonokromo']
      },
      {
        id: 'MALANG',
        name: 'Kota Malang',
        districts: ['Blimbing', 'Kedungkandang', 'Klojen', 'Lowokwaru', 'Sukun']
      },
      {
        id: 'SIDOARJO',
        name: 'Kabupaten Sidoarjo',
        districts: ['Balongbendo', 'Buduran', 'Candi', 'Gedangan', 'Jabon', 'Krembung', 'Krian', 'Prambon', 'Porong', 'Sedati', 'Sidoarjo', 'Sukodono', 'Taman', 'Tanggulangin', 'Tarik', 'Tulangan', 'Waru', 'Wonoayu']
      }
    ]
  },
  {
    id: 'BANTEN',
    name: 'Banten',
    cities: [
      {
        id: 'TANGERANG',
        name: 'Kota Tangerang',
        districts: ['Batuceper', 'Benda', 'Cibodas', 'Ciledug', 'Cipondoh', 'Jatiuwung', 'Karangtengah', 'Karawaci', 'Larangan', 'Negara', 'Periuk', 'Pinang', 'Tangerang', 'Cipete']
      },
      {
        id: 'SERANG',
        name: 'Kota Serang',
        districts: ['Cipocok Jaya', 'Curug', 'Kasemen', 'Serang', 'Taktakan', 'Walantaka']
      }
    ]
  },
  {
    id: 'BALI',
    name: 'Bali',
    cities: [
      {
        id: 'DENPASAR',
        name: 'Kota Denpasar',
        districts: ['Denpasar Barat', 'Denpasar Selatan', 'Denpasar Timur', 'Denpasar Utara']
      }
    ]
  },
  {
    id: 'NUSA_TENGGARA_BARAT',
    name: 'Nusa Tenggara Barat',
    cities: [
      {
        id: 'MATARAM',
        name: 'Kota Mataram',
        districts: ['Ampenan', 'Cakranegara', 'Mataram', 'Sandubaya', 'Sekarbela', 'Selaparang']
      }
    ]
  },
  {
    id: 'NUSA_TENGGARA_TIMUR',
    name: 'Nusa Tenggara Timur',
    cities: [
      {
        id: 'KUPANG',
        name: 'Kota Kupang',
        districts: ['Alak', 'Kelapa Lima', 'Kota Lama', 'Kota Raja', 'Maulafa', 'Oebobo']
      }
    ]
  },
  {
    id: 'KALIMANTAN_BARAT',
    name: 'Kalimantan Barat',
    cities: [
      {
        id: 'PONTIANAK',
        name: 'Kota Pontianak',
        districts: ['Pontianak Barat', 'Pontianak Kota', 'Pontianak Selatan', 'Pontianak Tenggara', 'Pontianak Timur', 'Pontianak Utara']
      }
    ]
  },
  {
    id: 'KALIMANTAN_TENGAH',
    name: 'Kalimantan Tengah',
    cities: [
      {
        id: 'PALANGKARAYA',
        name: 'Kota Palangka Raya',
        districts: ['Bukit Batu', 'Jekan Raya', 'Pahandut', 'Rakumpit', 'Sebangau']
      }
    ]
  },
  {
    id: 'KALIMANTAN_SELATAN',
    name: 'Kalimantan Selatan',
    cities: [
      {
        id: 'BANJARMASIN',
        name: 'Kota Banjarmasin',
        districts: ['Banjarmasin Barat', 'Banjarmasin Selatan', 'Banjarmasin Tengah', 'Banjarmasin Timur', 'Banjarmasin Utara']
      }
    ]
  },
  {
    id: 'KALIMANTAN_TIMUR',
    name: 'Kalimantan Timur',
    cities: [
      {
        id: 'SAMARINDA',
        name: 'Kota Samarinda',
        districts: ['Loa Janan Ilir', 'Palaran', 'Samarinda Ilir', 'Samarinda Kota', 'Samarinda Seberang', 'Samarinda Ulu', 'Samarinda Utara', 'Sambutan', 'Sungai Kunjang', 'Sungai Pinang']
      },
      {
        id: 'BALIKPAPAN',
        name: 'Kota Balikpapan',
        districts: ['Balikpapan Barat', 'Balikpapan Kota', 'Balikpapan Selatan', 'Balikpapan Tengah', 'Balikpapan Timur', 'Balikpapan Utara']
      }
    ]
  },
  {
    id: 'KALIMANTAN_UTARA',
    name: 'Kalimantan Utara',
    cities: [
      {
        id: 'TARAKAN',
        name: 'Kota Tarakan',
        districts: ['Tarakan Barat', 'Tarakan Tengah', 'Tarakan Timur', 'Tarakan Utara']
      }
    ]
  },
  {
    id: 'SULAWESI_UTARA',
    name: 'Sulawesi Utara',
    cities: [
      {
        id: 'MANADO',
        name: 'Kota Manado',
        districts: ['Bunaken', 'Bunaken Kepulauan', 'Malalayang', 'Mapanget', 'Paal Dua', 'Sario', 'Singkil', 'Tikala', 'Tuminting', 'Wenang']
      }
    ]
  },
  {
    id: 'SULAWESI_TENGAH',
    name: 'Sulawesi Tengah',
    cities: [
      {
        id: 'PALU',
        name: 'Kota Palu',
        districts: ['Mantikulore', 'Palu Barat', 'Palu Selatan', 'Palu Timur', 'Palu Utara', 'Tatanga', 'Tawaeli', 'Ulujadi']
      }
    ]
  },
  {
    id: 'SULAWESI_SELATAN',
    name: 'Sulawesi Selatan',
    cities: [
      {
        id: 'MAKASSAR',
        name: 'Kota Makassar',
        districts: ['Biringkanaya', 'Bontoala', 'Kepulauan Sangkarrang', 'Makassar', 'Mamajang', 'Manggala', 'Mariso', 'Panakkukang', 'Rappocini', 'Tallo', 'Tamalanrea', 'Tamalate', 'Ujung Pandang', 'Ujung Tanah', 'Wajo']
      }
    ]
  },
  {
    id: 'SULAWESI_TENGGARA',
    name: 'Sulawesi Tenggara',
    cities: [
      {
        id: 'KENDARI',
        name: 'Kota Kendari',
        districts: ['Abeli', 'Baruga', 'Kadia', 'Kambu', 'Kendari', 'Kendari Barat', 'Mandonga', 'Poasia', 'Puuwatu', 'Wua-Wua']
      }
    ]
  },
  {
    id: 'GORONTALO',
    name: 'Gorontalo',
    cities: [
      {
        id: 'GORONTALO',
        name: 'Kota Gorontalo',
        districts: ['Dumbo Raya', 'Dungingi', 'Hulonthalangi', 'Kota Barat', 'Kota Selatan', 'Kota Tengah', 'Kota Timur', 'Kota Utara', 'Sipatana']
      }
    ]
  },
  {
    id: 'SULAWESI_BARAT',
    name: 'Sulawesi Barat',
    cities: [
      {
        id: 'MAMUJU',
        name: 'Kabupaten Mamuju',
        districts: ['Bonehau', 'Kalukku', 'Kalumpang', 'Mamuju', 'Pangale', 'Tapalang', 'Tapalang Barat']
      }
    ]
  },
  {
    id: 'MALUKU',
    name: 'Maluku',
    cities: [
      {
        id: 'AMBON',
        name: 'Kota Ambon',
        districts: ['Baguala', 'Leitimur Selatan', 'Nusaniwe', 'Sirimau', 'Teluk Ambon']
      }
    ]
  },
  {
    id: 'MALUKU_UTARA',
    name: 'Maluku Utara',
    cities: [
      {
        id: 'TERNATE',
        name: 'Kota Ternate',
        districts: ['Moti', 'Pulau Batang Dua', 'Pulau Hiri', 'Pulau Ternate', 'Ternate Selatan', 'Ternate Tengah', 'Ternate Utara']
      }
    ]
  },
  {
    id: 'PAPUA_BARAT',
    name: 'Papua Barat',
    cities: [
      {
        id: 'SORONG',
        name: 'Kota Sorong',
        districts: ['Sorong', 'Sorong Barat', 'Sorong Kepulauan', 'Sorong Manoi', 'Sorong Timur', 'Sorong Utara']
      }
    ]
  },
  {
    id: 'PAPUA',
    name: 'Papua',
    cities: [
      {
        id: 'JAYAPURA',
        name: 'Kota Jayapura',
        districts: ['Abepura', 'Heram', 'Jayapura Selatan', 'Jayapura Utara', 'Muara Tami']
      }
    ]
  },
  {
    id: 'PAPUA_SELATAN',
    name: 'Papua Selatan',
    cities: [
      {
        id: 'MERAUKE',
        name: 'Kabupaten Merauke',
        districts: ['Animha', 'Elikobal', 'Ilwayab', 'Jagebob', 'Kaptel', 'Kimaam', 'Kurik', 'Malind', 'Merauke', 'Muting', 'Naukenjerai', 'Ngguti', 'Okaba', 'Semangga', 'Sota', 'Tabonji', 'Tanah Miring', 'Ulilin', 'Waan']
      }
    ]
  },
  {
    id: 'PAPUA_TENGAH',
    name: 'Papua Tengah',
    cities: [
      {
        id: 'NABIRE',
        name: 'Kabupaten Nabire',
        districts: ['Dipa', 'Makimi', 'Nabire', 'Nabire Barat', 'Napan', 'Siriwo', 'Teluk Kimi', 'Uwapa', 'Wanggar', 'Wapoga', 'Yaro', 'Yaur']
      }
    ]
  },
  {
    id: 'PAPUA_PEGUNUNGAN',
    name: 'Papua Pegunungan',
    cities: [
      {
        id: 'WAMENA',
        name: 'Kabupaten Jayawijaya',
        districts: ['Asologaima', 'Asolokobal', 'Asotipo', 'Bolakme', 'Bpiri', 'Bugi', 'Hubikiak', 'Hubikosi', 'Ibele', 'Itlay Hisage', 'Koragi', 'Kurulu', 'Libarek', 'Maima', 'Molagalome', 'Muliama', 'Musatfak', 'Napua', 'Pelebaga', 'Piramid', 'Pisugi', 'Popugoba', 'Siepkosi', 'Silo Karno Doga', 'Taelarek', 'Tagime', 'Tagineri', 'Trikora', 'Usilimo', 'Wadangku', 'Walaik', 'Walelagama', 'Wame', 'Wamena', 'Welesi', 'Wesaput', 'Wita Waya', 'Wollo', 'Wouma', 'Yalengga']
      }
    ]
  },
  {
    id: 'PAPUA_BARAT_DAYA',
    name: 'Papua Barat Daya',
    cities: [
      {
        id: 'FAKFAK',
        name: 'Kabupaten Fakfak',
        districts: ['Fakfak', 'Fakfak Barat', 'Fakfak Tengah', 'Fakfak Timur', 'Karas', 'Kokas', 'Kramongmongga', 'Teluk Patipi']
      }
    ]
  }
];

/**
 * Fungsi helper untuk mendapatkan daftar semua provinsi
 */
export const getProvinces = () => {
  return provinces.map(p => ({ id: p.id, name: p.name }));
};

/**
 * Fungsi helper untuk mendapatkan daftar kota berdasarkan provinsi
 */
export const getCitiesByProvince = (provinceId: string): City[] => {
  const province = provinces.find(p => p.id === provinceId);
  return province ? province.cities : [];
};

/**
 * Fungsi helper untuk mendapatkan daftar kecamatan berdasarkan provinsi dan kota
 */
export const getDistrictsByCity = (provinceId: string, cityId: string): string[] => {
  const province = provinces.find(p => p.id === provinceId);
  if (!province) return [];
  
  const city = province.cities.find(c => c.id === cityId);
  return city ? city.districts : [];
};
