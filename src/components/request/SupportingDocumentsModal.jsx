import React from 'react';

const SupportingDocuments = ({ documents }) => {
    return (
        <div className="mt-6">
            <p><strong>Supporting Documents</strong></p>
            {documents?.length ? (
                <ul className="space-y-2">
                    {documents.map((doc, index) => (
                        <li key={index}>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {`Reason ${index + 1}`} {/* Replace with Reason 1, Reason 2, etc. */}
                            </a>
                            <a href={doc.fileUrl} download className="ml-2 text-gray-500 hover:text-gray-700">Download</a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No documents available</p>
            )}
            <br/>
        </div>
    );
};

export default SupportingDocuments;