import Nullstack from "nullstack";

import Application from "./src/Application";
import reactClientPlugin from "./src/plugin/react-client-plugin";

Nullstack.use(reactClientPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
