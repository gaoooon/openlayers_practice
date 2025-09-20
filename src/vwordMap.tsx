import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { getCenter } from "ol/extent";
import ImageLayer from "ol/layer/Image.js";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";
import data from "./cell_coords.json";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Geometry, Point, Polygon } from "ol/geom";
import Draw from "ol/interaction/Draw.js";

const VWorldMap = () => {
  const mapRef = useRef(null);
  const [ml, setMl] =
    useState<VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>>>();
  const [fs, setFs] = useState<Feature<Point>[]>([]);

  console.log(data);

  useEffect(() => {
    if (!mapRef.current) return;

    // VWorld 타일 레이어
    // const vworldLayer = new TileLayer({
    //   source: new XYZ({
    //     // url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`,
    //     tileUrlFunction: (tileCoord) => {
    //       const [z, x, y] = tileCoord; // OpenLayers가 주는 타일 좌표
    //       console.log("타일 요청됨 → z:", z, "x:", x, "y:", y);

    //       return `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/${z}/${y}/${x}.png`;
    //     },
    //     tileSize: 256,
    //     crossOrigin: "anonymous",
    //   }),
    // });

    const extent = [0, 0, 1200, 800];

    const projection = new Projection({
      code: "image",
      units: "pixels",
      extent,
    });

    const imageLayer = new ImageLayer({
      source: new Static({
        url: "/cell_tissue.png",
        imageExtent: extent,
        projection: projection,
      }),
    });

    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({ source: markerSource });
    setMl(markerLayer);

    // const marker = new Feature({
    //   geometry: new Point([618, 1295]),
    // });

    const features: Feature<Point>[] = [];

    data.cells.forEach(({ x, y }) => {
      const marker = new Feature({
        geometry: new Point([x, y]),
      });

      marker.setId(`x:${x},y:${y}`);
      features.push(marker);

      console.log(marker);

      markerSource.addFeature(marker);
    });

    setFs(features);

    const draw = new Draw({
      source: new VectorSource(),
      type: "Polygon",
      freehand: true,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [imageLayer, markerLayer],
      interactions: [draw],

      view: new View({
        // center: fromLonLat([127.024612, 37.5326]),
        zoom: 1,
        maxZoom: 6,
        // minZoom: 6,
        // projection: "EPSG:3857",
        center: getCenter(extent),
        projection: projection,
      }),
    });

    draw.on("drawend", (e) => {
      const polygon = new Feature(new Polygon(e.target.sketchCoords_));

      markerSource.addFeature(polygon);
    });

    // map.getView().on("change:resolution", () => {
    //   console.log("현재 줌 레벨:", map.getView().getZoom());
    // });

    map.on("singleclick", function (event) {
      const coordinate = event.coordinate; // EPSG:3857 좌표
      console.log("클릭한 좌표:", coordinate);

      // 기존 마커 제거 (원하는 경우)
      // markerSource.clear();

      // 마커 Feature 생성
      // const marker = new Feature({
      //   geometry: new Point(coordinate),
      // });

      // 마커 스타일(아이콘 이미지)
      // marker.setStyle(
      //   new Style({
      //     image: new Icon({
      //       anchor: [0.5, 1],
      //       src: "https://openlayers.org/en/latest/examples/data/icon.png",
      //     }),
      //   })
      // );

      // markerSource.addFeature(marker);
    });

    return () => map.setTarget(undefined); // cleanup
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: 1000,
          height: 1000,
          border: "3px solid black",
          margin: 10,
        }}
      />
      <div
        style={{
          display: "flex",
        }}
      >
        <button
          onClick={() => {
            ml?.getSource()?.removeFeatures(fs);
          }}
        >
          delete all
        </button>

        <button>brush</button>
      </div>
    </div>
  );
};

export default VWorldMap;
