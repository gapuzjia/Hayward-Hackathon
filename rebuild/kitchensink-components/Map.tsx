import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
console.log("Google API Key:", GOOGLE_MAPS_API_KEY);


const PLACE_TYPES = [
  { type: "recycling_center", color: "green" },  // ♻️ Recycling centers
  { type: "transit_station", color: "blue" },    // 🚉 Public transport
  { type: "thrift_store", color: "orange" },     // 🛍 Thrift stores
];

const Map = () => {
  const [places, setPlaces] = useState<Array<{ 
    geometry: { location: { lat: number; lng: number } }; 
    name: string; 
    vicinity: string;
    type: string; // ✅ Stores the place type
  }> | []>([]);
  
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setLoading(false);

      fetchNearbyPlaces(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    try {
      let allPlaces: any[] = [];
  
      for (const placeType of PLACE_TYPES) {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${placeType.type}&key=${GOOGLE_MAPS_API_KEY}`;
        
        console.log("Fetching places from:", placesUrl); // Debugging URL
  
        let response = await fetch(placesUrl);
        let json = await response.json();
        
        console.log("API Response:", json); // Log full API response
  
        if (json.status !== "OK") {
          console.error("API Error:", json.status, json.error_message);
        }
  
        if (json.results) {
          const placesWithType = json.results.map((place: any) => ({
            ...place,
            type: placeType.type, // ✅ Add place type for pin color
          }));
          allPlaces = [...allPlaces, ...placesWithType];
        }
      }
  
      setPlaces(allPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
      ) : location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You are here"
            pinColor="red"
          />

          {/* Display Nearby Places */}
          {places.length > 0 ? (
            places.map((place, index) =>
              place.geometry?.location ? (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                  }}
                  title={place.name}
                  description={place.vicinity}
                  pinColor={
                    place.type === "recycling_center" ? "green" : 
                    place.type === "transit_station" ? "blue" : "orange"
                  }
                />
              ) : null
            )
          ) : (
            <Text style={{ textAlign: "center", marginTop: 50 }}>
              No places found in this area.
            </Text>
          )}
        </MapView>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Location access denied.
        </Text>
      )}
    </View>
  );
};

export default Map;
