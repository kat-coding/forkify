import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
/**
 * The helper.js file is helper functions such as timeout, fetch FROM API and TO API
 * 
 */

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 2000);
    });
  };


//refactored getJSON and sendJSON into one function that will determine
//if GET or POST based on parameters sent in  
export const AJAX = async function(url, uploadData = undefined){
  try{
  const fetchProm = uploadData ? 
   fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData),
  }) 
  : fetch(url);
  
    
    const res = await Promise.race([fetchProm, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
    }catch(err){
        throw err;
    }
}
/** 
//async function that gets data from API via GET method
export const getJSON = async function(url){
    try{
    const fetchProm = AJAX(url);
    const res = await Promise.race([fetchProm, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
    }catch(err){
        throw err;
    }
};

//async function that sends data to API via POST method for uploadRecipe function
export const sendJSON = async function(url, uploadData){
  try{
  const fetchProm = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData),
  });
  const res = await Promise.race([fetchProm, timeout(TIMEOUT_SEC)]);
  const data = await res.json();

  if (!res.ok) throw new Error(`${data.message} ${res.status}`);
  return data;
  }catch(err){
      throw err;
  }
 
};
 */