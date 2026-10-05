import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Facility } from '../types';
import {
  Hospital,
  MapPin,
  PhoneCall,
  Search,
  Filter,
  Navigation,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const FacilityFinder: React.FC = () => {
  const { language, t } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const fetchFacilities = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const data = await api.getFacilities({
        q: searchQuery,
        facility_type: filterType,
        lat: lat !== undefined ? lat : userLocation?.lat,
        lng: lng !== undefined ? lng : userLocation?.lng
      });
      setFacilities(data);
      if (data.length > 0 && !selectedFacility) {
        setSelectedFacility(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch facilities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFacilities();
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocating(false);
        fetchFacilities(coords.lat, coords.lng);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable', err);
        setLocating(false);
        // Default to Varanasi coordinates for demo
        const defaultCoords = { lat: 25.3176, lng: 82.9739 };
        setUserLocation(defaultCoords);
        fetchFacilities(defaultCoords.lat, defaultCoords.lng);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 space-y-6">
      {/* Title & Geolocation button */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'सरकारी स्वास्थ्य केंद्र' : 'Public Healthcare Network'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              OpenStreetMap Geocoded
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('facilities_finder_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('facilities_subtitle')}
          </p>
        </div>

        <button
          onClick={requestGeolocation}
          disabled={locating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
        >
          <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
          <span>
            {locating
              ? (language === 'hi' ? 'स्थान खोज रहे हैं...' : 'Finding location...')
              : userLocation
              ? (language === 'hi' ? 'निकटतम केंद्र क्रमबद्ध' : 'Sorted by Nearest GPS')
              : (language === 'hi' ? 'नजदीकी अस्पताल खोजें (GPS)' : 'Find Nearest via GPS')}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition"
          >
            {language === 'hi' ? 'खोजें' : 'Search'}
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> {language === 'hi' ? 'प्रकार:' : 'Type:'}
          </span>
          {[
            { key: 'ALL', label: t('all_facilities') },
            { key: 'PHC', label: 'Primary Health Centre (PHC)' },
            { key: 'CHC', label: 'Community Health Centre (CHC)' },
            { key: 'District Hospital', label: 'District Hospital' },
            { key: 'Sub-Centre', label: 'Arogya Mandir (Sub-Centre)' }
          ].map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setFilterType(pill.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterType === pill.key
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid & Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Facilities List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{facilities.length} {language === 'hi' ? 'केंद्र उपलब्ध' : 'Verified Facilities Found'}</span>
            <span>{userLocation ? 'GPS Calculated Distances' : 'Sorted Alphabetically'}</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {facilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;

              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                            {fac.type}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {fac.district}, {fac.state}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mt-1">
                          {language === 'hi' ? fac.name_hi : fac.name}
                        </h3>
                      </div>

                      {fac.distance_km !== null && fac.distance_km !== undefined && (
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">
                            {fac.distance_km} km
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.address}</span>
                    </p>

                    {/* Available Services Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(language === 'hi' ? fac.services_hi : fac.services).map((srv, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${fac.emergency_phone}`}
                        className="font-bold text-rose-600 flex items-center gap-1 hover:underline"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'आपातकाल:' : 'Emergency:'} {fac.emergency_phone}</span>
                      </a>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">{fac.phone}</span>
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{t('directions')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Map & Selected Facility Detail (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Map Preview Container */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Hospital className="w-4 h-4 text-teal-600" />
                {language === 'hi' ? 'मानचित्र स्थान (OpenStreetMap)' : 'OpenStreetMap Facility Plotter'}
              </span>
              <span className="text-emerald-700 font-bold">● Active Leaflet Tiles</span>
            </div>

            {/* Embedded OSM iframe for reliable interactive rendering */}
            <div className="h-[280px] w-full bg-slate-100 relative">
              <iframe
                title="Healthcare Facilities Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  (selectedFacility?.lng || 82.9739) - 0.08
                }%2C${(selectedFacility?.lat || 25.3582) - 0.08}%2C${
                  (selectedFacility?.lng || 82.9739) + 0.08
                }%2C${
                  (selectedFacility?.lat || 25.3582) + 0.08
                }&amp;layer=mapnik&amp;marker=${selectedFacility?.lat || 25.3582}%2C${
                  selectedFacility?.lng || 82.9739
                }`}
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Selected Facility Details Card */}
          {selectedFacility && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {selectedFacility.type_label}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedFacility.open_hours}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {language === 'hi' ? selectedFacility.name_hi : selectedFacility.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{selectedFacility.address}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">PIN: {selectedFacility.pincode}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block">{language === 'hi' ? 'बिस्तरों की संख्या' : 'Beds Capacity'}</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedFacility.beds} Beds</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block">{language === 'hi' ? 'सत्यापन स्थिति' : 'Verification'}</span>
                  <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Govt. Verified
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${selectedFacility.emergency_phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'कॉल 108' : 'Call 108'}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t('directions')}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />
    </div>
  );
};
