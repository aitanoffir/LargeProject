function LoggedInName() {
    
    var _ud = localStorage.getItem('user_data');
    var ud = _ud ? JSON.parse(_ud) : null; // Prevents null parsing error    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const doLogout = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

    return (
        <div id="loggedInDiv">
            <span id="userName">Logged In As {firstName} {lastName}</span><br />
            <button type="button" id="logoutButton" className="buttons"
                onClick={doLogout}> Log Out </button>
        </div>
    );
};
export default LoggedInName;