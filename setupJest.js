const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
const { enableFetchMocks } = require("jest-fetch-mock");

enableFetchMocks();
Enzyme.configure({ adapter: new Adapter() });
