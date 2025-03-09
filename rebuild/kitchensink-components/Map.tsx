import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import filter icon

const GOOGLE_MAPS_API_KEY = ""; // Replace with your API Key

// ✅ More specific Google Places API types
const PLACE_TYPES = [
  { type: "thrift_store", label: "Thrift Stores", color: "orange" },
  { type: "recycling_center", label: "Recycling Centers", color: "green" },
  { type: "bus_station", label: "Bus Stations", color: "blue" },
  { type: "train_station", label: "Train Stations", color: "purple" },
  { type: "subway_station", label: "Subway Stations", color: "red" },
  { type: "light_rail_station", label: "Light Rail Stations", color: "yellow" }
];

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          const placesWithCategory = json.results.map((place) => ({
            id: place.place_id,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            title: place.name,
            category: placeType.label, // 🔥 Store category name
            pinColor: placeType.color,
            address: place.vicinity || "No Address Provided",
            type: placeType.type // 🔥 Store type for filtering
          }));
          allPlaces = [...allPlaces, ...placesWithCategory];
        }
      }
      setPlaces(allPlaces);
      setFilteredPlaces(allPlaces); // Show all places initially
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // 🔥 Filter places based on selected category
  const applyCategoryFilter = () => {
    if (selectedCategory === "all") {
      setFilteredPlaces(places); // Show all places
    } else {
      const filtered = places.filter((place) => place.type === selectedCategory);
      setFilteredPlaces(filtered);
    }
    setFilterModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* 🔥 Filter Icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 50,
              zIndex: 2,
              elevation: 5,
            }}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color="black" /> {/* ✅ Filter icon */}
          </TouchableOpacity>

          {/* 🔥 Map View */}
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: location?.latitude || 37.7749,
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            showsUserLocation={true} // ✅ Show user location marker
            showsMyLocationButton={true} // ✅ Show location button
          >
            {/* 📍 User Location Marker */}
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You Are Here"
                pinColor="blue" // 🔥 User's location marker
              />
            )}

            {/* 📌 Place Markers (Filtered) */}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={place.address}
                pinColor={place.pinColor}
              />
            ))}
          </MapView>

          {/* 🔥 Legend (Shows Pin Colors & Types) */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 10,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Legend</Text>
            {PLACE_TYPES.map((placeType) => (
              <View key={placeType.type} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: placeType.color,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontSize: 14 }}>{placeType.label}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default Map;
