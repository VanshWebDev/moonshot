const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();
const Graph = require("../models/graph.module");

router.get("/", authenticateToken, async (req, res) => {
  const { age, gender, start, end } = req.query;
  console.log(req.query);
  
  try {
    // Fetch all graph data from the database
    const allGraphData = await Graph.find({});
    
    // Filter the data based on the query parameters
    const filteredData = allGraphData.filter(item => {
      const itemDate = new Date(item.day);
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;

      const ageMatch = age ? item.age === age : true;
      const genderMatch = gender ? item.gender === gender : true;
      const dateMatch = startDate && endDate
        ? itemDate >= startDate && itemDate <= endDate
        : startDate
        ? itemDate >= startDate
        : endDate
        ? itemDate <= endDate
        : true;

      return ageMatch && genderMatch && dateMatch;
    });

    // Send the filtered graph data along with the welcome message and user info
    res.json({
      message: "Welcome to the dashboard",
      user: req.user,
      graphData: filteredData,
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
