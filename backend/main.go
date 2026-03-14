package main

import (
	"log"
	"net/http"
	"realholat/handlers"
	"realholat/middleware"
	"realholat/store"
	"strings"
)

func main() {
	// 1. Tizim xotirasini boshlang'ich ma'lumotlar bilan to'ldirish
	store.InitStore()
	log.Println("Ma'lumotlar bazasi (In-memory) tayyor...")

	mux := http.NewServeMux()

	// 2. API yo'nalishlari
	mux.HandleFunc("/api/facilities", handlers.GetFacilities)

	// Dinamik marshrutizatsiya (Report qo'shish uchun)
	mux.HandleFunc("/api/facilities/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/report") {
			handlers.AddReport(w, r)
			return
		}
		http.NotFound(w, r)
	})

	// 3. CORS himoyasini ulash
	handler := middleware.CORS(mux)

	log.Println("Server 8080-portda ishlamoqda...")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Server xatosi: %v", err)
	}
}