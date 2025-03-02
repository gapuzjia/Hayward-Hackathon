import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MarkerSVG from "./assets/marker.svg"; // ✅ Import your SVG file

const LOCATIONS = [
  { id: 1, latitude: 37.7668, longitude: -122.4295, title: "Goodwill Donation Center", category: "Thrift Store" },
  { id: 2, latitude: 37.7813, longitude: -122.4622, title: "Salvation Army Thrift Store", category: "Thrift Store" },
];

const Map = () => {
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
      console.log("User Location:", userLocation.coords);
      setLocation(userLocation.coords);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location?.latitude || 37.7749,
            longitude: location?.longitude || -122.4194,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* CSV Data Markers with SVG Icon */}
          {LOCATIONS.map((place) => (
            <Marker key={place.id} coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.title} description={place.category}>
              <View>
                <MarkerSVG width={40} height={40} /> {/* ✅ Use your SVG as the marker */}
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

export default Map;
