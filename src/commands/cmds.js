import Reset from "./reset.js";
import Ping from "./ping.js";
import Scramble from "./scramble.js";
import Help from "./help.js";
import Anon from "./anon/anon.js";
import Uptime from "./uptime.js";
import Bruh from "./bruh.js";

export default [
  new Reset(),
  new Ping(),
  new Scramble(),
  new Help(),
  new Uptime(),
  new Anon(),
  new Bruh()
]