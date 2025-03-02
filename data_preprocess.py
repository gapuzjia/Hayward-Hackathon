import requests
import csv

# 🔑 Replace with your Google API Key
API_KEY = "AIzaSyD-_jPIjy2K2I6N-MKVmCqssrTLlI0gyi4"

# 🌍 Set the location (latitude & longitude) and radius (in meters)
LOCATION = "37.65498744801002,-122.05471139716227"  # Example: Near San Francisco
RADIUS = 10000  # 10km radius

# 🏢 Place types to fetch
PLACE_TYPES = {
    "Recycling Center": "recycling_center",
    "Transit Station": "transit_station",
    "Thrift Store": "thrift_store",
}

# 📄 Output CSV file name
OUTPUT_CSV = "places_data.csv"

def fetch_places(place_type, type_key):
    """ Fetch places from Google Places API """
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={LOCATION}&radius={RADIUS}&type={type_key}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if data.get("status") != "OK":
        print(f"❌ Error fetching {place_type}: {data.get('error_message', 'Unknown error')}")
        return []

    return [
        {
            "Name": place["name"],
            "Address": place.get("vicinity", "N/A"),
            "Latitude": place["geometry"]["location"]["lat"],
            "Longitude": place["geometry"]["location"]["lng"],
            "Rating": place.get("rating", "N/A"),
            "Type": place_type,
        }
        for place in data.get("results", [])
    ]

def save_to_csv(data):
    """ Save places data to CSV file """
    with open(OUTPUT_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["Name", "Address", "Latitude", "Longitude", "Rating", "Type"])
        writer.writeheader()
        writer.writerows(data)

def main():
    """ Main function to fetch and save places """
    all_places = []

    for place_type, type_key in PLACE_TYPES.items():
        print(f"🔍 Fetching {place_type}...")
        places = fetch_places(place_type, type_key)
        all_places.extend(places)

    if all_places:
        save_to_csv(all_places)
        print(f"✅ Data saved to {OUTPUT_CSV}")
    else:
        print("⚠️ No places found.")

if __name__ == "__main__":
    main()
