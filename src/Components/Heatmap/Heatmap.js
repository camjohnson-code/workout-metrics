import './Heatmap.css';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import LoadingModule from '../Loading Module/LoadingModule';
import SettingsModule from '../Settings Module/SettingsModule';
import NoLocationModule from '../No Location Module/NoLocationModule';
import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import GL from '@luma.gl/constants';
import polyline from '@mapbox/polyline';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';
import PropTypes from 'prop-types';

const Heatmap = ({
  year,
  athlete,
  homeCoordinates,
  activities,
  logout,
  isLoading,
  selectedUnit,
  setSelectedUnit,
  selectedTheme,
  setSelectedTheme,
  settingsShown,
  setSettingsShown,
  setRefreshData,
}) => {
  const [loading, setLoading] = useState(true);
  const [polylines, setPolylines] = useState([]);
  const [lineCoordinates, setLineCoordinates] = useState([]);
  const [layerColor, setLayerColor] = useState([]);

  useEffect(() => {
    if (activities.length) {
      const polylines = activities.map(
        (activity) => activity?.map?.summary_polyline
      );
      setPolylines(polylines);
    }
  }, [activities]);

  useEffect(() => {
    const encryptedPolylines = polylines.filter(Boolean);
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

  useEffect(() => {
    if (selectedTheme === 'Dark') {
      setLayerColor([138, 169, 249]);
    } else {
      setLayerColor([255, 70, 0]);
    }
  }, [selectedTheme]);

  const formatCoordinatesPairs = (array) => {
    const nestedCoordinatePairs = array.map((coordinatesArray, index) =>
      coordinatesArray.map((coordinates, index) => {
        if (coordinatesArray[index + 1])
          return {
            sourcePosition: coordinates,
            targetPosition: coordinatesArray[index + 1],
          };
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
      getColor: layerColor,
      opacity: 0.05,
    }),
  ];

  return (
    <section className='heatmap-page'>
      {isLoading && <LoadingModule />}
      {settingsShown && (
        <SettingsModule
          selectedUnit={selectedUnit}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          setSelectedUnit={setSelectedUnit}
          settingsShown={settingsShown}
          setSettingsShown={setSettingsShown}
        />
      )}
      <NavBar
        setRefreshData={setRefreshData}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
      />
      <Sidebar
        setRefreshData={setRefreshData}
        selectedTheme={selectedTheme}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
        athlete={athlete}
        year={year}
      ></Sidebar>
      <section className='heatmap-container'>
        {!athlete?.city && <NoLocationModule />}
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
              mapStyle={process.env.REACT_APP_MAPBOX_STYLE_DARK}
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
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
  }),
  homeCoordinates: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
};
