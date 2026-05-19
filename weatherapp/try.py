import requests

api_key = "b5e879865070e389439d80cca2c09fa8"
city = "Ahmedabad" # Aap koi bhi city daal sakte hain
url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

response = requests.get(url)
data = response.json()

if response.status_code == 200:
    # Current Temperature nikalne ka sahi tarika
    temp = data["main"]["temp"]
    print(f"Current Temperature in {city}: {temp}°C")
else:
    print("Error in API call")