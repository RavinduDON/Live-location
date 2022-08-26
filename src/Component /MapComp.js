import React, {useEffect, useRef} from 'react';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import {fromLonLat} from "ol/proj";
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

const MapComp = () => {

    const mapRef = useRef();

    useEffect(() => {
        const view = new View({
            center: fromLonLat([0, 0]),
            zoom: 5,
        });

        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            target: 'map',
            view: view,
        });

        const geolocation = new Geolocation({
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: view.getProjection(),
        });

        function el(id) {
            return document.getElementById(id);
        }

        el('track').addEventListener('change', function () {
            geolocation.setTracking(this.checked);
        });

        geolocation.on('error', function (error) {
            const info = document.getElementById('info');
            info.innerHTML = error.message;
            info.style.display = '';
        });

        const accuracyFeature = new Feature();
        geolocation.on('change:accuracyGeometry', function () {
            accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
        });

        const positionFeature = new Feature();
        positionFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({
                        color: '#3399CC',
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                    }),
                }),
            })
        );

        geolocation.on('change:position', function () {
            const coordinates = geolocation.getPosition();
            positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
            map.getView().animate(
                {
                    center: coordinates,
                    duration: 2000,
                    zoom: 15
                }
            );
        });

        new VectorLayer({
            map: map,
            source: new VectorSource({
                features: [accuracyFeature, positionFeature],
            }),
        });

        map.setTarget(mapRef.current);

        return () => map.setTarget(undefined);
    },[])

    return (
        <div>
            <div ref={mapRef} id="map" className="map"></div>
            <div id="info" style={{display: "none"}}></div>
            <label htmlFor="track">
                track position
                <input id="track" type="checkbox"/>
            </label>
            <script src="https://unpkg.com/elm-pep@1.0.6/dist/elm-pep.js"></script>
            <script type="module" src="main.js"></script>
        </div>
    );
};

export default MapComp;