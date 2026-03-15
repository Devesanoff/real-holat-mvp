package models

import "time"

type Report struct {
	ID          string    `json:"id"`
	UserName    string    `json:"user_name,omitempty"`
	Comment     string    `json:"comment"`
	IsDone      bool      `json:"is_done"`
	PhotoURL    string    `json:"photo_url,omitempty"`
	PhotoBase64 string    `json:"photo_base64,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type PromisedWork struct {
	Title  string `json:"title"`
	Status string `json:"status"`
}

type Coordinates struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Facility struct {
	ID            string         `json:"id"`
	Name          string         `json:"name"`
	Type          string         `json:"type"`
	Location      Coordinates    `json:"location"`
	PromisedWorks []PromisedWork `json:"promised_works"`
	Reports       []Report       `json:"reports"`
	CurrentStatus string         `json:"current_status"`
}
