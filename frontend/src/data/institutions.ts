export interface Task {
  id: string;
  projectId: string; // Used to reference parent, though here it might be part of the Institution directly
  title: string;
  status: 'done' | 'warn' | 'bad';
}

export interface Report {
  id: number;
  userName: string;
  userInitials: string;
  comment: string;
  date: string;
  status: 'good' | 'warning' | 'bad';
}

export interface Institution {
  id: number;
  name: string;
  type: 'school' | 'clinic';
  district: string;
  status: 'good' | 'warning' | 'bad';
  lat: number;
  lng: number;
  address: string;
  lastCheck: string;
  tasks: Task[];
  reports: Report[];
}

export const mockInstitutions: Institution[] = [
  // Schools
  { 
    id: 1, name: '45-maktab', type: 'school', district: 'Yunusobod tumani', status: 'warning', lat: 41.330, lng: 69.285,
    address: 'Amir Temur ko\'chasi, 15-uy', lastCheck: '2 kun oldin',
    tasks: [
      { id: 't1', projectId: '1', title: "Hojatxona ta'mirlanishi", status: 'warn' },
      { id: 't2', projectId: '1', title: 'Sport zal tekislanishi', status: 'done' },
      { id: 't3', projectId: '1', title: 'Derazalarni almashtirish', status: 'bad' },
    ],
    reports: [
      { id: 101, userName: 'Zarina Turg\'unova', userInitials: 'ZT', comment: "Hojatxona santexnikasi hali to'liq ishlamaydi, chala qoldirilgan.", date: '2 soat oldin', status: 'warning' }
    ]
  },
  { 
    id: 2, name: '12-maktab', type: 'school', district: 'Chilonzor tumani', status: 'good', lat: 41.290, lng: 69.210,
    address: 'Bunyodkor shoh ko\'chasi, 21-uy', lastCheck: 'Bugun',
    tasks: [
      { id: 't4', projectId: '2', title: "Isitish tizimi yangilanishi", status: 'done' },
      { id: 't5', projectId: '2', title: "Sinfxona pollari", status: 'done' },
      { id: 't6', projectId: '2', title: "Yangi partalar", status: 'done' },
    ],
    reports: [
      { id: 102, userName: 'Ali Valiyev', userInitials: 'AV', comment: "Isitish tizimi zo'r ishlayapti, bolalar issiq sinfda o'qishyapti. Rahmat!", date: '4 soat oldin', status: 'good' }
    ]
  },
  { 
    id: 3, name: '78-maktab', type: 'school', district: 'Sergeli tumani', status: 'bad', lat: 41.245, lng: 69.260,
    address: 'Yangi Sergeli ko\'chasi, 3-uy', lastCheck: '1 hafta oldin',
    tasks: [
      { id: 't7', projectId: '3', title: "Tom qismini ta'mirlash", status: 'bad' },
      { id: 't8', projectId: '3', title: "Fasadni bo'yash", status: 'warn' },
      { id: 't9', projectId: '3', title: "Oshxona anjomlari", status: 'bad' },
    ],
    reports: [
      { id: 103, userName: 'Dilshod Karimov', userInitials: 'DK', comment: "Yomg'ir yog'sa tomidan chakka o'tyapti. Umuman ta'mirlanmagan.", date: 'Kecha', status: 'bad' },
      { id: 104, userName: 'Gulzoda R.', userInitials: 'GR', comment: "Oshxonada sharoitlar umuman yo'q, va'da qilingan pechlar qani?", date: '3 kun oldin', status: 'bad' }
    ]
  },
  { 
    id: 4, name: '5-maktab', type: 'school', district: "Mirzo Ulug'bek tumani", status: 'warning', lat: 41.350, lng: 69.350,
    address: 'Buyuk Ipak Yo\'li, 114-uy', lastCheck: '3 kun oldin',
    tasks: [
      { id: 't10', projectId: '4', title: "Kutubxona kitoblari", status: 'done' },
      { id: 't11', projectId: '4', title: "Informatika xonasi kompyuterlari", status: 'warn' }
    ],
    reports: []
  },
  { 
    id: 5, name: '31-maktab', type: 'school', district: 'Olmazor tumani', status: 'good', lat: 41.270, lng: 69.320,
    address: 'Qamarniso ko\'chasi, 8-uy', lastCheck: 'Bugun',
    tasks: [
      { id: 't12', projectId: '5', title: "Yangi partalar va stullar", status: 'done' },
      { id: 't13', projectId: '5', title: "Laboratoriya jihozlari", status: 'done' },
    ],
    reports: [
      { id: 105, userName: 'Madina U.', userInitials: 'MU', comment: "Yangi partalar keldi rasmdagidek. Judayam xursandmiz.", date: '3 soat oldin', status: 'good' }
    ]
  },
  { 
    id: 10, name: '15-maktab', type: 'school', district: 'Chilonzor tumani', status: 'warning', lat: 41.295, lng: 69.230,
    address: 'Qatortol ko\'chasi, 42-uy', lastCheck: '4 kun oldin',
    tasks: [
      { id: 't14', projectId: '10', title: "Sport inventarlari", status: 'warn' },
      { id: 't15', projectId: '10', title: "Hojatxona eshiklari", status: 'bad' },
      { id: 't16', projectId: '10', title: "Yoritish tizimi", status: 'done' },
    ],
    reports: []
  },
  
  // Clinics
  { 
    id: 6, name: '1-klinika', type: 'clinic', district: 'Yunusobod tumani', status: 'good', lat: 41.340, lng: 69.270,
    address: 'Ahmad Donish ko\'chasi, 22-uy', lastCheck: 'Bugun',
    tasks: [
      { id: 't17', projectId: '6', title: "Yangi UTD apparati", status: 'done' },
      { id: 't18', projectId: '6', title: "Kutish zali o'rindiqlari", status: 'done' },
    ],
    reports: [
      { id: 106, userName: 'Sardor A.', userInitials: 'SA', comment: "UTD apparati zo'r ishlab turibdi. Va'da ustidan chiqildi.", date: '5 soat oldin', status: 'good' }
    ]
  },
  { 
    id: 7, name: '3-klinika', type: 'clinic', district: 'Sergeli tumani', status: 'bad', lat: 41.235, lng: 69.290,
    address: 'Lutfkor ko\'chasi, 9-uy', lastCheck: '2 hafta oldin',
    tasks: [
      { id: 't19', projectId: '7', title: "Tibbiy asbob-uskunalar", status: 'bad' },
      { id: 't20', projectId: '7', title: "Isitish tizimi", status: 'bad' },
      { id: 't21', projectId: '7', title: "Tom ta'miri", status: 'warn' },
    ],
    reports: [
      { id: 107, userName: 'Umidaxon S.', userInitials: 'US', comment: "Hech qanday tibbiy asboblar yo'q, umuman ish qilinmagan.", date: '15 daqiqa oldin', status: 'bad' }
    ]
  },
  { 
    id: 8, name: '2-klinika', type: 'clinic', district: 'Olmazor tumani', status: 'warning', lat: 41.280, lng: 69.340,
    address: 'Farobiy ko\'chasi, 33-uy', lastCheck: '3 kun oldin',
    tasks: [
      { id: 't22', projectId: '8', title: "Sovun dispenserlari", status: 'warn' },
      { id: 't23', projectId: '8', title: "Derazalar", status: 'done' },
    ],
    reports: []
  },
  { 
    id: 9, name: '7-klinika', type: 'clinic', district: 'Yunusobod tumani', status: 'good', lat: 41.320, lng: 69.260,
    address: 'Bog\'ishamol ko\'chasi, 12-uy', lastCheck: 'Bugun',
    tasks: [
      { id: 't24', projectId: '9', title: "Sovun dispenserlari o'rnatildi", status: 'done' },
      { id: 't25', projectId: '9', title: "Hojatxona ta'miri", status: 'done' },
    ],
    reports: [
      { id: 108, userName: 'Otabek Z.', userInitials: 'OZ', comment: "Hamma narsa toza, yangi sovun apparatlari o'rnatilibdi.", date: '2 soat oldin', status: 'good' }
    ]
  }
];
