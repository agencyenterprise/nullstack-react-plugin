import Nullstack from "nullstack";

import Application from "./src/Application";
import reactServerPlugin from "./src/plugin/react-server-plugin";

Nullstack.use(reactServerPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
