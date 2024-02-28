import './Heatmap.css';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import GL from '@luma.gl/constants';
import polyline from '@mapbox/polyline';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';
import PropTypes from 'prop-types';

const Heatmap = ({ year, athlete, homeCoordinates, activities }) => {
  const [loading, setLoading] = useState(true);
  const [polylines, setPolylines] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState([]);

  useEffect(() => {
    if (activities.length) {
      const polylines = activities.map(
        (activity) => activity.map.summary_polyline
      );
      setPolylines(polylines);
    }
  }, []);

  useEffect(() => {
    const encryptedPolylines = polylines;
    const decryptedPolylines = encryptedPolylines.map((line) =>
      polyline.decode(line)
    );
    const flippedLngLat = decryptedPolylines.map((array) =>
      array.map(([lat, lng]) => [lng, lat])
    );

    const lineCoordinates = formatCoordinatesPairs(flippedLngLat).filter(
      (obj) => obj
    );

    setLineCoordinates(lineCoordinates);
    setLoading(false);
  }, [polylines]);

  const formatCoordinatesPairs = (array) => {
    const nestedCoordinatePairs = array.map((coordinatesArray, index) =>
      coordinatesArray.map((coordinates, index) => {
        if (coordinatesArray[index + 1]) {
          return {
            sourcePosition: coordinates,
            targetPosition: coordinatesArray[index + 1],
          };
        }
      })
    );

    return [].concat(...nestedCoordinatePairs);
  };

  const INITIAL_VIEW_STATE = {
    longitude: homeCoordinates[0],
    latitude: homeCoordinates[1],
    zoom: 10,
    pitch: 0,
    bearing: 0,
  };

  const layers = [
    new LineLayer({
      id: 'line-layer',
      data: lineCoordinates,
      getColor: () => [138, 169, 249],
      opacity: 0.05,
    }),
  ];

  return (
    <section className='heatmap-page'>
      <NavBar />
      <Sidebar athlete={athlete} year={year}></Sidebar>
      <section className='heatmap-container'>
        {loading && (
          <Lottie
            animationData={LoadingAnimation}
            style={{ width: 300, height: 300 }}
          />
        )}
        {activities.length ? (
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}
            parameters={{
              blend: true,
              blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
              blendEquation: GL.FUNC_ADD,
            }}
          >
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
              mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
              attributionControl={false}
            />
          </DeckGL>
        ) : (
          <p className='no-gps'>None of your activities have GPS data!</p>
        )}
      </section>
    </section>
  );
};

export default Heatmap;

Heatmap.propTypes = {
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }),
  homeCoordinates: PropTypes.arrayOf(PropTypes.shape({
    map: PropTypes.shape({
      summary_plotline: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  activities: PropTypes.array.isRequired,
};