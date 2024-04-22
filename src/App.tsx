import { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface Markers {
  position: { lat: string; lng: string };
  content: string;
}

function App() {
  const { kakao } = window;
  const [info, setInfo] = useState<any>();
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  console.log(setMap);
  useEffect(() => {
    if (!map || !keyword) return;
    const ps = new kakao.maps.services.Places();
    // 장소 검색 객체를 생성합니다.
    ps.keywordSearch(`${keyword}`, (data, status, _pagination) => {
      // 지정된 키워드로 장소를 검색한다.
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        let marker: Markers[] = [];
        // 마커들을 담을 배열 생성
        // 좌표와 좌표에 해당한 장소 이름이 들어있다.
        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          marker.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          // 마커들의 좌표를 추가한다.
        }
        // 키워드에 대한 데이터를 가져오면 데이터 수만 큼 마커에 데이터를 넣어준다.
        setMarkers(marker);
        // 마커들의 배열을 순회하기위해 마커를 업데이트 한다.
        map.setBounds(bounds);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      }
    });
  }, [map, keyword]);

  const handleKeyPress = (e: any) => {
    console.log(e);
    if (e.key === "Enter") setKeyword(searchInputValue);
  };
  //

  return (
    <>
      <Map // 로드뷰를 표시할 Container
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: "100%",
          height: "350px",
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker: any) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
          // 마커들이 순회하면서 지도상에 마커들 표시한다.
        ))}
      </Map>
      <input
        onChange={(e) => setSearchInputValue(e.target.value)}
        onKeyUp={(e) => handleKeyPress(e)}
        value={searchInputValue}
        placeholder={"주소를 입력해주세요"}
      />
      <button onClick={() => setKeyword(searchInputValue)}>검색</button>
    </>
  );
}

export default App;
