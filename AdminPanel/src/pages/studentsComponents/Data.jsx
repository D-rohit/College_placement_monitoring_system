import axios from "axios";
const token = localStorage.getItem("token");

const response = await axios.get(
  "http://localhost:3000/api/student/getAllStudents",
  {
    headers: {
      Authorization: `Bearer ${token}`, // Passing the token in the Authorization header
    },
  }
);
const studentData =response.data

export default studentData;
