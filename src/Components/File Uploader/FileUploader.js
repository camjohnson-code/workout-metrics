import './FileUploader.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { BsUpload } from 'react-icons/bs';
import { getUserFromAPI, uploadFile } from '../../ApiCalls';

const FileUploader = ({ setManualForm, manualForm, setSubmitted, athlete }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileTypeError, setFileTypeError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const handleSubmit = async () => {
    if (acceptedFiles.length === 0) return;

    const supportedTypes = ['fit', 'tcx', 'gpx'];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      const extension = file.name.split('.').pop().toLowerCase();

      if (!supportedTypes.includes(extension)) {
        setFileTypeError(true);
        return;
      } else setFileTypeError(false);
      formData.append('data_type', extension);

      const athleteInfo = await getUserFromAPI(athlete.id);
      const accessToken = athleteInfo.data.stravaAccessToken;

      const data = await uploadFile(file, accessToken);

      if (data.error) {
        setUploadError(true);
        if (data.error.includes('duplicate'))
          setUploadErrorMessage('This file has already been uploaded.');
        else
          setUploadErrorMessage(
            'There was an error uploading your file. Please try again.'
          );
      }
    }
  };

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <form className='form'>
      {uploadError && <p>{uploadErrorMessage}</p>}
      {!fileTypeError && !uploadError ? (
        <p className='upload-instruction'>
          Upload your file below. You can also add one manually{' '}
          <Link
            onClick={() => setManualForm(!manualForm)}
            className='manual-link'
          >
            here
          </Link>
          .
        </p>
      ) : (
        <p className='upload-instruction'>
          Supported file types are .fit, .gpx and .tcx only.
        </p>
      )}
      <section
        className='file-uploader'
        {...getRootProps({ className: 'dropzone' })}
      >
        <BsUpload className='upload-icon' />
        <input {...getInputProps()} />
        <p className='file-types'>
          {acceptedFiles.length
            ? `File(s) added: ${acceptedFiles
                .map((file) => file.name)
                .join(', ')}`
            : 'Works for multiple .tcx, .fit or .gpx files 25MB or smaller.'}
        </p>
      </section>
      <button
        onClick={() => {
          handleSubmit();
          setSubmitted(true);
        }}
        disabled={!acceptedFiles.length || fileTypeError}
        className='submit-button'
      >
        Submit
      </button>
    </form>
  );
};

export default FileUploader;
