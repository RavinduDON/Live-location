import React from 'react';

const Map = () => {
    return (
        <Map view={{ center: [0, 0], zoom: 2 }}>
            <Layers>
                <layer.Tile />
            </Layers>
        </Map>
    );
};

export default Map;