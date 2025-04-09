import React, { useState } from "react";
import { FaRegSave, FaPen, FaExclamation } from "react-icons/fa";
import NavBar from '../Components/NavBar';


const EditProfile = () => {
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
                        <div className="flex-1 space-y-4">

                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    placeholder="We don't even ask the user for this information."
                                    className="mt-1 w-100 border-b border-gray-400 bg-gray-200 p-2"

                                />
                            </div>


                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="I don't really know"
                                        className="mt-1 w-60 bg-gray-200 p-2"

                                    />
                                </div>
                                <div className="flex-10">
                                    <label className="block text-sm font-medium">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="why I did this"
                                        className="mt-1 w-60 bg-gray-200 p-2"

                                    />
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium">Bio</label>
                                <textarea
                                    rows={5}
                                    className="mt-1 w-140 bg-gray-200 p-2"
                                    placeholder="but whatever‼️‼️"
                                />

                            </div>


                            <div className="flex justify-between mt-10">
                                <button className="cursor-pointer mt-4 bg-black text-white px-4 py-2 flex items-center gap-2 rounded">
                                    <FaRegSave />
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Right Side*/}
                        <div className="flex-1/5 items-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden border">
                                <img

                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <button className="cursor-pointer -mt-11 -ml-5 bg-orange-600 text-white px-4 py-1 rounded flex items-center gap-2">
                                <FaPen />
                                Edit
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;