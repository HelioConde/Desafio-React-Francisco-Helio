import { BrowserRouter, Routes, Route } from "react-router-dom";
import './NavBar.css';

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Employee from "./pages/Employee";
import NetWork from "./pages/NetWork";
import Alert from "./pages/Alert";
import Historic from "./pages/Historic";
import User from "./pages/User";


function NavBar() {

    return (
        <main>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Employee />} />
                        <Route path="Home" index element={<Home />} />
                        <Route path="Employee" index element={<Employee />} />
                        <Route path="NetWork" element={<NetWork />} />
                        <Route path="Alert" element={<Alert />} />
                        <Route path="Historic" element={<Historic />} />
                        <Route path="User" element={<User />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default NavBar;