import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";

const Map = () => {
  // ✅ Fix: Explicitly define the type for 'places'
  const [places, setPlaces] = useState<Array<{ 
    geometry: { location: { lat: number; lng: number } }; 
    name: string; 
    vicinity: string;
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

      fetchNearbyThriftStores(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyThriftStores = async (lat: number, lng: number) => {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=thrift_store&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      let response = await fetch(placesUrl);
      let json = await response.json();
      setPlaces(json.results ?? []); // ✅ Ensures TypeScript understands it's an array
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
            pinColor="blue"
          />

          {/* Nearby Thrift Stores */}
          {places.length > 0 ? (
            <>
              {places.map((place, index) =>
                place.geometry?.location ? ( // ✅ Fix: Now TypeScript recognizes 'geometry'
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: place.geometry.location.lat,
                      longitude: place.geometry.location.lng,
                    }}
                    title={place.name}
                    description={place.vicinity}
                  />
                ) : null
              )}
            </>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 50 }}>No thrift stores found in this area.</Text>
          )}
        </MapView>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 50 }}>Location access denied.</Text>
      )}
    </View>
  );
};

export default Map;
