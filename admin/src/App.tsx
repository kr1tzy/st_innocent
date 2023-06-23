import { Admin, Resource } from "react-admin";
import { authProvider, dataProvider } from "./Providers";
import { ImageList, ImageEdit, ImageShow } from "./Images";
import { PageList, PageEdit } from "./Pages";
import { darkTheme } from "./Theme";
import Dashboard from "./Dashboard";
import Layout from "./Layout";
import Login from "./Login";

const App = () => (
  <Admin
    disableTelemetry
    layout={Layout}
    theme={darkTheme}
    loginPage={Login}
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    requireAuth
  >
    <Resource
      name="images"
      list={ImageList}
      edit={ImageEdit}
      show={ImageShow}
    />
    <Resource name="pages" list={PageList} edit={PageEdit} />
  </Admin>
);

export default App;
