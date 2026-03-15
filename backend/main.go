package main

import (
	"log"
	"net/http"
	"os"
	"realholat/handlers"
	"realholat/middleware"
	"realholat/store"
	"strings"
)

func main() {
	store.InitStore()
	log.Println("Ma'lumotlar bazasi (In-memory) tayyor...")

	// uploads papkasini yaratish
	os.MkdirAll("./uploads", 0755)

	mux := http.NewServeMux()

	// Rasmlarni static serve qilish
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	// API endpoints
	mux.HandleFunc("/api/facilities", handlers.GetFacilities)
	mux.HandleFunc("/api/stats", handlers.GetStats)

	mux.HandleFunc("/api/facilities/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/report") {
			handlers.AddReport(w, r)
			return
		}
		// /api/facilities/1 — bitta muassasa
		handlers.GetFacility(w, r)
	})

	handler := middleware.CORS(mux)
	log.Println("Server 8080-portda ishlamoqda...")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Server xatosi: %v", err)
	}
}
