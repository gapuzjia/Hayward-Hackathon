import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, Modal, TouchableOpacity, Alert, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = "AIzaSyDjSMSEmtapgF2jkZpiooMv2UG7Nb9kM9Q"; // 🔥 Replace with your API Key

const PLACE_TYPES = [
  { type: "store", label: "Thrift Stores", color: "orange" }, // 🛍 Thrift stores
  { type: "point_of_interest", label: "Recycling Centers", color: "green" }, // ♻️ Recycling centers
  { type: "transit_station", label: "Public Transport", color: "blue" } // 🚉 Public transport
];

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [places, setPlaces] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 🔥 Default: Show all
  const [filterModalVisible, setFilterModalVisible] = useState(false); // 🔥 Controls the filter popup

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
          const placesWithType = json.results.map((place) => ({
            id: place.place_id,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            title: place.name,
            category: placeType.label, // 🔥 Store readable category name
            pinColor: placeType.color,
            address: place.vicinity || "No Address Provided",
            type: placeType.type // 🔥 Store type for filtering
          }));
          allPlaces = [...allPlaces, ...placesWithType];
        }
      }
      setPlaces(allPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // 🔥 Filter places based on selected category
  const filteredPlaces = selectedCategory === "all" 
    ? places 
    : places.filter(place => place.type === selectedCategory);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* 🔥 Button to Open Filter Modal */}
          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              margin: 10
            }}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Select Category
            </Text>
          </TouchableOpacity>

          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location?.latitude || 37.7749,
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You Are Here"
                pinColor="red"
              />
            )}

            {/* 📌 Filtered Markers */}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={place.address}
                pinColor={place.pinColor}
                onPress={() => setSelectedMarker(place)} // ✅ Opens popup
              />
            ))}
          </MapView>

          {/* 🔥 Filter Popup Modal */}
          <Modal
            transparent={true}
            animationType="fade"
            visible={filterModalVisible}
            onRequestClose={() => setFilterModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: 300, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Select Category</Text>

                {/* 🔥 Scrollable Category List */}
                <ScrollView style={{ width: "100%" }}>
                  <TouchableOpacity
                    style={{ padding: 10, borderBottomWidth: 1, width: "100%", alignItems: "center" }}
                    onPress={() => {
                      setSelectedCategory("all");
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>Show All</Text>
                  </TouchableOpacity>

                  {PLACE_TYPES.map((placeType) => (
                    <TouchableOpacity
                      key={placeType.type}
                      style={{ padding: 10, borderBottomWidth: 1, width: "100%", alignItems: "center" }}
                      onPress={() => {
                        setSelectedCategory(placeType.type);
                        setFilterModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{placeType.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* 🔥 Close Button */}
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                  style={{ marginTop: 15, padding: 10, backgroundColor: "red", borderRadius: 5 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 🔥 Popup Modal When Clicking a Pin */}
          {selectedMarker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={!!selectedMarker}
              onRequestClose={() => setSelectedMarker(null)}
            >
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: 300, alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{selectedMarker.title}</Text>
                  <Text style={{ fontSize: 16, color: "gray", marginBottom: 5 }}>{selectedMarker.category}</Text>
                  <Text style={{ fontSize: 14, color: "black", textAlign: "center" }}>{selectedMarker.address}</Text>
                  <TouchableOpacity onPress={() => setSelectedMarker(null)} style={{ marginTop: 15, padding: 10, backgroundColor: "blue", borderRadius: 5 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};

export default Map;
