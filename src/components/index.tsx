import {Fullscreen} from "./fullscreen"
import {Img} from "./img"
//import {Type001} from "./type001"

import { imageItemStyle, fullscreenImageItemStyle } from './content.css';

function Index() {
  return (
    <>
      <Fullscreen
      open={true}
        src="/PokepokeCardDetailMock/player/images/dummy_player_card02.png"
        imageClassName={fullscreenImageItemStyle}
      >
        <Img
        src="/PokepokeCardDetailMock/player/images/dummy_player_card02.png"
          className={imageItemStyle}
        />
      </Fullscreen>
    </>
  );
}

export default Index;
