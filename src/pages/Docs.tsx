import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight, FileCode, Download, BookOpen, Layers } from 'lucide-react';

const ENDPOINT_FEATURE_MAP: Record<string, { slug: string; label: string }> = {
  '/api/v1/pnr/:pnr': { slug: '/pnr-status-api', label: 'View Standalone PNR Status API Guide' },
  '/api/v1/trains/:trainNo/availability': { slug: '/irctc-seats-availability-api', label: 'View 14-Day Seat Forecast Guide' },
  '/api/v1/trains/:trainNo/chart-vacant': { slug: '/chart-vacant-berths-api', label: 'View Chart Vacant Berths Guide' },
  '/api/v1/live/:trainNo': { slug: '/live-train-status-api', label: 'View Live Train Status Guide' },
  '/api/v1/trains/search': { slug: '/trains-between-stations-api', label: 'View Route Search API Guide' },
  '/api/v1/trains/:trainNo/fare': { slug: '/train-fare-api', label: 'View Train Fare Breakup Guide' },
  '/api/v1/trains/:trainNo': { slug: '/train-schedule-api', label: 'View Train Schedule & GPS Guide' },
};

const ENDPOINTS = [
  {
    "title": "Gateway Health",
    "method": "GET",
    "path": "/health",
    "description": "Check if the API server is up and running.",
    "reqPath": "/health",
    "parameters": [],
    "response": "{\n  \"status\": \"up\",\n  \"version\": \"1.0.2\"\n}"
  },
  {
    "title": "Find Trains (Between Stations)",
    "method": "GET",
    "path": "/api/v1/trains/search",
    "description": "Discover direct running trains between any two station codes with travel duration, distance, and running days.",
    "reqPath": "/api/v1/trains/search?from=NDLS&to=GD&date=2026-10-24",
    "parameters": [
      {
        "name": "from",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Source station code (e.g. NDLS)"
      },
      {
        "name": "to",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Destination station code (e.g. GD)"
      },
      {
        "name": "date",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Journey date in YYYY-MM-DD format"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": [\n    {\n      \"trainNo\": \"12556\",\n      \"trainName\": \"GORAKHDHAM EXP\",\n      \"trainType\": \"SUPERFAST\",\n      \"fromStation\": \"NDLS\",\n      \"toStation\": \"GD\",\n      \"fromStationName\": \"NEW DELHI\",\n      \"toStationName\": \"GONDA JN\",\n      \"trainSrc\": \"BTI\",\n      \"trainDstn\": \"GKP\",\n      \"departure\": \"21:25\",\n      \"arrival\": \"07:00\",\n      \"durationMin\": 575,\n      \"durationStr\": \"9:35\",\n      \"runningDays\": [\n        \"Mon\",\n        \"Tue\",\n        \"Wed\",\n        \"Thu\",\n        \"Fri\",\n        \"Sat\",\n        \"Sun\"\n      ],\n      \"classes\": [],\n      \"distance\": \"631\",\n      \"estimatedFare\": 372,\n      \"halts\": 4,\n      \"fromStationDayOffset\": 0,\n      \"toStationDayOffset\": 1\n    },\n    {\n      \"trainNo\": \"12566\",\n      \"trainName\": \"BIHAR S KRANTI\",\n      \"trainType\": \"SUPERFAST\",\n      \"fromStation\": \"NDLS\",\n      \"toStation\": \"GD\",\n      \"fromStationName\": \"NEW DELHI\",\n      \"toStationName\": \"GONDA JN\",\n      \"trainSrc\": \"NDLS\",\n      \"trainDstn\": \"DBG\",\n      \"departure\": \"12:45\",\n      \"arrival\": \"22:26\",\n      \"durationMin\": 581,\n      \"durationStr\": \"9:41\",\n      \"runningDays\": [\n        \"Mon\",\n        \"Tue\",\n        \"Wed\",\n        \"Thu\",\n        \"Fri\",\n        \"Sat\",\n        \"Sun\"\n      ],\n      \"classes\": [],\n      \"distance\": \"639\",\n      \"estimatedFare\": 376,\n      \"halts\": 4,\n      \"fromStationDayOffset\": 0,\n      \"toStationDayOffset\": 0\n    },\n    {\n      \"trainNo\": \"15566\",\n      \"trainName\": \"VAISHALI EXP\",\n      \"trainType\": \"MAIL_EXPRESS\",\n      \"fromStation\": \"NDLS\",\n      \"toStation\": \"GD\",\n      \"fromStationName\": \"NEW DELHI\",\n      \"toStationName\": \"GONDA JN\",\n      \"trainSrc\": \"NDLS\",\n      \"trainDstn\": \"LLP\",\n      \"departure\": \"20:40\",\n      \"arrival\": \"06:33\",\n      \"durationMin\": 593,\n      \"durationStr\": \"9:53\",\n      \"runningDays\": [\n        \"Mon\",\n        \"Tue\",\n        \"Wed\",\n        \"Thu\",\n        \"Fri\",\n        \"Sat\",\n        \"Sun\"\n      ],\n      \"classes\": [],\n      \"distance\": \"639\",\n      \"estimatedFare\": 376,\n      \"halts\": 8,\n      \"fromStationDayOffset\": 0,\n      \"toStationDayOffset\": 1\n    }\n  ],\n  \"source\": \"irctc-api\",\n  \"isLive\": false\n}"
  },
  {
    "title": "Train by Name",
    "method": "GET",
    "path": "/api/v1/trains/search/name",
    "description": "Search for trains using a partial or full name.",
    "reqPath": "/api/v1/trains/search/name?name=duronto",
    "parameters": [
      {
        "name": "name",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Partial or full train name (min 2 chars, e.g. duronto)"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": [\n    {\n      \"trainNo\": \"12213\",\n      \"trainName\": \"YPR DEE DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"YPR\",\n      \"to\": \"DEE\"\n    },\n    {\n      \"trainNo\": \"12214\",\n      \"trainName\": \"DEE YPR DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"DEE\",\n      \"to\": \"YPR\"\n    },\n    {\n      \"trainNo\": \"12219\",\n      \"trainName\": \"SC DURONTO EXP\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"LTT\",\n      \"to\": \"SC\"\n    },\n    {\n      \"trainNo\": \"12220\",\n      \"trainName\": \"LTT DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"SC\",\n      \"to\": \"LTT\"\n    },\n    {\n      \"trainNo\": \"12221\",\n      \"trainName\": \"HOWRAH DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"PUNE\",\n      \"to\": \"HWH\"\n    },\n    {\n      \"trainNo\": \"12222\",\n      \"trainName\": \"PUNE DURONTO EX\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"HWH\",\n      \"to\": \"PUNE\"\n    },\n    {\n      \"trainNo\": \"12223\",\n      \"trainName\": \"LTT ERS DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"LTT\",\n      \"to\": \"ERS\"\n    },\n    {\n      \"trainNo\": \"12224\",\n      \"trainName\": \"ERS LTT DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"ERS\",\n      \"to\": \"LTT\"\n    },\n    {\n      \"trainNo\": \"12227\",\n      \"trainName\": \"INDB DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"MMCT\",\n      \"to\": \"INDB\"\n    },\n    {\n      \"trainNo\": \"12228\",\n      \"trainName\": \"MMCT DURONTO\",\n      \"trainType\": \"DURONTO\",\n      \"from\": \"INDB\",\n      \"to\": \"MMCT\"\n    }\n  ],\n  \"total\": 10,\n  \"source\": \"irctc-api\"\n}"
  },
  {
    "title": "Cancelled Trains",
    "method": "GET",
    "path": "/api/v1/trains/cancelled",
    "description": "Fetch daily fully and partially cancelled trains across Indian Railways with 0ms cache.",
    "reqPath": "/api/v1/trains/cancelled",
    "parameters": [],
    "response": "{\n  \"success\": true,\n  \"date\": \"23-10-2026\",\n  \"dateISO\": \"2026-10-23\",\n  \"total\": 65,\n  \"fullyCancelledCount\": 17,\n  \"partiallyCancelledCount\": 48,\n  \"trains\": [\n    {\n      \"trainNumber\": \"11002\",\n      \"trainName\": \"NANDIGRAM EXP\",\n      \"source\": \"BALHARSHAH\",\n      \"destination\": \"C SHIVAJI MAH T\",\n      \"trainType\": \"EXPRESS\",\n      \"isPartial\": true,\n      \"cancellationType\": \"PARTIALLY_CANCELLED\",\n      \"cancelledFromStation\": \"DR\",\n      \"cancelledToStation\": \"CSMT\",\n      \"startDate\": \"23-10-2026\",\n      \"railwayTimestamp\": \"2026-10-01T10:34:23.288000\"\n    },\n    {\n      \"trainNumber\": \"11020\",\n      \"trainName\": \"KONARK EXPRESS\",\n      \"source\": \"BHUBANESWAR NEW JN\",\n      \"destination\": \"C SHIVAJI MAH T\",\n      \"trainType\": \"EXPRESS\",\n      \"isPartial\": true,\n      \"cancellationType\": \"PARTIALLY_CANCELLED\",\n      \"cancelledFromStation\": \"DR\",\n      \"cancelledToStation\": \"CSMT\",\n      \"startDate\": \"23-10-2026\",\n      \"railwayTimestamp\": \"2026-10-01T06:09:16.750000\"\n    },\n    {\n      \"trainNumber\": \"12134\",\n      \"trainName\": \"MAJN CSMT SF EXP\",\n      \"source\": \"MANGALORE JN\",\n      \"destination\": \"C SHIVAJI MAH T\",\n      \"trainType\": \"EXPRESS\",\n      \"isPartial\": true,\n      \"cancellationType\": \"PARTIALLY_CANCELLED\",\n      \"cancelledFromStation\": \"TNA\",\n      \"cancelledToStation\": \"CSMT\",\n      \"startDate\": \"23-10-2026\",\n      \"railwayTimestamp\": \"2026-10-01T06:19:18.079000\"\n    },\n    {\n      \"trainNumber\": \"12759\",\n      \"trainName\": \"CHARMINAR SF EXP\",\n      \"source\": \"TAMBARAM\",\n      \"destination\": \"HYDERABAD\",\n      \"trainType\": \"EXPRESS\",\n      \"isPartial\": true,\n      \"cancellationType\": \"PARTIALLY_CANCELLED\",\n      \"cancelledFromStation\": \"TBM\",\n      \"cancelledToStation\": \"MSB\",\n      \"startDate\": \"23-10-2026\",\n      \"railwayTimestamp\": \"2026-09-24T06:39:33.616000\"\n    }\n  ],\n  \"syncedAt\": \"2026-10-23T12:23:57.049Z\",\n  \"isArchivedFallback\": true\n}"
  },
  {
    "title": "Train by Number",
    "method": "GET",
    "path": "/api/v1/trains/:trainNo",
    "description": "Get the full schedule, halts, timings, and route for a specific 5-digit train number.",
    "reqPath": "/api/v1/trains/26502",
    "parameters": [
      {
        "name": "trainNo",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "5-digit train number (e.g. 26502)"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": {\n    \"trainNo\": \"26502\",\n    \"trainName\": \"VANDE BHARAT EXP\",\n    \"trainType\": \"VANDE_BHARAT\",\n    \"runningDays\": [\n      \"Mon\",\n      \"Tue\",\n      \"Wed\",\n      \"Thu\",\n      \"Fri\",\n      \"Sun\"\n    ],\n    \"totalDistance\": 384,\n    \"originCode\": \"GKP\",\n    \"destinationCode\": \"PPTA\",\n    \"stationCodes\": [\n      \"GKP\",\n      \"CPJ\",\n      \"BUG\",\n      \"NKE\",\n      \"BTH\",\n      \"SGL\",\n      \"BMKI\",\n      \"MFP\",\n      \"HJP\",\n      \"PPTA\"\n    ],\n    \"stations\": [\n      {\n        \"seq\": 1,\n        \"code\": \"GKP\",\n        \"name\": \"GORAKHPUR JN\",\n        \"arrival\": null,\n        \"departure\": \"05:40\",\n        \"arrivalMin\": null,\n        \"departureMin\": 340,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 0,\n        \"distanceKm\": 0,\n        \"lat\": 26.7596884,\n        \"lng\": 83.381806,\n        \"arrivalDayOffset\": null\n      },\n      {\n        \"seq\": 2,\n        \"code\": \"CPJ\",\n        \"name\": \"KAPTANGANJ JN\",\n        \"arrival\": \"06:24\",\n        \"departure\": \"06:26\",\n        \"arrivalMin\": 384,\n        \"departureMin\": 386,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 40,\n        \"lat\": 26.9262389,\n        \"lng\": 83.69904849999999,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 3,\n        \"code\": \"BUG\",\n        \"name\": \"BAGAHA\",\n        \"arrival\": \"07:30\",\n        \"departure\": \"07:32\",\n        \"arrivalMin\": 450,\n        \"departureMin\": 452,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 109,\n        \"lat\": 27.1304131,\n        \"lng\": 84.0674887,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 4,\n        \"code\": \"NKE\",\n        \"name\": \"NARKATIAGANJ JN\",\n        \"arrival\": \"08:08\",\n        \"departure\": \"08:10\",\n        \"arrivalMin\": 488,\n        \"departureMin\": 490,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 151,\n        \"lat\": 27.1050503,\n        \"lng\": 84.4627715,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 5,\n        \"code\": \"BTH\",\n        \"name\": \"BETTIAH\",\n        \"arrival\": \"08:36\",\n        \"departure\": \"08:38\",\n        \"arrivalMin\": 516,\n        \"departureMin\": 518,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 187,\n        \"lat\": 26.805388,\n        \"lng\": 84.5223565,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 6,\n        \"code\": \"SGL\",\n        \"name\": \"SAGAULI JN\",\n        \"arrival\": \"08:54\",\n        \"departure\": \"08:56\",\n        \"arrivalMin\": 534,\n        \"departureMin\": 536,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 209,\n        \"lat\": 26.7585186,\n        \"lng\": 84.7397626,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 7,\n        \"code\": \"BMKI\",\n        \"name\": \"BAPUDM MOTIHARI\",\n        \"arrival\": \"09:18\",\n        \"departure\": \"09:20\",\n        \"arrivalMin\": 558,\n        \"departureMin\": 560,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 231,\n        \"lat\": 26.6554373,\n        \"lng\": 84.9050998,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 8,\n        \"code\": \"MFP\",\n        \"name\": \"MUZAFFARPUR JN\",\n        \"arrival\": \"10:45\",\n        \"departure\": \"10:50\",\n        \"arrivalMin\": 645,\n        \"departureMin\": 650,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 5,\n        \"distanceKm\": 310,\n        \"lat\": 26.1223553,\n        \"lng\": 85.3779498,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 9,\n        \"code\": \"HJP\",\n        \"name\": \"HAJIPUR JN\",\n        \"arrival\": \"11:43\",\n        \"departure\": \"11:45\",\n        \"arrivalMin\": 703,\n        \"departureMin\": 705,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 2,\n        \"distanceKm\": 364,\n        \"lat\": 25.7019167,\n        \"lng\": 85.2149445,\n        \"arrivalDayOffset\": 0\n      },\n      {\n        \"seq\": 10,\n        \"code\": \"PPTA\",\n        \"name\": \"PATLIPUTRA\",\n        \"arrival\": \"12:45\",\n        \"departure\": null,\n        \"arrivalMin\": 765,\n        \"departureMin\": null,\n        \"dayOffset\": 0,\n        \"haltMinutes\": 0,\n        \"distanceKm\": 384,\n        \"lat\": 25.6216198,\n        \"lng\": 85.0688695,\n        \"arrivalDayOffset\": 0\n      }\n    ],\n    \"convertedAt\": \"2026-07-08T11:06:11.814Z\",\n    \"dataVersion\": 2\n  },\n  \"source\": \"irctc-api\"\n}"
  },
  {
    "title": "Fare Lookup",
    "method": "GET",
    "path": "/api/v1/trains/:trainNo/fare",
    "description": "Fetch real-time train ticket fare breakup (Base, Reservation, Superfast, GST, Catering) for all running classes or a specific class.",
    "reqPath": "/api/v1/trains/12558/fare?from=ANVT&to=NKE&class=all&quota=GN",
    "parameters": [
      {
        "name": "trainNo",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "5-digit train number (e.g. 12558)"
      },
      {
        "name": "from",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Origin station code (e.g. ANVT)"
      },
      {
        "name": "to",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Destination station code (e.g. NKE)"
      },
      {
        "name": "class",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Travel class code (1A, 2A, 3A, 3E, SL, or all). Default: all"
      },
      {
        "name": "quota",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Quota code (GN for General). Default: GN"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"trainNumber\": \"12558\",\n  \"trainName\": \"SAPT KRANTI EXP\",\n  \"from\": \"ANVT\",\n  \"to\": \"NKE\",\n  \"quota\": \"GN\",\n  \"category\": \"Adult\",\n  \"availableClasses\": [\n    {\n      \"code\": \"1A\",\n      \"name\": \"First AC\"\n    },\n    {\n      \"code\": \"2A\",\n      \"name\": \"Second AC\"\n    },\n    {\n      \"code\": \"3A\",\n      \"name\": \"Third AC\"\n    },\n    {\n      \"code\": \"3E\",\n      \"name\": \"AC 3 Tier Economy\"\n    },\n    {\n      \"code\": \"SL\",\n      \"name\": \"Sleeper\"\n    }\n  ],\n  \"availableQuotas\": [\n    {\n      \"code\": \"GN\",\n      \"name\": \"General Quota\"\n    },\n    {\n      \"code\": \"TQ\",\n      \"name\": \"Tatkal Quota\"\n    }\n  ],\n  \"totalClasses\": 5,\n  \"fares\": [\n    {\n      \"class\": \"1A\",\n      \"className\": \"First AC\",\n      \"totalFare\": 3045,\n      \"breakup\": {\n        \"baseFare\": 2765,\n        \"reservationCharge\": 60,\n        \"superfastCharge\": 75,\n        \"gst\": 145,\n        \"cateringCharge\": 0,\n        \"dynamicFare\": 0\n      }\n    },\n    {\n      \"class\": \"2A\",\n      \"className\": \"Second AC\",\n      \"totalFare\": 1825,\n      \"breakup\": {\n        \"baseFare\": 1643,\n        \"reservationCharge\": 50,\n        \"superfastCharge\": 45,\n        \"gst\": 87,\n        \"cateringCharge\": 0,\n        \"dynamicFare\": 0\n      }\n    },\n    {\n      \"class\": \"3A\",\n      \"className\": \"Third AC\",\n      \"totalFare\": 1300,\n      \"breakup\": {\n        \"baseFare\": 1149,\n        \"reservationCharge\": 40,\n        \"superfastCharge\": 45,\n        \"gst\": 62,\n        \"cateringCharge\": 0,\n        \"dynamicFare\": 0\n      }\n    },\n    {\n      \"class\": \"3E\",\n      \"className\": \"AC 3 Tier Economy\",\n      \"totalFare\": 1205,\n      \"breakup\": {\n        \"baseFare\": 1062,\n        \"reservationCharge\": 40,\n        \"superfastCharge\": 45,\n        \"gst\": 58,\n        \"cateringCharge\": 0,\n        \"dynamicFare\": 0\n      }\n    },\n    {\n      \"class\": \"SL\",\n      \"className\": \"Sleeper\",\n      \"totalFare\": 505,\n      \"breakup\": {\n        \"baseFare\": 454,\n        \"reservationCharge\": 20,\n        \"superfastCharge\": 30,\n        \"gst\": 0,\n        \"cateringCharge\": 0,\n        \"dynamicFare\": 0\n      }\n    }\n  ],\n  \"_cached\": false\n}"
  },
  {
    "title": "Seat Availability",
    "method": "GET",
    "path": "/api/v1/trains/:trainNo/availability",
    "description": "Query real-time seat & berth availability across travel classes (1A, 2A, 3A, 3E, CC, SL) and quotas (GN, TQ, PT, LD). Returns an authentic 14-day availability calendar forecast with exact confirmation status.",
    "reqPath": "/api/v1/trains/12557/availability?from=NKE&to=ANVT&date=17-11-2026&class=3A&quota=GN",
    "parameters": [
      {
        "name": "trainNo",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "5-digit train number (e.g. 12557)"
      },
      {
        "name": "from",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Origin station code (e.g. NKE)"
      },
      {
        "name": "to",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Destination station code (e.g. ANVT)"
      },
      {
        "name": "date",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Journey date in DD-MM-YYYY format (e.g. 17-11-2026)"
      },
      {
        "name": "class",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Travel class code (1A, 2A, 3A, 3E, CC, EC, SL). Default: 3A"
      },
      {
        "name": "quota",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Quota code (GN, TQ, PT, LD). Default: GN"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"trainNumber\": \"12557\",\n  \"trainName\": \"SAPT KRANTI EXP\",\n  \"from\": \"NKE\",\n  \"to\": \"ANVT\",\n  \"date\": \"17-11-2026\",\n  \"class\": \"3A\",\n  \"quota\": \"GN\",\n  \"availability\": [\n    {\n      \"date\": \"2026-11-17\",\n      \"status\": \"REGRET/GNWL151\",\n      \"type\": \"REGRET\",\n      \"currentBooking\": \"N\"\n    },\n    {\n      \"date\": \"2026-11-18\",\n      \"status\": \"GNWL271/WL140\",\n      \"type\": \"WAITLIST\",\n      \"currentBooking\": \"N\"\n    },\n    {\n      \"date\": \"2026-11-19\",\n      \"status\": \"GNWL200/WL138\",\n      \"type\": \"WAITLIST\",\n      \"currentBooking\": \"N\"\n    },\n    {\n      \"date\": \"2026-11-20\",\n      \"status\": \"GNWL160/WL110\",\n      \"type\": \"WAITLIST\",\n      \"currentBooking\": \"N\"\n    },\n    {\n      \"date\": \"2026-11-21\",\n      \"status\": \"AVAILABLE-0042\",\n      \"type\": \"AVAILABLE\",\n      \"currentBooking\": \"N\"\n    }\n  ],\n  \"source\": \"irctc-api\",\n  \"_cached\": true,\n  \"_time\": 1.482\n}"
  },
  {
    "title": "Vacant Seats After Chart Preparation",
    "method": "GET",
    "path": "/api/v1/trains/:trainNo/chart-vacant",
    "description": "Query real-time vacant berths post-charting (First & Second reservation charts) from online reservation charts. Returns coach composition, total vacant berths, class summary, and berth-by-berth allocations for Current Booking & TTE allotment.",
    "reqPath": "/api/v1/trains/12557/chart-vacant?boardingStation=GKP&date=2026-10-24&class=ALL",
    "parameters": [
      {
        "name": "trainNo",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "5-digit train number (e.g. 12557)"
      },
      {
        "name": "boardingStation",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Boarding station code (e.g. GKP)"
      },
      {
        "name": "date",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Journey date in YYYY-MM-DD or DD-MM-YYYY format (defaults to today)"
      },
      {
        "name": "class",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Travel class code (1A, 2A, 3A, 3E, SL, or ALL). Default: ALL"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"trainNumber\": \"12557\",\n  \"trainName\": \"SAPT KRANTI EXP\",\n  \"boardingStation\": \"GKP\",\n  \"from\": \"MFP\",\n  \"to\": \"ANVT\",\n  \"date\": \"2026-10-24\",\n  \"chartStatus\": {\n    \"isChartPrepared\": true,\n    \"firstChartTime\": \"2026-10-24 08:40:47\",\n    \"currentChartTime\": null,\n    \"remoteStation\": \"GKP\",\n    \"nextRemoteStation\": \"LKO\"\n  },\n  \"totalVacantBerths\": 0,\n  \"summaryByClass\": {\n    \"2A\": 0,\n    \"3A\": 0,\n    \"1A\": 0,\n    \"3E\": 0,\n    \"SL\": 0\n  },\n  \"vacantBerths\": [],\n  \"coaches\": [\n    {\n      \"coach\": \"A1\",\n      \"class\": \"2A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"A2\",\n      \"class\": \"2A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"B1\",\n      \"class\": \"3A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"B2\",\n      \"class\": \"3A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"B3\",\n      \"class\": \"3A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"B4\",\n      \"class\": \"3A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"B5\",\n      \"class\": \"3A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"H1\",\n      \"class\": \"1A\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"M1\",\n      \"class\": \"3E\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S1\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S2\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S3\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S4\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S5\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    },\n    {\n      \"coach\": \"S6\",\n      \"class\": \"SL\",\n      \"position\": 0,\n      \"vacantBerths\": 0\n    }\n  ],\n  \"source\": \"irctc-charts\",\n  \"syncedAt\": \"2026-10-24T07:36:22.920Z\"\n}"
  },
  {
    "title": "Station by Name",
    "method": "GET",
    "path": "/api/v1/trains/stations",
    "description": "Lightning-fast autocomplete search for railway stations by name or exact code.",
    "reqPath": "/api/v1/trains/stations?q=pur",
    "parameters": [
      {
        "name": "q",
        "in": "QUERY",
        "type": "string",
        "required": true,
        "description": "Search query (min 2 characters, e.g. \"pur\")"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": [\n    {\n      \"code\": \"AAM\",\n      \"name\": \"Angadippuram\",\n      \"state\": \"Malappuram\"\n    },\n    {\n      \"code\": \"AAP\",\n      \"name\": \"Ambiapur\",\n      \"state\": \"Ambiapur\"\n    },\n    {\n      \"code\": \"ABKP\",\n      \"name\": \"Ambikapur\",\n      \"state\": \"Ambikapur\"\n    },\n    {\n      \"code\": \"ABP\",\n      \"name\": \"Akbarpur\",\n      \"state\": \"Akbarpur\"\n    },\n    {\n      \"code\": \"ADR\",\n      \"name\": \"Mandi Adampur\",\n      \"state\": \"Adampur\"\n    },\n    {\n      \"code\": \"ADTP\",\n      \"name\": \"Adityapur\",\n      \"state\": \"Jamshedpur\"\n    },\n    {\n      \"code\": \"ADX\",\n      \"name\": \"Adapur\",\n      \"state\": \"\"\n    },\n    {\n      \"code\": \"AFR\",\n      \"name\": \"Asafpur\",\n      \"state\": \"Asafpur\"\n    }\n  ],\n  \"source\": \"irctc-api\",\n  \"degraded\": false,\n  \"cached\": false\n}"
  },
  {
    "title": "Station Timetable",
    "method": "GET",
    "path": "/api/v1/trains/stations/:code/timetable/:date",
    "description": "Get a complete list of all trains arriving or departing from a specific station on a given date.",
    "reqPath": "/api/v1/trains/stations/NKE/timetable/2026-10-24",
    "parameters": [
      {
        "name": "code",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "Station code (e.g. NKE)"
      },
      {
        "name": "date",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "Date in YYYY-MM-DD (e.g. 2026-10-24)"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": {\n    \"stationCode\": \"NKE\",\n    \"day\": \"Sat\",\n    \"total\": 53,\n    \"trains\": [\n      {\n        \"trainNo\": \"63374\",\n        \"trainName\": \"NKE-RXL-DBG MEMU\",\n        \"trainType\": \"SUBURBAN\",\n        \"arrival\": null,\n        \"departure\": \"02:35\",\n        \"dayOffset\": 0,\n        \"from\": \"NKE\",\n        \"to\": \"DBG\",\n        \"runsOn\": [\n          \"Mon\",\n          \"Tue\",\n          \"Wed\",\n          \"Thu\",\n          \"Fri\",\n          \"Sat\",\n          \"Sun\"\n        ]\n      },\n      {\n        \"trainNo\": \"63338\",\n        \"trainName\": \"NKE-MFP MEMU\",\n        \"trainType\": \"SUBURBAN\",\n        \"arrival\": null,\n        \"departure\": \"02:45\",\n        \"dayOffset\": 0,\n        \"from\": \"NKE\",\n        \"to\": \"MFP\",\n        \"runsOn\": [\n          \"Mon\",\n          \"Tue\",\n          \"Wed\",\n          \"Thu\",\n          \"Fri\",\n          \"Sat\",\n          \"Sun\"\n        ]\n      },\n      {\n        \"trainNo\": \"15515\",\n        \"trainName\": \"NKE-DNR EXPRESS\",\n        \"trainType\": \"MAIL_EXPRESS\",\n        \"arrival\": null,\n        \"departure\": \"03:25\",\n        \"dayOffset\": 0,\n        \"from\": \"NKE\",\n        \"to\": \"DNR\",\n        \"runsOn\": [\n          \"Mon\",\n          \"Tue\",\n          \"Wed\",\n          \"Thu\",\n          \"Fri\",\n          \"Sat\",\n          \"Sun\"\n        ]\n      },\n      {\n        \"trainNo\": \"15202\",\n        \"trainName\": \"BUG-PPTA INTERCITY EXP\",\n        \"trainType\": \"MAIL_EXPRESS\",\n        \"arrival\": \"04:55\",\n        \"departure\": \"05:05\",\n        \"dayOffset\": 0,\n        \"from\": \"BUG\",\n        \"to\": \"PPTA\",\n        \"runsOn\": [\n          \"Mon\",\n          \"Tue\",\n          \"Wed\",\n          \"Thu\",\n          \"Fri\",\n          \"Sat\",\n          \"Sun\"\n        ]\n      },\n      {\n        \"trainNo\": \"55097\",\n        \"trainName\": \"NKE-GKC PASSENGER\",\n        \"trainType\": \"PASSENGER\",\n        \"arrival\": null,\n        \"departure\": \"05:30\",\n        \"dayOffset\": 0,\n        \"from\": \"NKE\",\n        \"to\": \"GKC\",\n        \"runsOn\": [\n          \"Mon\",\n          \"Tue\",\n          \"Wed\",\n          \"Thu\",\n          \"Fri\",\n          \"Sat\",\n          \"Sun\"\n        ]\n      }\n    ]\n  },\n  \"source\": \"irctc-api\"\n}"
  },
  {
    "title": "Station by Code",
    "method": "GET",
    "path": "/api/v1/trains/stations/:code",
    "description": "Fetch detailed information about a station including its full name, zone, and location.",
    "reqPath": "/api/v1/trains/stations/NDLS",
    "parameters": [
      {
        "name": "code",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "Station code (e.g. NDLS)"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": {\n    \"code\": \"NDLS\",\n    \"name\": \"New Delhi\",\n    \"state\": \"Delhi\"\n  },\n  \"source\": \"irctc-api\",\n  \"cached\": true\n}"
  },
  {
    "title": "Live Train Running Status",
    "method": "GET",
    "path": "/api/v1/live/:trainNo",
    "description": "Get real-time running status, current station, delay, and upcoming halts.",
    "reqPath": "/api/v1/live/12557?date=2026-10-24",
    "parameters": [
      {
        "name": "trainNo",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "5-digit train number (e.g. 12557)"
      },
      {
        "name": "date",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Journey date in YYYY-MM-DD"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": {\n    \"trainNumber\": \"12557\",\n    \"trainName\": \"Sapt Kranti Exp\",\n    \"currentLocation\": \"Chakia\",\n    \"locationStatus\": \"departed from\",\n    \"currentDelayMin\": 33,\n    \"currentDelayStr\": \"+33 min\",\n    \"lastUpdated\": \"24 Oct 2026 12:58,\",\n    \"totalDistanceKm\": 1060,\n    \"totalHalts\": 18,\n    \"stops\": [\n      {\n        \"stationName\": \"Muzaffarpur Jn\",\n        \"day\": 1,\n        \"date\": \"24-Oct\",\n        \"arrives\": \"11:46\",\n        \"departs\": null,\n        \"delayMin\": 11,\n        \"delayStr\": \"+11 min\",\n        \"isOnTime\": false,\n        \"status\": \"passed\",\n        \"distanceKm\": 0\n      },\n      {\n        \"stationName\": \"Motipur\",\n        \"day\": 1,\n        \"date\": \"24-Oct\",\n        \"arrives\": \"12:10\",\n        \"departs\": \"12:12\",\n        \"delayMin\": 3,\n        \"delayStr\": \"+3 min\",\n        \"isOnTime\": false,\n        \"status\": \"passed\",\n        \"distanceKm\": 26\n      },\n      {\n        \"stationName\": \"Mehsi\",\n        \"day\": 1,\n        \"date\": \"24-Oct\",\n        \"arrives\": \"12:28\",\n        \"departs\": \"12:30\",\n        \"delayMin\": 6,\n        \"delayStr\": \"+6 min\",\n        \"isOnTime\": false,\n        \"status\": \"passed\",\n        \"distanceKm\": 39\n      },\n      {\n        \"stationName\": \"Chakia\",\n        \"day\": 1,\n        \"date\": \"24-Oct\",\n        \"arrives\": \"12:58\",\n        \"departs\": \"13:09\",\n        \"delayMin\": 33,\n        \"delayStr\": \"+33 min\",\n        \"isOnTime\": false,\n        \"status\": \"current\",\n        \"distanceKm\": 48\n      },\n      {\n        \"stationName\": \"Moradabad\",\n        \"day\": 2,\n        \"date\": \"25-Oct\",\n        \"arrives\": \"05:46\",\n        \"departs\": \"05:54\",\n        \"delayMin\": 64,\n        \"delayStr\": \"+64 min\",\n        \"isOnTime\": false,\n        \"status\": \"upcoming\",\n        \"distanceKm\": 906\n      },\n      {\n        \"stationName\": \"Anand Vihar TRM\",\n        \"day\": 2,\n        \"date\": \"25-Oct\",\n        \"arrives\": \"09:09\",\n        \"departs\": null,\n        \"delayMin\": 89,\n        \"delayStr\": \"+89 min\",\n        \"isOnTime\": false,\n        \"status\": \"upcoming\",\n        \"distanceKm\": 1059\n      }\n    ],\n    \"updatedAt\": \"2026-10-24T07:38:35.596Z\",\n    \"source\": \"confirmtkt-fetch\"\n  },\n  \"source\": \"irctc-api\"\n}"
  },
  {
    "title": "Live Station Display Board",
    "method": "GET",
    "path": "/api/v1/live/station/:stationCode",
    "description": "Real-time train arrivals and departures board with platform, delay, and coach info.",
    "reqPath": "/api/v1/live/station/GKP?hours=2",
    "parameters": [
      {
        "name": "stationCode",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "Station code (e.g. GKP)"
      },
      {
        "name": "hours",
        "in": "QUERY",
        "type": "number",
        "required": false,
        "description": "Time window: 2, 4, or 8 hours (default: 2)"
      },
      {
        "name": "toStation",
        "in": "QUERY",
        "type": "string",
        "required": false,
        "description": "Optional destination filter station code"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"stationCode\": \"GKP\",\n  \"stationName\": \"GORAKHPUR JN\",\n  \"totalTrains\": 23,\n  \"trains\": [\n    {\n      \"trainNo\": \"04013\",\n      \"trainName\": \"LKQ ANVT SPL\",\n      \"route\": \"LKQ-ANVT\",\n      \"trainType\": \"TRAIN ON DEMAND 2A,3A,SL,GEN,PWD\",\n      \"platform\": {\n        \"number\": \"6\",\n        \"isProvisional\": true\n      },\n      \"hasCoachPosition\": true,\n      \"arrival\": {\n        \"isSource\": false,\n        \"scheduled\": \"10:25\",\n        \"actualOrEstimated\": \"12:16*\",\n        \"delay\": \"01:51 Hrs.\",\n        \"delayMinutes\": 111,\n        \"status\": \"DELAYED\"\n      },\n      \"departure\": {\n        \"isDestination\": false,\n        \"scheduled\": \"10:35\",\n        \"actualOrEstimated\": \"12:21*\",\n        \"delay\": \"01:46 Hrs.\",\n        \"delayMinutes\": 106,\n        \"status\": \"DELAYED\"\n      }\n    },\n    {\n      \"trainNo\": \"22551\",\n      \"trainName\": \"DBG-JUC ANTYODAY EXPRESS\",\n      \"route\": \"DBG-JUC\",\n      \"trainType\": \"SUPERFAST GEN\",\n      \"platform\": {\n        \"number\": \"4\",\n        \"isProvisional\": false\n      },\n      \"hasCoachPosition\": true,\n      \"arrival\": {\n        \"isSource\": false,\n        \"scheduled\": \"10:40\",\n        \"actualOrEstimated\": \"12:56\",\n        \"delay\": \"02:16 Hrs.\",\n        \"delayMinutes\": 136,\n        \"status\": \"DELAYED\"\n      },\n      \"departure\": {\n        \"isDestination\": false,\n        \"scheduled\": \"10:50\",\n        \"actualOrEstimated\": \"13:01*\",\n        \"delay\": \"02:11 Hrs.\",\n        \"delayMinutes\": 131,\n        \"status\": \"DELAYED\"\n      }\n    },\n    {\n      \"trainNo\": \"55032\",\n      \"trainName\": \"GD-GKP PASSENGER\",\n      \"route\": \"GD-GKP\",\n      \"trainType\": \"PASSENGER GEN,PWD\",\n      \"platform\": {\n        \"number\": \"4\",\n        \"isProvisional\": true\n      },\n      \"hasCoachPosition\": true,\n      \"arrival\": {\n        \"isSource\": false,\n        \"scheduled\": \"09:05\",\n        \"actualOrEstimated\": \"13:05*\",\n        \"delay\": \"04:00 Hrs.\",\n        \"delayMinutes\": 240,\n        \"status\": \"DELAYED\"\n      },\n      \"departure\": {\n        \"isDestination\": true,\n        \"scheduled\": null,\n        \"actualOrEstimated\": null,\n        \"delay\": \"Terminates Here\",\n        \"delayMinutes\": 0,\n        \"status\": \"DESTINATION\"\n      }\n    },\n    {\n      \"trainNo\": \"55040\",\n      \"trainName\": \"BNY-NKE PASSENGER\",\n      \"route\": \"BNY-NKE\",\n      \"trainType\": \"PASSENGER GEN,PWD\",\n      \"platform\": {\n        \"number\": \"9\",\n        \"isProvisional\": true\n      },\n      \"hasCoachPosition\": true,\n      \"arrival\": {\n        \"isSource\": false,\n        \"scheduled\": \"12:15\",\n        \"actualOrEstimated\": \"13:26*\",\n        \"delay\": \"01:11 Hrs.\",\n        \"delayMinutes\": 71,\n        \"status\": \"DELAYED\"\n      },\n      \"departure\": {\n        \"isDestination\": false,\n        \"scheduled\": \"12:25\",\n        \"actualOrEstimated\": \"13:31*\",\n        \"delay\": \"01:06 Hrs.\",\n        \"delayMinutes\": 66,\n        \"status\": \"DELAYED\"\n      }\n    }\n  ],\n  \"hours\": 2,\n  \"toStation\": null,\n  \"queryTime\": \"2026-10-24T07:38:47.241Z\"\n}"
  },
  {
    "title": "PNR Status",
    "method": "GET",
    "path": "/api/v1/pnr/:pnr",
    "description": "Fetch real-time current PNR status, passenger info, and charting status.",
    "reqPath": "/api/v1/pnr/2265248473",
    "parameters": [
      {
        "name": "pnr",
        "in": "PATH",
        "type": "string",
        "required": true,
        "description": "10-digit PNR number (e.g. 2265248473)"
      }
    ],
    "response": "{\n  \"success\": true,\n  \"data\": {\n    \"pnr\": \"2265248473\",\n    \"trainNumber\": \"15726\",\n    \"trainName\": \"ANVT NJP EXP\",\n    \"from\": {\n      \"code\": \"MFP\",\n      \"time\": \"Nov 23, 2026 10:05:00 AM\"\n    },\n    \"to\": {\n      \"code\": \"NJP\",\n      \"time\": \"Nov 23, 2026 6:45:00 PM\"\n    },\n    \"journeyDate\": \"Nov 23, 2026 10:05:00 AM\",\n    \"class\": \"SL\",\n    \"quota\": \"GN\",\n    \"expectedPlatform\": null,\n    \"chartStatus\": \"chart not prepared\",\n    \"passengers\": [\n      {\n        \"number\": 1,\n        \"status\": \"CNF\",\n        \"coach\": \"S4\",\n        \"seat\": \"65\",\n        \"berth\": \"LOWER BERTH\",\n        \"raw\": \"CNF/S4/65/LB\"\n      },\n      {\n        \"number\": 2,\n        \"status\": \"CNF\",\n        \"coach\": \"S4\",\n        \"seat\": \"66\",\n        \"berth\": \"MIDDLE BERTH\",\n        \"raw\": \"CNF/S4/66/MB\"\n      }\n    ],\n    \"updatedAt\": \"2026-10-24T07:40:06.056Z\",\n    \"source\": \"indianrail\"\n  },\n  \"source\": \"irctc-api\"\n}"
  }
];

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';

const getSnippet = (lang: string, path: string): string => {
  const url = `${BASE_URL}${path}`;
  if (lang === 'cURL') {
    return `curl -X GET "${url}" \\\n  -H "x-api-key: YOUR_API_KEY" \\\n  -H "accept: application/json"`;
  }
  if (lang === 'JavaScript') {
    return `const response = await fetch("${url}", {\n  method: "GET",\n  headers: {\n    "x-api-key": "YOUR_API_KEY",\n    "accept": "application/json",\n  },\n});\n\nconst data = await response.json();\nconsole.log(data);`;
  }
  if (lang === 'Python') {
    return `import requests\n\nurl = "${url}"\nheaders = {\n    "x-api-key": "YOUR_API_KEY",\n    "accept": "application/json"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`;
  }
  if (lang === 'Node.js (SDK)') {
    return `import { IrctcApi } from 'irctc-api';\n\nconst client = new IrctcApi({ apiKey: 'YOUR_API_KEY' });\n// Endpoint: ${path}\nconst response = await client._request('GET', '${path}');\nconsole.log(response);`;
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
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'APIReference',
                '@id': 'https://irctc.dev/docs#reference',
                url: 'https://irctc.dev/docs',
                name: 'Railway REST API Documentation & Reference',
                description: 'Interactive API reference for railway REST endpoints: PNR status, live running status, seat availability, and fare calculation.',
                isPartOf: {
                  '@id': 'https://irctc.dev/#webapi'
                },
                programmingLanguage: ['cURL', 'TypeScript', 'Node.js', 'Python'],
                inLanguage: 'en-IN'
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://irctc.dev'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'API Documentation',
                    item: 'https://irctc.dev/docs'
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="max-w-4xl mb-12 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-3 sm:mb-5 text-textMain">API Reference</h2>
        <p className="text-textMuted text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl">
          Integrate the Railway API into your application. Authenticate your requests using your secret API keys and fetch real-time railway data instantly.
        </p>

        {/* Global Controls: Language Switcher & Machine-Readable Spec Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          {/* Global Language Switcher - Sleek Segmented Control */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-textMuted/60">Language:</span>
            <div className="grid grid-cols-2 sm:flex bg-[#111] p-1 rounded-lg border border-white/[0.05] shadow-inner w-full sm:w-auto">
              {['cURL', 'JavaScript', 'Python', 'Node.js (SDK)'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`py-1.5 px-3 sm:px-4 text-center text-xs font-medium rounded-md transition-all duration-200 active:scale-[0.97] ${
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

          {/* Secondary Developer Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/alternatives/rapidapi-indian-railway-api"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/20 bg-brand/5 hover:bg-brand/10 text-xs font-medium text-brand hover:text-brand transition-all"
              title="RapidAPI Drop-In Migration & Compatibility Shim"
            >
              <Layers size={13} className="text-brand" />
              <span>RapidAPI Shim</span>
            </Link>

            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-textMuted hover:text-white transition-all"
              title="Developer Guides & Practical Blueprints"
            >
              <BookOpen size={13} className="text-textMuted group-hover:text-white" />
              <span>Guides</span>
            </Link>

            <a
              href="/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-textMuted hover:text-white transition-all"
              title="OpenAPI 3.1.0 Specification"
            >
              <FileCode size={13} className="text-textMuted" />
              <span>OpenAPI Spec</span>
            </a>

            <a
              href="/postman_collection.json"
              download="irctc_postman_collection.json"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-medium text-textMuted hover:text-white transition-all"
              title="Download Postman Collection v2.1.0 with Test Assertions"
            >
              <Download size={13} className="text-textMuted" />
              <span>Postman Collection</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ENDPOINTS LIST - 40/60 Split Layout */}
      <div className="flex flex-col">
        {ENDPOINTS.map((endpoint, idx) => {
          const snippet = getSnippet(activeLang, endpoint.reqPath);
          const currentTab = activeTabs[idx] || 'req';
          const featureLink = ENDPOINT_FEATURE_MAP[endpoint.path];

          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-white/[0.04] py-10 sm:py-16 first:pt-0 first:border-0"
            >

              {/* Left Column: Docs Info (Takes up 5 cols out of 12) */}
              <div className="lg:col-span-5 flex flex-col pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                  <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-textMain">{endpoint.title}</h4>
                  {featureLink && (
                    <Link
                      to={featureLink.slug}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-brand hover:underline shrink-0"
                    >
                      <span>Standalone Guide</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  )}
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

                {/* Terminal Body - Fixed height with vertical scrolling to prevent layout expansion on Response tab */}
                <div className="p-4 sm:p-6 overflow-y-auto overflow-x-auto h-[340px] sm:h-[400px]">
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
