import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SidebarInvitado";
import axios from "axios";
import ApexChartPuentes from "../../components/ApexChartPuentes";

const GraficosInv = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const lat = 19.4326;
      const lon = -99.1332;
      const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&current_weather=true` +
        `&hourly=relativehumidity_2m` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto`;

      try {
        const { data } = await axios.get(url);
        setWeather(data);
      } catch (err) {
        console.error("Error al obtener clima:", err);
      }
    };

    fetchWeather();
  }, []);

  const formatHour = (date) =>
    new Date(date).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 bg-white">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 uppercase text-center">
          Gráficos del clima
        </h1>

        {/* Sección clima */}
        {weather?.current_weather && (
          <div className="p-4 sm:p-6 rounded-lg shadow mb-8 text-center">
            {/* Emoji y temperatura centrados */}
            <div className="text-3xl sm:text-4xl lg:text-5xl mb-2">
              {weather.current_weather.temperature < 15
                ? "🌥️"
                : weather.current_weather.temperature >= 15 &&
                    weather.current_weather.temperature < 20
                  ? "🌤️"
                  : "☀️"}{" "}
              {Math.round(weather.current_weather.temperature)}°C
            </div>

            {/* Día y hora */}
            <div className="text-sm sm:text-base lg:text-lg font-medium mb-4">
              {new Date(weather.current_weather.time).toLocaleDateString(
                "es-MX",
                {
                  weekday: "long",
                },
              )}{" "}
              {formatHour(weather.current_weather.time)}
            </div>

            {/* Detalles clima */}
            <div className="space-y-1 mb-6">
              <p>
                Prob. de precipitaciones:{" "}
                {weather.daily.precipitation_probability_max?.[0] ?? "--"}%
              </p>
              <p>Viento: {weather.current_weather.windspeed} km/h</p>
            </div>

            {/* Pronóstico 7 días */}
            <div className="flex gap-3 overflow-x-auto pb-2 justify-start sm:justify-center">
              {weather.daily.time.slice(0, 7).map((day, i) => {
                const prob = weather.daily.precipitation_probability_max[i];
                const tempMax = weather.daily.temperature_2m_max[i];
                // Emoji basado en temperatura (no en probabilidad de lluvia)
                const emoji =
                  tempMax < 15
                    ? "🌥️"
                    : tempMax >= 15 && tempMax < 20
                      ? "🌤️"
                      : "☀️";
                return (
                  <div
                    key={day}
                    className="flex-shrink-0 text-center p-2 bg-white rounded shadow w-20 sm:w-24"
                  >
                    <div className="text-2xl">{emoji}</div>
                    <p className="capitalize text-sm">
                      {new Date(day).toLocaleDateString("es-MX", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-sm">
                      {Math.round(tempMax)}° |{" "}
                      {Math.round(weather.daily.temperature_2m_min[i])}°
                    </p>
                    <p className="text-xs text-blue-600">{prob}% lluvia</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="mt-4 sm:mt-6 lg:mt-28">
            <ApexChartPuentes />
          </div>

          <div className="bg-white shadow p-3 sm:p-4 rounded mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">
              Mapa climático de México en tiempo real
            </h2>
            <iframe
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
              src="https://embed.windy.com/embed2.html?lat=23.6345&lon=-102.5528&detailLat=19.4326&detailLon=-99.1332&width=650&height=450&zoom=5&level=surface&overlay=wind&menu=true&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=km/h&metricTemp=°C&radarRange=-1"
              frameBorder="0"
              title="Mapa climático Windy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosInv;
