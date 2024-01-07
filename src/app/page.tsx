"use client"
import { useState } from 'react';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Visualizer from './components/Visualizer';
import styles from './page.module.css';
import AppContext from '@/context';
import { IMarker } from 'react-ace';
import InputBox from './components/Utils/InputBox';
import CodeEditor from './components/Utils/CodeEditor';
import HoverComponent from './components/Utils/HoverComponent';

export default function Home() {

  const [visualizationCategory,setVisualizationCategory] = useState<number>(0);
  const [visualizationOption,setVisualizationOption] = useState(0);
  const [speedValue,setSpeedValue] = useState(1);
  const [isPlaying,setIsPlaying] = useState(true);
  const [input,setInput] = useState<any>([]);
  const [editorValue, setEditorValue] = useState('');
  const [markers,setMarkers] = useState<IMarker[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoverValue,setHoverValue] = useState<number>(0);


  return (
    <AppContext.Provider value={{
      visualizationCategory,
      setVisualizationCategory,
      visualizationOption,
      setVisualizationOption,
      speedValue,
      setSpeedValue,
      isPlaying,
      setIsPlaying,
      input,
      setInput,
      editorValue,
      setEditorValue,
      markers,
      setMarkers,
      isHovered,
      setIsHovered,
      position,
      setPosition,
      hoverValue,
      setHoverValue
      
    }}>
    <div className={styles.main}>
    <HoverComponent positionX={position.x} positionY={position.y} value={hoverValue} showHover={isHovered}/>
      <Header />
      <SideMenu />
      <Visualizer/>
      <div style={{
                width: '30%',
                position: 'absolute',
                right: 0,
                height: '100%'
            }}>
            <CodeEditor/>
            </div>
    </div>
    </AppContext.Provider>
  );
};