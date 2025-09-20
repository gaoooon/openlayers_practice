import VWorldMap from "./vwordMap";

function App() {
  // const [map, setMap] = useState<Map>();
  // const mapRef = useRef<HTMLDivElement>(null);

  // const initialMap = new Map({
  //   target: mapRef.current!,
  //   layers: [
  //     new TileLayer({
  //       source: new XYZ({
  //         url: `https://api.vworld.kr/req/wmts/1.0.0/A926F440-CF62-381A-B132-524D07115A76/Base/{z}/{y}/{x}.png`,
  //         projection: "EPSG:3857",
  //       }),
  //     }),
  //   ],
  //   view: new View({
  //     center: [0, 0],
  //     zoom: 0,
  //   }),ㅌ
  // });

  // useEffect(() => {
  //   setMap(initialMap);
  // }, []);

  return (
    // <div>
    //   <div id="map" style={{ height: 800, width: 800 }} ref={mapRef}></div>
    // </div>
    <VWorldMap />
  );
}

export default App;
