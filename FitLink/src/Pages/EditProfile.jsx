import { useEffect, useState } from 'react';
import { FaRegSave, FaPen } from "react-icons/fa";
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../../api";


const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        phonenumber: "",
        bio: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log("from handleSubmit");
    //     try {
    //         console.log("before POST");
    //         const response = await fetch("http://fit-link.xyz:7000/api/accounts/trainer", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 email: formData.email,
    //                 firstName: formData.firstname,
    //                 lastName: formData.lastname,
    //                 phoneNumber: formData.phonenumber,
    //                 bio: formData.bio,
    //             }),
    //         });

    //         console.log("API Failed");

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error("Saving failed:", errorData);
    //             alert("Saving failed. Please try again.");
    //         } else {
    //             const data = await response.json();
    //             console.log("Signup successful:", data);

    //         }
    //     } catch (error) {
    //         console.error("Error during edit profile:", error);
    //         alert("An error occurred. Please try again later.");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Get the token for authorization
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ text: 'You must be logged in to update your profile', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            // Call the update API
            const response = await fetch(apiUrl("/api/accounts/update"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    firstName: formData.firstname,
                    lastName: formData.lastname,
                    phonenumber: formData.phonenumber,
                    bio: formData.bio,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Update failed:", data.message);
                setMessage({ text: data.message || 'Update failed. Please try again.', type: 'error' });
            } else {
                console.log("Profile updated successfully:", data);
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
            }
        } catch (error) {
            console.error("Error during profile update:", error);
            setMessage({ text: 'An error occurred. Please try again later.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (token) => {
        try {
          setLoading(true);
          const response = await fetch(apiUrl("/api/accounts/get"), {
            headers: { "Authorization": token }
          });
          
          if (response.ok) {
            const data = await response.json();
            // Update form with the fetched data
            setFormData({
              email: data.profile.email,
              firstname: data.profile.firstName || "",
              lastname: data.profile.lastName || "",
              phonenumber: data.profile.phonenumber || "",
              bio: data.profile.bio || ""
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {

        //Check email verification
        const verified = localStorage.getItem('verified');
        if (verified === "false") {
        navigate("/email-verify");
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                // First set email from token (immediate display)
                const [header, payload, signature] = token.split('.');
                const decodedPayload = JSON.parse(atob(payload));
      
                setFormData(prev => ({
                ...prev,
                email: decodedPayload.name || ""
                }));
      
                // Then fetch complete profile data
                fetchUserProfile(token);
            } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/signin');
        }
    } else {
    console.log("Error no token at Home page");
    navigate('/signin');
    }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <NavBar />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-800">Your Profile</h1>
                        </div>
                        <p className="text-gray-600">Edit your profile</p>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between p-6 gap-6">
                        {/* Left Side*/}
                        <form onSubmit={handleSubmit} className="flex-1 space-y-4">



                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="font-bold block text-purple-900 flex items-center font-medium">First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="mt-1 w-60 bg-gray-200 p-2"

                                    />
                                </div>
                                <div className="flex-10">
                                    <label className="font-bold block text-purple-900 flex items-center font-medium">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        className="mt-1 w-60 bg-gray-200 p-2"

                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="font-bold block text-purple-900 flex items-center font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 w-60 bg-gray-200 p-2"
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="flex-10">
                                    <label className="font-bold block text-purple-900 flex items-center font-medium">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        value={formData.phonenumber}
                                        onChange={handleInputChange}
                                        className="mt-1 w-60 bg-gray-200 p-2"

                                    />
                                </div>
                            </div>


                            <div>
                                <label className="font-bold block text-purple-900 flex items-center font-medium">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={7}
                                    className="border-2 rounded border-purple-300 text-med font-medium mt-1 w-140 bg-gray-200 p-2"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                />

                            </div>


                            <div className="flex justify-between mt-10">
                                <button type="submit" className="border-purple-700 order-2 items-center flex font-bold cursor-pointer mt-4 hover:bg-purple-700 bg-purple-600 text-sm text-white px-5 py-2 flex items-center gap-2 rounded-lg">
                                    <FaRegSave className="text-lg mr-2"/>
                                    Save
                                </button>
                            </div>
                        </form>                      
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;