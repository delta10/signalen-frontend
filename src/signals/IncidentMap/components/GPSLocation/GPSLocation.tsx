/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import { useEffect, useState } from 'react'

import { Marker } from '@amsterdam/react-maps'
import type { Map, LatLngLiteral } from 'leaflet'

import { DEFAULT_ZOOM } from '../../../../components/AreaMap/AreaMap'
import GPSButton from '../../../../components/GPSButton'
import configuration from '../../../../shared/services/configuration/configuration'
import { markerIcon } from '../../../../shared/services/configuration/map-markers'
import type { LocationResult } from '../../../../types/location'
import { StyledViewerContainer } from './styled'

export interface Props {
  map: Map
  setNotification: (mapMessage: JSX.Element | string) => void
}

export const GPSLocation = ({ map, setNotification }: Props) => {
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()

  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, DEFAULT_ZOOM)
    }
  }, [map, coordinates])

  return (
    <>
      <StyledViewerContainer
        topLeft={
          <GPSButton
            tabIndex={0}
            onLocationSuccess={(location: LocationResult) => {
              const coordinates = {
                lat: location.latitude,
                lng: location.longitude,
              }
              setCoordinates(coordinates)
            }}
            onLocationError={() =>
              setNotification(
                <>
                  <strong>
                    {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                  </strong>
                  <p>
                    Dit kunt u wijzigen in de voorkeuren of instellingen van uw
                    browser of systeem.
                  </p>
                </>
              )
            }
            onLocationOutOfBounds={() =>
              setNotification(
                'Uw locatie valt buiten de kaart en is daardoor niet te zien'
              )
            }
          />
        }
      />
      {coordinates && (
        <Marker
          data-testid="incidentPinMarker"
          key={Object.values(coordinates).toString()}
          args={[coordinates]}
          options={{
            icon: markerIcon,
            keyboard: false,
          }}
        />
      )}
    </>
  )
}