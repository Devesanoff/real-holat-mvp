package models

import "time"

// Report - Fuqaroning 30 soniyalik hisoboti
type Report struct {
	ID          string    `json:"id"`
	IsDone      bool      `json:"is_done"` // true = Bajarildi, false = Muammo
	PhotoBase64 string    `json:"photo_base64,omitempty"`
	Comment     string    `json:"comment"`
	CreatedAt   time.Time `json:"created_at"`
}

// PromisedWork - Davlat nima va'da qilgan?
type PromisedWork struct {
	Title  string `json:"title"`
	Status string `json:"status"` // "Bajarildi" yoki "Bajarilmoqda"
}

// Coordinates - Xarita uchun geolokatsiya
type Coordinates struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// Facility - Muassasa (Maktab yoki Tibbiyot)
type Facility struct {
	ID            string         `json:"id"`
	Name          string         `json:"name"`
	Type          string         `json:"type"` // "Maktab" yoki "Tibbiyot"
	Location      Coordinates    `json:"location"`
	PromisedWorks []PromisedWork `json:"promised_works"`
	Reports       []Report       `json:"reports"`
	CurrentStatus string         `json:"current_status"` // "Yashil", "Sariq", "Qizil"
}