import { NavLink } from "react-router-dom";

function Menu() {
    return(
        <nav>
            <ul>
                <li>
                    <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/perfil">Perfil</NavLink>
                </li>
                <li>
                    <NavLink to="/">Sair</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;