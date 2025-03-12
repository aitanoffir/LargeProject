import React, { useState } from 'react';

const app_name = 'fit-link.xyz';

function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development'){
        return 'http://' + app_name + ':5000/' + route;
    } else {
        return 'http://localhost:5000/' + route;
    }
}

function Register() {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSetFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleSetLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const doRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        const obj = { 
            username: username, 
            password: password,
            firstName: firstName,
            lastName: lastName
        };
        
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/register'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            
            const res = await response.json();
            
            if (!res.success) {
                setMessage(res.message);
            } else {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    return (
        <div id="registerDiv">
            <span id="inner-title">CREATE NEW ACCOUNT</span><br />
            <input type="text" id="firstName" placeholder="First Name" 
                onChange={handleSetFirstName} required />
            <input type="text" id="lastName" placeholder="Last Name" 
                onChange={handleSetLastName} required />
            <input type="text" id="username" placeholder="Username" 
                onChange={handleSetUsername} required />
            <input type="password" id="password" placeholder="Password" 
                onChange={handleSetPassword} required />
            <input type="submit" id="registerButton" className="buttons" value="Register" 
                onClick={doRegister} />
            <span id="registerResult">{message}</span>
            <p>Already have an account? <a href="/">Login here</a></p>
        </div>
    );
}

export default Register;