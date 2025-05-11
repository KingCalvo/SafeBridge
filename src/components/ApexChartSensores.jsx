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
      const { data: sensores, error } = await supabase
        .from("sensores")
        .select("id_sensor, id_puente, status, catalogo_sensores(nombre)")
        .order("id_sensor", { ascending: true });
      if (error) {
        console.error("Error al obtener sensores:", error.message);
        return;
      }

      const enriched = await Promise.all(
        sensores.map(async (s) => {
          let fecha = null;
          if (s.status === "Inactivo") {
            const { data: alerta } = await supabase
              .from("alertas")
              .select("fecha_hora")
              .eq("id_puente", s.id_puente)
              .eq("status", "Inactiva")
              .order("fecha_hora", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (alerta?.fecha_hora) {
              fecha = new Date(alerta.fecha_hora).toLocaleDateString();
            } else {
              const { data: evento } = await supabase
                .from("eventos_desbordamiento")
                .select("fecha_hora")
                .eq("id_puente", s.id_puente)
                .order("fecha_hora", { ascending: false })
                .limit(1)
                .maybeSingle();
              if (evento?.fecha_hora) {
                fecha = new Date(evento.fecha_hora).toLocaleDateString();
              }
            }
            if (!fecha) fecha = "05/01/2025";
          }
          return {
            nombre: s.catalogo_sensores?.nombre || `Sensor ${s.id_sensor}`,
            status: s.status,
            date: fecha,
          };
        })
      );

      setDatosSensores(enriched);
    };

    fetchData();
  }, []);

  const categories = datosSensores.map((s) => s.nombre);
  const seriesData = datosSensores.map((s) => statusMap[s.status] || 0);
  const discreteMarkers = datosSensores.map((s, idx) => ({
    seriesIndex: 0,
    dataPointIndex: idx,
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
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5, discrete: discreteMarkers, hover: { sizeOffset: 4 } },
    xaxis: { categories, labels: { rotate: -45 } },
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
      enabled: true,
      shared: false,
      intersect: true,
      y: {
        title: {
          formatter: () => "Estado",
        },
        formatter: (val, { dataPointIndex }) => {
          const s = datosSensores[dataPointIndex];
          if (s.status === "Inactivo") {
            return `Inactivo\n${s.date}`;
          }
          return s.status;
        },
      },
    },
    grid: { borderColor: "#f1f1f1" },
    title: { text: "Estado actual de los sensores", align: "left" },
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
