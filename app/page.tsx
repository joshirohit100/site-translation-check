'use client'

import { FormEvent } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import parse from 'html-react-parser';

export default function Home() {

  // To set and show the response from openai api call.
  const [ apiResponseMessage, setApiResponseMessage ] = useState('');

  // To hide/show the loader while API call in progress.
  const [ showSpinner, setShowSpinner ] = useState(false);

  // To determine if error or success
  // Default for success.
  // 1 => success, 2 => error, 3 => notice.
  const [ isErrorSuccessNotice, setErrorSuccessNotice ] = useState(1);

  // Form submit handler.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSpinner(true);
    setApiResponseMessage('');
    setErrorSuccessNotice(1);

    // Get the form data.
    const formData = new FormData(event.target as HTMLFormElement);
    const urlEntered = formData.get('url')?.toString().trim();
    const languageSelected = formData.get('language')?.toString().trim();

    if (!urlEntered || !languageSelected) {
      setErrorSuccessNotice(2);
      setApiResponseMessage('Please input both url and language.');
      setShowSpinner(false);
      return;
    }

    // If url and language selected has value.
    if (urlEntered && languageSelected) {
      try {
        const response = await fetch('/api/', {
          method: 'POST',
          body: JSON.stringify({
            language: languageSelected,
            url: urlEntered,
          })
        });

        // Parse the JSON response of api call.
        const body = await response.json();
        const jsonFormated = JSON.parse(body.message);
        console.log(jsonFormated);

        // If HTML content is fully translated.
        if (jsonFormated['fully_translated']) {
          setApiResponseMessage('Content on this URL is fully translated.');
          setErrorSuccessNotice(1);
          setShowSpinner(false);
          return;
        }

        // If content is not fully translated.
        let notTranslatedText = "";
        for (let i = 0; i < jsonFormated['not_translated'].length; i++) {
          notTranslatedText += jsonFormated['not_translated'][i] + '<br/><br/>';
        }
        setApiResponseMessage(notTranslatedText);
        setErrorSuccessNotice(3);
        setShowSpinner(false);
      }
      catch(error) {
        console.log(error);
        setApiResponseMessage(error.message);
        setErrorSuccessNotice(2);
        setShowSpinner(false);
      }
    }
  };

  return (
    <main className="h-screen">
      <br/><br/><br/><br/>
      <h1 className="text-3xl font-bold flex justify-center mb-5">Check Translation</h1>

      { apiResponseMessage && isErrorSuccessNotice === 2 && (
        // For error.
        <div className="text-3xl font-bold flex justify-center mb-5">
        <br/>
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          { apiResponseMessage }
          </div>
        </div>
      )}

      { apiResponseMessage && isErrorSuccessNotice === 1 && (
        // For success.
        <div className="text-3xl font-bold flex justify-center mb-5">
        <br/>
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          { apiResponseMessage }
          </div>
        </div>
      )}

      <div className="flex items-center justify-center w-full gap-10">
        <Form onSubmit={handleSubmit} className="mb-50 w-10/12">
          <Form.Group className="mb-3 w-full" controlId="search">
            <Form.Control
              name="url"
              type="text"
              placeholder="Enter Url"
              className="items-center block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </Form.Group>

          <Form.Group className="flex w-72 flex-col gap-10 mb-5 border border-gray-300" controlId="language">
            <Form.Select aria-label="Select language" name="language">
              <option>Select language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </Form.Select>
          </Form.Group>

          <br/>
          { showSpinner
            ? <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span>
          </div>
            : <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Check</Button>
          }
  
        </Form>
      </div>

      { apiResponseMessage && isErrorSuccessNotice === 3 && (
        // For warning when full content is not translated.
        <div className="text-3xl font-bold flex justify-center mb-5">
        <br/>
        <div>Below content is not translated:</div>
        <div className="justify-center flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
          { parse(apiResponseMessage) }
          </div>
        </div>
      )}
 
    </main>
  );

}
