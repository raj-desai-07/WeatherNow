from django.shortcuts import render, redirect
import requests
import pycountry
from datetime import datetime, timedelta
from django.contrib import messages

def home(request):
    API_KEY = "b5e879865070e389439d80cca2c09fa8"
    if request.method == "POST":
        city = request.POST.get("city")
    else:
        city = "Delhi"

    try:
        data_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
        data_response = requests.get(data_url)
        data = data_response.json()

        weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        weather_response = requests.get(weather_url)
        weather = weather_response.json()

        lat = weather["coord"]["lat"]
        lon = weather["coord"]["lon"]

        aqi_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
        aqi_response = requests.get(aqi_url)
        aqi_data = aqi_response.json()

        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        forecast_list = []

        now = datetime.now()

        today_6am = now.replace(
            hour=6,
            minute=0,
            second=0,
            microsecond=0
        )

        if now.hour >= 6:
            start_time = today_6am + timedelta(days=1)

        else:
            start_time = today_6am

        end_time = start_time + timedelta(hours=21)

        for item in forecast_data["list"]:

            forecast_time = datetime.strptime(
                item["dt_txt"],
                "%Y-%m-%d %H:%M:%S"
            )

            if start_time <= forecast_time <= end_time:

                weather_main = item["weather"][0]["main"]

                hour = forecast_time.hour

                is_night = hour < 6 or hour >= 18

                if weather_main == "Clear":

                    if is_night:
                        icon = "fa-moon indigo-fc"

                    else:
                        icon = "fa-sun yellow-fc"


                elif weather_main == "Clouds":

                    if is_night:
                        icon = "fa-cloud-moon indigo-fc"

                    else:
                        icon = "fa-cloud-sun yellow-fc"


                elif weather_main == "Rain":
                    icon = "fa-cloud-rain indigo-fc"

                elif weather_main == "Thunderstorm":
                    icon = "fa-bolt yellow-fc"

                elif weather_main == "Snow":
                    icon = "fa-snowflake grey-fc"

                elif weather_main == "Mist":
                    icon = "fa-smog grey-fc"

                else:
                    icon = "fa-cloud indigo-fc"

                forecast_list.append({
                    "time": forecast_time.strftime("%I:%M %p"),
                    "temp": int(item["main"]["temp"]),
                    "ttl": weather_main,
                    "icon": icon
                })
    except:
        messages.error(request, "City not found. Please try another city name.")
        return redirect("/")

    if data:
        result = {
            "city" : data[0]["name"],
            "country" : pycountry.countries.get(alpha_2 = data[0]["country"]).name,  # getting country code(2 charector) using data[0]["country"] and find full country name using pycountry library
            "state": data[0].get("state", ""),
            "day" : datetime.now().strftime("%A"),
            "date" : datetime.now().date(),
            "time" : datetime.now().time(),
            "temp" : int(weather["main"]["temp"]),
            "title" : weather["weather"][0]["main"],
            "disc" : weather["weather"][0]["description"],
            "humidity" : weather["main"]["humidity"],
            "wind" : weather["wind"]["speed"],
            "visibility" : (weather["visibility"]) / 1000,
            "aqi" : aqi_data["list"][0]["main"]["aqi"],
            "feels_like" : weather["main"]["feels_like"],
            "pressure" : weather["main"]["pressure"],
            "sunrise_time" : datetime.fromtimestamp(weather["sys"]["sunrise"]).strftime("%I:%M %p"), 
            "sunset_time" : datetime.fromtimestamp(weather["sys"]["sunset"]).strftime("%I:%M %p"), 
            "forecast": forecast_list,
        }
    else:
        messages.error(request, "City not found. Please try another city name.")
        return redirect("/")
    return render(request, "index.html", result)