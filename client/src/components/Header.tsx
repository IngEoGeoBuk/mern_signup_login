import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

const Header = () => {
    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);

    const alertLogin = () => {
        alert('로그인을 하셔야 이용 가능합니다.');
        return false
    }

    const logout = () => {
        window.localStorage.clear();
        window.location.reload();
    }

    return (
        <header>
            <h2>FIFA</h2>
            <nav>
                <ul>
                    <li><Link to='/' className="LinkStyles">Home</Link></li>
                    <li>
                        {email ? 
                            <Link to='/createPost' className="LinkStyles">Write</Link> :
                            <div onClick={alertLogin} style={{ cursor: 'pointer' }}>Write</div>
                        }
                    </li>
                    <li><Link to='/readBest' className="LinkStyles">Best</Link></li>
                    <li>
                        {email ? 
                            <div onClick={logout} style={{ cursor: 'pointer' }}>Logout</div> :
                            <Link to='/login' className="LinkStyles">Login</Link>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
