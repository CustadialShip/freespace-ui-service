import Cookies from "universal-cookie";
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import jwt from "jwt-decode";

const Login = () => {
    const cookies = new Cookies();
    const history = useHistory();

    const [usernameIn, setUsername] = useState('');
    const [passwordIn, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const login = (jwt_token) => {
        const decode = jwt(jwt_token);

        cookies.set("jwt_authorization", jwt_token, {
            expires: new Date(decode.exp * 1000)
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsPending(true);

        fetch('/api/v1/auth/authenticate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: usernameIn,
                password: passwordIn
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw Error("Wrong username or password. Please try again");
                }
                return response.json();
            })
            .then(data => {
                login(data.token);
                history.push("/home");
            })
            .catch((err) => {
                setError(err.message);
                setIsPending(false);
            });
    };

    return (
        <div className="login">
            <h2>Welcome!</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label>Username:</label>
                <input
                    type="text"
                    required
                    value={usernameIn}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter username'/>
                <label>Password:</label>
                <input
                    type="text"
                    required
                    value={passwordIn}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter password'/>
                {error && <div className="error"><h4>{error}</h4></div>}
                {!isPending && <button>Log in</button>}
                {isPending && <button disabled>Log in...</button>}
            </form>
            <div className="signup-link">
                <h5>
                    Need an account? <Link to="/signup">Sign up</Link>
                </h5>
            </div>
        </div>
    );
}

export default Login;