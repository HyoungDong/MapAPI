import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Indicator,
  IndicatorContainer,
  InputContainer,
  LeftArrow,
  MapContainer,
  RightArrow,
  TextBox,
} from "./styles";

const { kakao, XLSX } = window;
function App() {
  const mapContainer = useRef(null);
  const fileInput = useRef(null);
  const [geocoder, setGeocoder] = useState(null);
  const [map, setMap] = useState(null);
  const [markerImage, setMarkerImage] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [mapOption, setMapOption] = useState(null);
  const [values, setValues] = useState([]);
  const [positions, setPositions] = useState([]);
  const [indicator, setIndicator] = useState(0);
  const searchMap = useCallback(() => {
    values.forEach((value, idx) => {
      geocoder.addressSearch(value.address, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          console.log(status);
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          // 결과값으로 받은 위치를 마커로 표시합니다
          //console.log(coords);
          setPositions((prev) => [
            ...prev,
            {
              index: idx,
              position: coords,
            },
          ]);
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            title: value.name,
            image: markerImage,
          });
          const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width:250px;text-align:center;padding:0;color:white;background:pink;font-weight:bold;font-size:30px;">${value.name}</div>`,
            removable: true,
          });
          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
          //infowindow.open(map, marker);
          if (idx === 0) map.setCenter(coords);
          const content = `<div class ="label" style="font-weight:bold"><span class="left"></span><span class="center">${value.key}</span><span class="right"></span></div>`;
          const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: content,
            yAnchor: 1,
          });
          customOverlay.setMap(map);
        }
      });
    });
  }, [values, geocoder, markerImage, map]);

  useEffect(() => {
    if (!mapOption)
      setMapOption({
        center: new kakao.maps.LatLng(37.5418765090197, 126.946594236448), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      });
    if (!imageSrc)
      setImageSrc(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
      );
    if (!imageSize) setImageSize(new kakao.maps.Size(34, 45));
    if (imageSrc && imageSize && !markerImage)
      setMarkerImage(new kakao.maps.MarkerImage(imageSrc, imageSize));
    if (mapOption && !map)
      setMap(new kakao.maps.Map(mapContainer.current, mapOption)); // 지도를 생성합니다
    if (!geocoder) setGeocoder(new kakao.maps.services.Geocoder());
    // 마커를 표시할 위치와 title 객체 배열입니다
  }, [imageSrc, imageSize, mapOption, markerImage, map, geocoder]);
  //const mapContainer = document.getElementById("map"), // 지도를 표시할 div
  // mapOption = {
  //   center: new kakao.maps.LatLng(37.5418765090197, 126.946594236448), // 지도의 중심좌표
  //   level: 3, // 지도의 확대 레벨
  // };
  useEffect(() => {
    if (values.length) searchMap();
    console.log(positions);
  }, [values]);
  // useEffect(() => {
  //   console.log(positions);
  // }, [positions]);
  const handleFiles = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      const data = reader.result;
      const workBook = XLSX.read(data, { type: "binary" });
      const Sheet = workBook.Sheets;
      workBook.SheetNames.forEach((sheet) => {
        let keyResult = [];
        let nameResult = [];
        let addressResult = [];
        const range = XLSX.utils.decode_range(Sheet[sheet]["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const colValue =
            Sheet[sheet][XLSX.utils.encode_cell({ r: 0, c: col })]?.v;

          if (
            colValue === "이름" ||
            colValue === "주소" ||
            colValue === "구분"
          ) {
            for (let row = 1; row <= range.e.r; row++) {
              const rowValue =
                Sheet[sheet][XLSX.utils.encode_cell({ r: row, c: col })]?.v;

              if (rowValue) {
                if (colValue === "이름") nameResult.push(rowValue);
                else if (colValue === "주소") addressResult.push(rowValue);
                else if (colValue === "구분") keyResult.push(rowValue);
              }
            }
          }
        }
        // console.log(nameResult);
        // console.log(addressResult);
        nameResult.forEach((result, idx) => {
          setValues((prev) => {
            return [
              ...prev,
              {
                key: keyResult[idx],
                name: result,
                address: addressResult[idx],
              },
            ];
          });
        });
      });
    };
    reader.readAsBinaryString(fileInput.current.files[0]);
  };

  const moveRight = useCallback(() => {
    setIndicator((prev) => {
      const nextIdx = (prev + 1) % values.length;
      const posIdx = positions.findIndex(
        (position) => position.index === nextIdx
      );
      map.setCenter(positions[posIdx].position);
      return nextIdx;
    });
  }, [values, positions]);
  const moveLeft = useCallback(() => {
    setIndicator((prev) => {
      const nextIdx = (prev - 1 + values.length) % values.length;
      const posIdx = positions.findIndex(
        (position) => position.index === nextIdx
      );
      map.setCenter(positions[posIdx].position);
      return nextIdx;
    });
  }, [values, positions]);
  return (
    <Container>
      <InputContainer>
        <input
          ref={fileInput}
          id="Input"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFiles}
          style={{ background: "transparent" }}
          //placeholder="장소명, 주소 형식으로 입력해 주세요"
        />
      </InputContainer>
      <MapContainer ref={mapContainer}></MapContainer>
      <IndicatorContainer>
        <Indicator>
          <LeftArrow onClick={moveLeft} />
          <TextBox>
            {`${values[indicator]?.key || ""} - ${
              values[indicator]?.name || ""
            }`}
          </TextBox>
          <RightArrow onClick={moveRight} />
        </Indicator>
      </IndicatorContainer>
    </Container>
  );
}

export default App;
