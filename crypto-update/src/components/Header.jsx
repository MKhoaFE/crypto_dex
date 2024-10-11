import { useNavigate } from "react-router-dom"
import { LogoIcon } from "../icons/icons"

import "../components/style/header.css"
import { Button } from "@mui/material";

const Header = () => {


  return (
    <div style={{backgroundColor:"rgb(25, 25, 66)"}}>
        <div className="container content">
          <div className="left">
          <h1>DEX EXCHANGE</h1>

          </div>
          <div className="right d-flex gap-1">
            Etherium
          <Button variant="outlined">Connect</Button>
          </div>
        </div>
    </div>
  )
}

export default Header