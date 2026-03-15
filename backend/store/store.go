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
				{Title: "Sovun idishlari o'rnatish", Status: "Bajarilmoqda"},
				{Title: "Yangi partalar qo'yish", Status: "Bajarilmadi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
		{
			ID: "2", Name: "112-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.299, Lng: 69.240},
			PromisedWorks: []models.PromisedWork{
				{Title: "O'quvchilar uchun yangi partalar", Status: "Bajarildi"},
				{Title: "Sinf xonalarini bo'yash", Status: "Bajarildi"},
				{Title: "Suv ta'minotini tiklash", Status: "Bajarildi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "3", Name: "71-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.328, Lng: 69.224},
			PromisedWorks: []models.PromisedWork{
				{Title: "Sport zalini ta'mirlash", Status: "Bajarilmoqda"},
				{Title: "Derazalarni almashtirish", Status: "Bajarilmadi"},
				{Title: "Isitish tizimini tuzatish", Status: "Bajarilmadi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Qizil",
		},
		{
			ID: "4", Name: "10-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.311, Lng: 69.279},
			PromisedWorks: []models.PromisedWork{
				{Title: "Yangi doskalar o'rnatish", Status: "Bajarildi"},
				{Title: "Kutubxonani yangilash", Status: "Bajarildi"},
				{Title: "Hovlini obodonlashtirish", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "5", Name: "34-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.285, Lng: 69.211},
			PromisedWorks: []models.PromisedWork{
				{Title: "Hojatxonani ta'mirlash", Status: "Bajarilmoqda"},
				{Title: "Elektr tizimini yangilash", Status: "Bajarilmoqda"},
				{Title: "Mebel yangilash", Status: "Bajarilmadi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
		{
			ID: "6", Name: "5-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.343, Lng: 69.321},
			PromisedWorks: []models.PromisedWork{
				{Title: "Sport maydonini ta'mirlash", Status: "Bajarildi"},
				{Title: "Sinf xonalarini bo'yash", Status: "Bajarilmoqda"},
				{Title: "Yangi kompyuterlar o'rnatish", Status: "Bajarilmadi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
		{
			ID: "7", Name: "222-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.275, Lng: 69.198},
			PromisedWorks: []models.PromisedWork{
				{Title: "Tom ta'mirlash", Status: "Bajarildi"},
				{Title: "Hojatxonani ta'mirlash", Status: "Bajarildi"},
				{Title: "Sovun dispenserlari o'rnatish", Status: "Bajarildi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "8", Name: "61-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.318, Lng: 69.255},
			PromisedWorks: []models.PromisedWork{
				{Title: "Kutubxona ta'mirlash", Status: "Bajarilmoqda"},
				{Title: "Yangi o'quv qurollari", Status: "Bajarilmadi"},
				{Title: "Derazalarni almashtirish", Status: "Bajarilmadi"},
			},
			Reports: []models.Report{}, CurrentStatus: "Qizil",
		},
		{
			ID: "9", Name: "178-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.291, Lng: 69.267},
			PromisedWorks: []models.PromisedWork{
				{Title: "Aktiv zal ta'mirlash", Status: "Bajarildi"},
				{Title: "Yangi partalar qo'yish", Status: "Bajarildi"},
				{Title: "Bo'yoq ishlari", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Yashil",
		},
		{
			ID: "10", Name: "15-sonli maktab", Type: "Maktab",
			Location: models.Coordinates{Lat: 41.356, Lng: 69.243},
			PromisedWorks: []models.PromisedWork{
				{Title: "Maktab tomini ta'mirlash", Status: "Bajarilmoqda"},
				{Title: "WC ta'mirlash", Status: "Bajarilmadi"},
				{Title: "Sinf qurilishi", Status: "Bajarilmoqda"},
			},
			Reports: []models.Report{}, CurrentStatus: "Sariq",
		},
	}
}
