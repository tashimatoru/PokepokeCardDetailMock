//import {Type001} from "./type001"

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';

import { useState, useCallback } from 'react';

import {Fullscreen} from "./fullscreen"
import {Viewer} from "./type001"

import { Img } from './img';
import Checkbox from '@mui/material/Checkbox';

import {
  imageItemStyle,
  fullscreenImageItemStyle,
  reflectionLayerCard02FullscreenStyle,
  reflectionLayerCard03InlineStyle,
  reflectionLayerCard03FullscreenStyle,
} from './content.css';

function Index() {
  const [enableReflectionLayer, setEnableReflectionLayer] = useState(true);
  const [noResetOnDrop, setNoResetOnDrop] = useState(false);

  // 傾き上限(inline)
  const [inlineMaxX, setInlineMaxX] = useState(30);
  const [inlineMaxY, setInlineMaxY] = useState(40);
  // 傾き上限(fullscreen)
  const [fullscreenMaxX, setFullscreenMaxX] = useState(10);
  const [fullscreenMaxY, setFullscreenMaxY] = useState(20);

  const onEnableReflectionLayerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEnableReflectionLayer(e.target.checked);
    },
    []
  );

  const onNoResetOnDropChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNoResetOnDrop(e.target.checked);
    },
    []
  );

  const handleInlineMaxXChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setInlineMaxX(typeof newValue === 'number' ? newValue : newValue[0]);
    },
    []
  );
  const handleInlineMaxYChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setInlineMaxY(typeof newValue === 'number' ? newValue : newValue[0]);
    },
    []
  );

  const handleFullscreenMaxXChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setFullscreenMaxX(typeof newValue === 'number' ? newValue : newValue[0]);
    },
    []
  );
  const handleFullscreenMaxYChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setFullscreenMaxY(typeof newValue === 'number' ? newValue : newValue[0]);
    },
    []
  );


  return (
    <>
      <hr />
      <div>
        <div>
          <Checkbox
            checked={enableReflectionLayer}
            onChange={onEnableReflectionLayerChange}
          />
            反射レイヤーを有効にする
        </div>
        <div>
          <Checkbox
            checked={noResetOnDrop}
            onChange={onNoResetOnDropChange}
          />
          ドロップ時に傾きをリセットしない
        </div>
        <div>傾き上限</div>
        <div>
          <Box>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid>inline</Grid>
              <Grid>X:</Grid>
              <Grid size="grow">
                <Slider
                  value={typeof inlineMaxX === 'number' ? inlineMaxX : 0}
                  onChange={handleInlineMaxXChange}
                  min={0}
                  max={240}
                />
              </Grid>
              <Grid>{inlineMaxX}</Grid>
              <Grid>Y:</Grid>
              <Grid size="grow">
                <Slider
                  value={typeof inlineMaxY === 'number' ? inlineMaxY : 0}
                  onChange={handleInlineMaxYChange}
                  min={0}
                  max={240}
                />
              </Grid>
              <Grid>{inlineMaxY}</Grid>
            </Grid>
          </Box>
        </div>
        <div>
          <Box>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid>fullscreen</Grid>
              <Grid>X:</Grid>
              <Grid size="grow">
                <Slider
                  value={
                    typeof fullscreenMaxX === 'number' ? fullscreenMaxX : 0
                  }
                  onChange={handleFullscreenMaxXChange}
                  min={0}
                  max={240}
                />
              </Grid>
              <Grid>{fullscreenMaxX}</Grid>
              <Grid>Y:</Grid>
              <Grid size="grow">
                <Slider
                  value={
                    typeof fullscreenMaxY === 'number' ? fullscreenMaxY : 0
                  }
                  onChange={handleFullscreenMaxYChange}
                  min={0}
                  max={240}
                />
              </Grid>
              <Grid>{fullscreenMaxY}</Grid>
            </Grid>
          </Box>
        </div>
      </div>


      <div
        style={{
          userSelect: 'none',
        }}
      >
      <hr />
      <div>inline</div>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid>
          <Viewer
            src="/PokepokeCardDetailMock/player/images/dummy_player_card01.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            className={imageItemStyle}
            maxX={inlineMaxX}
            maxY={inlineMaxY}
          />
        </Grid>
        <Grid>
          <Viewer
            src="/PokepokeCardDetailMock/player/images/dummy_player_card02.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            className={imageItemStyle}
            maxX={inlineMaxX}
            maxY={inlineMaxY}
          />
        </Grid>
        <Grid>
          <Viewer
            src="/PokepokeCardDetailMock/player/images/dummy_player_card03.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            className={imageItemStyle}
            maxX={inlineMaxX}
            maxY={inlineMaxY}
            reflectionLayerClassName={reflectionLayerCard03InlineStyle}
          />
        </Grid>
      </Grid>
      <div>fullscreen</div>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid>
          <Fullscreen
            src="/PokepokeCardDetailMock/player/images/dummy_player_card01.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            imageClassName={fullscreenImageItemStyle}
            maxX={fullscreenMaxX}
            maxY={fullscreenMaxY}
          >
            <Img
              src="/PokepokeCardDetailMock/player/images/dummy_player_card01.png"
              className={imageItemStyle}
            />
          </Fullscreen>
        </Grid>
        <Grid>
          <Fullscreen
            src="/PokepokeCardDetailMock/player/images/dummy_player_card02.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            imageClassName={fullscreenImageItemStyle}
            maxX={fullscreenMaxX}
            maxY={fullscreenMaxY}
            reflectionLayerClassName={reflectionLayerCard02FullscreenStyle}
          >
            <Img
              src="/PokepokeCardDetailMock/player/images/dummy_player_card02.png"
              className={imageItemStyle}
            />
          </Fullscreen>
        </Grid>
        <Grid>
          <Fullscreen
            src="/PokepokeCardDetailMock/player/images/dummy_player_card03.png"
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            imageClassName={fullscreenImageItemStyle}
            maxX={fullscreenMaxX}
            maxY={fullscreenMaxY}
            reflectionLayerClassName={reflectionLayerCard03FullscreenStyle}
          >
            <Img
              src="/PokepokeCardDetailMock/player/images/dummy_player_card03.png"
              className={imageItemStyle}
            />
          </Fullscreen>
        </Grid>
      </Grid>

      </div>
    </>
  );
}

export default Index;
