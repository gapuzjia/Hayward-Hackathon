import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = "AIzaSyDjSMSEmtapgF2jkZpiooMv2UG7Nb9kM9Q"; // Replace with your API Key

const PLACE_TYPES = [
  { type: "store", label: "Thrift Stores", color: "orange" },
  { type: "point_of_interest", label: "Recycling Centers", color: "green" },
  { type: "transit_station", label: "Public Transport", color: "blue" }
];

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      fetchNearbyPlaces(userLocation.coords.latitude, userLocation.coords.longitude);
      setLoading(false);
    })();
  }, []);

  // 🔥 Fetch nearby places (thrift stores, recycling centers, public transport)
  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      let allPlaces = [];
      for (const placeType of PLACE_TYPES) {
        const RADIUS_METERS = 50000;
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${RADIUS_METERS}&type=${placeType.type}&key=${GOOGLE_MAPS_API_KEY}`;
        let response = await fetch(placesUrl);
        let json = await response.json();

        if (json.status !== "OK") {
          console.error("API Error:", json.status, json.error_message);
        }

        if (json.results) {
          // 🔥 Fetch ZIP codes for each place using Google Geocoding API
          const placesWithZip = await Promise.all(
            json.results.map(async (place) => {
              const zipCode = await fetchZipFromLatLng(
                place.geometry.location.lat,
                place.geometry.location.lng
              );

              return {
                id: place.place_id,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                title: place.name,
                category: placeType.label,
                pinColor: placeType.color,
                address: place.vicinity || "No Address Provided",
                zipCode: zipCode, // 🔥 Store the correct ZIP code
              };
            })
          );

          allPlaces = [...allPlaces, ...placesWithZip];
        }
      }
      setPlaces(allPlaces);
      setFilteredPlaces(allPlaces); // Show all places initially
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // 🔥 Fetch ZIP Code using Google Geocoding API
  const fetchZipFromLatLng = async (lat, lng) => {
    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.status === "OK" && geoData.results.length > 0) {
        for (const component of geoData.results[0].address_components) {
          if (component.types.includes("postal_code")) {
            return component.long_name; // ✅ Correct ZIP code
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching ZIP code:", error);
      return null;
    }
  };

  // 🔥 Filter places based on searched ZIP code
  const filterPlacesByZip = () => {
    if (!/^\d{5}$/.test(searchInput)) {
      Alert.alert("Invalid ZIP Code", "Please enter a valid 5-digit ZIP code.");
      return;
    }

    const filtered = places.filter((place) => place.zipCode === searchInput);
    if (filtered.length === 0) {
      Alert.alert("No Places Found", `No places found in ZIP code ${searchInput}.`);
    }

    setFilteredPlaces(filtered);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* 🔥 Search Bar */}
          <View style={{ padding: 10, backgroundColor: "white", flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10
              }}
              placeholder="Enter ZIP Code"
              value={searchInput}
              onChangeText={setSearchInput}
              keyboardType="numeric"
              onSubmitEditing={filterPlacesByZip}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                padding: 10,
                borderRadius: 8,
                marginLeft: 10
              }}
              onPress={filterPlacesByZip}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* 🔥 Map View */}
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: location?.latitude || 37.7749,
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {/* 📌 Place Markers (Only show filtered places) */}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={`${place.address} (ZIP: ${place.zipCode})`}
                pinColor={place.pinColor}
              />
            ))}
          </MapView>
        </>
      )}
    </View>
  );
};

export default Map;
