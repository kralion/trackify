import React, { useState } from 'react';
import { MapView, Camera, UserLocation, type CameraPadding } from '@rnmapbox/maps';
import { SafeAreaView } from 'react-native';

enum Alignment {
  Top = 'TOP',
  Center = 'CENTER',
  Bottom = 'BOTTOM',
}

const ALIGNMENTS: Record<Alignment, Partial<CameraPadding>> = {
  [Alignment.Top]: { paddingBottom: 300 },
  [Alignment.Center]: {},
  [Alignment.Bottom]: { paddingTop: 300 },
};

const styles = { matchParent: { flex: 1 } };

const UserLocationPadding = () => {
  const [alignment, setAlignment] = useState<Alignment>(Alignment.Center);

  return (
    <SafeAreaView style={styles.matchParent}>
      <MapView style={styles.matchParent}>
        <Camera followUserLocation followPadding={ALIGNMENTS[alignment]} />
        <UserLocation />
      </MapView>
    </SafeAreaView>
  );
};

export default UserLocationPadding;