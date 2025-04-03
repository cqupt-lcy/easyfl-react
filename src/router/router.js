import { Navigate } from "react-router";
import FL from "../components/FL";
import SAM from '../components/SAM'
import Content from "../pages/content";
const routes =[
  {path:"/",element:<Navigate to="/fl"/>},
  {path:"/fl",element:<FL/>},
  {path:"/sam",element:<SAM/>},

]

export default routes