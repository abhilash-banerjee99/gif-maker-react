import React, { useState, useEffect } from 'react';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';

//Styles
import './App.css';

const ffmpeg = createFFmpeg({log: true});

function App() {
  // Create the all state.
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }
  // Create the counter (+1 every second).
  useEffect(() => {
    load()
  }, []);
  // Convert to GIF format
  const convertToGif = async() =>{
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    // Run the FFmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');
    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url)
  }
  // Return the App component.
  return ready ?(
    <div className="App">
      <h2>GIF MAKER</h2>
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>
      <h3>RESULT</h3>
      <button onClick={convertToGif}>Convert</button>
      {gif && <img src={gif} width="250"/>}
    </div>
  ): (<p>Loading...</p>);
}

export default App;
