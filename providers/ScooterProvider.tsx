import { supabase } from '@/utils/supabase';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getDirections } from '~/services/directions';

interface Scooter {
  id: number;
  long: number;
  lat: number;
}

interface ScooterContextType {
  nearbyScooters: Scooter[];
  selectedScooter: Scooter | undefined;
  setSelectedScooter: (scooter: Scooter | undefined) => void;
  direction: any;
  directionCoordinates: [number, number][];
  duration: number;
  distance: number;
  isNearby: boolean;
}

const ScooterContext = createContext<ScooterContextType>({
  nearbyScooters: [],
  selectedScooter: undefined,
  setSelectedScooter: () => {},
  direction: undefined,
  directionCoordinates: [],
  duration: 0,
  distance: 0,
  isNearby: false,
});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearbyScooters] = useState<Scooter[]>([]);
  const [selectedScooter, setSelectedScooter] = useState<Scooter>();
  const [direction, setDirection] = useState<any>();
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required');
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        const { error, data } = await supabase.rpc('nearby_scooters', {
          lat: location.coords.latitude,
          long: location.coords.longitude,
          max_dist_meters: 2000,
        });

        if (error) throw error;
        setNearbyScooters(data || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch scooters');
        console.error(error);
      }
    };

    fetchScooters();
  }, []);

  useEffect(() => {
    if (!selectedScooter) return;

    let subscription: Location.LocationSubscription;

    const watchLocation = async () => {
      try {
        subscription = await Location.watchPositionAsync(
          { distanceInterval: 10 },
          (newLocation) => {
            const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
            const to = point([selectedScooter.long, selectedScooter.lat]);
            const distance = getDistance(from, to, { units: 'meters' });
            setIsNearby(distance < 100);
          }
        );
      } catch (error) {
        console.error('Error watching location:', error);
      }
    };

    watchLocation();
    return () => subscription?.remove();
  }, [selectedScooter]);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const myLocation = await Location.getCurrentPositionAsync();
        if (!selectedScooter) return;

        const newDirection = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter.long, selectedScooter.lat]
        );
        setDirection(newDirection);
      } catch (error) {
        console.error('Error fetching directions:', error);
        Alert.alert('Error', 'Failed to fetch directions');
      }
    };

    if (selectedScooter) {
      fetchDirections();
      setIsNearby(false);
    } else {
      setDirection(undefined);
      setIsNearby(false);
    }
  }, [selectedScooter]);

  const contextValue: ScooterContextType = {
    nearbyScooters,
    selectedScooter,
    setSelectedScooter,
    direction,
    directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates || [],
    duration: direction?.routes?.[0]?.duration || 0,
    distance: direction?.routes?.[0]?.distance || 0,
    isNearby,
  };

  return <ScooterContext.Provider value={contextValue}>{children}</ScooterContext.Provider>;
}

export const useScooter = () => useContext(ScooterContext);
