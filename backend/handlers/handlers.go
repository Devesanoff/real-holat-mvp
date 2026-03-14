package handlers

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"realholat/models"
	"realholat/store"
	"strconv"
	"strings"
	"time"
)

// GetFacilities - Barcha muassasalarni xarita uchun qaytaradi
func GetFacilities(w http.ResponseWriter, r *http.Request) {
	store.Mu.RLock()
	defer store.Mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store.Facilities)
}

// AddReport - Yangi shikoyat yoki tasdiq qabul qiladi
func AddReport(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Faqat POST ruxsat etilgan", http.StatusMethodNotAllowed)
		return
	}

	// URL'dan ID ni ajratib olish: /api/facilities/1/report
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Noto'g'ri URL", http.StatusBadRequest)
		return
	}
	facilityID := parts[3]

	var newReport models.Report
	if err := json.NewDecoder(r.Body).Decode(&newReport); err != nil {
		http.Error(w, "Noto'g'ri JSON formati", http.StatusBadRequest)
		return
	}

	newReport.ID = strconv.Itoa(rand.Intn(100000))
	newReport.CreatedAt = time.Now()

	store.Mu.Lock()
	defer store.Mu.Unlock()

	found := false
	for i, facility := range store.Facilities {
		if facility.ID == facilityID {
			// Hisobotni ro'yxatga qo'shamiz
			store.Facilities[i].Reports = append(store.Facilities[i].Reports, newReport)

			// Mantiq: Agar muammo xabar qilinsa (is_done=false), xaritada QIZIL ga aylanadi
			if !newReport.IsDone {
				store.Facilities[i].CurrentStatus = "Qizil"
			} else {
				store.Facilities[i].CurrentStatus = "Yashil"
			}
			
			found = true
			break
		}
	}

	if !found {
		http.Error(w, "Muassasa topilmadi", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Hisobot muvaffaqiyatli saqlandi!"})
}