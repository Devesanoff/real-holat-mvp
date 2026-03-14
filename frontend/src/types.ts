export interface Facility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "Yashil" | "Sariq" | "Qizil";
  promised_works: string[];
}

export interface Report {
  id: string;
  facility_id: string;
  status: "Zo'r ishlayapti (Bajarildi)" | "Muammo (Bajarilmagan)";
  comment: string;
  photo_base64: string;
  created_at: string;
}
