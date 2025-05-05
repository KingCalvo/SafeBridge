import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { supabase } from "../supabase/client";

const ApexChartSensores = () => {
  const [datosSensores, setDatosSensores] = useState([]);

  const statusMap = { Activo: 3, Reparación: 2, Inactivo: 1 };
  const colorMap = {
    Activo: "#28a745",
    Reparación: "#fd7e14",
    Inactivo: "#dc3545",
  };

  useEffect(() => {
    const fetchData = async () => {
      // Traer sensores con datos de catalogo_sensores
      const { data: sensores, error } = await supabase
        .from("sensores")
        .select("id_sensor, status, catalogo_sensores(nombre)")
        .order("id_sensor", { ascending: true });

      if (error) {
        console.error("Error al obtener sensores:", error.message);
        return;
      }

      // Formatear datos para la gráfica
      const formateados = sensores.map((s) => ({
        nombre: s.catalogo_sensores?.nombre || `Sensor ${s.id_sensor}`,
        status: s.status,
      }));

      setDatosSensores(formateados);
    };

    fetchData();
  }, []);

  const categories = datosSensores.map((s) => s.nombre);
  const seriesData = datosSensores.map((s) => statusMap[s.status] || 0);

  const discreteMarkers = datosSensores.map((s, index) => ({
    seriesIndex: 0,
    dataPointIndex: index,
    fillColor: colorMap[s.status] || "#999",
    strokeColor: "#fff",
    size: 6,
  }));

  const options = {
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      discrete: discreteMarkers,
      hover: {
        sizeOffset: 4,
      },
    },
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
    yaxis: {
      min: 0.5,
      max: 3.5,
      tickAmount: 3,
      labels: {
        formatter: (val) => {
          if (val === 1) return "Inactivo";
          if (val === 2) return "Reparación";
          if (val === 3) return "Activo";
          return "";
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          if (val === 1) return "Inactivo";
          if (val === 2) return "Reparación";
          if (val === 3) return "Activo";
          return "";
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    title: {
      text: "Estado actual de los sensores",
      align: "left",
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <ReactApexChart
        options={options}
        series={[{ name: "Estado", data: seriesData }]}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ApexChartSensores;
