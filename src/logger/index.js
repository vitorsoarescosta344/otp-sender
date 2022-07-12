import logger from "pino";

const log = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time": "${new Date(Date.now()).toISOString()}"`,
});

export default log;
