import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ApexCharts from "react-apexcharts";
import { supabase } from "../../supabase/client";

const AdminInicio = () => {
  const [alertaSeries, setAlertaSeries] = useState([]);
  const [alertaCategories, setAlertaCategories] = useState([]);
  const [eventoSeries, setEventoSeries] = useState([]);
  const [eventoCategories, setEventoCategories] = useState([]);
  const [sensorSeries, setSensorSeries] = useState([]);

  useEffect(() => {
    fetchAlertas();
    fetchEventos();
    fetchSensores();
  }, []);

  const fetchAlertas = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select("id_alertas, fecha_hora, status");
    if (error) return console.error("Error fetching alertas", error);

    const countByDay = {};
    data.forEach((a) => {
      const day = new Date(a.fecha_hora).toLocaleDateString();
      countByDay[day] = (countByDay[day] || 0) + 1;
    });

    setAlertaCategories(Object.keys(countByDay));
    setAlertaSeries([{ name: "Alertas", data: Object.values(countByDay) }]);
  };

  const fetchEventos = async () => {
    const { data: eventos, error: eventosError } = await supabase
      .from("eventos_desbordamiento")
      .select("id_evento, fecha_hora, id_nivel_riesgo");
    if (eventosError) return console.error("Error eventos", eventosError);

    const { data: niveles, error: nivelesError } = await supabase
      .from("catalogo_niveles_riesgo")
      .select("id_nivel, status");
    if (nivelesError) return console.error("Error niveles", nivelesError);

    const nivelMap = niveles.reduce((acc, n) => {
      acc[n.id_nivel] = n.status;
      return acc;
    }, {});

    const countByStatus = { Alto: 0, Bajo: 0 };
    eventos.forEach((e) => {
      const status = nivelMap[e.id_nivel_riesgo];
      if (status) countByStatus[status] = (countByStatus[status] || 0) + 1;
    });

    setEventoCategories(Object.keys(countByStatus));
    setEventoSeries([
      {
        name: "Eventos",
        data: Object.values(countByStatus).map((value, index) => ({
          x: Object.keys(countByStatus)[index],
          y: value,
          color:
            Object.keys(countByStatus)[index] === "Alto"
              ? "#FF0000"
              : "#00FF00",
        })),
      },
    ]);
  };

  const fetchSensores = async () => {
    const { data: sensores, error: sensoresError } = await supabase
      .from("sensores")
      .select("id_sensor, status");

    const { data: catalogo, error: catalogoError } = await supabase
      .from("catalogo_sensores")
      .select("id_sensor, nombre, modelo");

    if (sensoresError || catalogoError)
      return console.error("Error sensores", sensoresError || catalogoError);

    const sensorMap = catalogo.reduce((acc, s) => {
      acc[s.id_sensor] = `${s.nombre} (${s.modelo})`;
      return acc;
    }, {});

    const categories = sensores.map(
      (s) => sensorMap[s.id_sensor] || `Sensor ${s.id_sensor}`
    );
    const values = sensores.map((s) => (s.status === "Activo" ? 1 : 0));

    setSensorSeries([
      {
        name: "Estado del Sensor",
        data: values,
      },
    ]);
    setSensorCategories(categories);
  };

  const [sensorCategories, setSensorCategories] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold uppercase text-gray-800 mb-8 text-center">
          Gráficas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Línea de Alertas */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ALERTAS GENERADAS
            </h2>
            <ApexCharts
              options={{
                chart: { id: "alertas-line", zoom: { enabled: false } },
                xaxis: { categories: alertaCategories },
                yaxis: {
                  min: 0,
                  title: {
                    text: "Número de alertas",
                  },
                },
                dataLabels: { enabled: false },
                stroke: { curve: "straight" },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                  },
                },
                title: {
                  text: "Tendencia de Alertas por Día",
                  align: "left",
                },
              }}
              series={alertaSeries}
              type="line"
              height={350}
            />
          </div>

          {/* Barras de Eventos */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ESTADÍSTICAS DE EVENTOS DE DESBORDAMIENTO
            </h2>
            <ApexCharts
              options={{
                chart: { type: "bar", id: "eventos-bar" },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                    distributed: true,
                  },
                },
                dataLabels: { enabled: false },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: { categories: eventoCategories },
                fill: { opacity: 1 },
                colors: eventoCategories.map((cat) =>
                  cat === "Alto" ? "#FF0000" : "#1ccd4c"
                ),
                tooltip: {
                  y: {
                    formatter: (val) => `${val} eventos`,
                  },
                },
              }}
              series={eventoSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>

        {/* Área - Estado de los Sensores */}
        <div className="mt-12 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            ESTADO DE LOS SENSORES
          </h2>
          <ApexCharts
            options={{
              chart: {
                type: "area",
                height: 350,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
              xaxis: {
                categories: sensorCategories,
              },
              tooltip: {
                y: {
                  formatter: (val) => (val === 1 ? "Activo" : "Inactivo"),
                },
              },
              yaxis: {
                min: 0,
                max: 1,
                tickAmount: 1,
                labels: {
                  formatter: (val) => (val === 1 ? "Activo" : "Inactivo"),
                },
              },
            }}
            series={sensorSeries}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInicio;
