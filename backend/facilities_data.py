"""
JanSwasthya Setu AI - Healthcare Facilities Database
Verified and demonstration directory of rural healthcare centers across Indian districts:
Primary Health Centres (PHC), Community Health Centres (CHC), Sub-Centres (SC), and District Hospitals.
"""

from typing import List, Dict, Any, Optional
import math

FACILITIES_DB: List[Dict[str, Any]] = [
    {
        "id": "fac_01",
        "name": "Community Health Centre (CHC) Kashi Rural",
        "name_hi": "सामुदायिक स्वास्थ्य केंद्र (सीएचसी) काशी ग्रामीण",
        "type": "CHC",
        "type_label": "Community Health Centre (सामुदायिक स्वास्थ्य केंद्र)",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "pincode": "221002",
        "address": "Shivpur Bypass Road, Varanasi Rural, UP",
        "phone": "0542-228108",
        "emergency_phone": "108",
        "lat": 25.3582,
        "lng": 82.9739,
        "beds": 30,
        "services": ["Emergency 24x7", "Maternity & Delivery", "Basic Surgery", "Pathology Lab", "X-Ray"],
        "services_hi": ["24x7 आपातकालीन", "प्रसूति एवं प्रसव", "सामान्य शल्य चिकित्सा", "पैथोलॉजी लैब", "एक्स-रे"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    },
    {
        "id": "fac_02",
        "name": "Primary Health Centre (PHC) Cholapur",
        "name_hi": "प्राथमिक स्वास्थ्य केंद्र (पीएचसी) चोलापुर",
        "type": "PHC",
        "type_label": "Primary Health Centre (प्राथमिक स्वास्थ्य केंद्र)",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "pincode": "221101",
        "address": "Main Bazar Road, Cholapur Block, Varanasi, UP",
        "phone": "0542-261203",
        "emergency_phone": "108",
        "lat": 25.4410,
        "lng": 83.0450,
        "beds": 6,
        "services": ["Outpatient (OPD)", "Immunization (टीकाकरण)", "Maternal Care", "Free Essential Medicines", "TB DOTS"],
        "services_hi": ["ओपीडी", "नियमित टीकाकरण", "मातृ देखभाल", "निःशुल्क आवश्यक दवाएं", "टीबी डॉट्स केंद्र"],
        "open_hours": "8:00 AM - 4:00 PM (Emergency 24x7)",
        "is_verified": True
    },
    {
        "id": "fac_03",
        "name": "Pandit Deendayal Upadhyay District Hospital",
        "name_hi": "पंडित दीनदयाल उपाध्याय जिला अस्पताल",
        "type": "District Hospital",
        "type_label": "District Hospital (जिला अस्पताल)",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "pincode": "221001",
        "address": "Pandeypur, Varanasi, UP",
        "phone": "0542-2508000",
        "emergency_phone": "108",
        "lat": 25.3341,
        "lng": 82.9982,
        "beds": 150,
        "services": ["Trauma & ICU", "Blood Bank", "Pediatrics (शिशु रोग)", "Gynecology", "Dialysis Unit", "Ayushman Bharat Desk"],
        "services_hi": ["ट्रॉमा एवं आईसीयू", "ब्लड बैंक", "बाल चिकित्सा", "स्त्री रोग विभाग", "डायलिसिस यूनिट", "आयुष्मान भारत केंद्र"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    },
    {
        "id": "fac_04",
        "name": "Health & Wellness Centre (Sub-Centre) Babatpur",
        "name_hi": "आरोग्य मंदिर (उप-स्वास्थ्य केंद्र) बाबतपुर",
        "type": "Sub-Centre",
        "type_label": "Ayushman Arogya Mandir (आयुष्मान आरोग्य मंदिर)",
        "district": "Varanasi",
        "state": "Uttar Pradesh",
        "pincode": "221006",
        "address": "Near Panchayat Bhawan, Babatpur Village, Varanasi",
        "phone": "9450001088",
        "emergency_phone": "108",
        "lat": 25.4520,
        "lng": 82.8590,
        "beds": 2,
        "services": ["Tele-Consultation (e-Sanjeevani)", "NCD Screening (BP/Sugar)", "ASHA Outreach", "ANC Checkups"],
        "services_hi": ["ई-संजीवनी टेली-परामर्श", "बीपी/शुगर जांच", "आशा कार्यकर्ता सहायता", "गर्भवती महिला जांच"],
        "open_hours": "9:00 AM - 5:00 PM",
        "is_verified": True
    },
    {
        "id": "fac_05",
        "name": "Community Health Centre (CHC) Phulpur",
        "name_hi": "सामुदायिक स्वास्थ्य केंद्र (सीएचसी) फूलपुर",
        "type": "CHC",
        "type_label": "Community Health Centre (सामुदायिक स्वास्थ्य केंद्र)",
        "district": "Prayagraj",
        "state": "Uttar Pradesh",
        "pincode": "212402",
        "address": "Civil Lines Road, Phulpur, Prayagraj, UP",
        "phone": "0532-245108",
        "emergency_phone": "108",
        "lat": 25.5510,
        "lng": 82.0910,
        "beds": 30,
        "services": ["Emergency 24x7", "Maternity Wing", "Basic Surgery", "Pathology Lab", "Vaccination"],
        "services_hi": ["24x7 आपातकालीन", "प्रसूति विंग", "सामान्य सर्जरी", "जांच प्रयोगशाला", "टीकाकरण"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    },
    {
        "id": "fac_06",
        "name": "Primary Health Centre (PHC) Maner",
        "name_hi": "प्राथमिक स्वास्थ्य केंद्र (पीएचसी) मनेर",
        "type": "PHC",
        "type_label": "Primary Health Centre (प्राथमिक स्वास्थ्य केंद्र)",
        "district": "Patna",
        "state": "Bihar",
        "pincode": "801108",
        "address": "NH-30, Near Block Office, Maner, Patna, Bihar",
        "phone": "0612-231108",
        "emergency_phone": "108",
        "lat": 25.6500,
        "lng": 84.8780,
        "beds": 8,
        "services": ["OPD Consultation", "Kala-azar Treatment", "Immunization", "Institutional Delivery"],
        "services_hi": ["ओपीडी परामर्श", "कालाजार जांच एवं उपचार", "टीकाकरण", "सुरक्षित प्रसव सेवा"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    },
    {
        "id": "fac_07",
        "name": "Sub-Divisional Hospital (SDH) Danapur",
        "name_hi": "अनुमंडलीय अस्पताल दानापुर",
        "type": "District Hospital",
        "type_label": "Sub-Divisional Hospital (अनुमंडलीय अस्पताल)",
        "district": "Patna",
        "state": "Bihar",
        "pincode": "801503",
        "address": "Hospital Road, Danapur Cantt, Patna, Bihar",
        "phone": "0612-2287108",
        "emergency_phone": "108",
        "lat": 25.6260,
        "lng": 85.0440,
        "beds": 100,
        "services": ["Emergency Room", "Pediatrics", "Orthopedics", "Blood Storage Unit", "Ultrasound"],
        "services_hi": ["आपातकालीन कक्ष", "शिशु रोग विशेषज्ञ", "हड्डी रोग विभाग", "रक्त भंडारण केंद्र", "अल्ट्रासाउंड"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    },
    {
        "id": "fac_08",
        "name": "Community Health Centre (CHC) Sanwer",
        "name_hi": "सामुदायिक स्वास्थ्य केंद्र (सीएचसी) सांवेर",
        "type": "CHC",
        "type_label": "Community Health Centre (सामुदायिक स्वास्थ्य केंद्र)",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "pincode": "453551",
        "address": "Ujjain Road, Sanwer, Indore, MP",
        "phone": "07321-222108",
        "emergency_phone": "108",
        "lat": 22.9750,
        "lng": 75.8280,
        "beds": 30,
        "services": ["Emergency Services", "Maternity Ward", "Sonography Camp", "SNCU Newborn Care"],
        "services_hi": ["आपातकालीन सेवा", "प्रसूति वार्ड", "सोनोग्राफी कैंप", "नवजात शिशु देखभाल इकाई (SNCU)"],
        "open_hours": "Open 24 Hours",
        "is_verified": True
    }
]

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates approximate distance in kilometers between two geo-coordinates."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def search_facilities(
    query: Optional[str] = None,
    facility_type: Optional[str] = None,
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None,
    district: Optional[str] = None
) -> List[Dict[str, Any]]:
    results = []
    q = query.lower().strip() if query else ""

    for fac in FACILITIES_DB:
        # Filter by type
        if facility_type and facility_type != "ALL":
            if fac["type"].lower() != facility_type.lower():
                continue

        # Filter by district
        if district and district.lower() not in fac["district"].lower():
            continue

        # Filter by query (name, address, pincode, district, state)
        if q:
            searchable = f"{fac['name']} {fac['name_hi']} {fac['address']} {fac['pincode']} {fac['district']} {fac['state']} {fac['type']}".lower()
            if q not in searchable:
                continue

        item = dict(fac)
        if user_lat is not None and user_lng is not None:
            dist = calculate_haversine_distance(user_lat, user_lng, fac["lat"], fac["lng"])
            item["distance_km"] = dist
        else:
            item["distance_km"] = None

        results.append(item)

    # Sort by distance if location provided, else default
    if user_lat is not None and user_lng is not None:
        results.sort(key=lambda x: (x["distance_km"] is None, x["distance_km"]))

    return results
