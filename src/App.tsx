import { useState, ChangeEvent, useEffect } from 'react';
import './App.css';
import CustomTextArea from './components/text-area';
import { Sparkles, X, LoaderCircle, Key } from 'lucide-react';
import GLBViewer from './components/glb-viewer';

const genieUrl = 'https://genie-luma-api.vercel.app/api/creations';
const genieDetailUrl = 'https://genie-luma-api.vercel.app/api/creations-uuid';

function App() {
  const [textValue, changeTextValue] = useState<string>('');

  const [createMode, changeCreateMode] = useState<boolean>(false);

  const [addTokenMode, changeAddTokenMode] = useState<boolean>(false);

  const [detailViewMode, setDetailViewMode] = useState<boolean>(false);

  const [detailViewNumber, setDetailViewNumber] = useState<number>(0);

  const [loading, changeLoading] = useState<boolean>(true);

  const [detailRes, setDetailRes] = useState<any>();

  const [token, setToken] = useState<string>('');

  const [tokenInput, setTokenInput] = useState<string>('');

  const handleInputToken = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setTokenInput(e.target.value);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchGenie = async () => {
    try {
      const genieData = {
        prompt: textValue,
        token: token,
      };
      const response = await fetch(genieUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(genieData), // Convert the data object to a JSON string
      });
      // if (response.status !== 200) {
      //   throw new Error('Could not fetch genie');
      // }
      const data = await response.json();
      console.log(data);
      if (data && data.response) {
        await delay(40000);
        const detailRes = [];
        for (let i = 0; i < data.response.length; i++) {
          const uuidRes = await fetch(
            `${genieDetailUrl}?uuid=${data.response[i]}`
          );

          const uuidResJson = await uuidRes.json();

          detailRes[i] = uuidResJson.response;
        }

        setDetailRes(detailRes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  };

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  const onClick = () => {
    changeLoading(true);
    changeCreateMode(true);
    fetchGenie();
  };

  return (
    <>
      {addTokenMode && (
        <div className="flex flex-col w-full max-w-[600px]">
          {/* Close button */}
          <button
            onClick={() => changeAddTokenMode(false)}
            className="self-end w-8 h-8  bg-gray-600 rounded-full \
             flex items-center justify-center text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
          <div className="mt-4">
            <textarea
              className="block resize-none py-2 w-full bg-[inherit] \
        border rounded-md text-[1.5rem] text-[color:rgba(0, 0, 0, 0.5)] leading-normal"
              rows={5}
              value={tokenInput}
              placeholder="Type token here..."
              onChange={handleInputToken}
            />
          </div>
          <div className="card flex justify-center">
            <button
              onClick={() => {
                setToken(tokenInput);
                changeAddTokenMode(false);
              }}
              className="flex items-center text-lg gap-1 px-6 py-2 rounded-full bg-gray-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-lg backdrop-blur-sm bg-opacity-90"
            >
              Add Token
            </button>
          </div>
        </div>
      )}
      {createMode && !addTokenMode && (
        <div className="flex flex-col w-full max-w-[600px] mx-auto p-8 pt-4 bg-gray-800 rounded-2xl">
          {/* Close button */}
          <button
            onClick={() => {
              if (detailViewMode) {
                setDetailViewMode(false);
                return;
              }
              changeCreateMode(false);
            }}
            className="self-end w-8 h-8  bg-gray-600 rounded-full  flex items-center justify-center text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>

          {/* Grid container with fixed width */}
          {detailViewMode ? (
            <div>
              <GLBViewer
                modelUrl={
                  detailRes?.[detailViewNumber].output?.[0].file_url || ''
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full mx-auto mt-4">
              {/* Four panels with fixed dimensions */}
              {[0, 1, 2, 3].map((panel) => (
                <div
                  key={panel}
                  className="aspect-square bg-gray-700 rounded-xl flex items-center justify-center"
                >
                  {loading ? (
                    <LoaderCircle
                      size={20}
                      className="text-white animate-spin"
                    />
                  ) : (
                    <video
                      className="w-full rounded-lg"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onClick={() => {
                        setDetailViewNumber(panel);
                        setDetailViewMode(true);
                      }}
                    >
                      <source
                        src={detailRes?.[panel].output?.[2].file_url || ''}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!createMode && !addTokenMode && (
        <div className="w-full max-w-[600px] mx-auto">
          <div className="card flex justify-end mb-12">
            <button
              onClick={() => {
                setTokenInput(token);
                changeAddTokenMode(true);
              }}
              className="flex items-center gap-1 px-4 py-4 rounded-full bg-gray-400 hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-lg backdrop-blur-sm bg-opacity-90"
            >
              <Key size={16} className="text-white" />
            </button>
          </div>
          <div>
            <CustomTextArea
              value={textValue}
              changeHandler={changeTextValue}
              label={'Input Prompt'}
              id={'prompt'}
            />
          </div>

          <div className="card flex justify-center">
            <button
              onClick={onClick}
              className="flex items-center gap-1 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-lg backdrop-blur-sm bg-opacity-90"
            >
              Create
              <Sparkles size={16} className="text-white" />
            </button>
          </div>
          <p className="read-the-docs">
            Click on the button to create your 3d model.
          </p>
        </div>
      )}
    </>
  );
}

export default App;
