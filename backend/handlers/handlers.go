package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"realholat/models"
	"realholat/store"
	"strconv"
	"strings"
	"time"
)

// GetFacilities - Barcha muassasalarni qaytaradi
func GetFacilities(w http.ResponseWriter, r *http.Request) {
	store.Mu.RLock()
	defer store.Mu.RUnlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store.Facilities)
}

// GetFacility - Bitta muassasani qaytaradi
func GetFacility(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Noto'g'ri URL", http.StatusBadRequest)
		return
	}
	facilityID := parts[3]

	store.Mu.RLock()
	defer store.Mu.RUnlock()

	for _, f := range store.Facilities {
		if f.ID == facilityID {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(f)
			return
		}
	}
	http.Error(w, "Muassasa topilmadi", http.StatusNotFound)
}

// AddReport - Rasm + matn bilan xabar qabul qiladi
func AddReport(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Faqat POST ruxsat etilgan", http.StatusMethodNotAllowed)
		return
	}

	// URL dan ID olish: /api/facilities/1/report
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "Noto'g'ri URL", http.StatusBadRequest)
		return
	}
	facilityID := parts[3]

	// Multipart form parse (10MB limit)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		// Multipart bo'lmasa oddiy JSON sinab ko'r
		var oldReport models.Report
		if jsonErr := json.NewDecoder(r.Body).Decode(&oldReport); jsonErr != nil {
			http.Error(w, "Noto'g'ri format", http.StatusBadRequest)
			return
		}
		saveReport(w, facilityID, oldReport)
		return
	}

	// Forma maydonlarini o'qish
	comment  := r.FormValue("comment")
	userName := r.FormValue("user_name")
	status   := r.FormValue("status")

	if userName == "" {
		userName = "Anonim fuqaro"
	}
	if comment == "" {
		http.Error(w, "Izoh bo'sh bo'lmasligi kerak", http.StatusBadRequest)
		return
	}

	isDone := status == "Bajarildi" || status == "good"

	// Rasm yuklash
	photoURL := ""
	file, header, err := r.FormFile("photo")
	if err == nil && file != nil {
		defer file.Close()

		// uploads papkasini yaratish
		uploadDir := "./uploads"
		if err := os.MkdirAll(uploadDir, 0755); err == nil {
			ext      := filepath.Ext(header.Filename)
			if ext == "" { ext = ".jpg" }
			filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), facilityID, ext)
			filePath := filepath.Join(uploadDir, filename)

			dst, err := os.Create(filePath)
			if err == nil {
				defer dst.Close()
				if _, err := io.Copy(dst, file); err == nil {
					photoURL = "/uploads/" + filename
				}
			}
		}
	}

	report := models.Report{
		ID:        strconv.Itoa(rand.Intn(100000)),
		UserName:  userName,
		Comment:   comment,
		IsDone:    isDone,
		PhotoURL:  photoURL,
		CreatedAt: time.Now(),
	}

	saveReport(w, facilityID, report)
}

// saveReport - Hisobotni store ga saqlaydi va status yangilaydi
func saveReport(w http.ResponseWriter, facilityID string, report models.Report) {
	if report.ID == "" {
		report.ID = strconv.Itoa(rand.Intn(100000))
	}
	if report.CreatedAt.IsZero() {
		report.CreatedAt = time.Now()
	}

	store.Mu.Lock()
	defer store.Mu.Unlock()

	for i, facility := range store.Facilities {
		if facility.ID == facilityID {
			store.Facilities[i].Reports = append(store.Facilities[i].Reports, report)

			// Oxirgi 5 xabar bo'yicha status hisoblash
			reports := store.Facilities[i].Reports
			total := len(reports)
			if total == 0 {
				break
			}

			// Oxirgi max 5 ta xabarni ko'rib chiqish
			start := total - 5
			if start < 0 { start = 0 }
			recent := reports[start:]

			good := 0
			for _, rep := range recent {
				if rep.IsDone { good++ }
			}

			ratio := float64(good) / float64(len(recent))
			if ratio >= 0.7 {
				store.Facilities[i].CurrentStatus = "Yashil"
			} else if ratio >= 0.4 {
				store.Facilities[i].CurrentStatus = "Sariq"
			} else {
				store.Facilities[i].CurrentStatus = "Qizil"
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"message":   "Xabar muvaffaqiyatli saqlandi!",
				"photo_url": report.PhotoURL,
				"id":        report.ID,
			})
			return
		}
	}

	http.Error(w, "Muassasa topilmadi", http.StatusNotFound)
}

// GetStats - Statistika
func GetStats(w http.ResponseWriter, r *http.Request) {
	store.Mu.RLock()
	defer store.Mu.RUnlock()

	total   := len(store.Facilities)
	good    := 0
	problem := 0
	reports := 0

	for _, f := range store.Facilities {
		reports += len(f.Reports)
		if f.CurrentStatus == "Yashil" { good++ }
		if f.CurrentStatus == "Qizil"  { problem++ }
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_facilities": total,
		"total_reports":    reports,
		"good_count":       good,
		"problem_count":    problem,
		"completion_rate":  float64(good) / float64(total) * 100,
	})
}
