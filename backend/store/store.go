package store

import (
	"realholat/models"
	"sync"
)

var (
	Facilities []models.Facility
	Mu         sync.RWMutex
)

func InitStore() {
	Mu.Lock()
	defer Mu.Unlock()

	Facilities = []models.Facility{
		{
			ID: "1", Name: "45-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.364, Lng: 69.288},
			PromisedWorks: []models.PromisedWork{
				{Title: "Hojatxonani ta'mirlash", Status: "Bajarilmoqda"},
				{Title: "Sovun idishlari (dispenserlar) o'rnatish", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
		{
			ID: "2", Name: "112-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.299, Lng: 69.240},
			PromisedWorks: []models.PromisedWork{
				{Title: "O'quvchilar uchun yangi partalar", Status: "Bajarildi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "3", Name: "71-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.328, Lng: 69.224},
			PromisedWorks: []models.PromisedWork{
				{Title: "Sport zalini ta'mirlash", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Qizil",
		},
		{
			ID: "4", Name: "10-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.311, Lng: 69.279},
			PromisedWorks: []models.PromisedWork{
				{Title: "Yangi doskalar o'rnatish", Status: "Bajarildi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "5", Name: "34-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.285, Lng: 69.211},
			PromisedWorks: []models.PromisedWork{
				{Title: "Hojatxonani ta'mirlash", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
	}
}