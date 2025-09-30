import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODU0ZjQwMjY2YmJmNDAxZGViZGYxMGJiMDk4MDE0MSIsIm5iZiI6MTc1OTIzMTY0MC4zNzc5OTk4LCJzdWIiOiI2OGRiYmU5ODgxOTBiNjhlNGRiYjE2N2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.VCm1RQVWd4oFNF65O9V2CsLtUrBLciXl-dd2voAN4MY`,
  },
});

export default api;