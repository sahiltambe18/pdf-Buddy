"use client"
import React, { useState } from 'react';
import MaxWidthWraapper from './MaxWidthWraapper';

const Dashboard = () => {
    // Sample state to store uploaded PDFs
    const [uploadedPDFs, setUploadedPDFs] = useState([{ name: "pdf", id: "sd" }, { name: "p", id: "s" }]);

    // Function to handle PDF upload
    const handleUpload = (event: Event) => {
        
    };

    // Function to handle PDF deletion
    const handleDelete = (pdfId: string) => {
        
    };

    return (

        <MaxWidthWraapper className='px-4' >
            <div className="flex flex-col items-center">

                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-2">My files</h2>
                    {uploadedPDFs.map((pdf, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-2">
                            <div className='flex flex-col'>
                            <span>{pdf.name}</span>
                            <span>created at</span>
                            </div>
                            <button onClick={() => handleDelete(pdf.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

        </MaxWidthWraapper>
    );
};

export default Dashboard;
