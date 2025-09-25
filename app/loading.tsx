import { RingLoader } from "react-spinners";
import css from "./Home.module.css";

const Loader = () => (
  <RingLoader size="50px" color="#0d6efd" className={css.loader} />
);

export default Loader;
