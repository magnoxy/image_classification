"use client";
import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";
import Image from "next/image";
import Loading from "./components/LoadingModel";
import DefaultBackground from "./components/Background";
import { translate } from "@vitalets/google-translate-api";

const LoadingModel = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [results, setResults] = useState<
    { className: string; probability: number }[]
  >([]);
  const [history, setHistory] = useState<string[]>([]);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      console.log("Loading model...");
      const model = await mobilenet.load();
      setModel(model);
      console.log("Model loaded successfully.");
    } catch (error) {
      console.log("Error loading model:", error);
    } finally {
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    if (imageRef.current && model) {
      textInputRef.current!.value = "";
      try {
        console.log("Classifying image...");
        const results = await model.classify(imageRef.current);
        console.log("Classification results:", results);
        const translatedResults = await translateResults(results);
        setResults(translatedResults);
      } catch (error) {
        console.log("Error classifying image:", error);
        setResults([]);
      }
    } else {
      console.log("Model is not loaded or image is not available.");
      setResults([]);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (isValidURL(value)) {
      setImageURL(value);
    } else {
      setImageURL(null);
    }
    setResults([]);
  };

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  if (isModelLoading) {
    return <Loading />;
  }

  const translateResults = async (results: any) => {
    const translatedResults = [];
    for (const result of results) {
      try {
        const translation = await translate(result.className, { to: "pt" });
        translatedResults.push({
          className: translation.text,
          probability: result.probability,
        });
      } catch (error) {
        console.error("Error translating:", error);
        translatedResults.push(result);
      }
    }
    return translatedResults;
  };

  return (
    <>
      <DefaultBackground>
        <div className="text-center font-extrabold text-4xl w-full ">
          <h1 className=" py-3">Classificador de Imagens</h1>
        </div>

        <div className="inputHolder text-center">
          <input
            type="file"
            accept="image/*"
            className="uploadInput"
            onChange={uploadImage}
            ref={fileInputRef}
          />
          <button className="uploadImage rounded-md" onClick={triggerUpload}>
            Upload Image
          </button>{" "}
          <span className="or">OR</span>{" "}
          <input
            type="text"
            placeholder="Cole o link da imagem aqui..."
            ref={textInputRef}
            onChange={handleOnChange}
          />
        </div>
        <div className="mainWrapper">
          <div className="mainContent">
            <div className="imageHolder">
              {imageURL && (
                <Image
                  src={imageURL}
                  alt="Upload Preview"
                  crossOrigin="anonymous"
                  ref={imageRef}
                  width={224}
                  height={224}
                />
              )}
            </div>
            {results && results.length > 0 && (
              <div className="resultsHolder">
                {results.map((result, index) => (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="confidence">
                      Nível de confiança:{" "}
                      {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Melhor palpite</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {imageURL && (
            <button className="button" onClick={identify}>
              Identificar Imagem
            </button>
          )}
        </div>
        {history.length > 0 && (
          <div className="recentPredictions">
            <h2>Imagens Recentes</h2>
            <div className="recentImages">
              {history.map((image, index) => {
                return (
                  <div className="recentPrediction" key={`${image}${index}`}>
                    <Image
                      src={image}
                      alt="Recent Prediction"
                      width={224}
                      height={224}
                      onClick={() => setImageURL(image)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DefaultBackground>
      <div className="flex flex-col justify-center items-center text-center p-5  bg-gradient-to-b from-sky-500 to-slate-500 ">
        <h1 className="text-gray-800 font-semibold">
          Copyright ® Edson Magno - Todos os direitos reservados.
        </h1>
      </div>
    </>
  );
};

export default LoadingModel;
