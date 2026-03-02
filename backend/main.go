package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"sync"
	"time"
)

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

type IssueStatus string

const (
	StatusYangi            IssueStatus = "yangi"
	StatusKoribChiqilmoqda IssueStatus = "ko'rib_chiqilmoqda"
	StatusJarayonda        IssueStatus = "jarayonda"
	StatusHalEtildi        IssueStatus = "hal_etildi"
)

type Issue struct {
	ID          string      `json:"id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Category    string      `json:"category"`
	Status      IssueStatus `json:"status"`
	Lat         float64     `json:"lat"`
	Lng         float64     `json:"lng"`
	Votes       int         `json:"votes"`
	CreatedAt   time.Time   `json:"createdAt"`
	Address     string      `json:"address"`
	Author      string      `json:"author"`
}

type VoteRequest struct {
	IssueID string `json:"issueId"`
	VoterID string `json:"voterId"`
}

type CreateIssueRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Address     string  `json:"address"`
	Author      string  `json:"author"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
}

// ---------------------------------------------------------------------------
// xotira
// ---------------------------------------------------------------------------

type Store struct {
	mu      sync.RWMutex
	issues  map[string]*Issue
	votes   map[string]map[string]bool 
	counter int
}

func NewStore() *Store {
	return &Store{
		issues:  make(map[string]*Issue),
		votes:   make(map[string]map[string]bool),
		counter: 0,
	}
}

func (s *Store) NextID() string {
	s.counter++
	return fmt.Sprintf("ISS-%04d", s.counter)
}

func (s *Store) AddIssue(issue *Issue) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if issue.ID == "" {
		issue.ID = s.NextID()
	}
	if issue.CreatedAt.IsZero() {
		issue.CreatedAt = time.Now()
	}
	s.issues[issue.ID] = issue
	s.votes[issue.ID] = make(map[string]bool)
}

func (s *Store) GetAllIssues() []*Issue {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]*Issue, 0, len(s.issues))
	for _, issue := range s.issues {
		result = append(result, issue)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})
	return result
}

func (s *Store) Vote(issueID, voterID string) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	issue, ok := s.issues[issueID]
	if !ok {
		return 0, fmt.Errorf("issue not found")
	}
	voters, ok := s.votes[issueID]
	if !ok {
		voters = make(map[string]bool)
		s.votes[issueID] = voters
	}
	if voters[voterID] {
		return issue.Votes, fmt.Errorf("already voted")
	}
	voters[voterID] = true
	issue.Votes++
	return issue.Votes, nil
}

func (s *Store) GetStats() map[string]int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	stats := map[string]int{
		"yangi":              0,
		"ko'rib_chiqilmoqda": 0,
		"jarayonda":          0,
		"hal_etildi":         0,
		"total":              len(s.issues),
	}
	for _, issue := range s.issues {
		stats[string(issue.Status)]++
	}
	return stats
}

// ---------------------------------------------------------------------------
// ma'lumotlarni kiritish
// ---------------------------------------------------------------------------

func seedData(store *Store) {
	now := time.Now()
	issues := []*Issue{
		{
			ID: "ISS-0001", Title: "Sergeli: Gaz bosimi past",
			Description: "Sergeli tumanida oxirgi 3 kundan beri gaz bosimi juda past. Ovqat pishirish qiyin.",
			Category:    "gaz", Status: StatusYangi, Lat: 41.2387, Lng: 69.2200,
			Votes: 24, CreatedAt: now.Add(-2 * time.Hour), Address: "Sergeli tumani, 7-mavze", Author: "Akbar T.",
		},
		{
			ID: "ISS-0002", Title: "Chilonzor: Yo'l chuquri",
			Description: "Chilonzor metro bekati yonida katta yo'l chuquri bor. Mashinalar shikastlanmoqda.",
			Category:    "yollar", Status: StatusJarayonda, Lat: 41.2860, Lng: 69.2045,
			Votes: 47, CreatedAt: now.Add(-5 * time.Hour), Address: "Chilonzor tumani, Bunyodkor ko'chasi", Author: "Dilshod M.",
		},
		{
			ID: "ISS-0003", Title: "1-son Kasalxona oldida chiroq yo'q",
			Description: "Kechqurun kasalxona oldida ko'cha chiroqlari yonmayapti. Bemorlar va yo'lovchilar qorong'ida yurishmoqda.",
			Category:    "elektr", Status: StatusKoribChiqilmoqda, Lat: 41.3111, Lng: 69.2790,
			Votes: 31, CreatedAt: now.Add(-8 * time.Hour), Address: "Mirzo Ulug'bek tumani, Kasalxona ko'chasi", Author: "Nilufar S.",
		},
		{
			ID: "ISS-0004", Title: "Yakkasaroy: Suv taqchilligi",
			Description: "Yakkasaroy tumanida uch kundan beri suv yo'q. Aholining turmush sharoiti yomonlashgan.",
			Category:    "suv", Status: StatusYangi, Lat: 41.2950, Lng: 69.2700,
			Votes: 56, CreatedAt: now.Add(-1 * time.Hour), Address: "Yakkasaroy tumani, Shota Rustaveli", Author: "Sardor K.",
		},
		{
			ID: "ISS-0005", Title: "Olmazor: Chiqindi konteynerlar to'lib ketgan",
			Description: "Mahallada chiqindi konteynerlari bir haftadan beri bo'shatilmagan. Hiddan nafas olish qiyin.",
			Category:    "boshqa", Status: StatusHalEtildi, Lat: 41.3300, Lng: 69.2100,
			Votes: 19, CreatedAt: now.Add(-72 * time.Hour), Address: "Olmazor tumani, Qorasaroy MFY", Author: "Zulfiya R.",
		},
		{
			ID: "ISS-0006", Title: "Mirobod: Tibbiy yordam kechikmoqda",
			Description: "Tez yordam chaqirildi, lekin 3 soatdan beri kelmadi. Aholi xavotirlangan.",
			Category:    "tibbiyot", Status: StatusKoribChiqilmoqda, Lat: 41.3050, Lng: 69.2650,
			Votes: 38, CreatedAt: now.Add(-4 * time.Hour), Address: "Mirobod tumani, Amir Temur shoh ko'chasi", Author: "Bobur A.",
		},
		{
			ID: "ISS-0007", Title: "Uchtepa: Elektr uzilishi",
			Description: "Butun mahallada elektr energiyasi 12 soatdan beri uzilgan. Muzlatgichdagi mahsulotlar buzilmoqda.",
			Category:    "elektr", Status: StatusJarayonda, Lat: 41.3200, Lng: 69.1900,
			Votes: 42, CreatedAt: now.Add(-6 * time.Hour), Address: "Uchtepa tumani, Gulbahor ko'chasi", Author: "Kamol N.",
		},
		{
			ID: "ISS-0008", Title: "Yunusobod: Piyodalar yo'lagi buzilgan",
			Description: "Yunusobod metrosidan chiqishda piyodalar yo'lagi singan. Keksalar va nogironlar o'tishi qiyin.",
			Category:    "yollar", Status: StatusYangi, Lat: 41.3400, Lng: 69.2850,
			Votes: 15, CreatedAt: now.Add(-30 * time.Minute), Address: "Yunusobod tumani, Metro bekati", Author: "Lola X.",
		},
	}

	for _, issue := range issues {
		store.AddIssue(issue)
	}
	store.counter = 8
}

// ---------------------------------------------------------------------------
// CORS Middleware
// ---------------------------------------------------------------------------

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

func handleGetIssues(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		issues := store.GetAllIssues()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(issues)
	}
}

func handleCreateIssue(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req CreateIssueRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.Title == "" {
			http.Error(w, "title is required", http.StatusBadRequest)
			return
		}

		issue := &Issue{
			Title:       req.Title,
			Description: req.Description,
			Category:    req.Category,
			Status:      StatusYangi,
			Lat:         req.Lat,
			Lng:         req.Lng,
			Votes:       0,
			Address:     req.Address,
			Author:      req.Author,
		}
		store.AddIssue(issue)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(issue)
	}
}

func handleVote(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req VoteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if req.IssueID == "" || req.VoterID == "" {
			http.Error(w, "issueId and voterId are required", http.StatusBadRequest)
			return
		}

		votes, err := store.Vote(req.IssueID, req.VoterID)
		if err != nil {
			if err.Error() == "already voted" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusConflict)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"error": "already voted",
					"votes": votes,
				})
				return
			}
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"votes": votes,
		})
	}
}

func handleGetStats(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		stats := store.GetStats()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	store := NewStore()
	seedData(store)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/issues", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handleGetIssues(store)(w, r)
		case http.MethodPost:
			handleCreateIssue(store)(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/api/vote", handleVote(store))
	mux.HandleFunc("/api/stats", handleGetStats(store))

	handler := corsMiddleware(mux)

	fmt.Println("Real Holat backend running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
