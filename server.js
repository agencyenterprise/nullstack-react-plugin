import Nullstack from "nullstack";

import Application from "./src/Application";
import reactPlugin from "./src/plugin/react-plugin";

Nullstack.use(reactPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
