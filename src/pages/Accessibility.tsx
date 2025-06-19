import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle, Loader, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

const Accessibility: React.FC = () => {
  const { theme } = useTheme();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        // Try to get address using reverse geocoding (if available)
        try {
          const address = await reverseGeocode(locationData.latitude, locationData.longitude);
          locationData.address = address;
        } catch (err) {
          console.log('Reverse geocoding not available');
        }

        setLocation(locationData);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please check your device\'s location settings.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      options
    );
  };

  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        try {
          const address = await reverseGeocode(locationData.latitude, locationData.longitude);
          locationData.address = address;
        } catch (err) {
          console.log('Reverse geocoding not available');
        }

        setLocation(locationData);
        setError(null);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while watching location.');
            break;
        }
      },
      options
    );

    setWatchId(id);
    setIsWatching(true);
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simple reverse geocoding using a free service (nominatim)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CareEase-Hub-App'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || 'Address not available';
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
    
    return 'Address not available';
  };

  const openInMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const copyCoordinates = () => {
    if (location) {
      const coords = `${location.latitude}, ${location.longitude}`;
      navigator.clipboard.writeText(coords).then(() => {
        alert('Coordinates copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = coords;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Coordinates copied to clipboard!');
      });
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Accessibility & Location Services</h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
          }`}>
            Find your location and access nearby healthcare services
          </p>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Show help information"
          className={`p-3 rounded-full ${
            theme === 'high-contrast' ? 'bg-white text-black' : 'text-teal-600 hover:bg-teal-100'
          }`}
        >
          <HelpCircle className="w-8 h-8" />
        </button>
      </div>

      {showHelp && (
        <div className={`mb-8 p-6 rounded-lg ${
          theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h2 className="text-2xl font-semibold mb-4">How to use Location Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Click "Get Current Location" to find your exact position</li>
              <li>Use "Watch Location" for real-time location tracking</li>
              <li>Your location data stays private and is not stored</li>
              <li>Works on all devices with location services enabled</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Copy coordinates to share with emergency services</li>
              <li>Open location in maps for navigation</li>
              <li>Location accuracy depends on your device and settings</li>
              <li>Enable location permissions when prompted</li>
            </ul>
          </div>
        </div>
      )}

      {/* Location Controls */}
      <div className={`mb-8 p-6 rounded-xl ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <h2 className="text-2xl font-bold mb-4">Location Detection</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading
                ? (theme === 'high-contrast' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : (theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700')
            }`}
            aria-label="Get current location"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Getting Location...' : 'Get Current Location'}
          </button>

          {!isWatching ? (
            <button
              onClick={startWatchingLocation}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Start watching location"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Watch Location
            </button>
          ) : (
            <button
              onClick={stopWatchingLocation}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              aria-label="Stop watching location"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Stop Watching
            </button>
          )}
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            theme === 'high-contrast' ? 'bg-gray-800 border border-white' : 'bg-red-50 border border-red-200'
          }`}>
            <AlertCircle className={`w-5 h-5 mr-3 mt-0.5 ${
              theme === 'high-contrast' ? 'text-white' : 'text-red-500'
            }`} />
            <div>
              <h3 className={`font-medium ${
                theme === 'high-contrast' ? 'text-white' : 'text-red-800'
              }`}>
                Location Error
              </h3>
              <p className={`text-sm ${
                theme === 'high-contrast' ? 'text-gray-200' : 'text-red-700'
              }`}>
                {error}
              </p>
            </div>
          </div>
        )}

        {location && (
          <div className={`p-6 rounded-lg ${
            theme === 'high-contrast' ? 'bg-gray-800 border border-white' : 
            theme === 'dark' ? 'bg-gray-700' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center mb-4">
              <CheckCircle className={`w-6 h-6 mr-2 ${
                theme === 'high-contrast' ? 'text-white' : 'text-green-600'
              }`} />
              <h3 className={`text-xl font-semibold ${
                theme === 'high-contrast' ? 'text-white' : 'text-green-800'
              }`}>
                Location Found
              </h3>
              {isWatching && (
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                  theme === 'high-contrast' ? 'bg-white text-black' : 'bg-blue-100 text-blue-800'
                }`}>
                  Live Tracking
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Coordinates</h4>
                <p className={`text-sm ${
                  theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Latitude: {location.latitude.toFixed(6)}
                </p>
                <p className={`text-sm ${
                  theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Longitude: {location.longitude.toFixed(6)}
                </p>
                <p className={`text-sm ${
                  theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Accuracy: ±{Math.round(location.accuracy)} meters
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <p className={`text-sm ${
                  theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Last Updated: {new Date(location.timestamp).toLocaleString()}
                </p>
                {location.address && (
                  <p className={`text-sm mt-2 ${
                    theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    <strong>Address:</strong> {location.address}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyCoordinates}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
                aria-label="Copy coordinates to clipboard"
              >
                Copy Coordinates
              </button>
              <button
                onClick={openInMaps}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'high-contrast' ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Open location in maps"
              >
                Open in Maps
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Features */}
      <div className={`mb-8 p-6 rounded-xl ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      }`}>
        <h2 className="text-2xl font-bold mb-4">Accessibility Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Location Services</h3>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              <li>🌍 Real-time GPS location detection</li>
              <li>📍 High-accuracy positioning</li>
              <li>🗺️ Address lookup and reverse geocoding</li>
              <li>📱 Cross-platform device support</li>
              <li>🔄 Continuous location tracking</li>
              <li>📋 Easy coordinate sharing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : theme === 'high-contrast' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              <li>🔒 Location data stays on your device</li>
              <li>🚫 No data storage or transmission</li>
              <li>⚡ Instant location detection</li>
              <li>🎯 Precise emergency location sharing</li>
              <li>🔐 Secure browser-based geolocation</li>
              <li>✋ User-controlled permissions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Information */}
      <div className={`p-6 rounded-lg ${
        theme === 'high-contrast' ? 'bg-gray-900 border border-white' : 
        theme === 'dark' ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start">
          <AlertCircle className={`w-6 h-6 mr-3 mt-1 ${
            theme === 'high-contrast' ? 'text-white' : 'text-red-600'
          }`} />
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'high-contrast' ? 'text-white' : 'text-red-800'
            }`}>
              Emergency Use
            </h3>
            <p className={`text-sm ${
              theme === 'high-contrast' ? 'text-gray-200' : 'text-red-700'
            }`}>
              In case of emergency, use the "Copy Coordinates" button to quickly share your exact location with emergency services. 
              Your coordinates can help first responders find you faster. For immediate emergency assistance, call your local emergency number (911 in the US).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;