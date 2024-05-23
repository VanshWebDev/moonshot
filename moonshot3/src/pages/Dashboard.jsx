import axios from "axios";
import React, { useEffect, useState } from "react";
import { REACT_APP_BACKEND_URL } from "../../env";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Select, Button, Tooltip as T } from "antd";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb"; // or your preferred locale
import { LogoutOutlined, SearchOutlined } from "@mui/icons-material";
import styles from "../style/FilterBar.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const { Option } = Select;

const Dashboard = () => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState(
    Cookies.get("ageFilter") || "15-25"
  );
  const [genderFilter, setGenderFilter] = useState(
    Cookies.get("genderFilter") || "Male"
  );
  const [dateRange, setDateRange] = useState([
    Cookies.get("startDate")
      ? moment(Cookies.get("startDate"), "DD-MM-YYYY")
      : moment("04-10-2022", "DD-MM-YYYY"),
    Cookies.get("endDate")
      ? moment(Cookies.get("endDate"), "DD-MM-YYYY")
      : moment("06-10-2022", "DD-MM-YYYY"),
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const age = params.get("age") || ageFilter;
    const gender = params.get("gender") || genderFilter;
    const start = params.get("start") || dateRange[0].format("DD-MM-YYYY");
    const end = params.get("end") || dateRange[1].format("DD-MM-YYYY");

    setAgeFilter(age);
    setGenderFilter(gender);
    setDateRange([moment(start, "DD-MM-YYYY"), moment(end, "DD-MM-YYYY")]);

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`https://moonshot-6jhr.onrender.com/dashboard`, {
          params: { age, gender, start, end },
        });
        console.log(response.data);
        setGraphData(response.data.graphData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [location.search]);

  const handleFiltersChange = () => {
    Cookies.set("ageFilter", ageFilter);
    Cookies.set("genderFilter", genderFilter);
    Cookies.set("startDate", dateRange[0].format("DD-MM-YYYY"));
    Cookies.set("endDate", dateRange[1].format("DD-MM-YYYY"));

    const params = new URLSearchParams({
      age: ageFilter,
      gender: genderFilter,
      start: dateRange[0].format("DD-MM-YYYY"),
      end: dateRange[1].format("DD-MM-YYYY"),
    });

    navigate(`?${params.toString()}`);
  };

  const transformData = (data) => {
    const labels = [...new Set(data.map((item) => item.day))]; // Unique days

    const categories = ["A", "B", "C"];
    const datasets = categories.map((category) => ({
      label: category,
      data: labels.map((day) => {
        const entry = data.find((item) => item.day === day);
        return entry ? entry[category] : 0;
      }),
      // backgroundColor: getRandomColor(),
    }));

    return {
      labels,
      datasets,
    };
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <lord-icon
          src="https://cdn.lordicon.com/pxwxddbb.json"
          trigger="loop"
          state="loop-build-up"
          // style="width:250px;height:250px"
          className="loader"
          style={{ height: "100px", width: "100px" }}
        ></lord-icon>
      </div>
    );
  }

  const chartData = transformData(graphData);

  return (
    <div className="graphContainer">
      <div className="filterBarContainer">
        <Select
          value={ageFilter}
          onChange={setAgeFilter}
          style={{ width: 80, borderRadius: "20px" }}
        >
          <Option value="15-25">15-25</Option>
          <Option value=">25">25</Option>
        </Select>
        <Select
          value={genderFilter}
          onChange={setGenderFilter}
          style={{ width: 100, borderRadius: "20px" }}
        >
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateField
            label="Start Date"
            value={dateRange[0]}
            onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
            format="DD-MM-YYYY"
            style={{ marginRight: "1px", padding: "0px" }}
          />
          <DateField
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => setDateRange([dateRange[0], newValue])}
            format="DD-MM-YYYY"
            style={{ marginRight: "10px" }}
          />
        </LocalizationProvider>
        <Button type="primary" shape="round" onClick={handleFiltersChange}>
          Apply
        </Button>
        <Button
          danger
          type="primary"
          shape="round"
          onClick={() => {
            Cookies.remove("startDate");
            Cookies.remove("endDate");
            Cookies.remove("genderFilter");
            Cookies.remove("ageFilter");
            navigate("/dashboard"); // reset the URL to remove params
          }}
        >
          Reset
        </Button>
        <T title="search">
          <Button
            shape="circle"
            icon={<LogoutOutlined style={{ height: "20px" }} />}
          />
        </T>
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Graph Data" },
          },
        }}
      />
    </div>
  );
};

export default Dashboard;
