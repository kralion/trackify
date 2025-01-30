import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchDirectionBasedOnCoords } from '~/services/directions';
import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-expo';

interface Ride {
  id: number;
  user_id: string;
  scooter_id: number;
  started_at: string;
  finished_at: string | null;
  routeDuration?: number;
  routeDistance?: number;
  routeCoords?: [number, number][];
}

interface RideContextType {
  startRide: (scooterId: number) => Promise<void>;
  finishRide: () => Promise<void>;
  ride: Ride | undefined;
  rideRoute: [number, number][];
}

const RideContext = createContext<RideContextType>({
  startRide: async () => {},
  finishRide: async () => {},
  ride: undefined,
  rideRoute: [],
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<Ride>();
  const [rideRoute, setRideRoute] = useState<[number, number][]>([]);
  const { user } = useUser();
  //TODO: Comment this useEffect for testing purposes
  useEffect(() => {
    const fetchActiveRide = async () => {
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('user_id', user?.id)
          .is('finished_at', null)
          .limit(1)
          .single();
        if (error) throw error;
        if (data) setRide(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching active ride:', error);
      }
    };

    if (user?.id) {
      fetchActiveRide();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!ride) return;

    let subscription: Location.LocationSubscription;

    const watchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required');
          return;
        }

        subscription = await Location.watchPositionAsync(
          { distanceInterval: 30 },
          (newLocation) => {
            const newCoords: [number, number] = [
              newLocation.coords.longitude,
              newLocation.coords.latitude,
            ];
            setRideRoute((currentRoute) => [...currentRoute, newCoords]);
          }
        );
      } catch (error) {
        console.error('Error watching location:', error);
      }
    };

    watchLocation();
    return () => subscription?.remove();
  }, [ride]);

  const startRide = async (scooterId: number) => {
    try {
      if (ride) {
        throw new Error('Cannot start a new ride while another one is in progress');
      }

      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            user_id: user?.id,
            scooter_id: scooterId,
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setRide(data);
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to start the ride');
    }
  };

  const finishRide = async () => {
    try {
      if (!ride) return;
      if (rideRoute.length < 2) {
        throw new Error('Not enough route points recorded');
      }

      const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
      const rideRouteCoords = actualRoute.matchings[0].geometry.coordinates;

      const { error } = await supabase
        .from('rides')
        .update({
          finished_at: new Date().toISOString(),
          routeDuration: actualRoute.matchings[0].duration,
          routeDistance: actualRoute.matchings[0].distance,
          routeCoords: rideRouteCoords,
        })
        .eq('id', ride.id);

      if (error) throw error;

      setRide(undefined);
      setRideRoute([]);
    } catch (error) {
      console.error('Error finishing ride:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to finish the ride');
    }
  };

  const contextValue: RideContextType = {
    startRide,
    finishRide,
    ride,
    rideRoute,
  };

  return <RideContext.Provider value={contextValue}>{children}</RideContext.Provider>;
}

export const useRide = () => useContext(RideContext);
