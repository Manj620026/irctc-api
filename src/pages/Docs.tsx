import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  {
    title: 'Gateway Health',
    method: 'GET',
    path: '/health',
    description: 'Check if the API server is up and running.',
    reqPath: '/health',
    parameters: [],
    response: `{\n  "status": "up",\n  "version": "1.0.2"\n}`
  },
  {
    title: 'Find Trains (Between Stations)',
    method: 'GET',
    path: '/api/v1/trains/search',
    description: 'Discover direct and connecting trains between two station codes.',
    reqPath: '/api/v1/trains/search?from=NDLS&to=PNBE&date=2026-10-22',
    parameters: [
      { name: 'from', in: 'QUERY', type: 'string', required: true, description: 'Source station code' },
      { name: 'to', in: 'QUERY', type: 'string', required: true, description: 'Destination station code' },
      { name: 'date', in: 'QUERY', type: 'string', required: false, description: 'Date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": [\n    {\n      "trainNo": "12304",\n      "trainName": "POORVA EXPRESS",\n      "trainType": "SUPERFAST",\n      "fromStation": "NDLS",\n      "toStation": "PNBE",\n      "fromStationName": "NEW DELHI",\n      "toStationName": "PATNA JN",\n      "trainSrc": "NDLS",\n      "trainDstn": "HWH",\n      "departure": "17:40",\n      "arrival": "06:48",\n      "durationMin": 788,\n      "durationStr": "13:08",\n      "runningDays": ["Wed", "Thu", "Sat", "Sun"],\n      "classes": [],\n      "distance": "995",\n      "estimatedFare": 518,\n      "halts": 9,\n      "fromStationDayOffset": 0,\n      "toStationDayOffset": 1\n    },\n    {\n      "trainNo": "12310",\n      "trainName": "RJPB TEJAS RAJ",\n      "trainType": "RAJDHANI",\n      "fromStation": "NDLS",\n      "toStation": "PNBE",\n      "fromStationName": "NEW DELHI",\n      "toStationName": "PATNA JN",\n      "trainSrc": "NDLS",\n      "trainDstn": "RJPB",\n      "departure": "17:10",\n      "arrival": "04:38",\n      "durationMin": 688,\n      "durationStr": "11:28",\n      "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],\n      "classes": [],\n      "distance": "996",\n      "estimatedFare": 518,\n      "halts": 4,\n      "fromStationDayOffset": 0,\n      "toStationDayOffset": 1\n    }\n  ],\n  "source": "irctc-api",\n  "cached": true,\n  "_time": 4.19\n}`
  },
  {
    title: 'Train by Name',
    method: 'GET',
    path: '/api/v1/trains/search/name',
    description: 'Search for trains using a partial or full name.',
    reqPath: '/api/v1/trains/search/name?name=rajdhani',
    parameters: [
      { name: 'name', in: 'QUERY', type: 'string', required: true, description: 'Partial or full train name' }
    ],
    response: `{\n  "success": true,\n  "data": [\n    {\n      "trainNo": "12301",\n      "trainName": "RAJDHANI EXPRESS",\n      "trainType": "RAJDHANI",\n      "from": "HWH",\n      "to": "NDLS"\n    },\n    {\n      "trainNo": "12302",\n      "trainName": "HWH RAJDHANI",\n      "trainType": "RAJDHANI",\n      "from": "NDLS",\n      "to": "HWH"\n    },\n    {\n      "trainNo": "12305",\n      "trainName": "RAJDHANI EXPRES",\n      "trainType": "RAJDHANI",\n      "from": "HWH",\n      "to": "NDLS"\n    },\n    {\n      "trainNo": "12313",\n      "trainName": "RAJDHANI EXPRES",\n      "trainType": "RAJDHANI",\n      "from": "SDAH",\n      "to": "NDLS"\n    }\n  ],\n  "total": 10,\n  "source": "irctc-api",\n  "cached": true,\n  "_time": 4.301\n}`
  },
  {
    title: 'Train by Number',
    method: 'GET',
    path: '/api/v1/trains/:trainNo',
    description: 'Get the full schedule, halts, timings, and route for a specific 5-digit train number.',
    reqPath: '/api/v1/trains/12309',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "trainNo": "12309",\n    "trainName": "RJPB TEJAS RAJ",\n    "trainType": "RAJDHANI",\n    "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],\n    "totalDistance": 998,\n    "originCode": "RJPB",\n    "destinationCode": "NDLS",\n    "stationCodes": ["RJPB", "PNBE", "DNR", "DDU", "PRYJ", "CNB", "NDLS"],\n    "stations": [\n      {\n        "seq": 1,\n        "code": "RJPB",\n        "name": "RAJENDRA NAGAR",\n        "arrival": null,\n        "departure": "19:10",\n        "arrivalMin": null,\n        "departureMin": 1150,\n        "dayOffset": 0,\n        "haltMinutes": 0,\n        "distanceKm": 0,\n        "lat": 25.6027429,\n        "lng": 85.1626146\n      },\n      {\n        "seq": 2,\n        "code": "PNBE",\n        "name": "PATNA JN",\n        "arrival": "19:23",\n        "departure": "19:30",\n        "arrivalMin": 1163,\n        "departureMin": 1170,\n        "dayOffset": 0,\n        "haltMinutes": 7,\n        "distanceKm": 2,\n        "lat": 25.6032109,\n        "lng": 85.1376861\n      },\n      {\n        "seq": 6,\n        "code": "CNB",\n        "name": "KANPUR CENTRAL",\n        "arrival": "02:15",\n        "departure": "02:20",\n        "arrivalMin": 135,\n        "departureMin": 140,\n        "dayOffset": 1,\n        "haltMinutes": 5,\n        "distanceKm": 557,\n        "lat": 26.4538613,\n        "lng": 80.3512433\n      },\n      {\n        "seq": 7,\n        "code": "NDLS",\n        "name": "NEW DELHI",\n        "arrival": "07:40",\n        "departure": null,\n        "arrivalMin": 460,\n        "departureMin": null,\n        "dayOffset": 1,\n        "haltMinutes": 0,\n        "distanceKm": 998,\n        "lat": 28.6428915,\n        "lng": 77.2190894\n      }\n    ],\n    "convertedAt": "2026-07-08T11:06:03.313Z",\n    "dataVersion": 2\n  },\n  "source": "irctc-api",\n  "cached": true,\n  "_time": 4.218\n}`
  },
  {
    title: 'Fare Lookup',
    method: 'GET',
    path: '/api/v1/trains/:trainNo/fare',
    description: 'Fetch real-time official IRCTC train ticket fare breakup (Base, Reservation, Superfast, GST, Catering) for all running classes or a specific class.',
    reqPath: '/api/v1/trains/12558/fare?from=ANVT&to=MFP&class=all&quota=GN',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number (e.g. 12558)' },
      { name: 'from', in: 'QUERY', type: 'string', required: true, description: 'Origin station code (e.g. ANVT)' },
      { name: 'to', in: 'QUERY', type: 'string', required: true, description: 'Destination station code (e.g. MFP)' },
      { name: 'class', in: 'QUERY', type: 'string', required: false, description: 'Travel class code (1A, 2A, 3A, 3E, CC, EC, SL, 2S, or all). Default: all' },
      { name: 'quota', in: 'QUERY', type: 'string', required: false, description: 'Quota code (GN for General). Default: GN' }
    ],
    response: `{\n  "success": true,\n  "trainNumber": "12558",\n  "trainName": "Sapt Kranti Exp",\n  "from": "ANVT",\n  "to": "MFP",\n  "quota": "GN",\n  "category": "Adult",\n  "availableClasses": [\n    { "code": "1A", "name": "First AC" },\n    { "code": "2A", "name": "Second AC" },\n    { "code": "3A", "name": "Third AC" },\n    { "code": "3E", "name": "AC 3 Tier Economy" },\n    { "code": "SL", "name": "Sleeper" }\n  ],\n  "availableQuotas": [\n    { "code": "GN", "name": "General Quota" },\n    { "code": "TQ", "name": "Tatkal Quota" }\n  ],\n  "totalClasses": 5,\n  "fares": [\n    {\n      "class": "1A",\n      "className": "First AC",\n      "totalFare": 3410,\n      "breakup": {\n        "baseFare": 3112,\n        "reservationCharge": 60,\n        "superfastCharge": 75,\n        "gst": 163,\n        "cateringCharge": 0,\n        "dynamicFare": 0\n      }\n    },\n    {\n      "class": "2A",\n      "className": "Second AC",\n      "totalFare": 2040,\n      "breakup": {\n        "baseFare": 1848,\n        "reservationCharge": 50,\n        "superfastCharge": 45,\n        "gst": 97,\n        "cateringCharge": 0,\n        "dynamicFare": 0\n      }\n    },\n    {\n      "class": "3A",\n      "className": "Third AC",\n      "totalFare": 1445,\n      "breakup": {\n        "baseFare": 1291,\n        "reservationCharge": 40,\n        "superfastCharge": 45,\n        "gst": 69,\n        "cateringCharge": 0,\n        "dynamicFare": 0\n      }\n    },\n    {\n      "class": "3E",\n      "className": "AC 3 Tier Economy",\n      "totalFare": 1350,\n      "breakup": {\n        "baseFare": 1200,\n        "reservationCharge": 40,\n        "superfastCharge": 45,\n        "gst": 65,\n        "cateringCharge": 0,\n        "dynamicFare": 0\n      }\n    },\n    {\n      "class": "SL",\n      "className": "Sleeper",\n      "totalFare": 565,\n      "breakup": {\n        "baseFare": 515,\n        "reservationCharge": 20,\n        "superfastCharge": 30,\n        "gst": 0,\n        "cateringCharge": 0,\n        "dynamicFare": 0\n      }\n    }\n  ],\n  "_cached": true,\n  "_time": 4.372\n}`
  },
  {
    title: 'Seat Availability',
    method: 'GET',
    path: '/api/v1/trains/:trainNo/availability',
    description: 'Query real-time official Indian Railways (CRIS) seat & berth availability across travel classes (1A, 2A, 3A, 3E, CC, SL) and quotas (GN, TQ, PT, LD). Returns an authentic 14-day availability calendar forecast with exact confirmation status.',
    reqPath: '/api/v1/trains/12557/availability?from=NKE&to=ANVT&date=17-11-2026&class=3A&quota=GN',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number (e.g. 12557)' },
      { name: 'from', in: 'QUERY', type: 'string', required: true, description: 'Origin station code (e.g. NKE)' },
      { name: 'to', in: 'QUERY', type: 'string', required: true, description: 'Destination station code (e.g. ANVT)' },
      { name: 'date', in: 'QUERY', type: 'string', required: true, description: 'Journey date in DD-MM-YYYY format (e.g. 17-11-2026)' },
      { name: 'class', in: 'QUERY', type: 'string', required: false, description: 'Travel class code (1A, 2A, 3A, 3E, CC, EC, SL). Default: 3A' },
      { name: 'quota', in: 'QUERY', type: 'string', required: false, description: 'Quota code (GN, TQ, PT, LD). Default: GN' }
    ],
    response: `{\n  "success": true,\n  "trainNumber": "12557",\n  "trainName": "SAPT KRANTI EXP",\n  "from": "NKE",\n  "to": "ANVT",\n  "date": "17-11-2026",\n  "class": "3A",\n  "quota": "GN",\n  "availability": [\n    {\n      "date": "2026-11-17",\n      "status": "REGRET/GNWL151",\n      "type": "REGRET",\n      "currentBooking": "N"\n    },\n    {\n      "date": "2026-11-18",\n      "status": "GNWL271/WL140",\n      "type": "WAITLIST",\n      "currentBooking": "N"\n    },\n    {\n      "date": "2026-11-19",\n      "status": "GNWL200/WL138",\n      "type": "WAITLIST",\n      "currentBooking": "N"\n    },\n    {\n      "date": "2026-11-20",\n      "status": "GNWL160/WL110",\n      "type": "WAITLIST",\n      "currentBooking": "N"\n    },\n    {\n      "date": "2026-11-21",\n      "status": "AVAILABLE-0042",\n      "type": "AVAILABLE",\n      "currentBooking": "N"\n    }\n  ],\n  "source": "irctc-api",\n  "_cached": true,\n  "_time": 1.482\n}`
  },
  {
    title: 'Vacant Seats After Chart Preparation',
    method: 'GET',
    path: '/api/v1/trains/:trainNo/chart-vacant',
    description: 'Query real-time vacant berths post-charting (First & Second reservation charts) from official IRCTC Online Charts. Returns coach composition, total vacant berths, class summary, and berth-by-berth allocations for Current Booking & TTE allotment.',
    reqPath: '/api/v1/trains/12557/chart-vacant?boardingStation=NKE&class=ALL',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number (e.g. 12557)' },
      { name: 'boardingStation', in: 'QUERY', type: 'string', required: true, description: 'Boarding station code (e.g. NKE)' },
      { name: 'date', in: 'QUERY', type: 'string', required: false, description: 'Journey date in YYYY-MM-DD or DD-MM-YYYY format (defaults to today)' },
      { name: 'class', in: 'QUERY', type: 'string', required: false, description: 'Travel class code (1A, 2A, 3A, 3E, SL, or ALL). Default: ALL' }
    ],
    response: `{\n  "success": true,\n  "trainNumber": "12557",\n  "trainName": "SAPT KRANTI EXP",\n  "boardingStation": "NKE",\n  "from": "MFP",\n  "to": "ANVT",\n  "date": "2026-10-23",\n  "chartStatus": {\n    "isChartPrepared": true,\n    "firstChartTime": "2026-10-22 22:46:19",\n    "currentChartTime": "2026-10-23 11:09:00",\n    "remoteStation": "MFP",\n    "nextRemoteStation": "GKP"\n  },\n  "totalVacantBerths": 85,\n  "summaryByClass": {\n    "2A": 85,\n    "3A": 0,\n    "1A": 0,\n    "3E": 0,\n    "SL": 0\n  },\n  "vacantBerths": [\n    {\n      "coach": "A1",\n      "class": "2A",\n      "berthNo": 2,\n      "berthType": "Upper",\n      "berthCode": "U",\n      "cabin": "1",\n      "from": "MFP",\n      "to": "SGL"\n    }\n  ],\n  "coaches": [\n    { "coach": "A1", "class": "2A", "position": 0, "vacantBerths": 85 },\n    { "coach": "B1", "class": "3A", "position": 0, "vacantBerths": 0 }\n  ],\n  "source": "irctc-charts",\n  "syncedAt": "2026-10-23T06:15:00.000Z",\n  "_cached": true,\n  "_time": 0.385\n}`
  },
  {
    title: 'Cancelled Trains',
    method: 'GET',
    path: '/api/v1/trains/cancelled',
    description: 'Fetch daily fully and partially cancelled trains across Indian Railways.',
    reqPath: '/api/v1/trains/cancelled',
    parameters: [],
    response: `{\n  "success": true,\n  "date": "22-10-2026",\n  "dateISO": "2026-10-22",\n  "total": 57,\n  "fullyCancelledCount": 16,\n  "partiallyCancelledCount": 41,\n  "trains": [\n    {\n      "trainNumber": "11002",\n      "trainName": "NANDIGRAM EXP",\n      "source": "BALHARSHAH",\n      "destination": "C SHIVAJI MAH T",\n      "trainType": "EXPRESS",\n      "isPartial": true,\n      "cancellationType": "PARTIALLY_CANCELLED",\n      "cancelledFromStation": "DR",\n      "cancelledToStation": "CSMT",\n      "startDate": "22-10-2026",\n      "railwayTimestamp": "2026-10-01T10:34:23.286000"\n    },\n    {\n      "trainNumber": "11020",\n      "trainName": "KONARK EXPRESS",\n      "source": "BHUBANESWAR NEW JN",\n      "destination": "C SHIVAJI MAH T",\n      "trainType": "EXPRESS",\n      "isPartial": true,\n      "cancellationType": "PARTIALLY_CANCELLED",\n      "cancelledFromStation": "DR",\n      "cancelledToStation": "CSMT",\n      "startDate": "22-10-2026",\n      "railwayTimestamp": "2026-10-01T06:09:16.748000"\n    },\n    {\n      "trainNumber": "17005",\n      "trainName": "HYB RXL EXP",\n      "source": "HYDERABAD",\n      "destination": "RAXAUL JN",\n      "trainType": "EXPRESS",\n      "isPartial": false,\n      "cancellationType": "FULLY_CANCELLED",\n      "cancelledFromStation": "HYB",\n      "cancelledToStation": "RXL",\n      "startDate": "22-10-2026",\n      "railwayTimestamp": "2026-07-25T07:16:27.562000"\n    }\n  ],\n  "syncedAt": "2026-10-22T05:29:12.943Z",\n  "_time": 3.852\n}`
  },
  {
    title: 'Station by Name',
    method: 'GET',
    path: '/api/v1/trains/stations',
    description: 'Lightning-fast autocomplete search for railway stations by name or exact code.',
    reqPath: '/api/v1/trains/stations?q=patna',
    parameters: [
      { name: 'q', in: 'QUERY', type: 'string', required: true, description: 'Search query' }
    ],
    response: `{\n  "success": true,\n  "data": [\n    {\n      "code": "PNBE",\n      "name": "Patna Jn",\n      "state": "Patna"\n    },\n    {\n      "code": "PNC",\n      "name": "Patna Saheb",\n      "state": "Patna"\n    }\n  ],\n  "source": "irctc-api",\n  "degraded": false,\n  "cached": true,\n  "_time": 4.679\n}`
  },
  {
    title: 'Station Timetable',
    method: 'GET',
    path: '/api/v1/trains/stations/:code/timetable/:date',
    description: 'Get a complete list of all trains arriving or departing from a specific station on a given date.',
    reqPath: '/api/v1/trains/stations/NDLS/timetable/2026-10-22',
    parameters: [
      { name: 'code', in: 'PATH', type: 'string', required: true, description: 'Station code' },
      { name: 'date', in: 'PATH', type: 'string', required: true, description: 'Date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "stationCode": "NDLS",\n    "day": "Thu",\n    "total": 241,\n    "trains": [\n      {\n        "trainNo": "12004",\n        "trainName": "LKO SHTBDI EXP",\n        "trainType": "SHATABDI",\n        "arrival": null,\n        "departure": "06:10",\n        "dayOffset": 0,\n        "from": "NDLS",\n        "to": "LKO",\n        "runsOn": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]\n      },\n      {\n        "trainNo": "12040",\n        "trainName": "KATHGODAM SHTBDI",\n        "trainType": "SHATABDI",\n        "arrival": null,\n        "departure": "06:20",\n        "dayOffset": 0,\n        "from": "NDLS",\n        "to": "KGM",\n        "runsOn": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]\n      },\n      {\n        "trainNo": "12310",\n        "trainName": "RJPB TEJAS RAJ",\n        "trainType": "RAJDHANI",\n        "arrival": null,\n        "departure": "17:10",\n        "dayOffset": 0,\n        "from": "NDLS",\n        "to": "RJPB",\n        "runsOn": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]\n      }\n    ]\n  },\n  "source": "irctc-api",\n  "cached": true,\n  "_time": 7.458\n}`
  },
  {
    title: 'Station by Code',
    method: 'GET',
    path: '/api/v1/trains/stations/:code',
    description: 'Fetch detailed information about a station including its full name, zone, and location.',
    reqPath: '/api/v1/trains/stations/NDLS',
    parameters: [
      { name: 'code', in: 'PATH', type: 'string', required: true, description: 'Station code' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "code": "NDLS",\n    "name": "New Delhi",\n    "state": "Delhi"\n  },\n  "source": "redis_offline",\n  "cached": true,\n  "_time": 3.685\n}`
  },
  {
    title: 'Live Train Running Status',
    method: 'GET',
    path: '/api/v1/live/:trainNo',
    description: 'Get real-time running status, current station, delay, and upcoming halts.',
    reqPath: '/api/v1/live/12558?date=2026-10-22',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number' },
      { name: 'date', in: 'QUERY', type: 'string', required: false, description: 'Journey date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "trainNumber": "12558",\n    "trainName": "Sapt Kranti Exp",\n    "currentLocation": "Anand Vihar Trm",\n    "locationStatus": "yet to start",\n    "currentDelayMin": 0,\n    "currentDelayStr": "Right Time",\n    "lastUpdated": "22 Oct 2026 00:05",\n    "totalDistanceKm": 1060,\n    "totalHalts": 18,\n    "stops": [\n      {\n        "stationName": "Anand Vihar Trm",\n        "day": 1,\n        "date": "22-Oct",\n        "arrives": "14:35",\n        "departs": "14:50",\n        "delayMin": 0,\n        "delayStr": "Right Time",\n        "isOnTime": true,\n        "status": "upcoming",\n        "distanceKm": 0\n      },\n      {\n        "stationName": "Moradabad",\n        "day": 1,\n        "date": "22-Oct",\n        "arrives": "17:05",\n        "departs": "17:13",\n        "delayMin": 0,\n        "delayStr": "Right Time",\n        "isOnTime": true,\n        "status": "upcoming",\n        "distanceKm": 154\n      },\n      {\n        "stationName": "Gorakhpur Jn",\n        "day": 2,\n        "date": "23-Oct",\n        "arrives": "03:37",\n        "departs": "03:47",\n        "delayMin": 0,\n        "delayStr": "Right Time",\n        "isOnTime": true,\n        "status": "upcoming",\n        "distanceKm": 750\n      },\n      {\n        "stationName": "Muzaffarpur Jn",\n        "day": 2,\n        "date": "23-Oct",\n        "arrives": "11:05",\n        "departs": null,\n        "delayMin": 0,\n        "delayStr": "Right Time",\n        "isOnTime": true,\n        "status": "upcoming",\n        "distanceKm": 1060\n      }\n    ],\n    "updatedAt": "2026-10-22T05:38:30.080Z"\n  },\n  "source": "irctc-api",\n  "_time": 625.362\n}`
  },
  {
    title: 'Live Station Display Board',
    method: 'GET',
    path: '/api/v1/live/station/:stationCode',
    description: 'Real-time train arrivals and departures board from NTES with platform, delay, and coach info.',
    reqPath: '/api/v1/live/station/NDLS?hours=2',
    parameters: [
      { name: 'stationCode', in: 'PATH', type: 'string', required: true, description: 'Station code (e.g. NDLS, HWH, BCT)' },
      { name: 'hours', in: 'QUERY', type: 'number', required: false, description: 'Time window: 2, 4, or 8 hours (default: 2)' },
      { name: 'toStation', in: 'QUERY', type: 'string', required: false, description: 'Optional destination filter station code' }
    ],
    response: `{\n  "success": true,\n  "stationCode": "NDLS",\n  "stationName": "NEW DELHI",\n  "totalTrains": 43,\n  "trains": [\n    {\n      "trainNo": "64567",\n      "trainName": "BSC-TKJ MEMU",\n      "route": "BSC-TKJ",\n      "trainType": "MEMU GEN",\n      "platform": {\n        "number": "5",\n        "isProvisional": false\n      },\n      "hasCoachPosition": true,\n      "arrival": {\n        "isSource": false,\n        "scheduled": "08:56",\n        "actualOrEstimated": "10:28",\n        "delay": "01:32 Hrs.",\n        "delayMinutes": 92,\n        "status": "DELAYED"\n      },\n      "departure": {\n        "isDestination": false,\n        "scheduled": "08:58",\n        "actualOrEstimated": "10:29*",\n        "delay": "01:31 Hrs.",\n        "delayMinutes": 91,\n        "status": "DELAYED"\n      }\n    },\n    {\n      "trainNo": "12004",\n      "trainName": "LKO SHTBDI EXP",\n      "route": "NDLS-LKO",\n      "trainType": "SHATABDI",\n      "platform": {\n        "number": "1",\n        "isProvisional": false\n      },\n      "hasCoachPosition": true,\n      "arrival": {\n        "isSource": true,\n        "scheduled": null,\n        "actualOrEstimated": null,\n        "delay": "Originates Here",\n        "delayMinutes": 0,\n        "status": "SOURCE"\n      },\n      "departure": {\n        "isDestination": false,\n        "scheduled": "06:10",\n        "actualOrEstimated": "06:10",\n        "delay": "On Time",\n        "delayMinutes": 0,\n        "status": "ON_TIME"\n      }\n    }\n  ],\n  "hours": 2,\n  "toStation": null,\n  "queryTime": "2026-10-22T05:38:40.781Z",\n  "_time": 8286.1\n}`
  },
  {
    title: 'PNR Status',
    method: 'GET',
    path: '/api/v1/pnr/:pnr',
    description: 'Fetch real-time current PNR status, passenger info, and charting status.',
    reqPath: '/api/v1/pnr/2265248473',
    parameters: [
      { name: 'pnr', in: 'PATH', type: 'string', required: true, description: '10-digit PNR number' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "pnr": "2265248473",\n    "trainNumber": "15726",\n    "trainName": "ANVT NJP EXP",\n    "from": {\n      "code": "MFP",\n      "time": "10:05",\n      "name": "Muzaffarpur Jn"\n    },\n    "to": {\n      "code": "NJP",\n      "time": "18:45",\n      "name": "New Jalpaiguri"\n    },\n    "journeyDate": "23-11-2026",\n    "class": "SL",\n    "quota": "GN",\n    "expectedPlatform": "1",\n    "chartStatus": "chart not prepared",\n    "passengers": [\n      {\n        "number": 1,\n        "status": "CNF",\n        "coach": "S4",\n        "seat": "65",\n        "berth": "LOWER BERTH",\n        "raw": "Confirm S4-65"\n      },\n      {\n        "number": 2,\n        "status": "CNF",\n        "coach": "S4",\n        "seat": "66",\n        "berth": "MIDDLE BERTH",\n        "raw": "Confirm S4-66"\n      }\n    ],\n    "updatedAt": "2026-10-22T05:38:53.636Z"\n  },\n  "source": "irctc-api",\n  "_time": 8331.709\n}`
  }
];

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';

const getSnippet = (lang: string, path: string): string => {
  const url = `${BASE_URL}${path}`;
  if (lang === 'JavaScript') {
    return `const response = await fetch("${url}", {\n  method: "GET",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "accept": "application/json",\n  },\n});\n\nconst data = await response.json();\nconsole.log(data);`;
  }
  if (lang === 'Python') {
    return `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "accept": "application/json"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`;
  }
  if (lang === 'cURL') {
    return `curl -X GET "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "accept: application/json"`;
  }
  return '';
};

// FE-SEC-04: Pure React JSON syntax highlighter eliminating dangerouslySetInnerHTML XSS sinks
const renderHighlightedJson = (jsonString: string) => {
  const lines = jsonString.split('\n');
  return lines.map((line, i) => {
    const keyMatch = line.match(/^(\s*)(".*?":)(.*)$/);
    if (keyMatch) {
      const [, indent, keyStr, rest] = keyMatch;
      let valueColor = 'text-textMain';
      if (rest.includes('true') || rest.includes('false') || rest.includes('null')) valueColor = 'text-[#f81ce5]';
      else if (/\d/.test(rest)) valueColor = 'text-[#f5a623]';
      else if (rest.includes('"')) valueColor = 'text-[#50e3c2]';
      return (
        <div key={i} className="font-mono text-[13px] leading-relaxed">
          <span className="whitespace-pre">{indent}</span>
          <span className="text-[#3291ff]">{keyStr}</span>
          <span className={valueColor}>{rest}</span>
        </div>
      );
    }
    return <div key={i} className="text-[#888888] font-mono text-[13px] leading-relaxed whitespace-pre">{line || ' '}</div>;
  });
};

// FE-SEC-04: Pure React snippet token renderer eliminating raw HTML injection sinks
const renderSnippet = (code: string) => {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    let content: React.ReactNode = line;
    if (line.startsWith('const ') || line.startsWith('import ') || line.startsWith('curl ')) {
      const firstSpace = line.indexOf(' ');
      const keyword = line.slice(0, firstSpace);
      const remainder = line.slice(firstSpace);
      content = (
        <>
          <span className="text-[#f81ce5]">{keyword}</span>
          <span className="text-[#ededed]">{remainder}</span>
        </>
      );
    }
    return (
      <div key={i} className="font-mono text-[13px] leading-relaxed whitespace-pre">
        {content || ' '}
      </div>
    );
  });
};

export default function Docs() {
  const [activeLang, setActiveLang] = useState('JavaScript');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<number, 'req' | 'res'>>({});

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleTab = (idx: number, tab: 'req' | 'res') => {
    setActiveTabs(prev => ({ ...prev, [idx]: tab }));
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col pt-16 pb-32"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="max-w-3xl mb-12 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-3 sm:mb-5 text-textMain">API Reference</h2>
        <p className="text-textMuted text-sm sm:text-lg leading-relaxed mb-6 sm:mb-10 max-w-2xl">
          Integrate the IRCTC API into your application. Authenticate your requests using your secret API keys and fetch real-time Indian Railways data instantly.
        </p>

        {/* Global Language Switcher - Sleek Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-textMuted/60">Language:</span>
          <div className="grid grid-cols-3 sm:flex bg-[#111] p-1 rounded-lg border border-white/[0.05] shadow-inner w-full sm:w-auto">
            {['JavaScript', 'Python', 'cURL'].map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`py-2 px-3 sm:px-6 text-center text-xs font-medium rounded-md transition-all duration-200 active:scale-[0.97] ${
                  activeLang === lang 
                    ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' 
                    : 'text-textMuted hover:text-textMain hover:bg-white/[0.02]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ENDPOINTS LIST - 40/60 Split Layout */}
      <div className="flex flex-col">
        {ENDPOINTS.map((endpoint, idx) => {
          const snippet = getSnippet(activeLang, endpoint.reqPath);
          const currentTab = activeTabs[idx] || 'req';
          
          return (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-white/[0.04] py-10 sm:py-16 first:pt-0 first:border-0"
            >
              
              {/* Left Column: Docs Info (Takes up 5 cols out of 12) */}
              <div className="lg:col-span-5 flex flex-col pt-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-textMain">{endpoint.title}</h4>
                </div>
                
                <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  {endpoint.description}
                </p>

                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#111] border border-white/[0.08] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] text-white shadow-sm hover:border-white/20 transition-colors cursor-default max-w-full">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider shrink-0">{endpoint.method}</span> 
                    <span className="text-white/80 truncate">{endpoint.path}</span>
                  </div>
                </div>

                {/* Parameters Section */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-textMuted/70 mb-3 sm:mb-4">Parameters</h5>
                    <div className="border-t border-white/[0.05]">
                      {endpoint.parameters.map((param, pIdx) => (
                        <div key={pIdx} className="py-2.5 sm:py-3 border-b border-white/[0.03] flex flex-col gap-1 sm:gap-1.5">
                          <div className="flex items-center gap-2">
                            <code className="text-[11px] sm:text-[12px] font-mono text-emerald-400">{param.name}</code>
                            {param.required && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-[#ff5f56] bg-[#ff5f56]/10 px-1.5 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-textMuted/60">
                            <span>in: <span className="text-textMuted">{param.in.toLowerCase()}</span></span>
                            <span>&bull;</span>
                            <span>type: <span className="text-textMuted">{param.type}</span></span>
                          </div>
                          <p className="text-xs sm:text-sm text-textMuted/90 mt-0.5 sm:mt-1">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Terminal Window (Takes up 7 cols out of 12) */}
              <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-[#000] border border-white/[0.08] shadow-2xl">
                {/* Terminal Header with Tabs */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#161616] border-b border-white/[0.05] gap-2">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  
                  {/* Request / Response Tabs */}
                  <div className="flex items-center bg-[#0a0a0a] rounded-md p-0.5 sm:p-1 border border-white/[0.03]">
                    <button
                      onClick={() => toggleTab(idx, 'req')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-sm transition-all active:scale-[0.97] ${
                        currentTab === 'req'
                          ? 'bg-[#222] text-white shadow-sm'
                          : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      Request
                    </button>
                    <button
                      onClick={() => toggleTab(idx, 'res')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-sm transition-all active:scale-[0.97] ${
                        currentTab === 'res'
                          ? 'bg-[#222] text-white shadow-sm'
                          : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      Response
                    </button>
                  </div>

                  <button
                    onClick={() => copyCode(currentTab === 'req' ? snippet : endpoint.response || '', idx)}
                    className="flex items-center gap-1.5 text-[10px] font-medium text-textMuted hover:text-white active:scale-[0.95] transition-all ml-auto px-2 py-1 rounded bg-[#0a0a0a] border border-white/[0.04]"
                  >
                    {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedIndex === idx ? 'COPIED' : 'COPY'}
                  </button>
                </div>

                {/* Terminal Body */}
                <div className="p-4 sm:p-6 overflow-x-auto min-h-[250px] sm:min-h-[350px]">
                  <AnimatePresence mode="wait">
                    {currentTab === 'req' ? (
                      <motion.div
                        key="req"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {renderSnippet(snippet)}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="res"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {renderHighlightedJson(endpoint.response || '{}')}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
