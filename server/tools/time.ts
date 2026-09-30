export const getTime = async () => ({
  success: true,
  tool: "gettime",
  data: {
    currentTime: "10:18 AM",
    timezone: "IST",
  },
  meta: {
    timestamp: new Date().toISOString(),
  },
});