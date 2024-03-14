import './FileUploader.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { BsUpload } from 'react-icons/bs';
import { getAthleteFromAPI, uploadFileToStrava, postActivityToAPI } from '../../ApiCalls';
import PropTypes from 'prop-types';

const FileUploader = ({
  setManualForm,
  manualForm,
  setSubmitted,
  athlete,
  refreshActivityData,
  setIsLoading,
}) => {
  const [fileTypeError, setFileTypeError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const supportedTypes = ['fit', 'tcx', 'gpx'];
      const validFiles = files.filter((file) => {
        const extension = file?.name.split('.').pop().toLowerCase();
        return supportedTypes.includes(extension);
      });

      if (validFiles.length !== files.length) {
        setFileTypeError(true);
      } else {
        setFileTypeError(false);
      }

      setAcceptedFiles(validFiles);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (acceptedFiles?.length === 0) return;

    for (const file of acceptedFiles) {
      const extension = file?.name.split('.').pop().toLowerCase();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('data_type', extension);

      const athleteInfo = await getAthleteFromAPI(athlete?.id);
      const accessToken = athleteInfo?.stravaAccessToken;

      setIsLoading(true);
      const data = await uploadFileToStrava(file, accessToken);
      
      if (data && data.id) {
        await new Promise(resolve => setTimeout(resolve, (1000 * acceptedFiles.length)));
        await refreshActivityData();
  
      }
      else {
        setUploadError(true);
        if (data.error.includes('duplicate'))
          setUploadErrorMessage('This file has already been uploaded.');
        else
          setUploadErrorMessage('There was an error uploading your file. Please try again.');
      }
    }
    setSubmitted(true);
  };

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
        <input id='fileUpload' name='fileUpload' {...getInputProps()} />
        <p className='file-types'>
          {acceptedFiles?.length
            ? `File(s) added: ${acceptedFiles
                .map((file) => file.name)
                .join(', ')}`
            : 'Works for multiple .tcx, .fit or .gpx files 25MB or smaller.'}
        </p>
      </section>
      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
        disabled={!acceptedFiles?.length || fileTypeError}
        className='submit-button'
      >
        Submit
      </button>
    </form>
  );
};

export default FileUploader;

FileUploader.propTypes = {
  setManualForm: PropTypes.func.isRequired,
  manualForm: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string,
    state: PropTypes.string,
    profile: PropTypes.string.isRequired,
  }).isRequired,
};
