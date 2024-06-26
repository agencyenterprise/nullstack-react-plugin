import Nullstack from "nullstack";

import Application from "./src/Application";
import reactClientPlugin from "nullstack-react-plugin/client";

Nullstack.use(reactClientPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
