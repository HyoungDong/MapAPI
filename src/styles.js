import styled from "styled-components";
import { ReactComponent as arrow } from "../src/arrow.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
`;
const MapContainer = styled.div`
  box-sizing: border-box;
  border: 5px solid pink;
  width: 85%;
  height: 600px;
`;
const IndicatorContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
`;
const RightArrow = styled(arrow)`
  cursor: pointer;
  fill: pink;
`;
const TextBox = styled.div`
  font-size: 30px;
  font-weight: bold;
`;
const LeftArrow = styled(arrow)`
  cursor: pointer;
  fill: pink;
  transform: rotate(180deg);
`;

export {
  Container,
  MapContainer,
  InputContainer,
  IndicatorContainer,
  Indicator,
  RightArrow,
  LeftArrow,
  TextBox,
};
